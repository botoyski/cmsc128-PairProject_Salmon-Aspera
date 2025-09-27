let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTask = null;
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}
