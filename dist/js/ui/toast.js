function showToast(message) { const toast = document.getElementById("toast"); if (!toast) return; toast.textContent = message; toast.hidden = false; clearTimeout(showToast.timer); showToast.timer = setTimeout(() => { toast.hidden = true; }, 3200); }
window.showToast = showToast;
