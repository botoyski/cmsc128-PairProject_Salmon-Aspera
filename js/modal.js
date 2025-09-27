document.addEventListener("DOMContentLoaded", () => {
  // ---------- ELEMENTS ----------
  const addTaskBtn = document.getElementById("addTaskBtn");
  const addTaskModal = document.getElementById("addTaskModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitTaskBtn = document.getElementById("submitTaskBtn");

  const modalTitle = document.getElementById("modalTitle");
  const taskIdInput = document.getElementById("taskId");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskPriorityInput = document.getElementById("taskPriority");
  const taskDueDateInput = document.getElementById("taskDueDate");
  const taskDueTimeInput = document.getElementById("taskDueTime");
  const taskTitleError = document.getElementById("taskTitleError");

  // ---------- OPEN MODAL FOR ADD ----------
  addTaskBtn.addEventListener("click", () => {
    modalTitle.textContent = "Add Task";
    resetModal();
    addTaskModal.classList.remove("hidden");
  });

  // ---------- CANCEL BUTTON ----------
  cancelBtn.addEventListener("click", () => {
    addTaskModal.classList.add("hidden");
    resetModal();
  });

  // ---------- SUBMIT BUTTON ----------
  submitTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const id = taskIdInput.value;
    const title = (taskTitleInput.value || "").trim();
    const description = (taskDescriptionInput.value || "").trim();
    const priority = taskPriorityInput.value;
    const dueDate = taskDueDateInput.value;
    const dueTime = taskDueTimeInput.value;

    // Clear previous error
    taskTitleError.textContent = "";

    // Validation
    if (!title) {
      taskTitleError.textContent = "Please enter a task name.";
      taskTitleInput.focus();
      return;
    }

    if (id) {
      // EDIT TASK
      editTask(Number(id), title, dueDate, dueTime, priority, description);
    } else {
      // ADD TASK
      addTask(title, dueDate, dueTime, priority, "notStarted", description);
    }

    addTaskModal.classList.add("hidden");
    resetModal();
  });

  // ---------- RESET MODAL ----------
  function resetModal() {
    taskIdInput.value = "";
    taskTitleInput.value = "";
    taskDescriptionInput.value = "";
    taskPriorityInput.value = "low";
    taskDueDateInput.value = "";
    taskDueTimeInput.value = "";
    taskTitleError.textContent = "";
  }
});

// ---------- OPEN MODAL FOR EDIT ----------
function editTaskPrompt(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  const addTaskModal = document.getElementById("addTaskModal");
  const modalTitle = document.getElementById("modalTitle");
  const taskIdInput = document.getElementById("taskId");
  const taskTitleInput = document.getElementById("taskTitle");
  const taskDescriptionInput = document.getElementById("taskDescription");
  const taskPriorityInput = document.getElementById("taskPriority");
  const taskDueDateInput = document.getElementById("taskDueDate");
  const taskDueTimeInput = document.getElementById("taskDueTime");
  const taskTitleError = document.getElementById("taskTitleError");

  modalTitle.textContent = "Edit Task";

  taskIdInput.value = task.id;
  taskTitleInput.value = task.title || "";
  taskDescriptionInput.value = task.description || "";
  taskPriorityInput.value = task.priority || "low";
  taskDueDateInput.value = task.dueDate || "";
  taskDueTimeInput.value = task.dueTime || "";
  taskTitleError.textContent = "";

  addTaskModal.classList.remove("hidden");
}
