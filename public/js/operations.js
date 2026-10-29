// Operations Hub Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const datePickerBtn = document.getElementById('date-picker-btn');
  const btnAllocateBed = document.getElementById('btn-allocate-bed');
  const btnResolveTickets = document.getElementById('btn-resolve-tickets');
  const btnInspectRooms = document.getElementById('btn-inspect-rooms');
  const btnManageSchedule = document.getElementById('btn-manage-schedule');
  const btnUpdateMenu = document.getElementById('btn-update-menu');
  const btnShiftRoster = document.getElementById('btn-shift-roster');
  const btnSendReminders = document.getElementById('btn-send-reminders');

  // Toast Helper
  function showToast(msg, duration = 2800) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, duration);
  }

  // 1. Fetch live operations data from Node.js backend
  async function loadOperationsData() {
    try {
      const response = await fetch('/api/operations');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const data = result.data;
          const opOccupancy = document.getElementById('op-occupancy');
          const opAlerts = document.getElementById('op-alerts');
          if (opOccupancy) opOccupancy.textContent = data.occupancy;
          if (opAlerts) opAlerts.textContent = `${data.priorityAlerts} Active`;
        }
      }
    } catch (_) {
      console.log('Running operations in standalone mode.');
    }
  }
  loadOperationsData();

  // 2. Interactive Button Handlers
  if (datePickerBtn) {
    datePickerBtn.addEventListener('click', () => {
      showToast('Calendar view opened. Selecting operations shift date...');
    });
  }

  if (btnAllocateBed) {
    btnAllocateBed.addEventListener('click', () => {
      showToast('Opening Bed Allocation Matrix...');
      setTimeout(() => {
        window.location.href = '/assign-bed.html';
      }, 400);
    });
  }

  if (btnResolveTickets) {
    btnResolveTickets.addEventListener('click', () => {
      showToast('Opening maintenance ticketing queue (3 open, 1 escalated)...');
    });
  }

  if (btnInspectRooms) {
    btnInspectRooms.addEventListener('click', () => {
      showToast('Opening Floor Audit & Room Inspections Console...');
    });
  }

  if (btnManageSchedule) {
    btnManageSchedule.addEventListener('click', () => {
      showToast('Opening Incident & Maintenance Dispatch Schedule...');
    });
  }

  if (btnUpdateMenu) {
    btnUpdateMenu.addEventListener('click', () => {
      showToast('Mess menu editor opened. Updating Lunch & Dinner specials.');
    });
  }

  if (btnShiftRoster) {
    btnShiftRoster.addEventListener('click', () => {
      showToast('Staff duty roster opened. Next rotation scheduled at 18:00.');
    });
  }

  if (btnSendReminders) {
    btnSendReminders.addEventListener('click', () => {
      showToast('Opening Bulk Reminder Dispatch Console for 7 overdue tenants...');
    });
  }
});

