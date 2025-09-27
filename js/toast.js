// ---------- SHOW TOAST WITH CUSTOM MESSAGE AND OPTIONAL UNDO ----------
function showToast(message, showUndo = false) {
  const toast = document.getElementById("toast");
  toast.innerHTML = message;

  if (showUndo) {
    const undoBtn = document.createElement("button");
    undoBtn.textContent = "Undo";
    undoBtn.className = "text-blue-400 ml-2";
    undoBtn.addEventListener("click", () => {
      undoDelete();
    });
    toast.appendChild(undoBtn);
  }

  toast.classList.remove("hidden");

  // Automatically hide after 3 seconds if no undo button
  if (!showUndo) {
    setTimeout(hideToast, 3000);
  }
}

// ---------- HIDE TOAST ----------
function hideToast() {
  const toast = document.getElementById("toast");
  toast.classList.add("hidden");
  toast.innerHTML = ""; // Clear message and button
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

// ---------- DELETE TASK WITH UNDO ----------
function deleteTask(id) {
  deletedTask = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  
  // Show delete toast with undo option
  showToast("I can't move it, move it anymore", true);
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
