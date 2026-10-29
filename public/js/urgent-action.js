// Urgent Action Stream Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Tabs
  const tabUrgentQueue = document.getElementById('tab-urgent-queue');
  const tabHostelFeed = document.getElementById('tab-hostel-feed');
  const viewUrgentQueue = document.getElementById('view-urgent-queue');
  const viewHostelFeed = document.getElementById('view-hostel-feed');
  const queueBadge = document.getElementById('queue-badge');
  const priorityCountLabel = document.getElementById('priority-count-label');

  // Incident 1 buttons
  const btnWhatsAppNudge = document.getElementById('btn-whatsapp-nudge');
  const btnNoticeNudge = document.getElementById('btn-notice-nudge');
  const btnCollectNudge = document.getElementById('btn-collect-nudge');
  const incidentRent = document.getElementById('incident-rent');

  // Incident 2 buttons
  const btnCallTech = document.getElementById('btn-call-tech');
  const btnViewPhoto = document.getElementById('btn-view-photo');

  // Incident 3 buttons & audit progress
  const btnStartChecklist = document.getElementById('btn-start-checklist');
  const btnHoldDeposit = document.getElementById('btn-hold-deposit');
  const auditCounter = document.getElementById('audit-counter');
  const auditBar = document.getElementById('audit-bar');

  let activeIncidentsCount = 3;
  let auditStep = 1;

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

  function decrementQueue() {
    if (activeIncidentsCount > 1) {
      activeIncidentsCount--;
      if (queueBadge) queueBadge.textContent = activeIncidentsCount;
      if (priorityCountLabel) priorityCountLabel.textContent = `${activeIncidentsCount} Priority Incidents`;
    } else {
      activeIncidentsCount = 0;
      if (queueBadge) queueBadge.classList.add('hidden');
      if (priorityCountLabel) priorityCountLabel.textContent = `All Priority Incidents Resolved`;
    }
  }

  // 1. Tab Switcher
  if (tabUrgentQueue && tabHostelFeed) {
    tabUrgentQueue.addEventListener('click', () => {
      tabUrgentQueue.className = 'flex-1 py-2.5 px-3 rounded-xl bg-white text-slate-900 shadow-xs flex items-center justify-center gap-2 transition cursor-pointer';
      tabHostelFeed.className = 'flex-1 py-2.5 px-3 rounded-xl text-slate-500 hover:text-slate-900 flex items-center justify-center gap-1.5 transition cursor-pointer';
      
      viewUrgentQueue.classList.remove('hidden');
      viewHostelFeed.classList.add('hidden');
    });

    tabHostelFeed.addEventListener('click', () => {
      tabHostelFeed.className = 'flex-1 py-2.5 px-3 rounded-xl bg-white text-slate-900 shadow-xs flex items-center justify-center gap-1.5 transition cursor-pointer';
      tabUrgentQueue.className = 'flex-1 py-2.5 px-3 rounded-xl text-slate-500 hover:text-slate-900 flex items-center justify-center gap-2 transition cursor-pointer';

      viewHostelFeed.classList.remove('hidden');
      viewUrgentQueue.classList.add('hidden');
    });
  }

  // 2. Incident 1: Overdue Rent
  if (btnWhatsAppNudge) {
    btnWhatsAppNudge.addEventListener('click', () => {
      showToast('Opening WhatsApp link: "Dear Rahul/David, reminder for overdue balance $840.00..."');
    });
  }

  if (btnNoticeNudge) {
    btnNoticeNudge.addEventListener('click', () => {
      showToast('Formal 24h Rent Default Notice issued with digital sign-off timestamp.');
    });
  }

  if (btnCollectNudge) {
    btnCollectNudge.addEventListener('click', async () => {
      btnCollectNudge.disabled = true;
      btnCollectNudge.innerHTML = '<span>⌛</span><span>Processing...</span>';

      try {
        const response = await fetch('/api/urgent/collect', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 840.00, tenants: ['Rahul Sharma', 'David Miller'] })
        });
        const data = await response.json();
        showToast(data.message || '✓ $840.00 collected! Rent ledger reconciled.');
      } catch (err) {
        showToast('✓ $840.00 cash/UPI receipt logged. Auto-lock removed.');
      }

      setTimeout(() => {
        if (incidentRent) {
          incidentRent.style.opacity = '0.5';
          btnCollectNudge.className = 'py-2.5 px-2 bg-emerald-600 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1 shadow-xs';
          btnCollectNudge.innerHTML = '<span>✓</span><span>Collected</span>';
        }
        decrementQueue();
      }, 700);
    });
  }

  // 3. Incident 2: AC Leakage
  if (btnCallTech) {
    btnCallTech.addEventListener('click', () => {
      showToast('Dialing Technician Ramesh S. (ColdFlow HVAC) at +91 98402 11029...');
    });
  }

  if (btnViewPhoto) {
    btnViewPhoto.addEventListener('click', () => {
      showToast('📷 Room 304 inspection photo: Condensation pan leaking near bedside socket.');
    });
  }

  // 4. Incident 3: Move-out Clearance
  if (btnStartChecklist) {
    btnStartChecklist.addEventListener('click', () => {
      auditStep++;
      if (auditStep > 4) auditStep = 1;

      const pct = auditStep * 25;
      if (auditBar) auditBar.style.width = `${pct}%`;
      if (auditCounter) auditCounter.textContent = `${auditStep} / 4 Complete`;

      if (auditStep === 2) {
        showToast('Step 2: Room keys & RFID turnstile tag verified returned.');
      } else if (auditStep === 3) {
        showToast('Step 3: Wall paint, furniture & mattress inventory approved.');
      } else if (auditStep === 4) {
        showToast('✓ All 4 Move-out clearance items passed! $450 deposit released to Sunita Rao.');
        decrementQueue();
      } else {
        showToast('Deposit audit reset to Step 1.');
      }
    });
  }

  if (btnHoldDeposit) {
    btnHoldDeposit.addEventListener('click', () => {
      showToast('⏸️ $450 security deposit placed on hold pending key recovery.');
    });
  }
});

