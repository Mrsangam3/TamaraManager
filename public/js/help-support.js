// TAAMARA CO-LIVE — Help & Support Interactivity
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

  // 2. Notification Bell
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Help Desk: 0 open critical escalations across North Wing.');
    });
  }

  // 3. Search Filter for SOPs & Help Articles
  const inputSearch = document.getElementById('input-support-search');
  const btnClearSearch = document.getElementById('btn-clear-search');
  const sopCards = document.querySelectorAll('.sop-card');

  if (inputSearch) {
    inputSearch.addEventListener('input', () => {
      const q = inputSearch.value.trim().toLowerCase();
      if (btnClearSearch) {
        btnClearSearch.classList.toggle('hidden', q.length === 0);
      }

      let matchCount = 0;
      sopCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const keywords = (card.dataset.keywords || '').toLowerCase();
        const matches = text.includes(q) || keywords.includes(q);
        card.classList.toggle('hidden', !matches);
        if (matches) matchCount++;
      });

      if (q.length > 0 && matchCount === 0) {
        showToast(`No exact SOP match for "${q}". Try "curfew", "turnstile", or "rent".`);
      }
    });
  }

  if (btnClearSearch && inputSearch) {
    btnClearSearch.addEventListener('click', () => {
      inputSearch.value = '';
      btnClearSearch.classList.add('hidden');
      sopCards.forEach(card => card.classList.remove('hidden'));
      inputSearch.focus();
    });
  }

  // 4. Emergency Quick Dials
  document.getElementById('btn-dial-police')?.addEventListener('click', () => {
    showToast('🚨 Connecting to Campus Police Control Room (100 / 911)...');
  });

  document.getElementById('btn-dial-clinic')?.addEventListener('click', () => {
    showToast('🩺 Dialing 24/7 North Wing Campus Medical Clinic (+1 555-0199)...');
  });

  document.getElementById('btn-dial-fire')?.addEventListener('click', () => {
    showToast('🚒 Emergency: Connecting to Municipal Fire Dept (Station 4)...');
  });

  // 5. Live Availability
  document.getElementById('btn-live-avail')?.addEventListener('click', () => {
    showToast('🟢 4 Operations Engineers & 2 Resident Wardens currently online.');
  });

  // 6. Live Concierge Chat Modal
  const modalChat = document.getElementById('modal-chat');
  const btnStartChat = document.getElementById('btn-start-chat');
  const btnCloseChat = document.getElementById('btn-close-chat');
  const inputChatMsg = document.getElementById('input-chat-msg');
  const btnSendChatMsg = document.getElementById('btn-send-chat-msg');
  const chatMessagesContainer = document.getElementById('chat-messages-container');

  function openChat() {
    if (modalChat) modalChat.classList.remove('hidden');
    if (inputChatMsg) inputChatMsg.focus();
  }

  function closeChat() {
    if (modalChat) modalChat.classList.add('hidden');
  }

  if (btnStartChat) btnStartChat.addEventListener('click', openChat);
  if (btnCloseChat) btnCloseChat.addEventListener('click', closeChat);

  function sendChatMessage() {
    if (!inputChatMsg) return;
    const msg = inputChatMsg.value.trim();
    if (!msg) return;

    // Append User Message
    const userBubble = document.createElement('div');
    userBubble.className = 'bg-[#c59b27] text-white rounded-2xl p-2.5 max-w-[85%] ml-auto text-right';
    userBubble.innerHTML = `
      <p class="text-[10px] font-bold text-[#f5e5ba]">Alex Morgan • Manager</p>
      <p class="text-[11px] mt-0.5">${escapeHTML(msg)}</p>
      <span class="text-[8px] text-[#edd18e] block mt-1">Just now</span>
    `;
    chatMessagesContainer.appendChild(userBubble);
    inputChatMsg.value = '';
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

    // Simulated Concierge Response
    setTimeout(() => {
      const agentBubble = document.createElement('div');
      agentBubble.className = 'bg-slate-100/90 rounded-2xl p-2.5 max-w-[85%] text-slate-700';
      agentBubble.innerHTML = `
        <p class="text-[10px] font-bold text-[#a6801e]">Sarah • Concierge</p>
        <p class="text-[11px] mt-0.5">Received. I am pulling up the North Wing telemetry log for your session. Standing by on priority channel.</p>
        <span class="text-[8px] text-slate-400 block text-right mt-1">Just now</span>
      `;
      chatMessagesContainer.appendChild(agentBubble);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }, 900);
  }

  if (btnSendChatMsg) btnSendChatMsg.addEventListener('click', sendChatMessage);
  if (inputChatMsg) {
    inputChatMsg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChatMessage();
    });
  }

  // 7. Priority Phone Hotline
  document.getElementById('btn-call-hotline')?.addEventListener('click', () => {
    navigator.clipboard?.writeText('#8824-OP').catch(() => {});
    showToast('📞 Dialing +1 (800) 467-8353... Hostel PIN #8824-OP copied to clipboard!');
  });

  // 8. Tech Incident Ticket Modal & Submission
  const modalTicket = document.getElementById('modal-ticket');
  const btnOpenTicketModal = document.getElementById('btn-open-ticket-modal');
  const btnCloseTicket = document.getElementById('btn-close-ticket');
  const formTechTicket = document.getElementById('form-tech-ticket');

  function openTicketModal() {
    if (modalTicket) modalTicket.classList.remove('hidden');
  }

  function closeTicketModal() {
    if (modalTicket) modalTicket.classList.add('hidden');
  }

  if (btnOpenTicketModal) btnOpenTicketModal.addEventListener('click', openTicketModal);
  if (btnCloseTicket) btnCloseTicket.addEventListener('click', closeTicketModal);

  if (formTechTicket) {
    formTechTicket.addEventListener('submit', async (e) => {
      e.preventDefault();
      const category = document.getElementById('select-ticket-category')?.value || 'hardware';
      const summary = document.getElementById('input-ticket-summary')?.value.trim();
      const details = document.getElementById('textarea-ticket-details')?.value.trim();
      const submitBtn = document.getElementById('btn-submit-ticket-action');

      if (!summary) {
        showToast('Please provide an incident summary.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Dispatching to Engineering Desk...';
      }

      try {
        await fetch('/api/support/ticket', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category, summary, details })
        });
      } catch (_) {}

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Dispatch Incident Ticket ⎘';
        }
        closeTicketModal();
        formTechTicket.reset();
        showToast('🎫 Incident Ticket #INC-9824 dispatched to Level-2 Engineering! SLA < 4h.');
      }, 700);
    });
  }

  // 9. SOP Accordion Collapsibles
  document.querySelectorAll('.sop-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.sop-card');
      const content = card.querySelector('.sop-content');
      const chevron = card.querySelector('.sop-chevron');
      const isHidden = content.classList.contains('hidden');

      // Close other open accordions
      document.querySelectorAll('.sop-card').forEach(c => {
        if (c !== card) {
          c.querySelector('.sop-content')?.classList.add('hidden');
          const ch = c.querySelector('.sop-chevron');
          if (ch) ch.style.transform = 'rotate(0deg)';
        }
      });

      if (isHidden) {
        content.classList.remove('hidden');
        if (chevron) chevron.style.transform = 'rotate(180deg)';
      } else {
        content.classList.add('hidden');
        if (chevron) chevron.style.transform = 'rotate(0deg)';
      }
    });
  });

  // 10. Browse All SOPs Link
  document.getElementById('btn-browse-all-sops')?.addEventListener('click', () => {
    // Reveal all SOPs and reset search
    sopCards.forEach(c => {
      c.classList.remove('hidden');
      c.querySelector('.sop-content')?.classList.remove('hidden');
      const ch = c.querySelector('.sop-chevron');
      if (ch) ch.style.transform = 'rotate(180deg)';
    });
    showToast('📖 Expanded all 5 verified manager SOP playbooks.');
  });

  // 11. Export Diagnostic Log & Telemetry
  document.getElementById('btn-export-telemetry')?.addEventListener('click', () => {
    const btn = document.getElementById('btn-export-telemetry');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span>⏳</span><span>Packaging Telemetry Bundle...</span>';
    btn.disabled = true;

    setTimeout(() => {
      btn.innerHTML = '<span>✓</span><span>Log Exported (#HSTL-904-TX)</span>';
      btn.disabled = false;
      showToast('📦 Diagnostic bundle exported: 1,420 event traces (Turnstile, SMS, Gateway).');
      setTimeout(() => {
        btn.innerHTML = originalText;
      }, 2500);
    }, 900);
  });

  // Utility to escape HTML in chat messages
  function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }
});

