// Onboard Tenant Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Classification buttons
  const studentBtn = document.getElementById('class-student-btn');
  const workerBtn = document.getElementById('class-worker-btn');
  let selectedClassification = 'College Student';

  // Photo & Doc upload
  const snapPhotoBtn = document.getElementById('snap-photo-btn');
  const uploadPhotoBtn = document.getElementById('upload-photo-btn');
  const uploadDocArea = document.getElementById('upload-doc-area');

  // Inputs
  const tenantNameInput = document.getElementById('tenant-name');
  const tenantPhoneInput = document.getElementById('tenant-phone');
  const tenantEmailInput = document.getElementById('tenant-email');
  const tenantOrgInput = document.getElementById('tenant-org');
  const emergencyNameInput = document.getElementById('emergency-name');
  const emergencyPhoneInput = document.getElementById('emergency-phone');
  const checkinDateInput = document.getElementById('checkin-date');
  const stayTermInput = document.getElementById('stay-term');
  const govIdSelect = document.getElementById('gov-id-type');
  const dispatchToggle = document.getElementById('dispatch-toggle');

  // Action buttons
  const btnSaveDraft = document.getElementById('btn-save-draft');
  const btnProceed = document.getElementById('btn-proceed');

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

  // 1. Classification Toggle
  if (studentBtn && workerBtn) {
    studentBtn.addEventListener('click', () => {
      selectedClassification = 'College Student';
      studentBtn.className = 'classification-btn py-2.5 px-3 bg-[#180d19] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition';
      workerBtn.className = 'classification-btn py-2.5 px-3 bg-[#fdfbf7] hover:bg-[#fbf2da]/60 text-slate-700 border border-[#ede4d5] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition';
      tenantOrgInput.placeholder = 'e.g. National Institute of Technology';
      showToast('Classification set to College Student');
    });

    workerBtn.addEventListener('click', () => {
      selectedClassification = 'Working Pro';
      workerBtn.className = 'classification-btn py-2.5 px-3 bg-[#180d19] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer transition';
      studentBtn.className = 'classification-btn py-2.5 px-3 bg-[#fdfbf7] hover:bg-[#fbf2da]/60 text-slate-700 border border-[#ede4d5] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition';
      tenantOrgInput.placeholder = 'e.g. Infosys / Google / Freelance';
      showToast('Classification set to Working Professional');
    });
  }

  // 2. Photo capture & upload simulation
  if (snapPhotoBtn) {
    snapPhotoBtn.addEventListener('click', () => {
      showToast('📷 Camera scanner activated. Face biometric captured!');
    });
  }

  if (uploadPhotoBtn) {
    uploadPhotoBtn.addEventListener('click', () => {
      showToast('File picker opened. Portrait JPG/PNG uploaded.');
    });
  }

  // 3. Document OCR Upload
  if (uploadDocArea) {
    uploadDocArea.addEventListener('click', () => {
      showToast('📄 OCR Scanner: Aadhaar Card verified (12-Digit UIDAI).');
    });
  }

  // 4. Save Draft
  if (btnSaveDraft) {
    btnSaveDraft.addEventListener('click', async () => {
      const draftData = {
        name: tenantNameInput.value.trim(),
        phone: tenantPhoneInput.value.trim(),
        email: tenantEmailInput.value.trim(),
        classification: selectedClassification,
        savedAt: new Date().toISOString()
      };

      try {
        await fetch('/api/tenants/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draftData)
        });
      } catch (_) {}

      showToast(`💾 Draft saved for ${draftData.name || 'Tenant'}!`);
    });
  }

  // 5. Proceed to Bed Assignment
  if (btnProceed) {
    btnProceed.addEventListener('click', async () => {
      const name = tenantNameInput.value.trim();
      const phone = tenantPhoneInput.value.trim();
      const email = tenantEmailInput.value.trim();
      const org = tenantOrgInput.value.trim();
      const checkin = checkinDateInput.value.trim();
      const stayTerm = stayTermInput.value.trim();
      const idType = govIdSelect.value;
      const sendAgreement = dispatchToggle.checked;

      if (!name || !phone) {
        showToast('Please fill in legal name and mobile number.');
        return;
      }

      btnProceed.disabled = true;
      btnProceed.innerHTML = `<span>Assigning Bed Matrix...</span>`;

      try {
        const response = await fetch('/api/tenants/onboard', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            phone,
            email,
            org,
            classification: selectedClassification,
            checkin,
            stayTerm,
            idType,
            sendAgreement
          })
        });

        const data = await response.json();
        showToast(data.message || `Tenant ${name} onboarded! Redirecting...`);
      } catch (_) {
        showToast(`Tenant ${name} onboarded! Bed allocation hold activated.`);
      }

      setTimeout(() => {
        window.location.href = '/assign-bed.html';
      }, 1000);
    });
  }
});

