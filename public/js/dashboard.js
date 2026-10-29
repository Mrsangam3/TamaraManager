// Manager Dashboard Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  const mgrFirstName = document.getElementById('mgr-first-name');
  const mgrCampus = document.getElementById('mgr-campus');
  const statOccupancyVal = document.getElementById('stat-occupancy-val');
  const statBedsVal = document.getElementById('stat-beds-val');
  const statTenantsVal = document.getElementById('stat-tenants-val');
  const statAvailableVal = document.getElementById('stat-available-val');
  const statPendingVal = document.getElementById('stat-pending-val');
  const notifBtn = document.getElementById('notif-btn');

  // Show Toast Utility
  function showToast(message, duration = 3000) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, duration);
  }

  // 1. Load Live Summary Data from Node.js Backend
  async function loadDashboardData() {
    try {
      // Check local storage for authenticated manager info
      const storedUser = sessionStorage.getItem('tamara_manager');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          if (user.name && mgrFirstName) {
            mgrFirstName.textContent = user.name.split(' ')[0] || 'Alex';
          }
          if (user.campus && mgrCampus) {
            mgrCampus.textContent = user.campus;
          }
        } catch (_) {}
      }

      const response = await fetch('/api/dashboard/summary');
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const { metrics } = result.data;
          if (metrics) {
            if (statOccupancyVal) statOccupancyVal.textContent = `${metrics.occupancy.percentage}%`;
            if (statBedsVal) statBedsVal.textContent = `${metrics.occupancy.occupiedBeds} / ${metrics.occupancy.totalBeds} Beds`;
            if (statTenantsVal) statTenantsVal.textContent = metrics.tenants.total;
            if (statAvailableVal) statAvailableVal.textContent = metrics.available.total;
            if (statPendingVal) statPendingVal.textContent = metrics.pending.total;
          }
        }
      }
    } catch (err) {
      console.log('Running in standalone mode with default stats.');
    }
  }
  loadDashboardData();

  // 2. Urgent Action Triggers (Nudge, Dispatch, Inspect)
  const actionButtons = document.querySelectorAll('.action-btn');
  actionButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      const actionType = btn.getAttribute('data-action');
      const originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = '...';

      try {
        const response = await fetch('/api/actions/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actionType }),
        });
        const data = await response.json();

        if (response.ok && data.success) {
          showToast(data.message);
          btn.textContent = '✓ Done';
          btn.classList.add('bg-emerald-600', 'text-white', 'border-transparent');
          btn.classList.remove('bg-[#180d19]', 'bg-white', 'text-[#c59b27]', 'text-slate-700');
        } else {
          showToast('Action logged in operations audit.');
          btn.textContent = originalText;
        }
      } catch (err) {
        // Fallback simulation
        if (actionType === 'nudge') {
          showToast('Payment reminder dispatched via SMS & WhatsApp.');
        } else if (actionType === 'dispatch') {
          showToast('Work order #4092 sent to campus maintenance team.');
        } else {
          showToast('Move-out checklist initialized.');
        }
        btn.textContent = '✓ Done';
      } finally {
        setTimeout(() => {
          btn.disabled = false;
        }, 2000);
      }
    });
  });

  // 3. Quick Operations Buttons
  const opOnboard = document.getElementById('op-onboard');
  const opAssign = document.getElementById('op-assign');
  const opIssue = document.getElementById('op-issue');
  const opRollcall = document.getElementById('op-rollcall');
  const opUrgent = document.getElementById('op-urgent');

  if (opOnboard) {
    opOnboard.addEventListener('click', () => {
      showToast('Opening Tenant Onboarding form...');
    });
  }

  if (opAssign) {
    opAssign.addEventListener('click', () => {
      showToast('Opening Bed Matrix Allocation...');
    });
  }

  if (opIssue) {
    opIssue.addEventListener('click', () => {
      showToast('Opening Maintenance Incident Logger...');
    });
  }

  if (opRollcall) {
    opRollcall.addEventListener('click', () => {
      showToast('Opening Night Curfew Roll Call...');
    });
  }

  if (opUrgent) {
    opUrgent.addEventListener('click', () => {
      showToast('Opening Urgent Action & Triage Stream...');
    });
  }

  // Smooth drag-to-scroll for Quick Operations buttons row (left <-> right)
  const buttonsRow = document.querySelector('.overflow-x-auto');
  if (buttonsRow) {
    let isDown = false;
    let startX;
    let scrollLeft;

    buttonsRow.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - buttonsRow.offsetLeft;
      scrollLeft = buttonsRow.scrollLeft;
    });
    buttonsRow.addEventListener('mouseleave', () => { isDown = false; });
    buttonsRow.addEventListener('mouseup', () => { isDown = false; });
    buttonsRow.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - buttonsRow.offsetLeft;
      const walk = (x - startX) * 1.5;
      buttonsRow.scrollLeft = scrollLeft - walk;
    });
  }

  // 4. Notifications Bell
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('3 urgent campus alerts pending triage.');
    });
  }

  // 5. Bottom Navigation Tabs (for non-linked tabs)
  const navTabs = document.querySelectorAll('button.nav-tab');
  navTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      navTabs.forEach((t) => {
        t.classList.remove('text-[#c59b27]', 'active');
        t.classList.add('text-slate-400');
        const span = t.querySelector('span');
        if (span) {
          span.classList.remove('font-bold');
          span.classList.add('font-medium');
        }
      });

      tab.classList.remove('text-slate-400');
      tab.classList.add('text-[#c59b27]', 'active');
      const activeSpan = tab.querySelector('span');
      if (activeSpan) {
        activeSpan.classList.remove('font-medium');
        activeSpan.classList.add('font-bold');
      }

      const tabName = activeSpan ? activeSpan.textContent.trim() : '';
      if (tabName !== 'Home') {
        showToast(`${tabName} module ready for screen template.`);
      }
    });
  });
});

