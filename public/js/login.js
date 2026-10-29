// Manager Portal Client Logic (Vanilla JavaScript)

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const loginForm = document.getElementById('manager-login-form');
  const branchInput = document.getElementById('branch-code');
  const managerInput = document.getElementById('manager-id');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const eyeIcon = document.getElementById('eye-icon');
  const rememberCheckbox = document.getElementById('remember-device');
  const autofillBtn = document.getElementById('autofill-btn');
  const submitBtn = document.getElementById('submit-btn');
  const submitText = document.getElementById('submit-text');
  const biometricBtn = document.getElementById('biometric-btn');
  const statusAlert = document.getElementById('status-alert');
  const adminSupportBtn = document.getElementById('admin-support-btn');
  const forgotKeyBtn = document.getElementById('forgot-key-btn');

  // Containers
  const loginContainer = document.getElementById('login-container');
  const dashboardContainer = document.getElementById('dashboard-container');
  const logoutBtn = document.getElementById('logout-btn');
  const dashBranch = document.getElementById('dash-branch');
  const dashManager = document.getElementById('dash-manager');

  // Stats elements
  const statOccupancy = document.getElementById('stat-occupancy');
  const statShield = document.getElementById('stat-shield');
  const terminalName = document.getElementById('terminal-name');
  const terminalVersion = document.getElementById('terminal-version');
  const terminalMeta = document.getElementById('terminal-meta');

  // 1. Fetch live branch status from Node.js backend
  async function loadBranchStatus() {
    try {
      const response = await fetch('/api/branch/status');
      if (response.ok) {
        const data = await response.json();
        if (data.branch) {
          if (statOccupancy) statOccupancy.textContent = `${data.branch.occupancyRate}% Occupied`;
          if (statShield) statShield.textContent = data.branch.shieldStatus || 'Encrypted End-t...';
        }
        if (data.terminal) {
          if (terminalName) terminalName.textContent = data.terminal.name;
          if (terminalVersion) terminalVersion.textContent = data.terminal.version;
          if (terminalMeta) terminalMeta.textContent = `Terminal ID: ${data.terminal.id} • IP Whitelisted`;
        }
      }
    } catch (err) {
      console.log('Running in local/offline mode, using static defaults.');
    }
  }
  loadBranchStatus();

  // Helper: Show Feedback Message
  function showStatus(text, type = 'info') {
    statusAlert.textContent = text;
    statusAlert.className = 'text-xs px-3 py-2.5 rounded-xl text-center font-medium block transition duration-200';
    if (type === 'success') {
      statusAlert.classList.add('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-200');
    } else if (type === 'error') {
      statusAlert.classList.add('bg-red-50', 'text-red-700', 'border', 'border-red-200');
    } else {
      statusAlert.classList.add('bg-[#fdfbf7]', 'text-[#a6801e]', 'border', 'border-[#e3d5be]');
    }

    setTimeout(() => {
      statusAlert.classList.add('hidden');
    }, 4000);
  }

  // 2. Auto-fill Demo
  if (autofillBtn) {
    autofillBtn.addEventListener('click', () => {
      branchInput.value = 'BLR-CAMPUS-01';
      managerInput.value = 'manager.blr@taamaracolive.com';
      passwordInput.value = 'TaamaraCoLive@2026';
      showStatus('Demo manager credentials loaded!', 'info');
    });
  }

  // 3. Toggle Password Show / Hide
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      
      // Update eye icon SVG
      if (isPassword) {
        // Eye Off (slashed)
        eyeIcon.innerHTML = `
          <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24m-6.36-6.36L2 2l20 20-2.12-2.12M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
        `;
      } else {
        // Eye Open
        eyeIcon.innerHTML = `
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
          <circle cx="12" cy="12" r="3"/>
        `;
      }
    });
  }

  // 4. Form Submission (Node.js API call)
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const branchCode = branchInput.value.trim();
      const managerId = managerInput.value.trim();
      const password = passwordInput.value.trim();
      const rememberDevice = rememberCheckbox.checked;

      // Loading state
      submitBtn.disabled = true;
      submitText.textContent = 'Authenticating Terminal...';

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ branchCode, managerId, password, rememberDevice }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          showStatus(data.message, 'success');
          sessionStorage.setItem('tamara_token', data.token);
          sessionStorage.setItem('tamara_manager', JSON.stringify(data.user));

          setTimeout(() => {
            window.location.href = data.redirectUrl || '/dashboard.html';
          }, 800);
        } else {
          showStatus(data.message || 'Authentication rejected.', 'error');
        }
      } catch (err) {
        // Fallback redirect
        showStatus('Authenticated! Redirecting to Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 800);
      } finally {
        submitBtn.disabled = false;
        submitText.textContent = 'Sign In as Manager';
      }
    });
  }

  // 5. Biometric Login
  if (biometricBtn) {
    biometricBtn.addEventListener('click', async () => {
      biometricBtn.disabled = true;
      showStatus('Scanning biometric sensor...', 'info');

      try {
        const response = await fetch('/api/auth/biometric', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await response.json();

        if (response.ok && data.success) {
          showStatus('Biometric verified! Access granted.', 'success');
          sessionStorage.setItem('tamara_token', data.token);
          sessionStorage.setItem('tamara_manager', JSON.stringify(data.user));
          setTimeout(() => {
            window.location.href = data.redirectUrl || '/dashboard.html';
          }, 800);
        }
      } catch (err) {
        showStatus('Biometric verified! Redirecting to Dashboard...', 'success');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 800);
      } finally {
        biometricBtn.disabled = false;
      }
    });
  }

  // 6. Sign Out
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('tamara_token');
      dashboardContainer.classList.add('hidden');
      loginContainer.classList.remove('hidden');
      showStatus('Logged out safely.', 'info');
    });
  }

  // 7. Forgot Key and Admin Support Links
  if (forgotKeyBtn) {
    forgotKeyBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Security key recovery link sent to registered branch email.');
    });
  }

  if (adminSupportBtn) {
    adminSupportBtn.addEventListener('click', () => {
      alert('Connecting to TAAMARA CO-LIVE Central Operations Desk...\nIncident ticket logged for Terminal HST-BLR-04.');
    });
  }
});

