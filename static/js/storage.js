// ---------- GLOBAL STATE ----------
let tasks = [];          // All tasks from backend
let deletedTask = null;  // Temporary storage for undo
let currentFilter = "all"; // Priority filter

// ---------- LOAD TASKS FROM BACKEND ----------
async function loadTasks() {
  try {
    const res = await fetch("/api/tasks");
    tasks = await res.json();
    renderTasks();
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// ---------- SAVE TASKS ----------
function saveTasks() {
  // Backend handles saving, just re-render
  renderTasks();
}
