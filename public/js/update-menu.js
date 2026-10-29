// Update Daily Menu Client-Side Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Helper: Toast Notification
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

  // 1. Dynamic Date Calculation for Day Tabs
  const today = new Date();
  const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthsShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const labelToday = document.getElementById('label-today-tab');
  const labelTomorrow = document.getElementById('label-tomorrow-tab');
  const labelWeekend = document.getElementById('label-weekend-tab');

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const weekend = new Date(today);
  // Find upcoming Saturday
  const daysUntilSat = (6 - today.getDay() + 7) % 7 || 7;
  weekend.setDate(today.getDate() + daysUntilSat);

  if (labelToday) {
    labelToday.textContent = `Today (${daysShort[today.getDay()]} ${today.getDate()})`;
  }
  if (labelTomorrow) {
    labelTomorrow.textContent = `Tomorrow (${daysShort[tomorrow.getDay()]} ${tomorrow.getDate()})`;
  }
  if (labelWeekend) {
    labelWeekend.textContent = `Sat ${weekend.getDate()}`;
  }

  // 2. Day Tabs Toggle
  const dayTabs = document.querySelectorAll('.day-tab');
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => {
        t.classList.remove('active', 'bg-white', 'shadow-xs', 'border', 'border-[#e3d5be]/60');
        t.classList.add('bg-transparent');
        const badge = t.querySelector('span:first-child');
        const label = t.querySelector('span:last-child');
        if (badge) badge.className = 'block text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none';
        if (label) label.className = 'block text-xs font-extrabold text-slate-600 mt-1 leading-tight';
      });

      tab.classList.add('active', 'bg-white', 'shadow-xs', 'border', 'border-[#e3d5be]/60');
      tab.classList.remove('bg-transparent');
      const activeBadge = tab.querySelector('span:first-child');
      const activeLabel = tab.querySelector('span:last-child');
      if (activeBadge) activeBadge.className = 'block text-[9px] font-black text-[#c59b27] uppercase tracking-wider leading-none';
      if (activeLabel) activeLabel.className = 'block text-xs font-black text-slate-900 mt-1 leading-tight';

      const daySelected = tab.getAttribute('data-day');
      showToast(`Switched menu schedule to: ${tab.querySelector('span:last-child').textContent.trim()}`);
    });
  });

  // 3. Modals & Quick Edit Handling
  const modalEditDishes = document.getElementById('modal-edit-dishes');
  const modalMealTitle = document.getElementById('modal-meal-title');
  const modalMealTime = document.getElementById('modal-meal-time');
  const modalActiveTags = document.getElementById('modal-active-tags');
  const inputNewDish = document.getElementById('input-new-dish');
  const btnAddDish = document.getElementById('btn-add-dish');
  const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
  const formEditDishes = document.getElementById('form-edit-dishes');

  let activeEditingMeal = 'lunch'; // 'lunch' | 'dinner' | 'snacks'

  function openEditModal(mealType, title, time, tagsContainerId) {
    activeEditingMeal = mealType;
    modalMealTitle.textContent = `Edit ${title} Menu Items`;
    modalMealTime.textContent = time;

    const container = document.getElementById(tagsContainerId);
    modalActiveTags.innerHTML = '';

    if (mealType === 'snacks') {
      const text = document.getElementById('snacks-dish-text').textContent.trim();
      const items = text.split(',').map(s => s.trim()).filter(Boolean);
      items.forEach(dish => addTagToModal(dish));
    } else if (container) {
      const spans = container.querySelectorAll('span');
      spans.forEach(span => {
        addTagToModal(span.textContent.trim());
      });
    }

    modalEditDishes.classList.remove('hidden');
    inputNewDish.value = '';
    inputNewDish.focus();
  }

  function addTagToModal(dishName) {
    if (!dishName) return;
    const tag = document.createElement('span');
    tag.className = 'modal-tag inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs';
    tag.innerHTML = `
      <span>${dishName}</span>
      <button type="button" class="text-rose-500 hover:text-rose-700 text-xs font-bold leading-none cursor-pointer">×</button>
    `;
    tag.querySelector('button').addEventListener('click', () => {
      tag.remove();
    });
    modalActiveTags.appendChild(tag);
  }

  if (btnAddDish) {
    btnAddDish.addEventListener('click', () => {
      const val = inputNewDish.value.trim();
      if (val) {
        addTagToModal(val);
        inputNewDish.value = '';
        inputNewDish.focus();
      }
    });
  }

  inputNewDish.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      btnAddDish.click();
    }
  });

  // Save Dish Changes
  if (formEditDishes) {
    formEditDishes.addEventListener('submit', (e) => {
      e.preventDefault();
      const tags = Array.from(modalActiveTags.querySelectorAll('.modal-tag span:first-child')).map(s => s.textContent.trim());

      if (activeEditingMeal === 'lunch') {
        const container = document.getElementById('lunch-dish-tags');
        if (container) {
          container.innerHTML = tags.map(t => {
            const isSweet = t.toLowerCase().includes('jamun') || t.toLowerCase().includes('sweet') || t.toLowerCase().includes('dessert');
            if (isSweet) {
              return `<span class="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300/80 text-emerald-800 text-xs font-extrabold shadow-2xs">${t}</span>`;
            }
            return `<span class="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">${t}</span>`;
          }).join(' ');
        }
      } else if (activeEditingMeal === 'dinner') {
        const container = document.getElementById('dinner-dish-tags');
        if (container) {
          container.innerHTML = tags.map(t => `<span class="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">${t}</span>`).join(' ');
        }
      } else if (activeEditingMeal === 'snacks') {
        const snacksText = document.getElementById('snacks-dish-text');
        if (snacksText) {
          snacksText.textContent = tags.join(', ');
        }
      }

      modalEditDishes.classList.add('hidden');
      showToast(`✓ ${activeEditingMeal.toUpperCase()} menu items updated successfully!`);
    });
  }

  if (btnCloseEditModal) {
    btnCloseEditModal.addEventListener('click', () => modalEditDishes.classList.add('hidden'));
  }

  // Trigger buttons for edit
  document.getElementById('btn-edit-lunch')?.addEventListener('click', () => {
    openEditModal('lunch', 'Lunch', '12:30 - 02:30 PM', 'lunch-dish-tags');
  });

  document.getElementById('btn-edit-snacks')?.addEventListener('click', () => {
    openEditModal('snacks', 'Evening Snacks', '05:00 - 06:00 PM', null);
  });

  document.getElementById('btn-modify-dinner')?.addEventListener('click', () => {
    openEditModal('dinner', 'Dinner', '07:30 - 09:30 PM', 'dinner-dish-tags');
  });

  // 4. Vegetarian Feast Night Toggle
  const toggleFeast = document.getElementById('toggle-feast');
  if (toggleFeast) {
    toggleFeast.addEventListener('change', () => {
      const container = document.getElementById('dinner-dish-tags');
      if (toggleFeast.checked) {
        showToast('🎉 Vegetarian Feast Night enabled (Special dessert & soup added).');
        if (container && !container.innerHTML.includes('Gulab Jamun') && !container.innerHTML.includes('Rasgulla')) {
          container.insertAdjacentHTML('beforeend', '<span class="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-extrabold shadow-2xs">Kheer Dessert</span>');
        }
      } else {
        showToast('Standard Vegetarian dinner set.');
      }
    });
  }

  // 5. Approve & Publish Dinner
  const btnApproveDinner = document.getElementById('btn-approve-dinner');
  const dinnerStatusBadge = document.getElementById('dinner-status-badge');
  const btnApproveDinnerText = document.getElementById('btn-approve-dinner-text');

  if (btnApproveDinner) {
    btnApproveDinner.addEventListener('click', async () => {
      btnApproveDinner.className = 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs';
      if (btnApproveDinnerText) btnApproveDinnerText.textContent = 'Approved & Published ✓';
      if (dinnerStatusBadge) {
        dinnerStatusBadge.className = 'px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold';
        dinnerStatusBadge.textContent = '• Approved & Published';
      }

      try {
        await fetch('/api/menu/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meal: 'dinner', status: 'approved' })
        });
      } catch (err) {}

      showToast('✓ Dinner menu approved and certified for Kitchen Duty Lead!');
    });
  }

  // 6. Broadcast Menu to Tenant App & WhatsApp
  const btnBroadcastMenu = document.getElementById('btn-broadcast-menu');
  const broadcastBtnText = document.getElementById('broadcast-btn-text');

  if (btnBroadcastMenu) {
    btnBroadcastMenu.addEventListener('click', async () => {
      if (broadcastBtnText) broadcastBtnText.textContent = 'Broadcasting to 176 Residents...';
      btnBroadcastMenu.classList.add('opacity-80');

      try {
        await fetch('/api/menu/broadcast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ channels: ['App', 'WhatsApp'], count: 176 })
        });
      } catch (err) {}

      setTimeout(() => {
        btnBroadcastMenu.classList.remove('opacity-80');
        btnBroadcastMenu.className = 'w-full bg-emerald-600 text-white font-extrabold text-xs py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md';
        if (broadcastBtnText) broadcastBtnText.textContent = 'Menu Broadcasted to Tenants & WhatsApp ✓';
        showToast('🚀 Menu broadcasted to 176 tenants & synced to Hostel WhatsApp Group!');
      }, 700);
    });
  }

  // 7. Weekly Templates Modal
  const modalTemplates = document.getElementById('modal-templates');
  const btnOpenTemplates = document.getElementById('btn-open-templates');
  const btnCloseTemplates = document.getElementById('btn-close-templates');
  const btnApplyTemplate = document.getElementById('btn-apply-template');
  let selectedTemplate = 'north';

  if (btnOpenTemplates) {
    btnOpenTemplates.addEventListener('click', () => modalTemplates.classList.remove('hidden'));
  }
  if (btnCloseTemplates) {
    btnCloseTemplates.addEventListener('click', () => modalTemplates.classList.add('hidden'));
  }

  document.querySelectorAll('.template-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.template-option').forEach(o => {
        o.classList.remove('border-[#e3d5be]', 'bg-[#fdfbf7]/50');
        o.classList.add('border-slate-200');
      });
      opt.classList.add('border-[#e3d5be]', 'bg-[#fdfbf7]/50');
      opt.classList.remove('border-slate-200');
      selectedTemplate = opt.getAttribute('data-template');
    });
  });

  if (btnApplyTemplate) {
    btnApplyTemplate.addEventListener('click', () => {
      if (selectedTemplate === 'south') {
        const lunch = document.getElementById('lunch-dish-tags');
        if (lunch) {
          lunch.innerHTML = `
            <span class="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">Drumstick Sambar</span>
            <span class="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">Avial Mixed Veg</span>
            <span class="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">Steamed Ponni Rice</span>
            <span class="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/90 text-slate-800 text-xs font-semibold shadow-2xs">Rasam & Curd</span>
            <span class="px-2.5 py-1 rounded-xl bg-emerald-100 border border-emerald-300/80 text-emerald-800 text-xs font-extrabold shadow-2xs">Ada Pradhaman Payasam</span>
          `;
        }
      }
      modalTemplates.classList.add('hidden');
      showToast('✓ Nutritional meal template applied across active services.');
    });
  }

  // 8. RSVP Modal
  const modalRsvp = document.getElementById('modal-rsvp');
  const btnViewRsvp = document.getElementById('btn-view-rsvp-list');
  const btnCloseRsvp = document.getElementById('btn-close-rsvp');
  const btnDismissRsvp = document.getElementById('btn-dismiss-rsvp');

  if (btnViewRsvp) {
    btnViewRsvp.addEventListener('click', () => modalRsvp.classList.remove('hidden'));
  }
  if (btnCloseRsvp) {
    btnCloseRsvp.addEventListener('click', () => modalRsvp.classList.add('hidden'));
  }
  if (btnDismissRsvp) {
    btnDismissRsvp.addEventListener('click', () => modalRsvp.classList.add('hidden'));
  }

  // 9. Pantry Log Modal
  const modalPantry = document.getElementById('modal-pantry');
  const btnPantryLog = document.getElementById('btn-pantry-log');
  const btnClosePantry = document.getElementById('btn-close-pantry');
  const btnDismissPantry = document.getElementById('btn-dismiss-pantry');

  if (btnPantryLog) {
    btnPantryLog.addEventListener('click', () => modalPantry.classList.remove('hidden'));
  }
  if (btnClosePantry) {
    btnClosePantry.addEventListener('click', () => modalPantry.classList.add('hidden'));
  }
  if (btnDismissPantry) {
    btnDismissPantry.addEventListener('click', () => modalPantry.classList.add('hidden'));
  }

  // 10. Bell Notification
  document.getElementById('btn-bell')?.addEventListener('click', () => {
    showToast('🔔 Dinner cutoff notice: Resident opt-out window locks at 18:30.');
  });

  // Modal Backdrop Click
  window.addEventListener('click', (e) => {
    if (e.target === modalEditDishes) modalEditDishes.classList.add('hidden');
    if (e.target === modalTemplates) modalTemplates.classList.add('hidden');
    if (e.target === modalRsvp) modalRsvp.classList.add('hidden');
    if (e.target === modalPantry) modalPantry.classList.add('hidden');
  });
});

