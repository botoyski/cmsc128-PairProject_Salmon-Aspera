let toastTimeout; // Track timeout to clear if a new toast appears

// ---------- SHOW TOAST WITH CUSTOM MESSAGE AND OPTIONAL UNDO ----------
function showToast(message, showUndo = false) {
  const toast = document.getElementById("toast");

  // Clear previous timeout and content
  clearTimeout(toastTimeout);
  toast.innerHTML = "";

  // Add message
  const msgEl = document.createElement("span");
  msgEl.textContent = message;
  toast.appendChild(msgEl);

  // Optional Undo button
  if (showUndo) {
    const undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    undoBtn.className = "text-blue-400 ml-2";
    undoBtn.addEventListener("click", undoDelete);
    toast.appendChild(undoBtn);
  }

  // Show toast
  toast.classList.remove("hidden");

  // Automatically hide after 3 seconds if no undo, else 5 seconds
  const hideTime = showUndo ? 5000 : 3000;
  toastTimeout = setTimeout(() => {
    hideToast();
  }, hideTime);
}

// ---------- HIDE TOAST ----------
function hideToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("hidden");
  toast.innerHTML = ""; // Clear message and button
  clearTimeout(toastTimeout);
}

// ---------- ADD TASK ----------
function addTask(title, dueDate, dueTime, priority = "low", status = "notStarted", description = "") {
  const task = {
    id: Date.now(),
    title,
    dueDate,
    dueTime,
    priority,
    status,
    description,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  saveTasks();

  showToast("Task Added, let's move it, move it!"); // Success toast
}

// ---------- UNDO DELETE ----------
function undoDelete() {
  if (deletedTask) {
    tasks.push(deletedTask);
    deletedTask = null;
    saveTasks();
  }
  hideToast();
}
