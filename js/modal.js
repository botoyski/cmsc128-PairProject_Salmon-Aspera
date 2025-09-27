document.addEventListener("DOMContentLoaded", () => {
  // ---------- ELEMENTS ----------
  // Cache all relevant DOM elements for modal functionality
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
  // Handles opening the modal in "Add Task" mode
  addTaskBtn.addEventListener("click", () => {
    modalTitle.textContent = "Add Task";
    resetModal();
    addTaskModal.classList.remove("hidden");
  });

  // ---------- CANCEL BUTTON ----------
  // Handles closing the modal and resetting its contents
  cancelBtn.addEventListener("click", () => {
    addTaskModal.classList.add("hidden");
    resetModal();
  });

  // ---------- SUBMIT BUTTON ----------
  // Handles form submission for adding or editing a task
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

    // ---------- VALIDATION ----------
    if (!title) {
      taskTitleError.textContent = "Please enter a task name.";
      taskTitleInput.focus();
      return;
    }

    // ---------- ADD OR EDIT TASK ----------
    if (id) {
      // Edit existing task
      editTask(Number(id), title, dueDate, dueTime, priority, description);
    } else {
      // Add new task
      addTask(title, dueDate, dueTime, priority, "notStarted", description);
    }

    addTaskModal.classList.add("hidden");
    resetModal();
  });

  // ---------- RESET MODAL ----------
  // Clears all input fields and error messages
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
/*
  Populates and opens the modal for editing an existing task.
  Sets the modal title to "Edit Task" and fills all fields with task data.
*/
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

let confirmCallback = null;

function showConfirm(message, onConfirm) {
  const modal = document.getElementById("confirmModal");
  const msgEl = document.getElementById("confirmMessage");

  msgEl.textContent = message;
  confirmCallback = onConfirm;

  modal.classList.remove("hidden");
}

function hideConfirm() {
  document.getElementById("confirmModal").classList.add("hidden");
  confirmCallback = null;
}

// Cancel button
document.getElementById("confirmCancelBtn").addEventListener("click", () => {
  hideConfirm();
});

// Confirm (OK) button
document.getElementById("confirmOkBtn").addEventListener("click", () => {
  if (confirmCallback) confirmCallback(); // call the delete function
  hideConfirm();
});
