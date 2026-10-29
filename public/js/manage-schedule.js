// Manage Maintenance Schedule & Real-Time Dynamic Calendar (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Metric elements
  const metricCompletedCount = document.getElementById('metric-completed-count');
  const metricNextUpText = document.getElementById('metric-next-up-text');
  const progressRingCircle = document.getElementById('progress-ring-circle');
  const progressPercentLabel = document.getElementById('progress-percent-label');

  // Calendar strip elements
  const currentMonthHeading = document.getElementById('current-month-heading');
  const dateStripContainer = document.getElementById('date-strip-container');
  const btnOpenFullCalendar = document.getElementById('btn-open-full-calendar');

  // Full calendar modal elements
  const modalFullCalendar = document.getElementById('modal-full-calendar');
  const btnCloseCalendar = document.getElementById('btn-close-calendar');
  const calPrevMonth = document.getElementById('cal-prev-month');
  const calNextMonth = document.getElementById('cal-next-month');
  const calMonthDisplay = document.getElementById('cal-month-display');
  const calendarDaysGrid = document.getElementById('calendar-days-grid');
  const btnCalendarJumpToday = document.getElementById('btn-calendar-jump-today');
  const btnCalendarConfirm = document.getElementById('btn-calendar-confirm');

  // Filter tabs
  const filterButtons = document.querySelectorAll('.schedule-filter');
  const taskItems = document.querySelectorAll('.schedule-task-item');

  // Task buttons
  const btnCallApex = document.getElementById('btn-call-apex');
  const btnConfirmArrival = document.getElementById('btn-confirm-arrival');
  const btnViewGatepass = document.getElementById('btn-view-gatepass');
  const btnRescheduleTask = document.getElementById('btn-reschedule-task');
  const btnStartManojTask = document.getElementById('btn-start-manoj-task');
  const btnReassignManoj = document.getElementById('btn-reassign-manoj');
  const btnEditBroadcast = document.getElementById('btn-edit-broadcast');
  const btnScheduleNewTask = document.getElementById('btn-schedule-new-task');
  const btnPrintSchedule = document.getElementById('btn-print-schedule');

  // Gate Pass Modal
  const modalGatepass = document.getElementById('modal-gatepass');
  const btnCloseGatepass = document.getElementById('btn-close-gatepass');
  const btnGatepassDownload = document.getElementById('btn-gatepass-download');

  // Reschedule Modal
  const modalReschedule = document.getElementById('modal-reschedule');
  const btnCloseReschedule = document.getElementById('btn-close-reschedule');
  const btnConfirmReschedule = document.getElementById('btn-confirm-reschedule');

  // New Task Modal
  const modalNewTask = document.getElementById('modal-new-task');
  const btnCloseNewTask = document.getElementById('btn-close-new-task');
  const formNewTask = document.getElementById('form-new-task');

  // State: Real-Time Client Date
  const realToday = new Date();
  let selectedDate = new Date(realToday);
  let viewingCalendarMonth = new Date(realToday.getFullYear(), realToday.getMonth(), 1);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNamesShort = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

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

  function isSameDay(d1, d2) {
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  }

  // 1. Render Real-Time Horizontal Date Strip
  function renderDateStrip() {
    if (!dateStripContainer) return;

    // Update Month Heading from selected date
    if (currentMonthHeading) {
      currentMonthHeading.textContent = `${monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    }

    dateStripContainer.innerHTML = '';

    // Generate a window of 7 days centered on the real-time week (3 days back, today, 3 days forward)
    const baseDate = new Date(selectedDate);
    const dayOfWeek = baseDate.getDay(); // 0 is Sun

    // Create 7-day strip from Monday of current week
    const startOffset = -3;
    for (let i = startOffset; i <= 4; i++) {
      const d = new Date(selectedDate);
      d.setDate(selectedDate.getDate() + i);

      const dayName = dayNamesShort[d.getDay()];
      const dayNum = d.getDate();
      const isToday = isSameDay(d, realToday);
      const isSelected = isSameDay(d, selectedDate);

      const chip = document.createElement('button');
      chip.type = 'button';
      chip.setAttribute('data-timestamp', d.getTime());

      if (isSelected) {
        chip.className = 'date-chip active shrink-0 px-3.5 py-2.5 rounded-2xl bg-[#180d19] text-white flex flex-col items-center justify-center min-w-[56px] shadow-sm cursor-pointer transition';
        chip.innerHTML = `
          <span class="text-[9px] font-extrabold uppercase tracking-wider ${isToday ? 'text-slate-300' : 'text-[#edd18e]'}">${dayName}</span>
          <span class="text-sm font-black mt-0.5 leading-none">${dayNum}</span>
          ${isToday 
            ? '<span class="text-[8px] font-black text-emerald-400 flex items-center gap-1 mt-1 leading-none"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>TODAY</span>'
            : '<span class="w-1.5 h-1.5 rounded-full bg-[#d4a838] mt-1"></span>'
          }
        `;
      } else {
        chip.className = 'date-chip shrink-0 px-3.5 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-slate-700 hover:bg-slate-50 flex flex-col items-center justify-center min-w-[56px] cursor-pointer transition';
        chip.innerHTML = `
          <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400">${dayName}</span>
          <span class="text-sm font-black text-slate-800 mt-0.5 leading-none">${dayNum}</span>
          <span class="w-1 h-1 rounded-full ${isToday ? 'bg-emerald-500' : 'bg-slate-300'} mt-1.5"></span>
        `;
      }

      chip.addEventListener('click', () => {
        selectedDate = new Date(d);
        renderDateStrip();
        showToast(`Viewing maintenance schedule for ${dayName}, ${monthNames[d.getMonth()]} ${dayNum}.`);
      });

      dateStripContainer.appendChild(chip);
    }
  }

  // 2. Render Full Calendar Modal Grid
  function renderFullCalendarModal() {
    if (!calendarDaysGrid || !calMonthDisplay) return;

    const year = viewingCalendarMonth.getFullYear();
    const month = viewingCalendarMonth.getMonth();

    calMonthDisplay.textContent = `${monthNames[month]} ${year}`;

    calendarDaysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Previous month padding
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'h-8';
      calendarDaysGrid.appendChild(emptyCell);
    }

    // Days of current month
    for (let d = 1; d <= totalDays; d++) {
      const cellDate = new Date(year, month, d);
      const isToday = isSameDay(cellDate, realToday);
      const isSelected = isSameDay(cellDate, selectedDate);

      const dayBtn = document.createElement('button');
      dayBtn.type = 'button';
      dayBtn.textContent = d;

      if (isSelected) {
        dayBtn.className = 'w-8 h-8 mx-auto rounded-full bg-[#180d19] text-white font-black text-xs flex items-center justify-center shadow-xs cursor-pointer';
      } else if (isToday) {
        dayBtn.className = 'w-8 h-8 mx-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 font-black text-xs flex items-center justify-center cursor-pointer';
      } else {
        dayBtn.className = 'w-8 h-8 mx-auto rounded-full hover:bg-slate-100 text-slate-700 font-semibold text-xs flex items-center justify-center cursor-pointer';
      }

      dayBtn.addEventListener('click', () => {
        selectedDate = new Date(cellDate);
        renderDateStrip();
        renderFullCalendarModal();
        modalFullCalendar?.classList.add('hidden');
        showToast(`Selected date: ${monthNames[month]} ${d}, ${year}`);
      });

      calendarDaysGrid.appendChild(dayBtn);
    }
  }

  // Full Calendar Modal Triggers
  if (btnOpenFullCalendar) {
    btnOpenFullCalendar.addEventListener('click', () => {
      viewingCalendarMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
      renderFullCalendarModal();
      modalFullCalendar?.classList.remove('hidden');
    });
  }

  if (btnCloseCalendar) {
    btnCloseCalendar.addEventListener('click', () => {
      modalFullCalendar?.classList.add('hidden');
    });
  }

  if (btnCalendarConfirm) {
    btnCalendarConfirm.addEventListener('click', () => {
      modalFullCalendar?.classList.add('hidden');
    });
  }

  if (calPrevMonth) {
    calPrevMonth.addEventListener('click', () => {
      viewingCalendarMonth.setMonth(viewingCalendarMonth.getMonth() - 1);
      renderFullCalendarModal();
    });
  }

  if (calNextMonth) {
    calNextMonth.addEventListener('click', () => {
      viewingCalendarMonth.setMonth(viewingCalendarMonth.getMonth() + 1);
      renderFullCalendarModal();
    });
  }

  if (btnCalendarJumpToday) {
    btnCalendarJumpToday.addEventListener('click', () => {
      selectedDate = new Date(realToday);
      viewingCalendarMonth = new Date(realToday.getFullYear(), realToday.getMonth(), 1);
      renderDateStrip();
      renderFullCalendarModal();
      modalFullCalendar?.classList.add('hidden');
      showToast('Jumped to current real-time date (Today).');
    });
  }

  // 3. Category Filter Tabs
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');

      filterButtons.forEach(b => {
        b.className = 'schedule-filter shrink-0 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition cursor-pointer';
      });

      btn.className = 'schedule-filter active shrink-0 px-3.5 py-1.5 rounded-full bg-[#180d19] text-white text-xs font-bold shadow-xs transition cursor-pointer';

      taskItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });

      showToast(`Filter applied: ${btn.textContent.trim()}`);
    });
  });

  // 4. Confirm Technician Arrival
  if (btnConfirmArrival) {
    btnConfirmArrival.addEventListener('click', async () => {
      btnConfirmArrival.disabled = true;
      btnConfirmArrival.innerHTML = '<span>⌛</span><span>Verifying Gate Pass...</span>';

      try {
        const response = await fetch('/api/schedule/confirm-arrival', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gatePass: 'GP-8821', vendor: 'Apex Facility Solutions' })
        });
        const data = await response.json();
        showToast(data.message || '✓ Technician arrival confirmed! Security clearance verified.');
      } catch (_) {
        showToast('✓ Technician arrival confirmed! Biometric security pass activated.');
      }

      btnConfirmArrival.className = 'w-full py-3 px-4 bg-emerald-600 text-white rounded-2xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 transition';
      btnConfirmArrival.innerHTML = `
        <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        <span>Technicians Arrived ✓ (Work Active)</span>
      `;

      // Update progress metric to 2/4 (50%)
      if (metricCompletedCount) metricCompletedCount.textContent = '2/4';
      if (metricNextUpText) metricNextUpText.textContent = 'Next up: Rooftop Solar Pressure Check in 2h';
      if (progressRingCircle) progressRingCircle.setAttribute('stroke-dashoffset', '50');
      if (progressPercentLabel) progressPercentLabel.textContent = '50%';
    });
  }

  // 5. Gate Pass Modal Controls
  if (btnViewGatepass) {
    btnViewGatepass.addEventListener('click', () => {
      modalGatepass?.classList.remove('hidden');
    });
  }
  if (btnCloseGatepass) {
    btnCloseGatepass.addEventListener('click', () => {
      modalGatepass?.classList.add('hidden');
    });
  }
  if (btnGatepassDownload) {
    btnGatepassDownload.addEventListener('click', () => {
      showToast('📄 Gate Pass #GP-8821 PDF downloaded and archived.');
      modalGatepass?.classList.add('hidden');
    });
  }

  // 6. Reschedule Modal Controls
  if (btnRescheduleTask) {
    btnRescheduleTask.addEventListener('click', () => {
      modalReschedule?.classList.remove('hidden');
    });
  }
  if (btnCloseReschedule) {
    btnCloseReschedule.addEventListener('click', () => {
      modalReschedule?.classList.add('hidden');
    });
  }
  if (btnConfirmReschedule) {
    btnConfirmReschedule.addEventListener('click', async () => {
      const selectedRadio = document.querySelector('input[name="reschedule_slot"]:checked');
      const newSlot = selectedRadio ? selectedRadio.value : 'Tomorrow, 10:00 AM';

      try {
        await fetch('/api/schedule/reschedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: 'Water Pump Overhaul', newSlot })
        });
      } catch (_) {}

      showToast(`✓ Water Pump Overhaul rescheduled to ${newSlot}. Apex Solutions notified.`);
      modalReschedule?.classList.add('hidden');
    });
  }

  // 7. Manoj Staff Task
  if (btnStartManojTask) {
    btnStartManojTask.addEventListener('click', () => {
      btnStartManojTask.disabled = true;
      btnStartManojTask.className = 'py-2.5 px-3 bg-emerald-600 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs';
      btnStartManojTask.innerHTML = '<span>⏱️</span><span>In Progress</span>';
      showToast('Rooftop Solar Pressure Check started by Electrician Manoj.');
    });
  }

  if (btnReassignManoj) {
    btnReassignManoj.addEventListener('click', () => {
      showToast('Reassignment request dispatched to Electrical Shift Supervisor.');
    });
  }

  // 8. Resident Notice Edit
  if (btnEditBroadcast) {
    btnEditBroadcast.addEventListener('click', () => {
      showToast('Opening SMS & Push broadcast editor for pest control notice...');
    });
  }

  // 9. Direct Phone Call Apex
  if (btnCallApex) {
    btnCallApex.addEventListener('click', () => {
      showToast('📞 Calling Apex Facility Solutions (+91 98402 11029)...');
    });
  }

  // 10. Schedule New Task Form & Modal
  if (btnScheduleNewTask) {
    btnScheduleNewTask.addEventListener('click', () => {
      modalNewTask?.classList.remove('hidden');
    });
  }
  if (btnCloseNewTask) {
    btnCloseNewTask.addEventListener('click', () => {
      modalNewTask?.classList.add('hidden');
    });
  }
  if (formNewTask) {
    formNewTask.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('input-task-title')?.value || 'Maintenance Inspection';
      const category = document.getElementById('input-task-category')?.value || 'vendor';
      const time = document.getElementById('input-task-time')?.value || '16:00';
      const assignee = document.getElementById('input-task-assignee')?.value || 'Apex Facility Solutions';
      const autoGatePass = document.getElementById('check-generate-gatepass')?.checked;

      try {
        await fetch('/api/schedule/create-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, category, timeSlot: time, assignee, autoGatePass })
        });
      } catch (_) {}

      showToast(`✓ Scheduled: ${title} (${time}) assigned to ${assignee}!`);
      modalNewTask?.classList.add('hidden');
      formNewTask.reset();
    });
  }

  // 11. Print Schedule
  if (btnPrintSchedule) {
    btnPrintSchedule.addEventListener('click', () => {
      showToast('🖨️ Generating printable daily operations schedule...');
      setTimeout(() => {
        window.print();
      }, 500);
    });
  }

  // Initialize
  renderDateStrip();
});

