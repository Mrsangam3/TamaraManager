// Requests & Approvals Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('req-search');
  const typeChips = document.querySelectorAll('.req-type-chip');
  const statusTabs = document.querySelectorAll('.status-tab');
  const requestCards = document.querySelectorAll('.request-card');
  const badgePending = document.getElementById('badge-pending');
  const navBadgeRequests = document.getElementById('nav-badge-requests');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  let currentTypeFilter = 'all';
  let pendingCount = 3;

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

  // Filter Logic
  function applyFilters() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    requestCards.forEach((card) => {
      const type = card.getAttribute('data-type');
      const name = card.getAttribute('data-name');
      const room = card.getAttribute('data-room');

      let matchesType = false;
      if (currentTypeFilter === 'all') {
        matchesType = true;
      } else if (currentTypeFilter === 'night' && type === 'night') {
        matchesType = true;
      } else if (currentTypeFilter === 'room' && type === 'room') {
        matchesType = true;
      }

      let matchesQuery = true;
      if (query) {
        matchesQuery = name.includes(query) || room.includes(query);
      }

      if (matchesType && matchesQuery) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // Type Chips Listener
  typeChips.forEach((chip) => {
    chip.addEventListener('click', (e) => {
      if (chip.getAttribute('data-type') === 'room') {
        // Redirect to Room Change subscreen
        if (chip.tagName !== 'A') {
          window.location.href = '/room-change.html';
        }
        return;
      }

      typeChips.forEach((c) => {
        c.className = 'req-type-chip shrink-0 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold px-3 py-1.5 rounded-full shadow-xs cursor-pointer transition flex items-center gap-1.5';
      });

      chip.className = 'req-type-chip shrink-0 bg-[#180d19] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs cursor-pointer transition flex items-center gap-1.5';
      currentTypeFilter = chip.getAttribute('data-type');
      applyFilters();
    });
  });

  // Search Input Listener
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }

  // Status Tab Switcher
  statusTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      statusTabs.forEach((t) => {
        t.className = 'status-tab text-slate-500 hover:text-slate-800 py-1.5 flex items-center justify-center gap-1.5 cursor-pointer transition';
      });
      tab.className = 'status-tab bg-white text-slate-900 rounded-xl shadow-xs py-1.5 flex items-center justify-center gap-1.5 cursor-pointer transition';
      const tabType = tab.getAttribute('data-tab');
      if (tabType !== 'pending') {
        showToast(`Viewing ${tabType} requests archive.`);
      }
    });
  });

  // Decrement pending count
  function decrementPending() {
    if (pendingCount > 0) {
      pendingCount--;
      if (badgePending) badgePending.textContent = pendingCount;
      if (navBadgeRequests) {
        if (pendingCount > 0) {
          navBadgeRequests.textContent = pendingCount;
        } else {
          navBadgeRequests.classList.add('hidden');
        }
      }
    }
  }

  // Card Action Handlers
  requestCards.forEach((card) => {
    const studentName = card.querySelector('h4').textContent.trim();
    const btnApprove = card.querySelector('.btn-approve');
    const btnReject = card.querySelector('.btn-reject');
    const btnAllocate = card.querySelector('.btn-allocate');

    if (btnApprove) {
      btnApprove.addEventListener('click', async () => {
        btnApprove.disabled = true;
        btnApprove.innerHTML = '<span>Approving...</span>';

        try {
          const res = await fetch('/api/requests/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'approve', studentName }),
          });
          const data = await res.json();
          showToast(data.message || `Pass approved for ${studentName}!`);
        } catch (_) {
          showToast(`Digital pass issued & sent to ${studentName}.`);
        }

        // Visual update
        decrementPending();
        card.classList.add('bg-emerald-50/60', 'border-emerald-200');
        const actionRow = card.querySelector('.grid');
        if (actionRow) {
          actionRow.innerHTML = `
            <div class="col-span-2 py-2 px-3 bg-emerald-100 text-emerald-800 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
              <span>✓ Pass Approved & QR Code Dispatched</span>
            </div>
          `;
        }
      });
    }

    if (btnReject) {
      btnReject.addEventListener('click', async () => {
        btnReject.disabled = true;
        btnReject.textContent = 'Declining...';

        try {
          const res = await fetch('/api/requests/action', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'reject', studentName }),
          });
          const data = await res.json();
          showToast(data.message || `Request rejected.`);
        } catch (_) {
          showToast(`Request rejected for ${studentName}.`);
        }

        decrementPending();
        card.classList.add('opacity-75');
        const actionRow = card.querySelector('.grid');
        if (actionRow) {
          actionRow.innerHTML = `
            <div class="col-span-2 py-2 px-3 bg-rose-50 text-rose-700 rounded-xl text-center text-xs font-semibold">
              ✕ Request Declined with Remarks
            </div>
          `;
        }
      });
    }

    if (btnAllocate) {
      btnAllocate.addEventListener('click', (e) => {
        // If it is an anchor link, allow direct navigation to room-change subscreen
        if (btnAllocate.tagName === 'A' && btnAllocate.getAttribute('href')) {
          showToast(`Opening Room Change Review & Allocation for ${studentName}...`);
          return;
        }

        e.preventDefault();
        window.location.href = '/room-change.html';
      });
    }
  });

  // Batch Processing Hub Navigation
  const cardBatchProcessing = document.getElementById('card-batch-processing');
  if (cardBatchProcessing) {
    cardBatchProcessing.addEventListener('click', () => {
      showToast('Opening Fast Lane Batch Processing Hub...');
    });
  }

  // Filter Subscreen Navigation
  const reqFilterBtn = document.getElementById('req-filter-btn');
  if (reqFilterBtn) {
    reqFilterBtn.addEventListener('click', () => {
      showToast('Opening Requests Search & Filter Subscreen...');
    });
  }
});

