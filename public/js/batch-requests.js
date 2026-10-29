// Batch Processing Hub Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Select all & items
  const selectAllCheckbox = document.getElementById('checkbox-select-all');
  const itemCheckboxes = document.querySelectorAll('.batch-item-checkbox');
  const countSelectedLabel = document.getElementById('count-selected-label');
  const safetyCount = document.getElementById('safety-count');
  const btnApproveCount = document.getElementById('btn-approve-count');
  const btnApproveBatch = document.getElementById('btn-approve-batch');
  const btnRejectBatch = document.getElementById('btn-reject-batch');

  // Filter pills & cards
  const filterPills = document.querySelectorAll('.batch-filter-pill');
  const batchCards = document.querySelectorAll('.batch-card');

  // Modal
  const modalSuccess = document.getElementById('modal-batch-success');
  const modalSuccessDesc = document.getElementById('modal-success-desc');
  const btnModalSuccessClose = document.getElementById('btn-modal-success-close');

  const btnBell = document.getElementById('btn-bell');
  const toggleSafety = document.getElementById('toggle-safety');

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

  // Update Counters
  function updateCounters() {
    let checkedCount = 0;
    itemCheckboxes.forEach(cb => {
      if (cb.checked) checkedCount++;
    });

    if (countSelectedLabel) countSelectedLabel.textContent = checkedCount;
    if (safetyCount) safetyCount.textContent = checkedCount;
    if (btnApproveCount) btnApproveCount.textContent = checkedCount;

    if (btnApproveBatch) {
      if (checkedCount === 0) {
        btnApproveBatch.disabled = true;
        btnApproveBatch.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        btnApproveBatch.disabled = false;
        btnApproveBatch.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    if (btnRejectBatch) {
      if (checkedCount === 0) {
        btnRejectBatch.disabled = true;
        btnRejectBatch.classList.add('opacity-50', 'cursor-not-allowed');
      } else {
        btnRejectBatch.disabled = false;
        btnRejectBatch.classList.remove('opacity-50', 'cursor-not-allowed');
      }
    }

    // Check if all verified are checked
    const verifiedCheckboxes = Array.from(itemCheckboxes).filter(cb => {
      const card = cb.closest('.batch-card');
      return card && card.getAttribute('data-verified') === 'true';
    });

    const allVerifiedChecked = verifiedCheckboxes.every(cb => cb.checked);
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = allVerifiedChecked && verifiedCheckboxes.length > 0;
    }
  }

  // 1. Select All Checkbox Handler
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      itemCheckboxes.forEach(cb => {
        const card = cb.closest('.batch-card');
        // Only toggle verified items by default
        if (card && card.getAttribute('data-verified') === 'true') {
          cb.checked = isChecked;
        }
      });
      updateCounters();
      showToast(isChecked ? 'Selected all 4 verified fast-lane requests.' : 'Cleared all selections.');
    });
  }

  // 2. Individual Checkbox Handlers
  itemCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateCounters();
    });
  });

  // 3. Category Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => {
        p.classList.remove('bg-[#180d19]', 'text-white');
        p.classList.add('bg-white', 'text-slate-700', 'border', 'border-slate-200');
      });

      pill.classList.add('bg-[#180d19]', 'text-white');
      pill.classList.remove('bg-white', 'text-slate-700', 'border', 'border-slate-200');

      const filterType = pill.getAttribute('data-filter');
      let visibleCount = 0;

      batchCards.forEach(card => {
        const type = card.getAttribute('data-type');
        if (filterType === 'all' || type === filterType) {
          card.classList.remove('hidden');
          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      showToast(`Showing ${visibleCount} requests for ${pill.textContent.trim()}.`);
    });
  });

  // 4. Batch Approve Handler
  if (btnApproveBatch) {
    btnApproveBatch.addEventListener('click', async () => {
      const selected = [];
      itemCheckboxes.forEach(cb => {
        if (cb.checked) {
          selected.push({
            id: cb.getAttribute('data-id'),
            name: cb.getAttribute('data-name')
          });
        }
      });

      if (selected.length === 0) {
        showToast('Please select at least one request to approve.');
        return;
      }

      btnApproveBatch.disabled = true;
      btnApproveBatch.innerHTML = '<span>Processing batch gate credentials...</span>';

      try {
        await fetch('/api/requests/batch-approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requests: selected })
        });
      } catch (err) {}

      if (modalSuccessDesc) {
        modalSuccessDesc.textContent = `${selected.length} student request(s) approved in fast-lane mode.`;
      }
      if (modalSuccess) modalSuccess.classList.remove('hidden');
    });
  }

  // 5. Batch Reject Handler
  if (btnRejectBatch) {
    btnRejectBatch.addEventListener('click', async () => {
      const selectedNames = [];
      itemCheckboxes.forEach(cb => {
        if (cb.checked) selectedNames.push(cb.getAttribute('data-name'));
      });

      if (selectedNames.length === 0) {
        showToast('Please select requests to reject.');
        return;
      }

      const confirmReject = confirm(`Reject selected ${selectedNames.length} request(s) with policy notice?`);
      if (confirmReject) {
        try {
          await fetch('/api/requests/batch-reject', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ names: selectedNames })
          });
        } catch (err) {}

        showToast(`✕ ${selectedNames.length} request(s) rejected and logged in Infraction archive.`);
        setTimeout(() => {
          window.location.href = '/requests.html';
        }, 900);
      }
    });
  }

  // 6. Close Modal Success
  if (btnModalSuccessClose) {
    btnModalSuccessClose.addEventListener('click', () => {
      if (modalSuccess) modalSuccess.classList.add('hidden');
      showToast('Fast-lane sync complete. Returning to Requests Console...');
      setTimeout(() => {
        window.location.href = '/requests.html';
      }, 500);
    });
  }

  // 7. Safety toggle
  if (toggleSafety) {
    toggleSafety.addEventListener('change', (e) => {
      showToast(e.target.checked
        ? '✓ Safety Checklist: Strict campus curfew & warden verification active.'
        : '⚠️ Standard checklist enforcement relaxed for this batch.');
    });
  }

  // 8. Notification Bell
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Fast-lane sync: 4 auto-verified requests cleared by hostel AI audit.');
    });
  }

  // Initial calculation
  updateCounters();
});

