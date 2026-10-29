// Room Change Request Detail Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Vacancy Cards
  const card203 = document.getElementById('vacancy-card-203');
  const card202 = document.getElementById('vacancy-card-202');
  const check203 = document.getElementById('check-203');
  const check202 = document.getElementById('check-202');
  const label203 = document.getElementById('label-selected-203');
  const label202 = document.getElementById('label-selected-202');

  // Settlement summary
  const summaryRateDiff = document.getElementById('summary-rate-diff');
  const summaryBalanceDue = document.getElementById('summary-balance-due');
  const btnConfirmText = document.getElementById('btn-confirm-text');
  const modalProratedTxt = document.getElementById('modal-prorated-txt');
  const modalConfirmSubtitle = document.getElementById('modal-confirm-subtitle');

  // Actions & Modals
  const btnConfirm = document.getElementById('btn-confirm-allocation');
  const btnDecline = document.getElementById('btn-decline');
  const modalConfirm = document.getElementById('modal-confirm');
  const modalDecline = document.getElementById('modal-decline');
  const btnModalPrint = document.getElementById('btn-modal-print');
  const btnModalDone = document.getElementById('btn-modal-done');
  const btnCancelDecline = document.getElementById('btn-cancel-decline');
  const btnConfirmDecline = document.getElementById('btn-confirm-decline');
  const toggleAnnexure = document.getElementById('toggle-annexure');
  const btnMenu = document.getElementById('btn-menu');
  const managerNoteInput = document.getElementById('manager-note-input');

  let selectedRoom = '203-B';
  let selectedDiff = 70;
  let selectedProrated = 42;

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

  // Swap Vacancy Function
  function selectVacancy(room) {
    if (room === '203-B') {
      selectedRoom = '203-B';
      selectedDiff = 70;
      selectedProrated = 42;

      // Card 203 active
      card203.className = 'vacancy-card bg-white rounded-2xl p-3.5 border-2 border-[#c59b27] shadow-sm space-y-2.5 relative cursor-pointer transition';
      check203.className = 'w-5 h-5 rounded-full bg-[#c59b27] text-white flex items-center justify-center text-xs font-bold';
      check203.textContent = '✓';
      label203.className = 'text-[#c59b27] font-black';
      label203.textContent = 'Selected for Move-in';

      // Card 202 inactive
      card202.className = 'vacancy-card bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5 relative cursor-pointer hover:border-slate-300 transition';
      check202.className = 'w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-xs font-bold';
      check202.textContent = '';
      label202.className = 'text-slate-500 font-bold';
      label202.textContent = 'Tap to swap';

      // Summary updates
      if (summaryRateDiff) summaryRateDiff.textContent = '+$70.00 / mo';
      if (summaryBalanceDue) summaryBalanceDue.textContent = '$42.00';
      if (btnConfirmText) btnConfirmText.textContent = 'Confirm Allocation & Issue Key (203-B)';
      if (modalProratedTxt) modalProratedTxt.textContent = '+$42.00';
      if (modalConfirmSubtitle) {
        modalConfirmSubtitle.innerHTML = 'Ananya Iyer re-assigned to <strong class="text-slate-900">Room 203 - Bed B</strong>.';
      }

      showToast('Selected Room 203 - Bed B (Twin Premium Academic Wing).');
    } else {
      selectedRoom = '202-B';
      selectedDiff = 40;
      selectedProrated = 24;

      // Card 202 active
      card202.className = 'vacancy-card bg-white rounded-2xl p-3.5 border-2 border-[#c59b27] shadow-sm space-y-2.5 relative cursor-pointer transition';
      check202.className = 'w-5 h-5 rounded-full bg-[#c59b27] text-white flex items-center justify-center text-xs font-bold';
      check202.textContent = '✓';
      label202.className = 'text-[#c59b27] font-black';
      label202.textContent = 'Selected for Move-in';

      // Card 203 inactive
      card203.className = 'vacancy-card bg-white rounded-2xl p-3.5 border border-slate-200 shadow-2xs space-y-2.5 relative cursor-pointer hover:border-slate-300 transition';
      check203.className = 'w-5 h-5 rounded-full border-2 border-slate-300 bg-white flex items-center justify-center text-xs font-bold';
      check203.textContent = '';
      label203.className = 'text-slate-500 font-bold';
      label203.textContent = 'Tap to swap';

      // Summary updates
      if (summaryRateDiff) summaryRateDiff.textContent = '+$40.00 / mo';
      if (summaryBalanceDue) summaryBalanceDue.textContent = '$24.00';
      if (btnConfirmText) btnConfirmText.textContent = 'Confirm Allocation & Issue Key (202-B)';
      if (modalProratedTxt) modalProratedTxt.textContent = '+$24.00';
      if (modalConfirmSubtitle) {
        modalConfirmSubtitle.innerHTML = 'Ananya Iyer re-assigned to <strong class="text-slate-900">Room 202 - Bed B</strong>.';
      }

      showToast('Swapped to Room 202 - Bed B (Shared 2-Bed Non-AC).');
    }
  }

  if (card203) card203.addEventListener('click', () => selectVacancy('203-B'));
  if (card202) card202.addEventListener('click', () => selectVacancy('202-B'));

  // Toggle Annexure
  if (toggleAnnexure) {
    toggleAnnexure.addEventListener('change', (e) => {
      if (e.target.checked) {
        showToast('✓ WhatsApp Annexure auto-dispatch enabled for resident.');
      } else {
        showToast('Annexure dispatch set to Manual Handover.');
      }
    });
  }

  // Top Menu
  if (btnMenu) {
    btnMenu.addEventListener('click', () => {
      showToast('📋 Options: View Tenant Dossier • Lease Contract #LC-881 • Print Form');
    });
  }

  // Confirm Allocation Action
  if (btnConfirm) {
    btnConfirm.addEventListener('click', async () => {
      btnConfirm.disabled = true;
      btnConfirm.classList.add('opacity-75');

      const payload = {
        requestId: 'RC-429',
        tenant: 'Ananya Iyer',
        oldRoom: '305-B',
        newRoom: selectedRoom,
        differential: selectedDiff,
        proratedDue: selectedProrated,
        autoAnnexure: toggleAnnexure ? toggleAnnexure.checked : true,
        managerNote: managerNoteInput ? managerNoteInput.value : ''
      };

      try {
        await fetch('/api/requests/room-change/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } catch (err) {}

      if (modalConfirm) modalConfirm.classList.remove('hidden');
    });
  }

  // Modal Confirm Done & Print
  if (btnModalPrint) {
    btnModalPrint.addEventListener('click', () => {
      window.print();
    });
  }

  if (btnModalDone) {
    btnModalDone.addEventListener('click', () => {
      if (modalConfirm) modalConfirm.classList.add('hidden');
      showToast('Redirecting to Requests Console...');
      setTimeout(() => {
        window.location.href = '/requests.html';
      }, 600);
    });
  }

  // Decline Action
  if (btnDecline) {
    btnDecline.addEventListener('click', () => {
      if (modalDecline) modalDecline.classList.remove('hidden');
    });
  }

  if (btnCancelDecline) {
    btnCancelDecline.addEventListener('click', () => {
      if (modalDecline) modalDecline.classList.add('hidden');
    });
  }

  if (btnConfirmDecline) {
    btnConfirmDecline.addEventListener('click', async () => {
      const select = document.getElementById('decline-reason-select');
      const reason = select ? select.value : 'zero_vacancy';

      try {
        await fetch('/api/requests/room-change/decline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requestId: 'RC-429', tenant: 'Ananya Iyer', reason })
        });
      } catch (err) {}

      if (modalDecline) modalDecline.classList.add('hidden');
      showToast('Room Change request declined and archived to Infraction Log.');
      setTimeout(() => {
        window.location.href = '/requests.html';
      }, 800);
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modalConfirm) modalConfirm.classList.add('hidden');
    if (e.target === modalDecline) modalDecline.classList.add('hidden');
  });
});

