// TAAMARA CO-LIVE — Logout Confirmation Interactivity
document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message, isAlert = false) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  // 1. Notification Bell
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Shift Alert: Evening Roll Call active until 22:30. 3 open tickets pending.');
    });
  }

  // 2. Checkboxes
  const checkKeepBiometrics = document.getElementById('check-keep-biometrics');
  const checkHandoverShift = document.getElementById('check-handover-shift');

  if (checkKeepBiometrics) {
    checkKeepBiometrics.addEventListener('change', (e) => {
      if (e.target.checked) {
        showToast('🛡️ Biometrics saved: Quick FaceID unlock enabled for next 12h.');
      } else {
        showToast('🔒 Full security reset: FaceID bypassed; SMS OTP required on next login.');
      }
    });
  }

  if (checkHandoverShift) {
    checkHandoverShift.addEventListener('change', (e) => {
      if (e.target.checked) {
        showToast('🤝 Shift handover alert queued for Warden Sunil Deshmukh (Duty Room 102).');
      }
    });
  }

  // 3. Confirm & Log Out Button
  const btnConfirmLogout = document.getElementById('btn-confirm-logout');
  if (btnConfirmLogout) {
    btnConfirmLogout.addEventListener('click', async () => {
      const origContent = btnConfirmLogout.innerHTML;
      btnConfirmLogout.disabled = true;
      btnConfirmLogout.innerHTML = `
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Signing Out Manager Session...</span>
      `;

      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            keepBiometrics: !!checkKeepBiometrics?.checked,
            handoverShift: !!checkHandoverShift?.checked,
            terminal: 'HF-9022',
            timestamp: new Date().toISOString()
          })
        });
      } catch (_) {}

      // Clear manager session storage
      sessionStorage.clear();
      if (!checkKeepBiometrics?.checked) {
        localStorage.removeItem('tamara_biometrics_saved');
      }

      showToast('✓ Successfully logged out of HF-9022. Redirecting to Terminal Login...');

      setTimeout(() => {
        window.location.href = '/index.html';
      }, 750);
    });
  }
});

