// TAAMARA CO-LIVE / HavenHostel — Notifications Client Interactivity
document.addEventListener('DOMContentLoaded', () => {
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
    }, 2800);
  }

  // 1. Header Bell
  const btnBell = document.getElementById('btn-header-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Real-time sync: 4 high-priority alerts waiting for management triage.');
    });
  }

  // 2. Mark All As Read
  const btnMarkAll = document.getElementById('btn-mark-all-read');
  const badgeNewCount = document.getElementById('badge-new-count');
  const headerUnreadDot = document.getElementById('header-unread-dot');
  const unreadDots = document.querySelectorAll('.unread-dot');
  const notifCards = document.querySelectorAll('.notif-card');

  if (btnMarkAll) {
    btnMarkAll.addEventListener('click', () => {
      unreadDots.forEach(dot => dot.classList.add('hidden'));
      if (headerUnreadDot) headerUnreadDot.classList.add('hidden');
      if (badgeNewCount) {
        badgeNewCount.textContent = '0 New';
        badgeNewCount.className = 'px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold';
      }
      notifCards.forEach(card => card.setAttribute('data-unread', 'false'));
      showToast('✓ All 4 notifications marked as read.');
    });
  }

  // 3. Filter Tabs (All, Unread, Payments, Maintenance)
  const filterTabs = document.querySelectorAll('.notif-filter-tab');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.className = 'notif-filter-tab shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-[#ede5d8] text-slate-700 hover:bg-slate-50 text-[11px] font-bold transition cursor-pointer flex items-center gap-1.5';
      });
      tab.className = 'notif-filter-tab active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-[11px] font-extrabold shadow-xs transition cursor-pointer flex items-center gap-1.5';

      const filter = tab.dataset.filter;
      let count = 0;

      notifCards.forEach(card => {
        const cat = card.dataset.category;
        const isUnread = card.getAttribute('data-unread') === 'true';

        if (filter === 'all') {
          card.classList.remove('hidden');
          count++;
        } else if (filter === 'unread') {
          if (isUnread) {
            card.classList.remove('hidden');
            count++;
          } else {
            card.classList.add('hidden');
          }
        } else if (filter === 'payments') {
          if (cat === 'payments') {
            card.classList.remove('hidden');
            count++;
          } else {
            card.classList.add('hidden');
          }
        } else if (filter === 'maintenance') {
          if (cat === 'maintenance') {
            card.classList.remove('hidden');
            count++;
          } else {
            card.classList.add('hidden');
          }
        }
      });

      showToast(`Showing ${count} ${filter} notifications.`);
    });
  });

  // 4. Action Buttons
  document.querySelectorAll('.btn-wa-reminder').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('💬 Opening WhatsApp reminder to Marcus Vance (₹450 overdue)...');
    });
  });

  document.querySelectorAll('.btn-call-tenant').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('📞 Dialing Marcus Vance (+91 98402 11029)...');
    });
  });

  document.querySelectorAll('.btn-assign-staff').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('👤 Opening Maintenance Task Dispatch for Room 102...');
    });
  });
});
