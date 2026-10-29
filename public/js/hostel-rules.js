// TAAMARA CO-LIVE — Hostel Rules & Handbook Interactivity
document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Utility
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');
  let toastTimeout = null;

  function showToast(message) {
    if (!toast || !toastText) return;
    toastText.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3200);
  }

  // 2. Clause Accordions
  const clauseCards = document.querySelectorAll('.clause-card');
  clauseCards.forEach(card => {
    const toggle = card.querySelector('.clause-toggle');
    const content = card.querySelector('.clause-content');
    const icon = card.querySelector('.clause-icon');

    if (toggle && content) {
      toggle.addEventListener('click', () => {
        const isExpanded = !content.classList.contains('hidden');
        if (isExpanded) {
          content.classList.add('hidden');
          if (icon) icon.textContent = '⌄';
        } else {
          content.classList.remove('hidden');
          if (icon) icon.textContent = '⌃';
        }
      });
    }
  });

  // 3. Category Filter Pills
  const catPills = document.querySelectorAll('.rule-cat-pill');
  let currentCategory = 'all';

  function filterCards() {
    const searchVal = (searchInput ? searchInput.value.trim().toLowerCase() : '');

    clauseCards.forEach(card => {
      const cardCategory = card.dataset.category || 'all';
      const textContent = card.textContent.toLowerCase();

      const matchesCat = (currentCategory === 'all' || cardCategory === currentCategory || cardCategory === 'all');
      const matchesSearch = !searchVal || textContent.includes(searchVal);

      if (matchesCat && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(p => {
        p.classList.remove('bg-[#180d19]', 'text-white', 'font-extrabold', 'active');
        p.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700', 'font-bold');
      });
      pill.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700', 'font-bold');
      pill.classList.add('bg-[#180d19]', 'text-white', 'font-extrabold', 'active');

      currentCategory = pill.dataset.category || 'all';
      filterCards();
    });
  });

  // 4. Search Filter
  const searchInput = document.getElementById('rule-search-input');
  const btnClearSearch = document.getElementById('btn-clear-search');

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      if (btnClearSearch) {
        if (searchInput.value.trim().length > 0) {
          btnClearSearch.classList.remove('hidden');
        } else {
          btnClearSearch.classList.add('hidden');
        }
      }
      filterCards();
    });
  }

  if (btnClearSearch) {
    btnClearSearch.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      btnClearSearch.classList.add('hidden');
      filterCards();
    });
  }

  // 5. Header Inquiry & Notification
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Handbook Notice: Zero active curfew policy infractions logged today.');
    });
  }

  const btnFeedback = document.getElementById('btn-feedback');
  if (btnFeedback) {
    btnFeedback.addEventListener('click', () => {
      showToast('📨 Connecting to Residence Dean & Warden Desk for policy inquiries.');
    });
  }

  // 6. PDF Download Action
  const btnDownloadPdf = document.getElementById('btn-download-pdf');
  if (btnDownloadPdf) {
    btnDownloadPdf.addEventListener('click', () => {
      showToast('📄 Generating official AY 2024-25 Handbook PDF (v4.2)...');
      setTimeout(() => {
        window.print();
      }, 600);
    });
  }

  // 7. Admin Edit Modal
  const btnEditRules = document.getElementById('btn-edit-rules');
  const modalEditRules = document.getElementById('modal-edit-rules');
  const btnCloseEdit = document.getElementById('btn-close-edit');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const btnSaveClause = document.getElementById('btn-save-clause');
  const selectClauseEdit = document.getElementById('select-clause-edit');
  const textareaClauseEdit = document.getElementById('textarea-clause-edit');

  function openEditModal() {
    if (!modalEditRules) return;
    modalEditRules.classList.remove('hidden');
    syncSelectedClauseText();
  }

  function closeEditModal() {
    if (modalEditRules) modalEditRules.classList.add('hidden');
  }

  function getClauseElement(clauseId) {
    const cards = Array.from(clauseCards);
    return cards.find(c => {
      const title = c.querySelector('h4')?.textContent || '';
      const badge = c.querySelector('span')?.textContent || '';
      return badge.includes(clauseId) || title.includes(clauseId);
    });
  }

  function syncSelectedClauseText() {
    if (!selectClauseEdit || !textareaClauseEdit) return;
    const clauseId = selectClauseEdit.value;
    const targetCard = getClauseElement(clauseId);
    if (targetCard) {
      const p = targetCard.querySelector('.clause-content p');
      textareaClauseEdit.value = p ? p.textContent.trim() : '';
    }
  }

  if (selectClauseEdit) {
    selectClauseEdit.addEventListener('change', syncSelectedClauseText);
  }

  if (btnEditRules) btnEditRules.addEventListener('click', openEditModal);
  if (btnCloseEdit) btnCloseEdit.addEventListener('click', closeEditModal);
  if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEditModal);

  if (btnSaveClause) {
    btnSaveClause.addEventListener('click', async () => {
      const clauseId = selectClauseEdit.value;
      const newText = textareaClauseEdit.value.trim();
      if (!newText) {
        showToast('Please enter revised clause text.');
        return;
      }

      const targetCard = getClauseElement(clauseId);
      if (targetCard) {
        const p = targetCard.querySelector('.clause-content p');
        if (p) p.textContent = newText;
        // Expand to verify
        const content = targetCard.querySelector('.clause-content');
        if (content) content.classList.remove('hidden');
        const icon = targetCard.querySelector('.clause-icon');
        if (icon) icon.textContent = '⌃';
      }

      try {
        await fetch('/api/rules/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clause: clauseId, text: newText })
        });
      } catch (_) {}

      closeEditModal();
      showToast(`Clause ${clauseId} amended & audit-logged successfully!`);
    });
  }
});

