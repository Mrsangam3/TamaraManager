// TAAMARA CO-LIVE — Quick Action Center Interactivity
document.addEventListener('DOMContentLoaded', () => {
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
    }, 2800);
  }

  // Bell Notification
  const btnBell = document.getElementById('btn-bell');
  if (btnBell) {
    btnBell.addEventListener('click', () => {
      showToast('🔔 Fast Dispatch: 2 urgent tasks and 6 vacant beds ready for assignment.');
    });
  }

  // Action Items Feedback
  document.querySelectorAll('.action-item').forEach(card => {
    card.addEventListener('click', (e) => {
      const heading = card.querySelector('h3')?.textContent || 'Action';
      showToast(`⚡ Launching ${heading}...`);
    });
  });
});

