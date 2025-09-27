let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let deletedTask = null;

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
}

// ---------------------------
// TASK FUNCTIONS
// ---------------------------

// Add Task Function
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

// Edit Task Function
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

// Delete Task
function deleteTask(id) {
  deletedTask = tasks.find(t => t.id === id);
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  showToast();
}

// Undo Delete
function undoDelete() {
  if (deletedTask) {
    tasks.push(deletedTask);
    deletedTask = null;
    saveTasks();
  }
  hideToast();
}
// ---------------------------
// RENDER TASKS
// ---------------------------
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
    let containerId =
      task.status === "notStarted" ? "notStartedList" :
      task.status === "inProgress" ? "inProgressList" : "completedList";
    let container = document.getElementById(containerId);

    // Priority styles
    let priorityBar =
      task.priority === "high" ? "bg-red-500" :
      task.priority === "mid" ? "bg-yellow-500" :
      "bg-green-500"; // low

    let priorityBadge =
      task.priority === "high" ? "bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold" :
      task.priority === "mid" ? "bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold" :
      "bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold"; // low

    // Fallback if no due date/time
    let dueText = (task.dueDate || task.dueTime) 
      ? `Due: ${task.dueDate || ""} ${task.dueTime || ""}` 
      : "No deadline";

    let taskEl = document.createElement("div");
    taskEl.className = "bg-gray-600 text-gray-900 rounded-lg mb-3 flex shadow-md overflow-hidden";

    taskEl.innerHTML = `
      <!-- Priority bar full height -->
      <div class="w-2 ${priorityBar}"></div>

      <!-- Content -->
      <div class="flex-1 p-4 flex flex-col gap-2">
        <!-- Title + Dropdown -->
        <div class="flex justify-between items-start">
          <div>
            <p class="font-bold text-lg text-gray-100">${task.title}</p>
            <p class="text-xs text-gray-400">Date added: ${new Date(task.createdAt).toLocaleString()}</p>
            <p class="text-sm text-gray-300">${task.description || "No description provided"}</p>
            <p class="text-sm mt-1 flex items-center gap-2">
              <span class="${priorityBadge} capitalize">${task.priority}</span>
              <span class="text-gray-400">• ${dueText}</span>
            </p>
          </div>

          <!-- Dropdown moved here -->
          <select onchange="updateStatus(${task.id}, this.value)" 
            class="bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-sm ml-4">
            <option value="notStarted" ${task.status === "notStarted" ? "selected" : ""}>Not Started</option>
            <option value="inProgress" ${task.status === "inProgress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
        </div>

        <!-- Footer actions -->
        <div class="flex justify-end items-center mt-2 gap-3">
          <button onclick="editTaskPrompt(${task.id})" class="text-yellow-400">✏️</button>
          <button onclick="deleteTask(${task.id})" class="text-red-400">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(taskEl);
  });
}


// Update status
function updateStatus(id, newStatus) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = newStatus;
    saveTasks();
  }
}

// ---------------------------
// TOAST
// ---------------------------
function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(hideToast, 5000);
}
function hideToast() {
  document.getElementById("toast").classList.add("hidden");
}

// ---------------------------
// MODAL LOGIC
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const addTaskModal = document.getElementById("addTaskModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const submitTaskBtn = document.getElementById("submitTaskBtn");

  addTaskBtn.addEventListener("click", () => {
    addTaskModal.classList.remove("hidden");
  });
  cancelBtn.addEventListener("click", () => {
    addTaskModal.classList.add("hidden");
  });

  submitTaskBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const title = document.getElementById("taskTitle").value.trim();
    const priority = document.getElementById("taskPriority").value;
    const dueDate = document.getElementById("taskDueDate").value;
    const dueTime = document.getElementById("taskDueTime").value;

    if (!title) {
      alert("Please enter a task name.");
      return;
    }

    addTask(title, dueDate, dueTime, priority);

    // Reset form
    document.getElementById("taskTitle").value = "";
    document.getElementById("taskPriority").value = "low";
    document.getElementById("taskDueDate").value = "";
    document.getElementById("taskDueTime").value = "";

    addTaskModal.classList.add("hidden");
  });

  document.getElementById("undoBtn").addEventListener("click", undoDelete);

  renderTasks();
});
