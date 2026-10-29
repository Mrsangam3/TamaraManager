// Shift Roster Client-Side Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Filter Pills & Staff Cards
  const filterPills = document.querySelectorAll('.filter-pill');
  const staffCards = document.querySelectorAll('.staff-card');

  // Modals
  const modalSwapShift = document.getElementById('modal-swap-shift');
  const btnSwapShiftOpen = document.getElementById('btn-swap-shift-open');
  const btnCloseSwapModal = document.getElementById('btn-close-swap-modal');
  const formSwapShift = document.getElementById('form-swap-shift');

  const modalAssignTask = document.getElementById('modal-assign-task');
  const btnCloseAssignModal = document.getElementById('btn-close-assign-modal');
  const formAssignTask = document.getElementById('form-assign-task');
  const assignStaffSubtitle = document.getElementById('assign-staff-subtitle');

  const modalIntercom = document.getElementById('modal-intercom');
  const btnIntercomGuardpost = document.getElementById('btn-intercom-guardpost');
  const btnCloseIntercom = document.getElementById('btn-close-intercom');
  const btnIntercomMute = document.getElementById('btn-intercom-mute');

  const modalHousekeeping = document.getElementById('modal-housekeeping');
  const btnViewHkTasks = document.getElementById('btn-view-housekeeping-tasks');
  const btnCloseHkModal = document.getElementById('btn-close-hk-modal');
  const btnCloseHkDone = document.getElementById('btn-close-hk-done');

  const modalMenuLog = document.getElementById('modal-menu-log');
  const btnViewMenuLog = document.getElementById('btn-view-menu-log');
  const btnCloseMenuModal = document.getElementById('btn-close-menu-modal');
  const btnCloseMenuDone = document.getElementById('btn-close-menu-done');

  const btnPrintRoster = document.getElementById('btn-print-roster');
  const btnBell = document.getElementById('btn-bell');
  const handoverTime = document.getElementById('handover-time');

  // Helper: Show Toast
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

  // 1. Horizontal Category Filtering
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      // Toggle active states
      filterPills.forEach(p => {
        p.classList.remove('active', 'bg-[#180d19]', 'text-white');
        p.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });

      pill.classList.add('active', 'bg-[#180d19]', 'text-white');
      pill.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      const targetCategory = pill.getAttribute('data-category');

      let visibleCount = 0;
      staffCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (targetCategory === 'all' || cardCat === targetCategory) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      showToast(`Showing ${visibleCount} staff members for "${pill.textContent.trim()}".`);
    });
  });

  // 2. Call Staff Action
  const btnCallStaffList = document.querySelectorAll('.btn-call-staff');
  btnCallStaffList.forEach(btn => {
    btn.addEventListener('click', () => {
      const staffName = btn.getAttribute('data-name') || 'Staff Member';
      const staffPhone = btn.getAttribute('data-phone') || '+91 98234 11029';
      showToast(`Initiating direct voice call to ${staffName} (${staffPhone})...`);
    });
  });

  // 3. Assign Task Modal
  const btnAssignTaskList = document.querySelectorAll('.btn-assign-task');
  btnAssignTaskList.forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Staff';
      const role = btn.getAttribute('data-role') || 'Duty Staff';
      if (assignStaffSubtitle) {
        assignStaffSubtitle.textContent = `Assign to ${name} (${role})`;
      }
      modalAssignTask.classList.remove('hidden');
    });
  });

  if (btnCloseAssignModal) {
    btnCloseAssignModal.addEventListener('click', () => {
      modalAssignTask.classList.add('hidden');
    });
  }

  if (formAssignTask) {
    formAssignTask.addEventListener('submit', async (e) => {
      e.preventDefault();
      const taskTitle = document.getElementById('task-title').value;
      const priority = document.getElementById('task-priority').value;

      try {
        await fetch('/api/roster/assign-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskTitle, priority })
        });
      } catch (err) {
        // Fallback for offline simulation
      }

      modalAssignTask.classList.add('hidden');
      showToast(`✓ Task "${taskTitle}" (${priority}) successfully dispatched.`);
    });
  }

  // 4. Intercom Guardpost Call
  if (btnIntercomGuardpost) {
    btnIntercomGuardpost.addEventListener('click', () => {
      modalIntercom.classList.remove('hidden');
      showToast('Connecting to Guardpost 01 VoIP channel...');
    });
  }

  if (btnCloseIntercom) {
    btnCloseIntercom.addEventListener('click', () => {
      modalIntercom.classList.add('hidden');
      showToast('Guardpost intercom call terminated.');
    });
  }

  if (btnIntercomMute) {
    let isMuted = false;
    btnIntercomMute.addEventListener('click', () => {
      isMuted = !isMuted;
      btnIntercomMute.classList.toggle('bg-rose-100', isMuted);
      btnIntercomMute.classList.toggle('text-rose-600', isMuted);
      showToast(isMuted ? 'Microphone muted.' : 'Microphone active.');
    });
  }

  // 5. Housekeeping Tasks Modal
  if (btnViewHkTasks) {
    btnViewHkTasks.addEventListener('click', () => {
      modalHousekeeping.classList.remove('hidden');
    });
  }
  if (btnCloseHkModal) {
    btnCloseHkModal.addEventListener('click', () => {
      modalHousekeeping.classList.add('hidden');
    });
  }
  if (btnCloseHkDone) {
    btnCloseHkDone.addEventListener('click', () => {
      modalHousekeeping.classList.add('hidden');
    });
  }

  // 6. Mess Menu Log Modal
  if (btnViewMenuLog) {
    btnViewMenuLog.addEventListener('click', () => {
      modalMenuLog.classList.remove('hidden');
    });
  }
  if (btnCloseMenuModal) {
    btnCloseMenuModal.addEventListener('click', () => {
      modalMenuLog.classList.add('hidden');
    });
  }
  if (btnCloseMenuDone) {
    btnCloseMenuDone.addEventListener('click', () => {
      modalMenuLog.classList.add('hidden');
    });
  }

  // 7. Temporary / Swap Shift Modal
  if (btnSwapShiftOpen) {
    btnSwapShiftOpen.addEventListener('click', () => {
      modalSwapShift.classList.remove('hidden');
    });
  }
  if (btnCloseSwapModal) {
    btnCloseSwapModal.addEventListener('click', () => {
      modalSwapShift.classList.add('hidden');
    });
  }

  if (formSwapShift) {
    formSwapShift.addEventListener('submit', async (e) => {
      e.preventDefault();
      const outgoing = document.getElementById('swap-outgoing').value;
      const incoming = document.getElementById('swap-incoming').value;
      const shift = document.getElementById('swap-shift-type').value;

      try {
        await fetch('/api/roster/swap', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ outgoing, incoming, shift })
        });
      } catch (err) {
        // Fallback
      }

      modalSwapShift.classList.add('hidden');
      showToast(`✓ Shift swap recorded: ${incoming} taking over for ${outgoing}. Biometrics synced!`);
    });
  }

  // 8. Export / Print Roster
  if (btnPrintRoster) {
    btnPrintRoster.addEventListener('click', () => {
      showToast('Generating official TAAMARA Shift Roster PDF report...');
      setTimeout(() => {
        window.print();
      }, 700);
    });
  }

  // 9. Bell Notification
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('Shift Roster Notice: Evening rotation handover scheduled at 22:00 sharp.');
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modalSwapShift) modalSwapShift.classList.add('hidden');
    if (e.target === modalAssignTask) modalAssignTask.classList.add('hidden');
    if (e.target === modalIntercom) modalIntercom.classList.add('hidden');
    if (e.target === modalHousekeeping) modalHousekeeping.classList.add('hidden');
    if (e.target === modalMenuLog) modalMenuLog.classList.add('hidden');
  });
});

