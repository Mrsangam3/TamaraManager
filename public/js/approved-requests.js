// Approved Requests Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Filter Pills & Search
  const searchInput = document.getElementById('archive-search');
  const filterPills = document.querySelectorAll('.archive-filter-pill');
  const approvedCards = document.querySelectorAll('.approved-card');

  // Modals
  const modalPass = document.getElementById('modal-digital-pass');
  const passStudentName = document.getElementById('pass-student-name');
  const passIdText = document.getElementById('pass-id-text');
  const btnClosePass = document.getElementById('btn-close-pass');
  const btnDismissPass = document.getElementById('btn-dismiss-pass');

  const modalAudit = document.getElementById('modal-audit');
  const btnCloseAudit = document.getElementById('btn-close-audit');
  const btnDismissAudit = document.getElementById('btn-dismiss-audit');

  const btnExportLog = document.getElementById('btn-export-log');
  const btnScanQr = document.getElementById('btn-scan-qr');
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

  // 1. Filtering & Search
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    approvedCards.forEach(card => {
      const cat = card.getAttribute('data-category');
      const name = card.getAttribute('data-name') || '';
      const room = card.getAttribute('data-room') || '';

      const matchesCat = currentCategory === 'all' || cat === currentCategory;
      const matchesQuery = !query || name.includes(query) || room.includes(query);

      if (matchesCat && matchesQuery) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('active', 'bg-[#180d19]', 'text-white');
        p.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });

      pill.classList.add('active', 'bg-[#180d19]', 'text-white');
      pill.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      currentCategory = pill.getAttribute('data-filter');
      applyFilters();
      showToast(`Filter: ${pill.textContent.trim()}`);
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // 2. View Digital Pass Modal
  document.querySelectorAll('.btn-view-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Student';
      const pass = btn.getAttribute('data-pass') || 'NO-2024-8819';
      const room = btn.getAttribute('data-room') || 'Room 201-A';

      if (passStudentName) passStudentName.textContent = name;
      if (passIdText) passIdText.textContent = `Pass #${pass} • Room ${room}`;

      if (modalPass) modalPass.classList.remove('hidden');
    });
  });

  if (btnClosePass) btnClosePass.addEventListener('click', () => modalPass.classList.add('hidden'));
  if (btnDismissPass) btnDismissPass.addEventListener('click', () => modalPass.classList.add('hidden'));

  // 3. Revoke Pass Action
  document.querySelectorAll('.btn-revoke-pass').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name') || 'Student';
      const card = btn.closest('.approved-card');
      if (confirm(`Are you sure you want to revoke the active gate pass for ${name}? Turnstile permissions will immediately terminate.`)) {
        btn.disabled = true;
        btn.textContent = 'Revoked';
        btn.className = 'bg-slate-200 text-slate-500 font-bold text-xs py-2.5 px-3 rounded-xl cursor-not-allowed';
        const badge = card.querySelector('.bg-[#fbf2da]');
        if (badge) {
          badge.className = 'px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold';
          badge.textContent = '• Pass Revoked';
        }
        showToast(`⚠️ Gate Pass for ${name} has been revoked.`);
      }
    });
  });

  // 4. Audit Details Modal
  document.querySelectorAll('.btn-audit-details').forEach(btn => {
    btn.addEventListener('click', () => {
      if (modalAudit) modalAudit.classList.remove('hidden');
    });
  });

  if (btnCloseAudit) btnCloseAudit.addEventListener('click', () => modalAudit.classList.add('hidden'));
  if (btnDismissAudit) btnDismissAudit.addEventListener('click', () => modalAudit.classList.add('hidden'));

  // 5. Confirm Key Handover Action
  const btnHandover = document.getElementById('btn-confirm-handover');
  const btnHandoverText = document.getElementById('btn-handover-text');
  if (btnHandover) {
    btnHandover.addEventListener('click', async () => {
      btnHandover.className = 'w-full bg-emerald-600 text-white font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md';
      if (btnHandoverText) btnHandoverText.textContent = 'Key Handover Confirmed & Locked ✓';
      showToast('🔑 Key handover confirmed for Priya Nair (Transfer to Rm 204-A). Biometrics updated!');
    });
  }

  // 6. View Travel Form
  document.querySelectorAll('.btn-travel-form').forEach(btn => {
    btn.addEventListener('click', () => {
      const student = btn.getAttribute('data-student') || 'Student';
      showToast(`Opening emergency travel itinerary and parent consent form for ${student}...`);
    });
  });

  // 7. Export Log (Print / PDF)
  if (btnExportLog) {
    btnExportLog.addEventListener('click', () => {
      showToast('Generating official TAAMARA Approved Security & Gate Records PDF...');
      setTimeout(() => window.print(), 600);
    });
  }

  // 8. Scan QR Barcode
  if (btnScanQr) {
    btnScanQr.addEventListener('click', () => {
      showToast('📷 Activating camera for Security Gate Barcode / QR scanner...');
    });
  }

  // 9. Bell Notification
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Security Alert: 0 curfew violations recorded in October.');
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modalPass) modalPass.classList.add('hidden');
    if (e.target === modalAudit) modalAudit.classList.add('hidden');
  });
});

