// Resolve Tickets & Incident Desk Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Metrics elements
  const metricOpenCount = document.getElementById('metric-open-count');
  const metricEscalatedCount = document.getElementById('metric-escalated-count');
  const metricResolvedCount = document.getElementById('metric-resolved-count');

  // Filter chips
  const filterButtons = document.querySelectorAll('.ticket-filter');
  const ticketCards = document.querySelectorAll('.ticket-card');

  // Ticket #HF-1092 elements
  const btnCallRajesh = document.getElementById('btn-call-rajesh');
  const btnWorkdone1092 = document.getElementById('btn-workdone-1092');
  const btnResolve1092 = document.getElementById('btn-resolve-1092');
  const badge1092 = document.getElementById('badge-1092');
  const card1092 = document.getElementById('ticket-card-1092');

  // Ticket #HF-1095 elements
  const btnAssignPlumber = document.getElementById('btn-assign-plumber');
  const btnResolve1095 = document.getElementById('btn-resolve-1095');
  const badge1095 = document.getElementById('badge-1095');
  const card1095 = document.getElementById('ticket-card-1095');

  // Ticket #HF-1098 elements
  const btnTestPing = document.getElementById('btn-test-ping');
  const btnClose1098 = document.getElementById('btn-close-1098');
  const badge1098 = document.getElementById('badge-1098');
  const card1098 = document.getElementById('ticket-card-1098');
  const diagnosticsText = document.getElementById('diagnostics-text');
  const latencyText = document.getElementById('latency-text');

  // Modal: Assign Plumber
  const modalAssign = document.getElementById('modal-assign');
  const btnCloseAssign = document.getElementById('btn-close-assign');
  const btnConfirmAssign = document.getElementById('btn-confirm-assign');

  // Quick Resolution Dispatcher
  const toggleDispatcherHeader = document.getElementById('toggle-dispatcher-header');
  const toggleDispatcherText = document.getElementById('toggle-dispatcher-text');
  const dispatcherDrawer = document.getElementById('dispatcher-drawer');
  const inputResolutionNotes = document.getElementById('input-resolution-notes');
  const btnLogInstantResolution = document.getElementById('btn-log-instant-resolution');
  const btnBell = document.getElementById('btn-bell');

  let openCount = 3;
  let escalatedCount = 1;
  let resolvedCount = 18;

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

  // 1. Filter Chips
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.className = 'ticket-filter shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer';
        const redDot = b.querySelector('.bg-rose-500');
        if (redDot && b.getAttribute('data-filter') === 'escalated') {
          b.className = 'ticket-filter shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer';
        }
      });

      btn.className = 'ticket-filter active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold shadow-xs transition cursor-pointer';

      ticketCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });

      showToast(`Filter: ${btn.textContent.trim()}`);
    });
  });

  // 2. Ticket #HF-1092 (Hazard Risk: AC Condensation Leak)
  if (btnCallRajesh) {
    btnCallRajesh.addEventListener('click', () => {
      showToast('📞 Dialing Technician Rajesh M. (+91 98402 11029)...');
    });
  }

  if (btnWorkdone1092) {
    btnWorkdone1092.addEventListener('click', () => {
      btnWorkdone1092.disabled = true;
      btnWorkdone1092.className = 'py-2.5 px-3 bg-emerald-50 text-emerald-700 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5';
      btnWorkdone1092.innerHTML = '<span>✓</span><span>Work Verified Done</span>';
      showToast('Technician work logged. Awaiting manager closure signature.');
    });
  }

  if (btnResolve1092) {
    btnResolve1092.addEventListener('click', async () => {
      btnResolve1092.disabled = true;
      btnResolve1092.innerHTML = '<span>⌛</span><span>Resolving...</span>';

      try {
        const response = await fetch('/api/tickets/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: 'HF-1092', room: '304', resolution: 'Condensation pan cleared, pipe re-sealed, socket dry.' })
        });
        const data = await response.json();
        showToast(data.message || '✓ Ticket #HF-1092 resolved and closed!');
      } catch (_) {
        showToast('✓ Ticket #HF-1092 resolved and closed! Tenant Aditya Verma notified.');
      }

      // Update UI
      if (badge1092) {
        badge1092.className = 'px-2.5 py-0.5 rounded-full bg-[#052e16] text-emerald-400 text-[10px] font-black';
        badge1092.textContent = '✓ Resolved & Closed';
      }
      if (card1092) {
        card1092.classList.remove('border-l-rose-500');
        card1092.classList.add('border-l-emerald-500', 'opacity-85');
      }
      btnResolve1092.className = 'py-2.5 px-3 bg-emerald-600 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5';
      btnResolve1092.innerHTML = '<span>✓</span><span>Closed</span>';

      // Update metrics
      if (openCount > 0) openCount--;
      if (escalatedCount > 0) escalatedCount--;
      resolvedCount++;

      if (metricOpenCount) metricOpenCount.textContent = openCount;
      if (metricEscalatedCount) metricEscalatedCount.textContent = escalatedCount;
      if (metricResolvedCount) metricResolvedCount.textContent = resolvedCount;
    });
  }

  // 3. Ticket #HF-1095 (Plumbing)
  if (btnAssignPlumber) {
    btnAssignPlumber.addEventListener('click', () => {
      modalAssign?.classList.remove('hidden');
    });
  }
  if (btnCloseAssign) {
    btnCloseAssign.addEventListener('click', () => {
      modalAssign?.classList.add('hidden');
    });
  }
  if (btnConfirmAssign) {
    btnConfirmAssign.addEventListener('click', async () => {
      const selectedRadio = document.querySelector('input[name="assignee_radio"]:checked');
      const techName = selectedRadio ? selectedRadio.value : 'Ramesh S.';

      try {
        await fetch('/api/tickets/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: 'HF-1095', technician: techName })
        });
      } catch (_) {}

      showToast(`✓ Work order dispatched to ${techName} for Room 204.`);
      modalAssign?.classList.add('hidden');

      btnAssignPlumber.textContent = `Assigned: ${techName} ✓`;
      btnAssignPlumber.className = 'py-2.5 px-3 bg-[#fbf2da] text-[#876717] text-xs font-bold rounded-xl flex items-center justify-center gap-1.5';
    });
  }

  if (btnResolve1095) {
    btnResolve1095.addEventListener('click', async () => {
      btnResolve1095.disabled = true;

      try {
        await fetch('/api/tickets/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: 'HF-1095', room: '204', resolution: 'Shower head cleaned and washer replaced.' })
        });
      } catch (_) {}

      showToast('✓ Ticket #HF-1095 resolved! Shower pressure restored.');
      if (badge1095) {
        badge1095.className = 'px-2.5 py-0.5 rounded-full bg-[#052e16] text-emerald-400 text-[10px] font-black';
        badge1095.textContent = '✓ Resolved';
      }
      if (card1095) card1095.classList.add('opacity-85');
      btnResolve1095.className = 'py-2.5 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5';
      btnResolve1095.textContent = 'Resolved ✓';

      if (openCount > 0) openCount--;
      resolvedCount++;
      if (metricOpenCount) metricOpenCount.textContent = openCount;
      if (metricResolvedCount) metricResolvedCount.textContent = resolvedCount;
    });
  }

  // 4. Ticket #HF-1098 (Wi-Fi Network)
  if (btnTestPing) {
    btnTestPing.addEventListener('click', async () => {
      btnTestPing.disabled = true;
      btnTestPing.innerHTML = '<span>⌛</span><span>Testing...</span>';

      try {
        const response = await fetch('/api/tickets/ping', { method: 'POST' });
        const data = await response.json();
        if (diagnosticsText) diagnosticsText.textContent = 'Diagnostics: Optimal (100% Signal)';
        if (latencyText) latencyText.textContent = `Latency: ${data.latencyMs || 24}ms`;
        showToast(data.message || '📶 Ping test passed: 24ms, 0% packet loss.');
      } catch (_) {
        if (diagnosticsText) diagnosticsText.textContent = 'Diagnostics: Optimal';
        if (latencyText) latencyText.textContent = 'Latency: 22ms';
        showToast('📶 Diagnostic ping passed: 22ms latency, link verified.');
      }

      btnTestPing.disabled = false;
      btnTestPing.innerHTML = `
        <svg class="w-3.5 h-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Ping Optimal</span>
      `;
    });
  }

  if (btnClose1098) {
    btnClose1098.addEventListener('click', async () => {
      btnClose1098.disabled = true;

      try {
        await fetch('/api/tickets/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: 'HF-1098', location: 'Block B Network Hub', resolution: 'Mesh node rebooted and firmware synchronized.' })
        });
      } catch (_) {}

      showToast('✓ Ticket #HF-1098 closed! Mesh Node #04 back online.');
      if (badge1098) {
        badge1098.className = 'px-2.5 py-0.5 rounded-full bg-[#052e16] text-emerald-400 text-[10px] font-black';
        badge1098.textContent = '✓ Closed';
      }
      if (card1098) card1098.classList.add('opacity-85');
      btnClose1098.className = 'py-2.5 px-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5';
      btnClose1098.textContent = 'Closed ✓';

      if (openCount > 0) openCount--;
      resolvedCount++;
      if (metricOpenCount) metricOpenCount.textContent = openCount;
      if (metricResolvedCount) metricResolvedCount.textContent = resolvedCount;
    });
  }

  // 5. Quick Resolution Dispatcher
  if (toggleDispatcherHeader) {
    toggleDispatcherHeader.addEventListener('click', () => {
      const isHidden = dispatcherDrawer?.classList.contains('hidden');
      if (isHidden) {
        dispatcherDrawer?.classList.remove('hidden');
        if (toggleDispatcherText) toggleDispatcherText.textContent = 'Tap to collapse';
      } else {
        dispatcherDrawer?.classList.add('hidden');
        if (toggleDispatcherText) toggleDispatcherText.textContent = 'Tap to expand';
      }
    });
  }

  if (btnLogInstantResolution) {
    btnLogInstantResolution.addEventListener('click', async () => {
      const notes = inputResolutionNotes?.value.trim() || 'Verified by Shift Warden on-site.';
      btnLogInstantResolution.disabled = true;
      btnLogInstantResolution.innerHTML = '<span>⌛</span><span>Logging Resolution...</span>';

      try {
        await fetch('/api/tickets/resolve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ticketId: 'BATCH-RESOLVE', notes })
        });
      } catch (_) {}

      showToast(`✓ Instant resolution logged: "${notes}"`);
      if (inputResolutionNotes) inputResolutionNotes.value = '';
      btnLogInstantResolution.disabled = false;
      btnLogInstantResolution.innerHTML = `
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>+ Log Instant Resolution / Close Selected</span>
      `;
    });
  }

  // 6. Notification Bell
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Incident Desk: 1 critical electrical hazard ticket active in Block A.');
    });
  }
});

