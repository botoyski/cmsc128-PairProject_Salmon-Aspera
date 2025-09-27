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
function addTask(title, dueDate, dueTime, priority = "low", status = "notStarted") {
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

// Edit Task Function (modal version can be added later)
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

// Mark Task as Completed
function markDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.status = "completed";
    saveTasks();
  }
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
    let priorityColor =
      task.priority === "high" ? "text-red-400" :
      task.priority === "mid" ? "text-yellow-300" :
      "text-green-400"; // low

    let priorityBar =
      task.priority === "high" ? "bg-red-500" :
      task.priority === "mid" ? "bg-yellow-400" :
      "bg-green-500"; // low

    let taskEl = document.createElement("div");
    taskEl.className = "bg-gray-700 p-4 rounded-lg mb-3 flex flex-col gap-2 shadow-md";

    taskEl.innerHTML = `
      <div class="flex items-start gap-3">
        <!-- Priority bar -->
        <span class="w-1.5 rounded-sm ${priorityBar}"></span>

        <!-- Task details -->
        <div class="flex-1">
          <p class="font-bold text-lg text-gray-100">${task.title}</p>
          <p class="text-xs text-gray-400">Date added: ${new Date(task.createdAt).toLocaleString()}</p>
          <p class="text-sm text-gray-300">${task.description || "No description provided"}</p>
          <p class="text-sm mt-1">
            <span class="${priorityColor} font-semibold capitalize">${task.priority}</span> 
            • Due: ${task.dueDate} ${task.dueTime}
          </p>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="flex justify-between items-center mt-2">
        <!-- Status dropdown -->
        <select onchange="updateStatus(${task.id}, this.value)" class="bg-gray-600 text-gray-200 px-2 py-1 rounded-md text-sm">
          <option value="notStarted" ${task.status === "notStarted" ? "selected" : ""}>Not Started</option>
          <option value="inProgress" ${task.status === "inProgress" ? "selected" : ""}>In Progress</option>
          <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
        </select>

        <!-- Edit + Delete buttons -->
        <div class="flex gap-3">
          <button onclick="editTaskPrompt(${task.id})" class="text-yellow-400">✏️</button>
          <button onclick="deleteTask(${task.id})" class="text-red-400">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(taskEl);
  });
}

// Update status when dropdown changes
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

  // Open modal
  addTaskBtn.addEventListener("click", () => {
    addTaskModal.classList.remove("hidden");
  });

  // Close modal
  cancelBtn.addEventListener("click", () => {
    addTaskModal.classList.add("hidden");
  });

  // Save new task
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

  // Undo button
  document.getElementById("undoBtn").addEventListener("click", undoDelete);

  // Initial render
  renderTasks();
});
