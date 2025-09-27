// ---------- ADD TASK ----------
// Creates a new task object and adds it to the tasks array, then saves to localStorage
function addTask(title, dueDate, dueTime, priority = "low", status = "notStarted", description = "") {
  const task = {
    id: Date.now(),              // Unique ID based on timestamp
    title,
    dueDate,
    dueTime,
    priority,
    status,
    description,
    createdAt: new Date().toISOString() // Track when task was created
  };
  tasks.push(task);
  saveTasks(); // Persist changes and re-render
}

// ---------- EDIT TASK ----------
// Finds a task by ID and updates its properties, then saves
function editTask(id, newTitle, newDueDate, newDueTime, newPriority, newDescription) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.title = newTitle;
    task.dueDate = newDueDate;
    task.dueTime = newDueTime;
    task.priority = newPriority;
    task.description = newDescription;
    saveTasks();
  }
}

// ---------- DELETE TASK ----------
// Removes a task from the array and stores it temporarily for undo functionality
function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // ---------- SHOW CUSTOM CONFIRM MODAL ----------
  showConfirm(`Are you sure you want to delete "${task.title}"?`, () => {
    // This runs if user clicks Delete
    deletedTask = task;
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();

    // Show undo toast
    showToast("I can't move it, move it anymore!", true);
  });
}



// ---------- UNDO DELETE ----------
// Restores the last deleted task, if available
function undoDelete() {
  if (deletedTask) {
    tasks.push(deletedTask);
    deletedTask = null;
    saveTasks();
  }
  hideToast(); // Hide the undo notification
}

// ---------- UPDATE TASK STATUS ----------
// Changes the status of a task (notStarted, inProgress, completed) and saves
function updateStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
}
