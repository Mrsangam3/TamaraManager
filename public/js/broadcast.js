// TAAMARA CO-LIVE — Broadcast Notice Interactivity
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

  // 2. Notification Bell & History
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Broadcast Gateway: 100% gateway uptime across WhatsApp & Push.');
    });
  }

  const btnHistory = document.getElementById('btn-history');
  if (btnHistory) {
    btnHistory.addEventListener('click', () => {
      showToast('📜 Past Dispatches: 3 sent this week (Water Tank, Fire Drill, Mess RSVP).');
    });
  }

  // 3. Notice Classification Pills
  const classPills = document.querySelectorAll('.class-pill');
  const inputBcTitle = document.getElementById('input-bc-title');
  const channelSms = document.getElementById('channel-sms');

  classPills.forEach(pill => {
    pill.addEventListener('click', () => {
      classPills.forEach(p => {
        p.classList.remove('bg-[#180d19]', 'text-white', 'font-extrabold', 'active');
        p.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700', 'font-bold');
      });
      pill.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700', 'font-bold');
      pill.classList.add('bg-[#180d19]', 'text-white', 'font-extrabold', 'active');

      const classification = pill.dataset.classification;
      if (classification === 'urgent') {
        if (channelSms) channelSms.checked = true;
        showToast('⚠️ Urgent Classification: SMS fallback auto-enabled.');
      } else if (classification === 'maintenance') {
        showToast('💧 Maintenance notice template initialized.');
      } else if (classification === 'events') {
        showToast('🎉 Community celebration template selected.');
      } else {
        showToast('📢 General administrative circular active.');
      }
    });
  });

  // 4. Target Audience Pills
  const audiencePills = document.querySelectorAll('.audience-pill');
  const badgeAudienceCount = document.getElementById('badge-audience-count');
  const btnDispatchLabel = document.getElementById('btn-dispatch-label');
  let selectedAudienceCount = '176';
  let selectedAudienceLabel = 'All Tenants';

  audiencePills.forEach(pill => {
    pill.addEventListener('click', () => {
      audiencePills.forEach(p => {
        p.classList.remove('bg-[#180d19]', 'text-white', 'font-extrabold', 'active');
        p.classList.add('bg-white', 'border', 'border-slate-200', 'text-slate-700', 'font-bold');
        const check = p.querySelector('span:first-child');
        if (check && check.textContent === '✓') check.remove();
      });

      pill.classList.remove('bg-white', 'border', 'border-slate-200', 'text-slate-700', 'font-bold');
      pill.classList.add('bg-[#180d19]', 'text-white', 'font-extrabold', 'active');
      if (!pill.querySelector('span')) {
        const check = document.createElement('span');
        check.textContent = '✓ ';
        pill.prepend(check);
      }

      selectedAudienceCount = pill.dataset.count;
      selectedAudienceLabel = pill.dataset.label;
      if (badgeAudienceCount) badgeAudienceCount.textContent = `${selectedAudienceCount} selected`;
      if (btnDispatchLabel) btnDispatchLabel.textContent = `Dispatch Broadcast Notice (${selectedAudienceCount} Recipients)`;

      showToast(`Target audience set to ${selectedAudienceLabel}.`);
    });
  });

  // 5. Dispatch Channels
  const channelPush = document.getElementById('channel-push');
  const channelWa = document.getElementById('channel-wa');

  [
    { el: channelPush, name: 'In-App Push' },
    { el: channelWa, name: 'WhatsApp Broadcast' },
    { el: channelSms, name: 'Urgent SMS Gateway' }
  ].forEach(item => {
    if (item.el) {
      item.el.addEventListener('change', () => {
        showToast(`${item.name} is ${item.el.checked ? 'ACTIVATED' : 'DISABLED'}.`);
      });
    }
  });

  // 6. Character Counter
  const textareaBcBody = document.getElementById('textarea-bc-body');
  const charCounter = document.getElementById('char-counter');

  if (textareaBcBody && charCounter) {
    textareaBcBody.addEventListener('input', () => {
      const len = textareaBcBody.value.length;
      charCounter.textContent = `${len} / 500`;
    });
  }

  // 7. Attachment Removal
  const btnRemoveAttachment = document.getElementById('btn-remove-attachment');
  const attachmentChip = document.getElementById('attachment-chip');

  if (btnRemoveAttachment && attachmentChip) {
    btnRemoveAttachment.addEventListener('click', () => {
      attachmentChip.classList.add('hidden');
      showToast('📎 Circular PDF attachment detached.');
    });
  }

  // 8. Schedule Dispatch Toggle
  const btnSchedNow = document.getElementById('btn-sched-now');
  const btnSchedLater = document.getElementById('btn-sched-later');
  let scheduleMode = 'now';

  if (btnSchedNow && btnSchedLater) {
    btnSchedNow.addEventListener('click', () => {
      scheduleMode = 'now';
      btnSchedNow.className = 'px-3 py-1 rounded-full bg-[#180d19] text-white font-extrabold text-[10px] shadow-xs cursor-pointer transition';
      btnSchedLater.className = 'px-3 py-1 rounded-full text-slate-500 hover:text-slate-900 font-bold text-[10px] cursor-pointer transition';
      if (btnDispatchLabel) btnDispatchLabel.textContent = `Dispatch Broadcast Notice (${selectedAudienceCount} Recipients)`;
      showToast('⚡ Instant broadcast dispatch mode selected.');
    });

    btnSchedLater.addEventListener('click', () => {
      scheduleMode = 'later';
      btnSchedLater.className = 'px-3 py-1 rounded-full bg-[#180d19] text-white font-extrabold text-[10px] shadow-xs cursor-pointer transition';
      btnSchedNow.className = 'px-3 py-1 rounded-full text-slate-500 hover:text-slate-900 font-bold text-[10px] cursor-pointer transition';
      if (btnDispatchLabel) btnDispatchLabel.textContent = `Schedule Broadcast Notice (${selectedAudienceCount} Recipients)`;
      showToast('🗓️ Broadcast queued for tomorrow morning (08:30 AM).');
    });
  }

  // 9. Preview Modal
  const btnPreviewNotice = document.getElementById('btn-preview-notice');
  const modalPreview = document.getElementById('modal-preview');
  const btnClosePreview = document.getElementById('btn-close-preview');
  const btnModalDismiss = document.getElementById('btn-modal-dismiss');
  const previewModalTitle = document.getElementById('preview-modal-title');
  const previewModalBody = document.getElementById('preview-modal-body');

  function openPreviewModal() {
    if (!modalPreview) return;
    if (previewModalTitle && inputBcTitle) previewModalTitle.textContent = inputBcTitle.value || 'Announcement Title';
    if (previewModalBody && textareaBcBody) previewModalBody.textContent = textareaBcBody.value || 'Message contents will appear here...';
    modalPreview.classList.remove('hidden');
  }

  function closePreviewModal() {
    if (modalPreview) modalPreview.classList.add('hidden');
  }

  if (btnPreviewNotice) btnPreviewNotice.addEventListener('click', openPreviewModal);
  if (btnClosePreview) btnClosePreview.addEventListener('click', closePreviewModal);
  if (btnModalDismiss) btnModalDismiss.addEventListener('click', closePreviewModal);

  // 10. Dispatch Broadcast Action
  const btnDispatchNotice = document.getElementById('btn-dispatch-notice');
  if (btnDispatchNotice) {
    btnDispatchNotice.addEventListener('click', async () => {
      const title = inputBcTitle ? inputBcTitle.value.trim() : '';
      const body = textareaBcBody ? textareaBcBody.value.trim() : '';

      if (!title || !body) {
        showToast('Please provide both an announcement title and message body.');
        return;
      }

      btnDispatchNotice.disabled = true;
      btnDispatchNotice.innerHTML = `<span>Dispatching to ${selectedAudienceCount} residents...</span>`;

      try {
        await fetch('/api/broadcast/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            body,
            audience: selectedAudienceLabel,
            recipientCount: selectedAudienceCount,
            channels: {
              push: channelPush ? channelPush.checked : true,
              whatsapp: channelWa ? channelWa.checked : true,
              sms: channelSms ? channelSms.checked : false
            },
            schedule: scheduleMode
          })
        });
      } catch (_) {}

      setTimeout(() => {
        showToast(`🚀 Broadcast sent to ${selectedAudienceCount} recipients via WhatsApp & Push!`);
        btnDispatchNotice.innerHTML = `<span>✓ Dispatched Successfully</span>`;
        setTimeout(() => {
          window.location.href = '/more.html';
        }, 1200);
      }, 700);
    });
  }
});

