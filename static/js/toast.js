let toastTimeout;

// ---------- SHOW TOAST ----------
function showToast(message, showUndo = false) {
  const toast = document.getElementById("toast");

  clearTimeout(toastTimeout);
  toast.innerHTML = "";

  const msgEl = document.createElement("span");
  msgEl.textContent = message;
  toast.appendChild(msgEl);

  if (showUndo) {
    const undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    undoBtn.className = "text-blue-400 ml-2";
    undoBtn.addEventListener("click", undoDelete);
    toast.appendChild(undoBtn);
  }

  toast.classList.remove("hidden");

  toastTimeout = setTimeout(() => {
    hideToast();
  }, showUndo ? 5000 : 3000);
}

// ---------- HIDE TOAST ----------
function hideToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("hidden");
  toast.innerHTML = "";
  clearTimeout(toastTimeout);
}