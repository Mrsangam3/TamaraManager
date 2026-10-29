// Log Maintenance Ticket Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  const catButtons = document.querySelectorAll('.cat-btn');
  const urgencyButtons = document.querySelectorAll('.urgency-btn');
  const locButtons = document.querySelectorAll('.loc-btn');
  const thumbDeletes = document.querySelectorAll('.thumb-del');
  const btnAddProof = document.getElementById('btn-add-proof');
  const proofCounterLabel = document.getElementById('proof-counter-label');

  const inputTitle = document.getElementById('input-title');
  const inputNotes = document.getElementById('input-notes');
  const inputRoom = document.getElementById('input-room');
  const inputTenant = document.getElementById('input-tenant');

  const btnDispatchTicket = document.getElementById('btn-dispatch-ticket');
  const btnSaveMemo = document.getElementById('btn-save-memo');

  let selectedCategory = 'Plumbing';
  let selectedUrgency = 'Critical / High';
  let selectedLocation = 'Student Room';
  let attachedPhotosCount = 2;

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

  // 1. Category Switcher
  catButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      catButtons.forEach(b => {
        b.className = 'cat-btn relative p-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 transition cursor-pointer';
        const dot = b.querySelector('.bg-emerald-400');
        if (dot) dot.remove();
      });

      btn.className = 'cat-btn relative p-3 bg-[#180d19] text-white rounded-2xl flex flex-col items-center justify-center text-center gap-1.5 shadow-sm transition cursor-pointer';
      const indicator = document.createElement('span');
      indicator.className = 'absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400';
      btn.appendChild(indicator);

      selectedCategory = btn.getAttribute('data-cat');
      showToast(`Category set to ${selectedCategory}`);
    });
  });

  // 2. Urgency Tier Switcher
  urgencyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      urgencyButtons.forEach(b => {
        b.className = 'urgency-btn py-2 text-center rounded-xl text-xs font-semibold text-slate-600 transition cursor-pointer';
      });

      selectedUrgency = btn.getAttribute('data-tier');

      if (selectedUrgency === 'Critical / High') {
        btn.className = 'urgency-btn py-2 text-center bg-[#b91c1c] text-white rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer';
      } else if (selectedUrgency === 'Medium') {
        btn.className = 'urgency-btn py-2 text-center bg-amber-500 text-white rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer';
      } else {
        btn.className = 'urgency-btn py-2 text-center bg-[#c59b27] text-white rounded-xl text-xs font-extrabold shadow-sm transition cursor-pointer';
      }

      showToast(`Urgency priority set to ${selectedUrgency}`);
    });
  });

  // 3. Location Chips
  locButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      locButtons.forEach(b => {
        b.className = 'loc-btn px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full text-xs font-semibold transition cursor-pointer';
      });
      btn.className = 'loc-btn px-3.5 py-1.5 bg-[#c59b27] text-white rounded-full text-xs font-bold transition cursor-pointer';
      selectedLocation = btn.getAttribute('data-loc');
      showToast(`Incident area set to ${selectedLocation}`);
    });
  });

  // 4. Photo Proof Handlers
  thumbDeletes.forEach(delBtn => {
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetId = delBtn.getAttribute('data-target');
      const targetThumb = document.getElementById(targetId);
      if (targetThumb) {
        targetThumb.remove();
        if (attachedPhotosCount > 0) attachedPhotosCount--;
        proofCounterLabel.textContent = `Visual Proof (${attachedPhotosCount} of 4 attached)`;
        showToast('Attachment removed.');
      }
    });
  });

  if (btnAddProof) {
    btnAddProof.addEventListener('click', () => {
      if (attachedPhotosCount < 4) {
        attachedPhotosCount++;
        proofCounterLabel.textContent = `Visual Proof (${attachedPhotosCount} of 4 attached)`;
        showToast('New photo attachment added from camera feed.');
      } else {
        showToast('Maximum of 4 photos reached.');
      }
    });
  }

  // 5. Submit Ticket & Dispatch Technician
  if (btnDispatchTicket) {
    btnDispatchTicket.addEventListener('click', async () => {
      const title = inputTitle.value.trim();
      const notes = inputNotes.value.trim();
      const room = inputRoom.value.trim();
      const tenant = inputTenant.value.trim();

      if (!title) {
        showToast('Please provide an issue title.');
        return;
      }

      btnDispatchTicket.disabled = true;
      btnDispatchTicket.innerHTML = `<span>Dispatching Apex Technician...</span>`;

      try {
        const response = await fetch('/api/tickets/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ticketId: 'HF-4159',
            category: selectedCategory,
            urgency: selectedUrgency,
            location: selectedLocation,
            room,
            tenant,
            title,
            notes,
            vendor: 'Rajesh M. (Plumber) - Apex Facility Solutions'
          })
        });

        const data = await response.json();
        showToast(data.message || 'Ticket #HF-4159 created! Technician dispatched.');
      } catch (_) {
        showToast('Ticket #HF-4159 logged! Technician dispatched with SLA < 2h.');
      }

      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1200);
    });
  }

  // 6. Save as Internal Memo
  if (btnSaveMemo) {
    btnSaveMemo.addEventListener('click', async () => {
      const title = inputTitle.value.trim();
      try {
        await fetch('/api/tickets/memo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, savedAt: new Date().toISOString() })
        });
      } catch (_) {}

      showToast('Issue saved as draft internal memo.');
    });
  }
});

