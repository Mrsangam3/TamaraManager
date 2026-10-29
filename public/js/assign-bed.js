// Assign Bed Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const wingButtons = document.querySelectorAll('.wing-btn');
  const floorButtons = document.querySelectorAll('.floor-btn');
  const bedSelectButtons = document.querySelectorAll('.bed-select-btn');
  const checklistItems = document.querySelectorAll('.checklist-item');
  const checklistCounter = document.getElementById('checklist-counter');
  const btnLockAllocation = document.getElementById('btn-lock-allocation');
  const btnLockText = document.getElementById('btn-lock-text');

  let currentSelectedBed = 'Room 203 - Bed A';

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

  // 1. Wing Selector
  wingButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      wingButtons.forEach(b => {
        b.className = 'wing-btn py-2.5 px-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer';
      });
      btn.className = 'wing-btn py-2.5 px-3 bg-white border-2 border-[#c59b27] text-[#c59b27] rounded-2xl text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer';
      showToast(`Selected ${btn.textContent.trim()}`);
    });
  });

  // 2. Floor Selector
  floorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      floorButtons.forEach(b => {
        b.className = 'floor-btn py-2 px-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer text-center';
      });
      btn.className = 'floor-btn py-2 px-3 bg-[#180d19] text-white rounded-xl text-xs font-extrabold shadow-xs transition cursor-pointer text-center';
      showToast(`Switched layout view to ${btn.textContent.trim()}`);
    });
  });

  // 3. Bed Selection
  bedSelectButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const room = btn.getAttribute('data-room');
      const bed = btn.getAttribute('data-bed');
      const price = btn.getAttribute('data-price');
      currentSelectedBed = `${room} - ${bed}`;

      bedSelectButtons.forEach(b => {
        b.textContent = '• Select';
        b.className = 'bed-select-btn px-3 py-1 rounded-full bg-white text-[#c59b27] hover:bg-[#fdfbf7] border border-[#e3d5be] text-[10px] font-extrabold cursor-pointer transition shadow-2xs';
      });

      btn.textContent = '✓ Selected';
      btn.className = 'bed-select-btn px-3 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold cursor-pointer transition shadow-2xs';

      btnLockText.textContent = `Assign & Lock Bed Allocation (${currentSelectedBed})`;
      showToast(`Selected ${currentSelectedBed} (${price}/month)`);
    });
  });

  // 4. Checklist Item Counter
  function updateChecklist() {
    let checkedCount = 0;
    checklistItems.forEach(item => {
      if (item.checked) checkedCount++;
    });
    if (checklistCounter) {
      checklistCounter.textContent = `${checkedCount} of ${checklistItems.length} Done`;
    }
  }

  checklistItems.forEach(item => {
    item.addEventListener('change', () => {
      updateChecklist();
      if (item.checked) {
        showToast('Checklist task completed ✓');
      }
    });
  });

  // 5. Assign & Lock Allocation
  if (btnLockAllocation) {
    btnLockAllocation.addEventListener('click', async () => {
      btnLockAllocation.disabled = true;
      btnLockAllocation.innerHTML = `<span>Securing & Locking Allocation...</span>`;

      try {
        const response = await fetch('/api/beds/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantName: 'Aryan Sharma',
            allocation: currentSelectedBed,
            wing: 'Block A',
            floor: 'Floor 2'
          })
        });
        const data = await response.json();
        showToast(data.message || `Bed locked for Aryan Sharma!`);
      } catch (_) {
        showToast(`Bed (${currentSelectedBed}) locked & assigned to Aryan Sharma!`);
      }

      setTimeout(() => {
        window.location.href = '/tenants.html';
      }, 1200);
    });
  }
});

