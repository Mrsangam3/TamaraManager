// Rejected Requests & Policy Infractions Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Filter Pills
  const filterPills = document.querySelectorAll('.rej-filter-pill');
  const rejectedCards = document.querySelectorAll('.rejected-card');

  // Modals
  const modalGuardian = document.getElementById('modal-call-guardian');
  const guardianContactText = document.getElementById('guardian-contact-text');
  const btnCloseGuardian = document.getElementById('btn-close-guardian');
  const btnDialGuardian = document.getElementById('btn-dial-guardian');

  const modalPolicy = document.getElementById('modal-policy');
  const btnClosePolicy = document.getElementById('btn-close-policy');
  const btnDismissPolicy = document.getElementById('btn-dismiss-policy');

  const modalDues = document.getElementById('modal-dues');
  const btnCloseDues = document.getElementById('btn-close-dues');
  const btnSendPaymentLink = document.getElementById('btn-send-payment-link');

  const btnDownloadReport = document.getElementById('btn-download-report');
  const btnBell = document.getElementById('btn-bell');

  let currentCategory = 'all';

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

  // 1. Filtering Logic
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active', 'bg-[#180d19]', 'text-white');
        p.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });

      pill.classList.add('active', 'bg-[#180d19]', 'text-white');
      pill.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      currentCategory = pill.getAttribute('data-filter');

      let visibleCount = 0;
      rejectedCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (currentCategory === 'all' || cat === currentCategory) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      showToast(`Showing ${visibleCount} entries for ${pill.textContent.trim()}`);
    });
  });

  // 2. Re-Open Action
  document.querySelectorAll('.btn-reopen').forEach(btn => {
    btn.addEventListener('click', async () => {
      const studentName = btn.getAttribute('data-name') || 'Student';
      const card = btn.closest('.rejected-card');
      
      const reason = prompt(`Enter supervisor justification to re-open request for ${studentName}:`, 'Parent indemnification letter submitted');
      if (reason) {
        btn.disabled = true;
        btn.className = 'bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs py-2 px-3 rounded-xl cursor-default';
        btn.textContent = 'Re-opened for Hearing ✓';

        const redBadge = card.querySelector('.bg-rose-100');
        if (redBadge) {
          redBadge.className = 'px-2.5 py-0.5 rounded-full bg-[#fbf2da] text-[#a6801e] text-[10px] font-bold';
          redBadge.textContent = '• Under Supervisor Review';
        }

        try {
          await fetch('/api/requests/reopen', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentName, reason })
          });
        } catch (err) {}

        showToast(`✓ Request for ${studentName} re-opened for Warden Review.`);
      }
    });
  });

  // 3. Call Guardian Modal
  document.querySelectorAll('.btn-call-guardian').forEach(btn => {
    btn.addEventListener('click', () => {
      const contact = btn.getAttribute('data-guardian') || 'Guardian (+91 98112 40019)';
      if (guardianContactText) guardianContactText.textContent = contact;
      if (modalGuardian) modalGuardian.classList.remove('hidden');
    });
  });

  if (btnCloseGuardian) btnCloseGuardian.addEventListener('click', () => modalGuardian.classList.add('hidden'));
  if (btnDialGuardian) {
    btnDialGuardian.addEventListener('click', () => {
      modalGuardian.classList.add('hidden');
      showToast('📞 Initiating secure teleconference with Mr. R. K. Malik...');
    });
  }

  // 4. View Waitlist Action
  document.querySelectorAll('.btn-view-waitlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Aditya Verma';
      const pos = btn.getAttribute('data-position') || '#3';
      showToast(`🗂️ Single Suite Queue: ${name} is at Position ${pos}. Estimated availability: Semester Break.`);
    });
  });

  // 5. Custom Note Action
  document.querySelectorAll('.btn-custom-note').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Student';
      const note = prompt(`Add internal disciplinary memo for ${name}:`, 'Advised to apply for Block B double sharing room next week.');
      if (note) {
        showToast(`📝 Internal memo saved for ${name}.`);
      }
    });
  });

  // 6. Policy Details Modal
  document.querySelectorAll('.btn-policy-details').forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalPolicy) modalPolicy.classList.remove('hidden');
    });
  });

  if (btnClosePolicy) btnClosePolicy.addEventListener('click', () => modalPolicy.classList.add('hidden'));
  if (btnDismissPolicy) btnDismissPolicy.addEventListener('click', () => modalPolicy.classList.add('hidden'));

  // 7. View Fee Dues Modal
  const btnViewFeeDues = document.getElementById('btn-view-fee-dues');
  if (btnViewFeeDues) {
    btnViewFeeDues.addEventListener('click', () => {
      if (modalDues) modalDues.classList.remove('hidden');
    });
  }

  if (btnCloseDues) btnCloseDues.addEventListener('click', () => modalDues.classList.add('hidden'));
  if (btnSendPaymentLink) {
    btnSendPaymentLink.addEventListener('click', () => {
      modalDues.classList.add('hidden');
      showToast('💬 Instant payment deep-link sent to Sameer Khan via WhatsApp & SMS ($620.00).');
    });
  }

  // 8. Download Disciplinary Report
  if (btnDownloadReport) {
    btnDownloadReport.addEventListener('click', () => {
      showToast('Generating official TAAMARA Disciplinary & Policy Rejections Report (PDF)...');
      setTimeout(() => window.print(), 600);
    });
  }

  // 9. Bell Notification
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Deanery notice: 4 archived policy infractions under disciplinary monitoring.');
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modalGuardian) modalGuardian.classList.add('hidden');
    if (e.target === modalPolicy) modalPolicy.classList.add('hidden');
    if (e.target === modalDues) modalDues.classList.add('hidden');
  });
});

