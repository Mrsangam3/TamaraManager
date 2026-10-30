// Universal Navigation Active State Manager
// Ensures the active highlight ("cursor") accurately reflects the current page/tab across the entire application.

(function () {
  function syncActiveNav() {
    const rawPath = window.location.pathname.toLowerCase();
    let page = rawPath.split('/').pop().replace('.html', '').trim();
    if (!page || page === 'index') {
      page = rawPath.includes('dashboard') ? 'dashboard' : 'dashboard';
    }

    const pageToNavMap = {
      'dashboard': 'dashboard',
      'urgent-action': 'dashboard',
      'quick-actions': 'dashboard',

      'tenants': 'tenants',
      'onboard-tenant': 'tenants',

      'occupancy': 'occupancy',
      'assign-bed': 'occupancy',

      'operations': 'operations',
      'inspect-rooms': 'operations',
      'manage-schedule': 'operations',
      'resolve-tickets': 'operations',
      'shift-roster': 'operations',
      'update-menu': 'operations',
      'log-issue': 'operations',
      'roll-call': 'operations',

      'requests': 'requests',
      'approved-requests': 'requests',
      'rejected-requests': 'requests',
      'room-change': 'requests',
      'batch-processing': 'requests',
      'filter-requests': 'requests',

      'broadcast': 'broadcast',
      'bulk-reminders': 'broadcast',

      'notifications': 'notifications',

      'security-permissions': 'security-permissions',

      'help-support': 'help-support',

      'more': 'more',
      'hostel-rules': 'more',
      'app-preferences': 'more',

      'block-a': 'block-a',
      'block-b': 'block-b',
      'logout-confirmation': 'logout-confirmation'
    };

    const targetNav = pageToNavMap[page] || page;
    const sidebar = document.getElementById('app-sidebar');
    if (!sidebar) return;

    // 1. Reset all standard menu items
    const navLinks = sidebar.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.classList.remove('font-bold', 'text-white', 'bg-[#2d1729]', 'border', 'border-[#5c304f]', 'shadow-md');
      link.classList.add('font-semibold', 'text-[#d4b8cf]');

      // Remove any lingering "Active" badges
      link.querySelectorAll('.nav-active-indicator, .nav-active-badge').forEach(b => b.remove());
      link.querySelectorAll('span').forEach(sp => {
        if (sp.textContent.trim().toLowerCase() === 'active') {
          sp.remove();
        }
      });

      // Reset icon color
      const svg = link.querySelector('svg');
      if (svg) {
        svg.classList.remove('text-[#eab308]');
      }
    });

    // 2. Reset Campus Wings buttons
    const blockABtn = sidebar.querySelector('a[href*="block-a"]');
    const blockBBtn = sidebar.querySelector('a[href*="block-b"]');
    if (blockABtn) {
      blockABtn.className = 'py-2 px-2.5 rounded-xl bg-[#251222] border border-[#381c34] text-[11px] font-bold text-[#d4b8cf] hover:text-white hover:bg-[#341830] text-center transition cursor-pointer';
    }
    if (blockBBtn) {
      blockBBtn.className = 'py-2 px-2.5 rounded-xl bg-[#251222] border border-[#381c34] text-[11px] font-bold text-[#d4b8cf] hover:text-white hover:bg-[#341830] text-center transition cursor-pointer';
    }

    // 3. Highlight the matching target link
    if (targetNav === 'block-a') {
      if (blockABtn) {
        blockABtn.className = 'py-2 px-2.5 rounded-xl bg-[#341830] border-2 border-[#eab308] text-[11px] font-extrabold text-white text-center shadow-md transition cursor-pointer';
      }
      return;
    }

    if (targetNav === 'block-b') {
      if (blockBBtn) {
        blockBBtn.className = 'py-2 px-2.5 rounded-xl bg-[#341830] border-2 border-[#eab308] text-[11px] font-extrabold text-white text-center shadow-md transition cursor-pointer';
      }
      return;
    }

    let matched = false;
    navLinks.forEach(link => {
      const href = (link.getAttribute('href') || '').toLowerCase();
      const isMatch = href.includes('/' + targetNav + '.html') || href === targetNav || href === '/' + targetNav;

      if (isMatch && !matched) {
        matched = true;
        link.classList.remove('font-semibold', 'text-[#d4b8cf]', 'hover:text-white', 'hover:bg-[#281424]');
        link.classList.add('font-bold', 'text-white', 'bg-[#2d1729]', 'border', 'border-[#5c304f]', 'shadow-md');

        const svg = link.querySelector('svg');
        if (svg) {
          svg.classList.add('text-[#eab308]');
        }

        // Add Active badge if the link doesn't already have a count badge
        const hasExistingBadge = link.querySelector('span:not(.nav-active-indicator)');
        if (!hasExistingBadge) {
          const activeTag = document.createElement('span');
          activeTag.className = 'nav-active-indicator text-[10px] font-bold text-[#eab308]';
          activeTag.textContent = 'Active';
          link.appendChild(activeTag);
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncActiveNav);
  } else {
    syncActiveNav();
  }
})();
