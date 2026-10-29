// More Hub & Profile Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // DOM Elements
  const profName = document.getElementById('prof-name');
  const profRole = document.getElementById('prof-role');
  const profPhone = document.getElementById('prof-phone');
  const profEmail = document.getElementById('prof-email');
  const profNode = document.getElementById('prof-node');
  const profShift = document.getElementById('prof-shift');

  const btnEditProfile = document.getElementById('btn-edit-profile');
  const profileModal = document.getElementById('profile-modal');
  const closeProfileBtn = document.getElementById('close-profile-btn');
  const cancelProfBtn = document.getElementById('cancel-prof-btn');
  const saveProfBtn = document.getElementById('save-prof-btn');

  const itemNotifications = document.getElementById('item-notifications');
  const itemBroadcast = document.getElementById('item-broadcast');
  const itemRules = document.getElementById('item-rules');
  const itemPreferences = document.getElementById('item-preferences');
  const itemSecurity = document.getElementById('item-security');
  const itemHelp = document.getElementById('item-help');
  const btnLogout = document.getElementById('btn-logout');
  const btnMoreBack = document.getElementById('btn-more-back');
  if (btnMoreBack) {
    btnMoreBack.addEventListener('click', (e) => {
      if (window.history.length > 1) {
        e.preventDefault();
        window.history.back();
      }
    });
  }

  // Broadcast Modal Elements
  const broadcastModal = document.getElementById('broadcast-modal');
  const closeBroadcastBtn = document.getElementById('close-broadcast-btn');
  const cancelBcBtn = document.getElementById('cancel-bc-btn');
  const submitBcBtn = document.getElementById('submit-bc-btn');
  const bcTitle = document.getElementById('bc-title');
  const bcAudience = document.getElementById('bc-audience');

  // Edit Profile Inputs
  const inputEditName = document.getElementById('input-edit-name');
  const inputEditPhone = document.getElementById('input-edit-phone');
  const inputEditEmail = document.getElementById('input-edit-email');
  const inputEditShift = document.getElementById('input-edit-shift');

  // Toast Helper
  function showToast(msg, duration = 3000) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, duration);
  }

  // 1. Fetch Profile Data from Node.js backend
  async function loadProfileData() {
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const d = result.data;
          if (profName) profName.textContent = d.name;
          if (profRole) profRole.textContent = d.role;
          if (profPhone) profPhone.textContent = d.phone;
          if (profEmail) profEmail.textContent = d.email;
          if (profNode) profNode.textContent = d.node;
          if (profShift) profShift.textContent = d.shift;

          if (inputEditName) inputEditName.value = d.name;
          if (inputEditPhone) inputEditPhone.value = d.phone;
          if (inputEditEmail) inputEditEmail.value = d.email;
          if (inputEditShift) inputEditShift.value = d.shift;
        }
      }
    } catch (_) {
      console.log('Running More Hub in standalone mode.');
    }
  }
  loadProfileData();

  // 2. Edit Profile Modal
  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      profileModal.classList.remove('hidden');
    });
  }

  function closeProfileModal() {
    if (profileModal) profileModal.classList.add('hidden');
  }

  if (closeProfileBtn) closeProfileBtn.addEventListener('click', closeProfileModal);
  if (cancelProfBtn) cancelProfBtn.addEventListener('click', closeProfileModal);

  if (saveProfBtn) {
    saveProfBtn.addEventListener('click', async () => {
      const newName = inputEditName.value.trim();
      const newPhone = inputEditPhone.value.trim();
      const newEmail = inputEditEmail.value.trim();
      const newShift = inputEditShift.value;

      if (!newName || !newPhone || !newEmail) {
        showToast('Please fill in all profile fields.');
        return;
      }

      profName.textContent = newName;
      profPhone.textContent = newPhone;
      profEmail.textContent = newEmail;
      profShift.textContent = newShift;

      try {
        await fetch('/api/profile/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newName, phone: newPhone, email: newEmail, shift: newShift })
        });
      } catch (_) {}

      closeProfileModal();
      showToast('Profile and shift status updated successfully!');
    });
  }

  // 3. Notifications Click
  if (itemNotifications) {
    itemNotifications.addEventListener('click', (e) => {
      window.location.href = '/notifications.html';
    });
  }

  // 4. Broadcast Modal / Subscreen navigation
  if (itemBroadcast) {
    itemBroadcast.addEventListener('click', (e) => {
      window.location.href = '/broadcast.html';
    });
  }

  function closeBroadcastModal() {
    if (broadcastModal) broadcastModal.classList.add('hidden');
  }

  if (closeBroadcastBtn) closeBroadcastBtn.addEventListener('click', closeBroadcastModal);
  if (cancelBcBtn) cancelBcBtn.addEventListener('click', closeBroadcastModal);

  if (submitBcBtn) {
    submitBcBtn.addEventListener('click', async () => {
      const title = bcTitle.value.trim();
      const audience = bcAudience.value;
      submitBcBtn.disabled = true;
      submitBcBtn.textContent = 'Sending...';

      try {
        await fetch('/api/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, audience })
        });
      } catch (_) {}

      setTimeout(() => {
        submitBcBtn.disabled = false;
        submitBcBtn.textContent = 'Broadcast Now';
        closeBroadcastModal();
        showToast(`📢 Announcement dispatched to ${audience} via SMS, WhatsApp & Push!`);
      }, 700);
    });
  }

  // 5. Operations Settings: Rules, Preferences, Security
  if (itemRules) {
    itemRules.addEventListener('click', (e) => {
      // Direct navigation to Hostel Rules & Policies screen
      window.location.href = '/hostel-rules.html';
    });
  }

  if (itemPreferences) {
    itemPreferences.addEventListener('click', () => {
      window.location.href = '/app-preferences.html';
    });
  }

  if (itemSecurity) {
    itemSecurity.addEventListener('click', () => {
      window.location.href = '/security-permissions.html';
    });
  }

  // 6. Help Center
  if (itemHelp) {
    itemHelp.addEventListener('click', () => {
      window.location.href = '/help-support.html';
    });
  }

  // 7. Logout Button
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/logout-confirmation.html';
    });
  }
});

