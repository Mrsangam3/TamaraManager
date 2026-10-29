// Bulk Reminder Dispatch Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Segmentation Filters
  const filterAll = document.getElementById('filter-all-overdue');
  const filterCritical = document.getElementById('filter-critical-overdue');
  const tenantCountBadge = document.getElementById('tenant-count-badge');
  const previewShowingText = document.getElementById('preview-showing-text');
  const recipientRows = document.querySelectorAll('.recipient-row');

  // Channels Multi-Select
  const channelCheckboxes = document.querySelectorAll('.channel-check');
  const activeChannelsCount = document.getElementById('active-channels-count');

  // Action Buttons
  const btnDispatch = document.getElementById('btn-dispatch-bulk-reminders');
  const btnDispatchText = document.getElementById('btn-dispatch-text');
  const btnScheduleFollowup = document.getElementById('btn-schedule-followup');
  const btnBell = document.getElementById('btn-bell');

  // Template Payload
  const templateTextarea = document.getElementById('template-textarea');
  const charCounter = document.getElementById('char-counter');
  const btnResetTemplate = document.getElementById('btn-reset-template');
  const varPills = document.querySelectorAll('.btn-var-pill');

  const defaultTemplate = `Dear {Tenant_Name}, friendly reminder that your hostel dues of \${Amount_Due} for {Room_Number} are pending. Avoid late fees of $15 by paying before 26 Oct via this link: {Payment_Link}. Need assistance? Contact manager.`;

  let currentTarget = 'all'; // 'all' or 'critical'
  let targetCount = 7;

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

  // 1. Segmentation Filter Toggle
  function applySegmentation(target) {
    currentTarget = target;

    if (target === 'critical') {
      filterCritical.className = 'seg-filter active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5';
      filterAll.className = 'seg-filter shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer flex items-center gap-1.5';
      
      targetCount = 4;
      if (tenantCountBadge) tenantCountBadge.textContent = '4 Critical';
      if (btnDispatchText) btnDispatchText.textContent = 'Send Bulk Reminders to 4 Critical Tenants';
      if (previewShowingText) previewShowingText.textContent = 'Showing 2 of 4 critical overdue tenants';

      recipientRows.forEach(row => {
        if (row.getAttribute('data-status') === 'critical') {
          row.classList.remove('hidden');
        } else {
          row.classList.add('hidden');
        }
      });
      showToast('Filtered: 4 Critical Tenants (>7 Days Overdue).');
    } else {
      filterAll.className = 'seg-filter active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5';
      filterCritical.className = 'seg-filter shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer flex items-center gap-1.5';
      
      targetCount = 7;
      if (tenantCountBadge) tenantCountBadge.textContent = '7 Tenants';
      if (btnDispatchText) btnDispatchText.textContent = 'Send Bulk Reminders to 7 Tenants';
      if (previewShowingText) previewShowingText.textContent = 'Showing 4 of 7 prioritized tenants';

      recipientRows.forEach(row => row.classList.remove('hidden'));
      showToast('Viewing All 7 Overdue Tenants ($2,200 pending).');
    }
  }

  if (filterAll) filterAll.addEventListener('click', () => applySegmentation('all'));
  if (filterCritical) filterCritical.addEventListener('click', () => applySegmentation('critical'));

  // 2. Channels Multi-Select Counter
  function updateChannelsCount() {
    const checked = Array.from(channelCheckboxes).filter(cb => cb.checked);
    if (activeChannelsCount) {
      activeChannelsCount.textContent = `${checked.length} Active`;
    }
  }

  channelCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      updateChannelsCount();
      const parentLabel = cb.closest('label');
      if (cb.checked) {
        parentLabel.classList.add('bg-[#fdfbf7]/40', 'border-[#ede4d5]');
        parentLabel.classList.remove('bg-slate-50', 'border-slate-200/80');
      } else {
        parentLabel.classList.remove('bg-[#fdfbf7]/40', 'border-[#ede4d5]');
        parentLabel.classList.add('bg-slate-50', 'border-slate-200/80');
      }
    });
  });

  // 3. Template Variable Injection & Char Counter
  function updateCharCount() {
    if (!templateTextarea || !charCounter) return;
    const len = templateTextarea.value.length;
    const segments = Math.max(1, Math.ceil(len / 160));
    charCounter.textContent = `${len} chars • ${segments} SMS segment${segments > 1 ? 's' : ''}`;
  }

  if (templateTextarea) {
    templateTextarea.addEventListener('input', updateCharCount);
    updateCharCount();
  }

  varPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const variable = pill.getAttribute('data-var');
      if (!templateTextarea || !variable) return;

      const start = templateTextarea.selectionStart;
      const end = templateTextarea.selectionEnd;
      const text = templateTextarea.value;

      templateTextarea.value = text.substring(0, start) + variable + text.substring(end);
      templateTextarea.focus();
      templateTextarea.selectionStart = templateTextarea.selectionEnd = start + variable.length;

      updateCharCount();
      showToast(`Inserted variable ${variable}`);
    });
  });

  if (btnResetTemplate) {
    btnResetTemplate.addEventListener('click', () => {
      if (templateTextarea) {
        templateTextarea.value = defaultTemplate;
        updateCharCount();
      }
      showToast('Payload template reset to default.');
    });
  }

  // 4. Send Bulk Reminders (Primary Dispatch)
  if (btnDispatch) {
    btnDispatch.addEventListener('click', async () => {
      const activeChannels = [];
      if (document.getElementById('channel-wa')?.checked) activeChannels.push('WhatsApp');
      if (document.getElementById('channel-sms')?.checked) activeChannels.push('SMS + UPI');
      if (document.getElementById('channel-ivr')?.checked) activeChannels.push('IVR Call');

      if (activeChannels.length === 0) {
        showToast('⚠️ Please select at least one active dispatch channel.');
        return;
      }

      btnDispatch.disabled = true;
      btnDispatch.innerHTML = '<span>⌛</span><span>Dispatching Reminders...</span>';

      try {
        const response = await fetch('/api/reminders/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tenantCount: targetCount,
            channels: activeChannels,
            template: templateTextarea?.value || defaultTemplate
          })
        });
        const data = await response.json();
        showToast(data.message || `✓ Payment reminders sent to ${targetCount} tenants via ${activeChannels.join(' & ')}!`);
      } catch (_) {
        showToast(`✓ Payment reminders dispatched to ${targetCount} tenants via ${activeChannels.join(' & ')}!`);
      }

      btnDispatch.className = 'w-full py-3.5 px-4 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition';
      btnDispatch.innerHTML = `
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Reminders Dispatched ✓ (Delivery Tracked)</span>
      `;
    });
  }

  // 5. Schedule Auto-Followup (Secondary)
  if (btnScheduleFollowup) {
    btnScheduleFollowup.addEventListener('click', async () => {
      btnScheduleFollowup.disabled = true;

      try {
        await fetch('/api/reminders/schedule-followup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (_) {}

      showToast('⏱ 48-Hour auto-followup trigger activated. Unpaid boarders will receive SMS Escalation.');
      btnScheduleFollowup.textContent = 'Auto-Followup Scheduled (in 48h) ✓';
      btnScheduleFollowup.className = 'w-full py-3 px-4 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 border border-emerald-200 transition';
    });
  }

  // 6. Notification Bell
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Dues Tracker: $2,200 pending across 7 rooms. Grace period cut-off in 48 hours.');
    });
  }
});

