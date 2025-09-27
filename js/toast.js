function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(hideToast, 5000);
}
function hideToast() {
  document.getElementById("toast").classList.add("hidden");
}
