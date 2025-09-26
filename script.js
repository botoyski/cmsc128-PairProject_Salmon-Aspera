let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTask = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

function addTask(title, dueDate, dueTime, priority="low", status="notStarted") {
  const task = {
    id: Date.now(),
    title,
    dueDate,
    dueTime,
    priority,
    status,
    createdAt: new Date().toISOString()
  };
  tasks.push(task);
  saveTasks();
}

function editTask(id, newTitle, newDueDate, newDueTime, newPriority) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.title = newTitle;
    task.dueDate = newDueDate;
    task.dueTime = newDueTime;
    task.priority = newPriority;
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

function markDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = "completed";
    saveTasks();
  }
}

function renderTasks() {
  document.getElementById("notStartedList").innerHTML = "";
  document.getElementById("inProgressList").innerHTML = "";
  document.getElementById("completedList").innerHTML = "";
  document.getElementById("deadlineList").innerHTML = "";

  let total = tasks.length;
  let notStarted = tasks.filter(t => t.status === "notStarted").length;
  let inProgress = tasks.filter(t => t.status === "inProgress").length;
  let completed = tasks.filter(t => t.status === "completed").length;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("notStartedTasks").textContent = notStarted;
  document.getElementById("inProgressTasks").textContent = inProgress;
  document.getElementById("completedTasks").textContent = completed;

  tasks.forEach(task => {
    let containerId = task.status === "notStarted" ? "notStartedList" :
                     task.status === "inProgress" ? "inProgressList" : "completedList";
    let container = document.getElementById(containerId);

    let taskEl = document.createElement("div");
    taskEl.className = "bg-gray-700 p-3 rounded-lg mb-2 flex justify-between items-center";
    taskEl.innerHTML = `
      <div>
        <p class="font-bold">${task.title}</p>
        <p class="text-xs text-gray-400">${task.dueDate} ${task.dueTime}</p>
      </div>
      <div class="flex gap-2">
        <button onclick="markDone(${task.id})" class="text-green-400">✔</button>
        <button onclick="deleteTask(${task.id})" class="text-red-400">🗑</button>
      </div>
    `;
    container.appendChild(taskEl);
  });
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(hideToast, 5000);
}

function hideToast() {
  document.getElementById("toast").classList.add("hidden");
}

document.getElementById("undoBtn").addEventListener("click", undoDelete);
document.getElementById("addTaskBtn").addEventListener("click", () => {
  let title = prompt("Task title:");
  let dueDate = prompt("Due date (YYYY-MM-DD):");
  let dueTime = prompt("Due time (HH:MM):");
  let priority = prompt("Priority (high/mid/low):", "low");
  if (title) addTask(title, dueDate, dueTime, priority);
});

renderTasks();
