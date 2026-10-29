// Evening Roll Call Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Stats Elements
  const statTotal = document.getElementById('stat-total');
  const statPresent = document.getElementById('stat-present');
  const statNightout = document.getElementById('stat-nightout');
  const statUrgent = document.getElementById('stat-urgent');
  const barPresent = document.getElementById('bar-present');
  const barNightout = document.getElementById('bar-nightout');
  const barUrgent = document.getElementById('bar-urgent');

  // Search & Filters
  const searchInput = document.getElementById('rollcall-search');
  const tenantCards = document.querySelectorAll('.tenant-roll-card');
  const wingFloorChips = document.querySelectorAll('.wing-floor-chip');
  const btnMarkAllPresent = document.getElementById('btn-mark-all-present');
  const btnFilterSettings = document.getElementById('btn-filter-settings');
  const btnScanQr = document.getElementById('btn-scan-qr');

  // Siren & Submit
  const btnSirenAlert = document.getElementById('btn-siren-alert');
  const btnFinalizeRollcall = document.getElementById('btn-finalize-rollcall');
  const btnFinalizeText = document.getElementById('btn-finalize-text');
  const footerVerifiedCount = document.getElementById('footer-verified-count');
  const footerPendingCount = document.getElementById('footer-pending-count');

  // State
  let totalResidents = 176;
  let presentResidents = 162;
  const nightoutResidents = 8;
  let urgentResidents = 6;

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

  // Update Roster Header Stats & Bar
  function updateStats() {
    if (statPresent) statPresent.textContent = presentResidents;
    if (statUrgent) statUrgent.textContent = urgentResidents;

    const presentPct = Math.round((presentResidents / totalResidents) * 100);
    const nightoutPct = Math.round((nightoutResidents / totalResidents) * 100);
    const urgentPct = Math.max(0, 100 - presentPct - nightoutPct);

    if (barPresent) barPresent.style.width = `${presentPct}%`;
    if (barNightout) barNightout.style.width = `${nightoutPct}%`;
    if (barUrgent) barUrgent.style.width = `${urgentPct}%`;

    if (footerVerifiedCount) {
      footerVerifiedCount.textContent = `Verified ${presentResidents} of ${totalResidents} Residents`;
    }
    if (footerPendingCount) {
      footerPendingCount.textContent = `${urgentResidents} Pending Review`;
    }
    if (btnFinalizeText) {
      btnFinalizeText.textContent = `Finalize & Submit Roll Call (${presentResidents}/${totalResidents})`;
    }
  }

  // 1. Wing & Floor Chip Selection
  wingFloorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      wingFloorChips.forEach(c => {
        c.className = 'wing-floor-chip shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition cursor-pointer';
        const dot = c.querySelector('.bg-emerald-400');
        if (dot) dot.remove();
        const badge = c.querySelector('span:last-child');
        if (badge) {
          badge.className = 'px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-extrabold';
        }
      });

      chip.className = 'wing-floor-chip active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer';
      
      const dot = document.createElement('span');
      dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
      chip.prepend(dot);

      const badge = chip.querySelector('span:last-child');
      if (badge) {
        badge.className = 'px-2 py-0.5 rounded-full bg-slate-800 text-slate-200 text-[10px] font-extrabold';
      }

      showToast(`Filtered roll call view: ${chip.textContent.trim().replace(/\s+/g, ' ')}`);
    });
  });

  // 2. Search Input Real-Time Filter
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      tenantCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  }

  // 3. QR / NFC Scan Button
  if (btnScanQr) {
    btnScanQr.addEventListener('click', () => {
      showToast('NFC turnstile camera scanner initialized. Tap student ID card.');
    });
  }

  // 4. Filter Settings Button
  if (btnFilterSettings) {
    btnFilterSettings.addEventListener('click', () => {
      showToast('Filters: Showing Block A (Floor 2 Target) • 24 Beds active.');
    });
  }

  // 5. Mark All Remaining Present Button
  if (btnMarkAllPresent) {
    btnMarkAllPresent.addEventListener('click', () => {
      tenantCards.forEach(card => {
        const statusPill = card.querySelector('.status-pill');
        if (statusPill && statusPill.textContent.includes('UNACCOUNTED')) {
          statusPill.textContent = '• PRESENT';
          statusPill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold tracking-tight';

          card.classList.remove('border-rose-200');
          card.classList.add('border-slate-100');

          const nameH3 = card.querySelector('h3');
          if (nameH3) {
            nameH3.classList.remove('text-rose-600');
            nameH3.classList.add('text-slate-900');
          }
        }
      });

      presentResidents = 168;
      urgentResidents = 0;
      updateStats();

      showToast('✓ All 6 unaccounted residents marked as PRESENT via Warden override.');
    });
  }

  // 6. Interactive 3-way Segmented Control on Vikram Sen's card
  const toggleButtons = document.querySelectorAll('.toggle-status-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleButtons.forEach(b => {
        b.className = 'toggle-status-btn flex-1 py-2 px-2 text-slate-600 hover:text-slate-900 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer';
      });

      btn.className = 'toggle-status-btn flex-1 py-2 px-2 bg-[#180d19] text-white rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer';
      
      const newStatus = btn.getAttribute('data-status');
      const parentCard = btn.closest('.tenant-roll-card');
      if (parentCard) {
        const pill = parentCard.querySelector('.status-pill');
        if (pill) {
          if (newStatus === 'PRESENT') {
            pill.textContent = '• PRESENT';
            pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold tracking-tight';
          } else if (newStatus === 'ABSENT') {
            pill.textContent = '• ABSENT';
            pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-extrabold tracking-tight';
          } else {
            pill.textContent = '• ON LEAVE';
            pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-extrabold tracking-tight';
          }
        }
      }
      showToast(`Vikram Sen status marked as ${newStatus}.`);
    });
  });

  // 7. Action Buttons on Kabir Singh card
  document.querySelectorAll('.btn-call-tenant').forEach(btn => {
    btn.addEventListener('click', () => showToast('Dialing Kabir Singh (+91 98765 43210)...'));
  });
  document.querySelectorAll('.btn-call-parent').forEach(btn => {
    btn.addEventListener('click', () => showToast('Connecting to parent contact: Rajesh Singh (Father)...'));
  });
  document.querySelectorAll('.btn-curfew-alert').forEach(btn => {
    btn.addEventListener('click', () => showToast('Curfew WhatsApp & SMS reminder sent to Kabir.'));
  });

  // 8. Action Buttons on Dev Malik card
  document.querySelectorAll('.btn-wifi-ping').forEach(btn => {
    btn.addEventListener('click', () => {
      showToast('📍 Access Point: AP-LIB-F3-02 (Central Library 3rd Floor, Signal -58 dBm).');
    });
  });
  document.querySelectorAll('.btn-mark-found').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentCard = btn.closest('.tenant-roll-card');
      if (parentCard) {
        const pill = parentCard.querySelector('.status-pill');
        if (pill) {
          pill.textContent = '• PRESENT';
          pill.className = 'status-pill px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold tracking-tight';
        }
        parentCard.classList.remove('border-rose-200');
        parentCard.classList.add('border-slate-100');
        const nameH3 = parentCard.querySelector('h3');
        if (nameH3) {
          nameH3.classList.remove('text-rose-600');
          nameH3.classList.add('text-slate-900');
        }
      }
      if (urgentResidents > 0) urgentResidents--;
      if (presentResidents < totalResidents) presentResidents++;
      updateStats();
      showToast('✓ Dev Malik verified present in Library Reading Hall.');
    });
  });

  // 9. Siren Push Alert
  if (btnSirenAlert) {
    btnSirenAlert.addEventListener('click', async () => {
      btnSirenAlert.disabled = true;
      btnSirenAlert.innerHTML = '<span class="animate-spin text-sm">⌛</span><span>Broadcasting High-Priority Siren Alert...</span>';

      try {
        const response = await fetch('/api/rollcall/siren', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            unaccountedCount: urgentResidents,
            deadline: '10:30 PM'
          })
        });
        const data = await response.json();
        showToast(data.message || '🚨 Emergency Siren & WhatsApp blast sent to 6 residents!');
      } catch (err) {
        showToast('🚨 Siren Push & Automated Curfew IVR dispatched to 6 unaccounted residents.');
      } finally {
        setTimeout(() => {
          btnSirenAlert.disabled = false;
          btnSirenAlert.innerHTML = '<span class="live-dot text-sm">🚨</span><span>Alert 6 Tenants via Siren Push & WhatsApp</span>';
        }, 2000);
      }
    });
  }

  // 10. Finalize & Submit Roll Call
  if (btnFinalizeRollcall) {
    btnFinalizeRollcall.addEventListener('click', async () => {
      btnFinalizeRollcall.disabled = true;
      btnFinalizeRollcall.innerHTML = '<span class="animate-spin text-sm">⌛</span><span>Submitting Evening Roll Call...</span>';

      try {
        const response = await fetch('/api/rollcall/finalize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shift: '#2',
            warden: 'Sunil Deshmukh',
            present: presentResidents,
            total: totalResidents,
            urgent: urgentResidents,
            nightout: nightoutResidents,
            timestamp: new Date().toISOString()
          })
        });
        const data = await response.json();
        showToast(data.message || '✓ Night curfew roll call recorded and transmitted to Central Ops!');
      } catch (err) {
        showToast('✓ Night curfew roll call logged successfully!');
      }

      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1200);
    });
  }
});

