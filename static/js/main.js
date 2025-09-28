document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("undoBtn").addEventListener("click", undoDelete);
  loadTasks(); // Load tasks from backend API instead of localStorage
});
