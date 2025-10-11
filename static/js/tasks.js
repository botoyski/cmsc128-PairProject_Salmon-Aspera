// ---------- ADD TASK ----------
async function addTask(title, dueDate, dueTime, priority = "low", status = "notStarted", description = "") {
  try {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, dueDate, dueTime, priority, status, description })
    });
    const newTask = await res.json();
    tasks.push(newTask);
    renderTasks();
    showToast("Task Added, let's move it, move it!");
  } catch (err) {
    console.error("Error adding task:", err);
  }
}

// ---------- EDIT TASK ----------
async function editTask(id, newTitle, newDueDate, newDueTime, newPriority, newDescription) {
  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        dueDate: newDueDate,
        dueTime: newDueTime,
        priority: newPriority,
        description: newDescription
      })
    });
    const updatedTask = await res.json();
    tasks = tasks.map(t => (t.id === id ? updatedTask : t));
    renderTasks();
  } catch (err) {
    console.error("Error editing task:", err);
  }
}

// ---------- DELETE TASK ----------
function deleteTask(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  showConfirm(`Are you sure you want to delete "${task.title}"?`, async () => {
    try {
      await fetch(`/api/tasks/${id}`, { method: "DELETE" });
      deletedTask = task;
      tasks = tasks.filter(t => t.id !== id);
      renderTasks();
      showToast("I can't move it, move it anymore!", true);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  });
}

// ---------- UNDO DELETE ----------
async function undoDelete() {
  if (deletedTask) {
    await addTask(
      deletedTask.title,
      deletedTask.dueDate,
      deletedTask.dueTime,
      deletedTask.priority,
      deletedTask.status,
      deletedTask.description
    );
    deletedTask = null;
  }
  hideToast();
}

// ---------- UPDATE TASK STATUS ----------
async function updateStatus(id, newStatus) {
  try {
    const res = await fetch(`/api/tasks/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    const updatedTask = await res.json();
    tasks = tasks.map(t => (t.id === id ? updatedTask : t));
    renderTasks();
  } catch (err) {
    console.error("Error updating status:", err);
  }
}