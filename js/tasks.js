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
}

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

function deleteTask(id) {
  deletedTask = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  showToast();
}

function undoDelete() {
  if (deletedTask) {
    tasks.push(deletedTask);
    deletedTask = null;
    saveTasks();
  }
  hideToast();
}

function updateStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
}
