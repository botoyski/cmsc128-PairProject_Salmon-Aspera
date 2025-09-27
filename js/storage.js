// ---------- INITIAL TASK DATA ----------
let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Load tasks from localStorage or initialize empty array
let deletedTask = null; // Temporary storage for undo functionality
let currentFilter = "all"; // Current priority filter for tasks

// ---------- SAVE TASKS TO LOCAL STORAGE ----------
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // Persist tasks in browser storage
  renderTasks(); // Re-render tasks on the page after saving
}
