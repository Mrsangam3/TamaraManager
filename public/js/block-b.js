// Block B Overview & Operational Hub Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const floorChips = document.querySelectorAll('.floor-chip');
  const btnFloorView = document.getElementById('btn-floor-view');
  const btnSwitchFloor = document.getElementById('btn-switch-floor');
  const btnWardenChat = document.getElementById('btn-warden-chat');
  const btnAddRoom = document.getElementById('btn-add-room');
  const btnWingReport = document.getElementById('btn-wing-report');

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

  // 1. Floor Filter Chips
  floorChips.forEach(chip => {
    chip.addEventListener('click', () => {
      floorChips.forEach(c => {
        c.className = 'floor-chip shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer';
      });

      chip.className = 'floor-chip active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition cursor-pointer';
      showToast(`Filtered: Block B ${chip.textContent.trim().replace(/\s+/g, ' ')}`);
    });
  });

  // 2. Floor View Link
  if (btnFloorView) {
    btnFloorView.addEventListener('click', () => {
      showToast('Loading Block B CAD floor plan matrix...');
    });
  }

  // 3. Switch Floor Link
  if (btnSwitchFloor) {
    btnSwitchFloor.addEventListener('click', () => {
      showToast('Switched view to Block B Floor 3 Active Rooms.');
    });
  }

  // 4. Warden WhatsApp Chat
  if (btnWardenChat) {
    btnWardenChat.addEventListener('click', () => {
      showToast('Connecting WhatsApp to Warden Sunil Deshmukh (+91 98234 11029)...');
    });
  }

  // 5. Reserve Bed Buttons
  document.querySelectorAll('.btn-reserve-space').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = '<span>✓</span><span>Reserved</span>';
      btn.className = 'py-1 px-3 bg-emerald-600 text-white text-[11px] font-extrabold rounded-xl flex items-center gap-1 shadow-2xs';
      showToast('✓ Block B Room 203 - Bed B soft-held for 2 hours.');
    });
  });

  // 6. Remind Overdue Rent Button
  document.querySelectorAll('.btn-remind-rent').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.innerHTML = '<span>✓</span><span>Sent</span>';
      btn.className = 'py-1 px-3 bg-slate-800 text-white text-[11px] font-extrabold rounded-xl flex items-center gap-1 shadow-2xs';
      showToast('🔔 Payment reminder notice sent to Rahul Sharma ($420 overdue).');
    });
  });

  // 7. Add Room in Block B
  if (btnAddRoom) {
    btnAddRoom.addEventListener('click', () => {
      showToast('Opening Room Allocation Builder for Block B...');
      setTimeout(() => {
        window.location.href = '/assign-bed.html';
      }, 600);
    });
  }

  // 8. Export Wing Report
  if (btnWingReport) {
    btnWingReport.addEventListener('click', () => {
      showToast('📥 Block B Occupancy & Repairs Audit Report exported (PDF/CSV).');
    });
  }
});

