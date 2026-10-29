// Inspect Rooms & Floor Audits Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const floorTabs = document.querySelectorAll('.floor-tab');
  const floorViews = document.querySelectorAll('.floor-view');

  const btnReclean302 = document.getElementById('btn-reclean-302');
  const btnApprove302 = document.getElementById('btn-approve-302');
  const cardRoom302 = document.getElementById('card-room-302');
  const badgeRoom302 = document.getElementById('badge-room-302');

  const turnoverItems = document.querySelectorAll('.turnover-item');
  const btnStartRestroom = document.getElementById('btn-start-restroom');
  const btnInspectCamera = document.getElementById('btn-inspect-camera');
  const btnSubmitInspection = document.getElementById('btn-submit-inspection');

  let currentFloor = '3'; // Default active floor in mockup

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

  // Update Floor UI Tab Appearance
  function updateTabsUI(selectedFloor) {
    floorTabs.forEach(tab => {
      const f = tab.getAttribute('data-floor');
      const isSelected = f === selectedFloor;

      // Clear existing content and rebuild cleanly
      tab.innerHTML = '';

      if (isSelected) {
        tab.className = 'floor-tab active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer';
        const dot = document.createElement('span');
        dot.className = 'w-1.5 h-1.5 rounded-full bg-emerald-400';
        tab.appendChild(dot);

        const label = document.createElement('span');
        if (f === '1') label.textContent = 'Floor 1 Done';
        else if (f === '2') label.textContent = 'Floor 2 Done';
        else if (f === '3') label.textContent = 'Floor 3 Active';
        else if (f === '4') label.textContent = 'Floor 4 Scheduled';
        tab.appendChild(label);
      } else {
        if (f === '1' || f === '2') {
          tab.className = 'floor-tab shrink-0 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer';
          const check = document.createElement('span');
          check.textContent = '✓';
          tab.appendChild(check);
          const label = document.createElement('span');
          label.textContent = `Floor ${f} Done`;
          tab.appendChild(label);
        } else if (f === '3') {
          tab.className = 'floor-tab shrink-0 px-3.5 py-1.5 rounded-full bg-[#fdfbf7] border border-[#e3d5be] text-[#a6801e] hover:bg-[#fbf2da] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer';
          const dot = document.createElement('span');
          dot.className = 'w-1.5 h-1.5 rounded-full bg-[#c59b27]';
          tab.appendChild(dot);
          const label = document.createElement('span');
          label.textContent = 'Floor 3 Active';
          tab.appendChild(label);
        } else if (f === '4') {
          tab.className = 'floor-tab shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer';
          const label = document.createElement('span');
          label.textContent = 'Floor 4 Scheduled';
          tab.appendChild(label);
        }
      }
    });
  }

  // Update Floor Views & Bottom Action Button
  function switchFloor(floor) {
    currentFloor = floor;
    updateTabsUI(floor);

    // Switch visible section
    floorViews.forEach(view => {
      if (view.id === `floor-view-${floor}`) {
        view.classList.remove('hidden');
      } else {
        view.classList.add('hidden');
      }
    });

    // Update Bottom Submit Action Button Text & Style
    if (btnSubmitInspection) {
      if (floor === '1') {
        btnSubmitInspection.className = 'flex-1 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition cursor-pointer';
        btnSubmitInspection.innerHTML = `
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>View Signed Floor 1 Audit (Completed)</span>
        `;
        showToast('Viewing Floor 1 Ground Wing: All 4 audits passed.');
      } else if (floor === '2') {
        btnSubmitInspection.className = 'flex-1 py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/25 transition cursor-pointer';
        btnSubmitInspection.innerHTML = `
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>View Signed Floor 2 Audit (Completed)</span>
        `;
        showToast('Viewing Floor 2 East & West Wing: All 4 audits passed.');
      } else if (floor === '3') {
        btnSubmitInspection.className = 'flex-1 py-3.5 px-4 bg-[#c59b27] hover:bg-[#c59b27] active:bg-[#a6801e] text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-[#c59b27]/25 transition cursor-pointer';
        btnSubmitInspection.innerHTML = `
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span>Submit Floor 3 Inspection</span>
        `;
        showToast('Viewing Floor 3 West Wing: Active inspection in progress.');
      } else if (floor === '4') {
        btnSubmitInspection.className = 'flex-1 py-3.5 px-4 bg-slate-900 hover:bg-slate-800 active:bg-black text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-slate-900/25 transition cursor-pointer';
        btnSubmitInspection.innerHTML = `
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
          <span>Initialize &amp; Submit Floor 4 Inspection</span>
        `;
        showToast('Viewing Floor 4 Rooftop & North Wing: Scheduled for evening prep.');
      }
    }
  }

  // 1. Floor Tabs Event Listeners
  floorTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const floor = tab.getAttribute('data-floor');
      if (floor) switchFloor(floor);
    });
  });

  // 2. Room Photo Proof Modals / Toasts
  document.querySelectorAll('.btn-view-proof').forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.getAttribute('data-room') || '301';
      showToast(`📷 Room ${room} Photo Proof: Bed Linen, Flooring & Washroom sanitization verified.`);
    });
  });

  // 3. Room 302 Re-clean & Approve
  if (btnReclean302) {
    btnReclean302.addEventListener('click', async () => {
      btnReclean302.disabled = true;
      btnReclean302.innerHTML = '<span>⌛</span><span>Dispatching...</span>';

      try {
        const response = await fetch('/api/inspections/reclean', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room: '302', housekeeper: 'Rajiv M.', issues: 'Exhaust fan dusty; balcony latch loose' })
        });
        const data = await response.json();
        showToast(data.message || '🔄 Re-clean work ticket dispatched to Rajiv M.');
      } catch (_) {
        showToast('🔄 Re-clean notification dispatched to Rajiv M. (SLA: 20 mins)');
      }

      if (badgeRoom302) {
        badgeRoom302.className = 'px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold';
        badgeRoom302.textContent = '🔄 Re-cleaning In Progress';
      }
      btnReclean302.classList.add('opacity-50');
    });
  }

  if (btnApprove302) {
    btnApprove302.addEventListener('click', async () => {
      btnApprove302.disabled = true;

      try {
        await fetch('/api/inspections/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room: '302', approvedBy: 'Alex Morgan' })
        });
      } catch (_) {}

      showToast('✓ Single Deluxe Suite (Room 302) approved and marked as Passed!');
      if (badgeRoom302) {
        badgeRoom302.className = 'px-2.5 py-0.5 rounded-full bg-[#052e16] text-emerald-400 text-[10px] font-black';
        badgeRoom302.textContent = '✓ Passed (Manager Override)';
      }
      if (cardRoom302) {
        cardRoom302.classList.remove('border-rose-100');
        cardRoom302.classList.add('border-emerald-200');
      }
    });
  }

  // 4. Turnover Tasks Checkbox Toggles
  turnoverItems.forEach(item => {
    item.addEventListener('change', () => {
      const parentLabel = item.closest('label');
      if (item.checked) {
        parentLabel.className = 'flex items-center gap-2.5 p-2.5 bg-[#fdfbf7]/50 rounded-xl border border-[#ede4d5] cursor-pointer text-xs font-semibold text-slate-700';
      } else {
        parentLabel.className = 'flex items-center gap-2.5 p-2.5 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer text-xs font-semibold text-slate-700 hover:bg-slate-100/70 transition';
      }

      const totalChecked = document.querySelectorAll('.turnover-item:checked').length;
      showToast(`Turnover task updated (${totalChecked} of 5 completed).`);
    });
  });

  // 5. Restroom 3B Start Cleaning
  if (btnStartRestroom) {
    btnStartRestroom.addEventListener('click', () => {
      btnStartRestroom.textContent = 'Cleaning Active';
      btnStartRestroom.className = 'font-extrabold text-emerald-600';
      showToast('Common Restroom 3B timer started: Assigned to Housekeeping Team A.');
    });
  }

  // 6. Floor 4 Specific Handlers
  document.querySelectorAll('.btn-start-floor4').forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.getAttribute('data-room');
      btn.textContent = 'Audit Started ✓';
      btn.className = 'font-extrabold text-emerald-600';
      showToast(`Started active audit for Room ${room} on Floor 4.`);
    });
  });

  document.querySelectorAll('.btn-notify-laundry').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.textContent = 'Pinged ✓';
      btn.disabled = true;
      btn.className = 'text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg';
      showToast('🧺 High-priority alert sent to Central Laundry facility.');
    });
  });

  // 7. Camera Proof
  if (btnInspectCamera) {
    btnInspectCamera.addEventListener('click', () => {
      showToast(`📸 Camera launched. Capture audit photo for Floor ${currentFloor}.`);
    });
  }

  // 8. Submit / Action Floor Inspection
  if (btnSubmitInspection) {
    btnSubmitInspection.addEventListener('click', async () => {
      if (currentFloor === '1' || currentFloor === '2') {
        showToast(`✓ Floor ${currentFloor} Housekeeping Audit is certified, signed and archived.`);
        return;
      }

      if (currentFloor === '4') {
        showToast('✓ Floor 4 Evening Shift Inspection initialized & synced with Operations!');
        setTimeout(() => {
          switchFloor('3');
        }, 1200);
        return;
      }

      // Default Floor 3 submission
      btnSubmitInspection.disabled = true;
      btnSubmitInspection.innerHTML = '<span>⌛</span><span>Submitting Audit...</span>';

      try {
        const response = await fetch('/api/inspections/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            floor: 'Floor 3 (West Wing)',
            completedRooms: 4,
            lead: 'Maria Santos',
            timestamp: new Date().toISOString()
          })
        });
        const data = await response.json();
        showToast(data.message || '✓ Floor 3 Housekeeping Audit successfully submitted and synced with Operations Hub!');
      } catch (_) {
        showToast('✓ Floor 3 Audit recorded and verified by Lead Maria Santos!');
      }

      setTimeout(() => {
        window.location.href = '/operations.html';
      }, 1200);
    });
  }
});
