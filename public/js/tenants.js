// Tenants Directory Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('tenant-search');
  const qrScanBtn = document.getElementById('qr-scan-btn');
  const filterChips = document.querySelectorAll('.filter-chip');
  const tenantItems = document.querySelectorAll('.tenant-item');
  const onboardBtn = document.getElementById('onboard-tenant-btn');
  const floorMapBtn = document.getElementById('floor-map-btn');
  const quickAddFab = document.getElementById('quick-add-fab');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  let currentFilter = 'all';

  // Toast Helper
  function showToast(msg, duration = 2500) {
    if (!toast || !toastText) return;
    toastText.textContent = msg;
    toast.classList.remove('hidden');
    toast.classList.add('flex');

    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, duration);
  }

  // Filter & Search Logic
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    tenantItems.forEach((item) => {
      const block = item.getAttribute('data-block');
      const status = item.getAttribute('data-status');
      const name = item.getAttribute('data-name');
      const room = item.getAttribute('data-room');
      const phone = item.getAttribute('data-phone');

      let matchesFilter = false;
      if (currentFilter === 'all') {
        matchesFilter = true;
      } else if (currentFilter === 'block-a' && block === 'block-a') {
        matchesFilter = true;
      } else if (currentFilter === 'block-b' && block === 'block-b') {
        matchesFilter = true;
      } else if (currentFilter === 'dues' && status === 'dues') {
        matchesFilter = true;
      }

      let matchesQuery = true;
      if (query) {
        matchesQuery = name.includes(query) || room.includes(query) || phone.includes(query);
      }

      if (matchesFilter && matchesQuery) {
        item.classList.remove('hidden');
      } else {
        item.classList.add('hidden');
      }
    });
  }

  // Filter Chip Click Listeners
  filterChips.forEach((chip) => {
    if (!chip.hasAttribute('data-filter')) return;
    chip.addEventListener('click', () => {
      filterChips.forEach((c) => {
        if (c.hasAttribute('data-filter')) {
          c.className = 'filter-chip shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-xs cursor-pointer transition';
        }
      });

      chip.className = 'filter-chip shrink-0 bg-[#180d19] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xs cursor-pointer transition';
      currentFilter = chip.getAttribute('data-filter');
      applyFilters();
    });
  });

  const chipBlockA = document.getElementById('chip-block-a');
  if (chipBlockA) {
    chipBlockA.addEventListener('click', () => {
      showToast('Opening Block A Operational Hub & Floor Matrix...');
    });
  }

  const chipBlockB = document.getElementById('chip-block-b');
  if (chipBlockB) {
    chipBlockB.addEventListener('click', () => {
      showToast('Opening Block B Operational Hub & Floor Matrix...');
    });
  }

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Action Buttons
  if (onboardBtn) {
    onboardBtn.addEventListener('click', () => {
      showToast('Opening Tenant Onboarding Wizard...');
      setTimeout(() => {
        window.location.href = '/onboard-tenant.html';
      }, 400);
    });
  }

  if (quickAddFab) {
    quickAddFab.addEventListener('click', (e) => {
      // Direct navigation to Quick Action Center
      window.location.href = '/quick-actions.html';
    });
  }

  const occupancyBanner = document.getElementById('occupancy-banner');
  if (occupancyBanner) {
    occupancyBanner.addEventListener('click', (e) => {
      // Direct navigation to 94% occupancy campus map
      window.location.href = '/occupancy.html';
    });
  }

  if (floorMapBtn) {
    floorMapBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.location.href = '/occupancy.html';
    });
  }

  if (qrScanBtn) {
    qrScanBtn.addEventListener('click', () => {
      showToast('Camera QR / RFID scanner activated.');
    });
  }

  // Tenant Card Detail Click
  document.querySelectorAll('.tenant-detail-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parentCard = btn.closest('.tenant-item');
      const name = parentCard.querySelector('h4').textContent;
      showToast(`Opening profile dossier for ${name}...`);
    });
  });
});

