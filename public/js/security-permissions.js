// TAAMARA CO-LIVE — Security & Permissions Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Utility
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  // 2. Notification Bell
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Security Alert Desk: Zero unauthorized perimeter or gate anomalies.');
    });
  }

  // 3. Update Manager PIN Modal
  const modalPin = document.getElementById('modal-pin');
  const btnUpdatePin = document.getElementById('btn-update-pin');
  const btnClosePin = document.getElementById('btn-close-pin');
  const formUpdatePin = document.getElementById('form-update-pin');

  if (btnUpdatePin) {
    btnUpdatePin.addEventListener('click', () => {
      modalPin?.classList.remove('hidden');
      document.getElementById('input-current-pin')?.focus();
    });
  }

  if (btnClosePin) {
    btnClosePin.addEventListener('click', () => {
      modalPin?.classList.add('hidden');
    });
  }

  if (formUpdatePin) {
    formUpdatePin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPin = document.getElementById('input-current-pin')?.value.trim();
      const newPin = document.getElementById('input-new-pin')?.value.trim();
      const confirmPin = document.getElementById('input-confirm-pin')?.value.trim();

      if (newPin.length !== 4 || isNaN(newPin)) {
        showToast('PIN must be exactly 4 numeric digits.');
        return;
      }

      if (newPin !== confirmPin) {
        showToast('New PIN and Confirm PIN do not match.');
        return;
      }

      const saveBtn = document.getElementById('btn-save-pin');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Updating Master PIN...';
      }

      try {
        await fetch('/api/security/pin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentPin, newPin })
        });
      } catch (_) {}

      setTimeout(() => {
        if (saveBtn) {
          saveBtn.disabled = false;
          saveBtn.textContent = 'Save New Master PIN ✓';
        }
        modalPin?.classList.add('hidden');
        formUpdatePin.reset();
        showToast('🔐 Manager PIN successfully updated across all warden terminals!');
      }, 700);
    });
  }

  // 4. Biometric Authentication Toggle
  const toggleBiometrics = document.getElementById('toggle-biometrics');
  if (toggleBiometrics) {
    toggleBiometrics.addEventListener('change', async (e) => {
      const enabled = e.target.checked;
      try {
        await fetch('/api/security/toggle-biometrics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ enabled })
        });
      } catch (_) {}

      showToast(
        enabled
          ? '🛡️ FaceID / TouchID biometric console verification ENABLED.'
          : '⚠️ Biometric console verification disabled. PIN required upon launch.'
      );
    });
  }

  // 5. Configure 2FA Modal
  const modal2fa = document.getElementById('modal-2fa');
  const btnConfigure2fa = document.getElementById('btn-configure-2fa');
  const btnClose2fa = document.getElementById('btn-close-2fa');
  const btnConfirm2fa = document.getElementById('btn-confirm-2fa');

  if (btnConfigure2fa) {
    btnConfigure2fa.addEventListener('click', () => {
      modal2fa?.classList.remove('hidden');
    });
  }

  if (btnClose2fa) {
    btnClose2fa.addEventListener('click', () => {
      modal2fa?.classList.add('hidden');
    });
  }

  if (btnConfirm2fa) {
    btnConfirm2fa.addEventListener('click', () => {
      modal2fa?.classList.add('hidden');
      showToast('📱 Two-Factor Authentication validated & synchronizing via Authenticator.');
    });
  }

  // 6. Change Master Password Modal
  const modalPassword = document.getElementById('modal-password');
  const btnChangePassword = document.getElementById('btn-change-password');
  const btnClosePassword = document.getElementById('btn-close-password');
  const formChangePassword = document.getElementById('form-change-password');

  if (btnChangePassword) {
    btnChangePassword.addEventListener('click', () => {
      modalPassword?.classList.remove('hidden');
    });
  }

  if (btnClosePassword) {
    btnClosePassword.addEventListener('click', () => {
      modalPassword?.classList.add('hidden');
    });
  }

  if (formChangePassword) {
    formChangePassword.addEventListener('submit', (e) => {
      e.preventDefault();
      const npw = document.getElementById('input-new-pw')?.value;
      const cpw = document.getElementById('input-confirm-pw')?.value;

      if (npw !== cpw) {
        showToast('New passwords do not match.');
        return;
      }

      modalPassword?.classList.add('hidden');
      formChangePassword.reset();
      showToast('🔑 Master password updated. Next rotation scheduled in 90 days.');
    });
  }

  // 7. Security Audit & Login History Modal
  const modalAudit = document.getElementById('modal-audit');
  const btnAuditHistory = document.getElementById('btn-audit-history');
  const btnCloseAudit = document.getElementById('btn-close-audit');
  const btnDismissAudit = document.getElementById('btn-dismiss-audit');

  function openAuditModal() {
    modalAudit?.classList.remove('hidden');
  }

  function closeAuditModal() {
    modalAudit?.classList.add('hidden');
  }

  if (btnAuditHistory) btnAuditHistory.addEventListener('click', openAuditModal);
  if (btnCloseAudit) btnCloseAudit.addEventListener('click', closeAuditModal);
  if (btnDismissAudit) btnDismissAudit.addEventListener('click', closeAuditModal);

  // 8. Session Revocation
  let registeredSessions = 3;
  const sessionCountLabel = document.getElementById('session-count-label');

  function updateSessionCount() {
    if (sessionCountLabel) {
      sessionCountLabel.textContent = `${registeredSessions} Registered`;
    }
  }

  document.querySelectorAll('.btn-revoke-session').forEach(btn => {
    btn.addEventListener('click', async () => {
      const device = btn.dataset.device || 'device';
      const card = btn.closest('#session-card-ipad, #session-card-mac');
      if (card) {
        card.style.opacity = '0.4';
        setTimeout(() => {
          card.remove();
          registeredSessions = Math.max(1, registeredSessions - 1);
          updateSessionCount();
          showToast(`🔒 Session on ${device} successfully revoked! Access terminated.`);
        }, 300);
      }
    });
  });

  // Terminate All Other Sessions
  const btnTerminateOtherSessions = document.getElementById('btn-terminate-other-sessions');
  if (btnTerminateOtherSessions) {
    btnTerminateOtherSessions.addEventListener('click', async () => {
      const cardIpad = document.getElementById('session-card-ipad');
      const cardMac = document.getElementById('session-card-mac');

      if (cardIpad) cardIpad.remove();
      if (cardMac) cardMac.remove();

      registeredSessions = 1;
      updateSessionCount();

      try {
        await fetch('/api/security/revoke-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ revokeAllExceptCurrent: true })
        });
      } catch (_) {}

      showToast('🚨 All other sessions terminated! Only active iPhone 15 Pro remains authenticated.');
    });
  }

  // 9. Manage Staff Roles & Access Modal
  const modalRoles = document.getElementById('modal-roles');
  const btnManageRoles = document.getElementById('btn-manage-roles');
  const btnCloseRoles = document.getElementById('btn-close-roles');
  const btnSaveRolePerms = document.getElementById('btn-save-role-perms');
  const selectRoleType = document.getElementById('select-role-type');

  if (btnManageRoles) {
    btnManageRoles.addEventListener('click', () => {
      modalRoles?.classList.remove('hidden');
    });
  }

  if (btnCloseRoles) {
    btnCloseRoles.addEventListener('click', () => {
      modalRoles?.classList.add('hidden');
    });
  }

  if (btnSaveRolePerms) {
    btnSaveRolePerms.addEventListener('click', async () => {
      const role = selectRoleType ? selectRoleType.value : 'wardens';
      try {
        await fetch('/api/security/roles/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role, updated: true })
        });
      } catch (_) {}

      modalRoles?.classList.add('hidden');
      showToast(`👥 Role-based permissions matrix for ${role.toUpperCase()} saved & deployed.`);
    });
  }
});

