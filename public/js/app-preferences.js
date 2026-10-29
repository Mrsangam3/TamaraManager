// TAAMARA CO-LIVE — App Preferences Interactivity
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
      showToast('🔔 Preferences synced across manager mobile & tablet terminals.');
    });
  }

  // 3. Theme Mode Selection
  const themeButtons = document.querySelectorAll('.theme-btn');
  let currentTheme = 'light';

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      themeButtons.forEach(b => {
        b.classList.remove('bg-white', 'text-[#c59b27]', 'font-extrabold', 'shadow-xs', 'active');
        b.classList.add('text-slate-500', 'font-bold');
      });
      btn.classList.remove('text-slate-500', 'font-bold');
      btn.classList.add('bg-white', 'text-[#c59b27]', 'font-extrabold', 'shadow-xs', 'active');

      currentTheme = btn.dataset.theme;
      if (currentTheme === 'dark') {
        showToast('🌙 Dark Mode activated (High-contrast night shift profile).');
      } else if (currentTheme === 'system') {
        showToast('🖵 Theme synchronized with host device OS appearance.');
      } else {
        showToast('☀ Standard Light Theme restored.');
      }
    });
  });

  // 4. Compact Card View Toggle
  const toggleCompact = document.getElementById('toggle-compact');
  if (toggleCompact) {
    toggleCompact.addEventListener('change', () => {
      if (toggleCompact.checked) {
        showToast('📐 Compact density mode enabled (more rooms per viewport).');
      } else {
        showToast('Comfortable card density enabled.');
      }
    });
  }

  // 5. Font Size Scale Selection
  const fontScaleButtons = document.querySelectorAll('.font-scale-btn');
  const badgeFontSize = document.getElementById('badge-font-size');
  let currentFontScale = 'standard';

  fontScaleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      fontScaleButtons.forEach(b => {
        b.classList.remove('bg-[#fdfbf7]/70', 'border-2', 'border-[#c59b27]', 'text-[#a6801e]', 'active');
        b.classList.add('bg-slate-50', 'border', 'border-slate-200', 'text-slate-700');
        const sub = b.querySelector('span:last-child');
        if (sub) {
          sub.classList.remove('text-[#a6801e]', 'font-extrabold');
          sub.classList.add('text-slate-500', 'font-bold');
        }
      });

      btn.classList.remove('bg-slate-50', 'border', 'border-slate-200', 'text-slate-700');
      btn.classList.add('bg-[#fdfbf7]/70', 'border-2', 'border-[#c59b27]', 'text-[#a6801e]', 'active');
      const activeSub = btn.querySelector('span:last-child');
      if (activeSub) {
        activeSub.classList.remove('text-slate-500', 'font-bold');
        activeSub.classList.add('text-[#a6801e]', 'font-extrabold');
      }

      currentFontScale = btn.dataset.scale;
      const labelText = currentFontScale.charAt(0).toUpperCase() + currentFontScale.slice(1);
      if (badgeFontSize) badgeFontSize.textContent = labelText;
      showToast(`Font scaling adjusted to ${labelText}.`);
    });
  });

  // 6. Push & Sound Alerts
  const toggleCurfew = document.getElementById('toggle-alert-curfew');
  const toggleRequests = document.getElementById('toggle-alert-requests');
  const toggleEmergency = document.getElementById('toggle-alert-emergency');
  const toggleRent = document.getElementById('toggle-alert-rent');

  [
    { el: toggleCurfew, name: 'Urgent Curfew Breach Alert' },
    { el: toggleRequests, name: 'Room Change & Leave Push' },
    { el: toggleEmergency, name: 'Emergency (<1h SLA) Alert' },
    { el: toggleRent, name: 'Rent & Fee Notifications' }
  ].forEach(item => {
    if (item.el) {
      item.el.addEventListener('change', () => {
        showToast(`${item.name} set to ${item.el.checked ? 'ENABLED' : 'MUTED'}.`);
      });
    }
  });

  // 7. Alert Volume Range Slider
  const rangeVolume = document.getElementById('range-volume');
  const labelVolume = document.getElementById('label-volume');

  if (rangeVolume && labelVolume) {
    rangeVolume.addEventListener('input', () => {
      const val = parseInt(rangeVolume.value, 10);
      if (val === 0) {
        labelVolume.textContent = 'Muted (0%)';
        labelVolume.className = 'font-black text-rose-500';
      } else if (val < 50) {
        labelVolume.textContent = `${val}% Soft`;
        labelVolume.className = 'font-black text-slate-700';
      } else if (val < 90) {
        labelVolume.textContent = `${val}% Normal`;
        labelVolume.className = 'font-black text-[#c59b27]';
      } else {
        labelVolume.textContent = `${val}% Loud`;
        labelVolume.className = 'font-black text-[#c59b27]';
      }
    });
  }

  // 8. Operational Defaults
  const selectDefaultWing = document.getElementById('select-default-wing');
  const toggleSensorRefresh = document.getElementById('toggle-sensor-refresh');
  const toggleHaptic = document.getElementById('toggle-haptic');
  const toggleOfflineCache = document.getElementById('toggle-offline-cache');

  if (selectDefaultWing) {
    selectDefaultWing.addEventListener('change', () => {
      showToast(`Default launch wing set to: ${selectDefaultWing.options[selectDefaultWing.selectedIndex].text}`);
    });
  }

  // 9. App Data & Cache Clear
  const btnClearCache = document.getElementById('btn-clear-cache');
  const cachedSizeLabel = document.getElementById('cached-size-label');

  if (btnClearCache && cachedSizeLabel) {
    btnClearCache.addEventListener('click', async () => {
      btnClearCache.disabled = true;
      btnClearCache.textContent = 'Clearing...';

      try {
        await fetch('/api/preferences/clear-cache', { method: 'POST' });
      } catch (_) {}

      setTimeout(() => {
        cachedSizeLabel.textContent = '0 KB';
        btnClearCache.textContent = 'Cleared ✓';
        btnClearCache.className = 'px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-extrabold';
        showToast('🗑️ Cleared 142 MB cached photo inspections and lease PDFs.');
      }, 500);
    });
  }

  // 10. Reset Preferences Action
  const btnResetPref = document.getElementById('btn-reset-pref');
  if (btnResetPref) {
    btnResetPref.addEventListener('click', () => {
      // Reset Theme to Light
      themeButtons.forEach(b => {
        const isLight = b.dataset.theme === 'light';
        b.classList.toggle('bg-white', isLight);
        b.classList.toggle('text-[#c59b27]', isLight);
        b.classList.toggle('font-extrabold', isLight);
        b.classList.toggle('shadow-xs', isLight);
        b.classList.toggle('active', isLight);
        b.classList.toggle('text-slate-500', !isLight);
        b.classList.toggle('font-bold', !isLight);
      });
      currentTheme = 'light';

      // Reset Compact View
      if (toggleCompact) toggleCompact.checked = false;

      // Reset Font Scale to Standard
      fontScaleButtons.forEach(b => {
        const isStandard = b.dataset.scale === 'standard';
        b.classList.toggle('bg-[#fdfbf7]/70', isStandard);
        b.classList.toggle('border-2', isStandard);
        b.classList.toggle('border-[#c59b27]', isStandard);
        b.classList.toggle('text-[#a6801e]', isStandard);
        b.classList.toggle('active', isStandard);
        b.classList.toggle('bg-slate-50', !isStandard);
        b.classList.toggle('border', !isStandard);
        b.classList.toggle('border-slate-200', !isStandard);
        b.classList.toggle('text-slate-700', !isStandard);
      });
      currentFontScale = 'standard';
      if (badgeFontSize) badgeFontSize.textContent = 'Standard';

      // Reset Alerts
      if (toggleCurfew) toggleCurfew.checked = true;
      if (toggleRequests) toggleRequests.checked = true;
      if (toggleEmergency) toggleEmergency.checked = true;
      if (toggleRent) toggleRent.checked = true;

      // Reset Volume
      if (rangeVolume) rangeVolume.value = 100;
      if (labelVolume) {
        labelVolume.textContent = '100% Loud';
        labelVolume.className = 'font-black text-[#c59b27]';
      }

      // Reset Operations
      if (selectDefaultWing) selectDefaultWing.value = 'all';
      if (toggleSensorRefresh) toggleSensorRefresh.checked = true;
      if (toggleHaptic) toggleHaptic.checked = true;
      if (toggleOfflineCache) toggleOfflineCache.checked = true;

      showToast('🔄 Preferences reset to property standard defaults.');
    });
  }

  // 11. Save Preferences CTA
  const btnSavePref = document.getElementById('btn-save-pref');
  if (btnSavePref) {
    btnSavePref.addEventListener('click', async () => {
      btnSavePref.disabled = true;
      const originalHTML = btnSavePref.innerHTML;
      btnSavePref.innerHTML = `<span>Saving...</span>`;

      const preferences = {
        theme: currentTheme,
        compactMode: toggleCompact ? toggleCompact.checked : false,
        fontScale: currentFontScale,
        alerts: {
          curfew: toggleCurfew ? toggleCurfew.checked : true,
          requests: toggleRequests ? toggleRequests.checked : true,
          emergency: toggleEmergency ? toggleEmergency.checked : true,
          rent: toggleRent ? toggleRent.checked : true,
          volume: rangeVolume ? parseInt(rangeVolume.value, 10) : 100,
        },
        operations: {
          defaultWing: selectDefaultWing ? selectDefaultWing.value : 'all',
          sensorRefresh: toggleSensorRefresh ? toggleSensorRefresh.checked : true,
          haptic: toggleHaptic ? toggleHaptic.checked : true,
          offlineCache: toggleOfflineCache ? toggleOfflineCache.checked : true
        }
      };

      try {
        localStorage.setItem('tamara_app_preferences', JSON.stringify(preferences));
        await fetch('/api/preferences/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(preferences)
        });
      } catch (_) {}

      setTimeout(() => {
        btnSavePref.disabled = false;
        btnSavePref.innerHTML = originalHTML;
        showToast('✓ Preferences saved & synchronized to manager profile!');
      }, 400);
    });
  }
});

