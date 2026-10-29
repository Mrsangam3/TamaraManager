// Requests Search & Filter Subscreen Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const searchInput = document.getElementById('filter-search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const matchedCount = document.getElementById('matched-count');
  const previewResultsBadge = document.getElementById('preview-results-badge');
  const ctaMatchCount = document.getElementById('cta-match-count');
  const activeFiltersCount = document.getElementById('active-filters-count');

  const filterPills = document.querySelectorAll('.filter-pill');
  const btnResetAll = document.getElementById('btn-reset-all');
  const btnShowMatching = document.getElementById('btn-show-matching');
  const btnSavePreset = document.getElementById('btn-save-preset');
  const btnBell = document.getElementById('btn-bell');

  const previewCardsContainer = document.getElementById('preview-cards-container');

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

  // Calculate Active Filters & Results
  function updateState() {
    let activeCount = 0;

    // Search query
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    if (query) activeCount++;

    // Count active non-default pills
    const activePills = document.querySelectorAll('.filter-pill.active');
    activePills.forEach(pill => {
      const val = pill.getAttribute('data-value');
      if (val !== 'all') {
        activeCount++;
      }
    });

    if (activeFiltersCount) {
      activeFiltersCount.textContent = `${activeCount} filter${activeCount === 1 ? '' : 's'} active`;
    }

    // Dynamic Result Calculation based on query & filters
    let results = 3;
    if (query === '') {
      results = 5;
    } else if (query === '201' || query.includes('201') || query.includes('rohan')) {
      results = 3;
    } else if (query.includes('305') || query.includes('ananya')) {
      results = 1;
    } else if (query.includes('karan') || query.includes('104')) {
      results = 1;
    } else {
      results = 2;
    }

    if (matchedCount) matchedCount.textContent = results;
    if (previewResultsBadge) previewResultsBadge.textContent = results;
    if (ctaMatchCount) ctaMatchCount.textContent = results;
  }

  // Filter Pill Click Handlers
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const group = pill.getAttribute('data-filter-group');
      const isMulti = group === 'status' || group === 'sla';

      if (isMulti) {
        // Toggle multi-select
        const isActive = pill.classList.contains('active');
        if (isActive) {
          pill.classList.remove('active', 'bg-[#180d19]', 'text-white', 'bg-rose-100', 'text-rose-700', 'bg-emerald-50', 'text-emerald-800');
          pill.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700');
        } else {
          pill.classList.add('active');
          pill.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700');
          if (pill.getAttribute('data-value') === 'critical') {
            pill.classList.add('bg-rose-100', 'text-rose-700', 'border', 'border-rose-200');
          } else if (pill.getAttribute('data-value') === 'confirmed') {
            pill.classList.add('bg-emerald-50', 'text-emerald-800', 'border', 'border-emerald-200');
          } else {
            pill.classList.add('bg-[#180d19]', 'text-white');
          }
        }
      } else {
        // Single-select inside group
        document.querySelectorAll(`.filter-pill[data-filter-group="${group}"]`).forEach(p => {
          p.classList.remove('active', 'bg-[#180d19]', 'text-white');
          p.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700');
        });

        pill.classList.add('active', 'bg-[#180d19]', 'text-white');
        pill.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700');
      }

      updateState();
      showToast(`Filter updated: ${pill.textContent.replace(/[\n\r]+/g, ' ').trim()}`);
    });
  });

  // Search input typing & clear
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      updateState();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      updateState();
      showToast('Search query cleared.');
    });
  }

  // Reset All Button
  if (btnResetAll) {
    btnResetAll.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';

      filterPills.forEach(p => {
        p.classList.remove('active', 'bg-[#180d19]', 'text-white', 'bg-rose-100', 'text-rose-700', 'bg-emerald-50', 'text-emerald-800');
        p.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700');
      });

      // Set default active pills
      const defaultPills = [
        document.querySelector('.filter-pill[data-filter-group="status"][data-value="pending"]'),
        document.querySelector('.filter-pill[data-filter-group="type"][data-value="all"]'),
        document.querySelector('.filter-pill[data-filter-group="time"][data-value="today"]'),
        document.querySelector('.filter-pill[data-filter-group="wing"][data-value="all"]')
      ];

      defaultPills.forEach(p => {
        if (p) {
          p.classList.add('active', 'bg-[#180d19]', 'text-white');
          p.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700');
        }
      });

      updateState();
      showToast('Filters reset to default view.');
    });
  }

  // Show Matching Requests CTA
  if (btnShowMatching) {
    btnShowMatching.addEventListener('click', () => {
      const count = ctaMatchCount ? ctaMatchCount.textContent : '3';
      showToast(`Applying filters... Showing ${count} matching requests.`);
      setTimeout(() => {
        window.location.href = `/requests.html?filtered=true&count=${count}`;
      }, 600);
    });
  }

  // Save Preset Button
  if (btnSavePreset) {
    btnSavePreset.addEventListener('click', () => {
      showToast('🔖 Current filter parameters saved to "Quick Presets".');
    });
  }

  // Bell Alert
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Filter Notice: 3 active requests match your current security parameters.');
    });
  }

  // Initial state check
  updateState();
});

