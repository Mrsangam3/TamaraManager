// TAAMARA CO-LIVE — Campus Occupancy & Rooms Map Interactivity
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
    }, 3200);
  }

  // 1. Notification Bell
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Room Telemetry: 10 vacant beds property-wide ready for auto-assignment.');
    });
  }

  // 2. Floor Tab Selector
  const floorTabs = document.querySelectorAll('.floor-tab');
  const selectedFloorBadge = document.getElementById('selected-floor-badge');

  floorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      floorTabs.forEach(t => {
        t.className = 'floor-tab shrink-0 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-[11px] font-bold transition cursor-pointer';
      });
      tab.className = 'floor-tab active shrink-0 px-3 py-1.5 rounded-full bg-[#180d19] text-white text-[11px] font-bold shadow-xs transition cursor-pointer';

      const floorName = tab.textContent.trim().split('(')[0].trim();
      if (selectedFloorBadge) {
        selectedFloorBadge.textContent = `● ${floorName} Selected`;
      }
      showToast(`📍 Switched live cluster map to ${floorName}.`);
    });
  });

  // 3. Room Bed Buttons
  document.querySelectorAll('.room-bed-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.dataset.room || 'Bed';
      showToast(`🛏️ ${room} Telemetry: Sensor Active • Door strike online • Ready for check-in.`);
    });
  });

  // 4. Auto-Match 10 Vacant Beds Button
  const btnAutoMatch = document.getElementById('btn-auto-match');
  if (btnAutoMatch) {
    btnAutoMatch.addEventListener('click', async () => {
      const origContent = btnAutoMatch.innerHTML;
      btnAutoMatch.disabled = true;
      btnAutoMatch.innerHTML = '<span>⚡ Running Multi-Factor Allocation Algorithm...</span>';

      try {
        await fetch('/api/occupancy/auto-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ matchedCount: 10 })
        });
      } catch (_) {}

      setTimeout(() => {
        btnAutoMatch.disabled = false;
        btnAutoMatch.innerHTML = origContent;
        showToast('🚀 10 Waitlist Applicants matched with Double AC & Non-AC vacancies! Digital offer letters sent.');
      }, 800);
    });
  }

  // 5. See All Vacancies Link
  const btnSeeAll = document.getElementById('btn-see-all-vacancies');
  if (btnSeeAll) {
    btnSeeAll.addEventListener('click', () => {
      showToast('📋 Viewing all 10 vacant spaces: 5 in Block A, 5 in Block B.');
    });
  }

  // 6. Export Audit PDF Button
  const btnExportAudit = document.getElementById('btn-export-audit');
  if (btnExportAudit) {
    btnExportAudit.addEventListener('click', () => {
      showToast('📄 94.3% Campus Capacity & Yield Audit PDF exported (#CAP-2024-94).');
    });
  }

  // 7. Dynamic Pricing Button
  const btnDynamicPricing = document.getElementById('btn-dynamic-pricing');
  if (btnDynamicPricing) {
    btnDynamicPricing.addEventListener('click', () => {
      showToast('📈 Dynamic Pricing: +4.5% surge yield activated across all remaining vacant premium suites.');
    });
  }
});

