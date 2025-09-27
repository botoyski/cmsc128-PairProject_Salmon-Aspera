// js/search.js

const searchInput = document.getElementById("searchInput");

// Listen for input changes
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  renderTasksFiltered(query);
});

// Function to render tasks filtered by search query
function renderTasksFiltered(query) {
  // Filter tasks by title or description
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(query) ||
    (task.description && task.description.toLowerCase().includes(query))
  );

  // Clear all lists first
  document.getElementById("notStartedList").innerHTML = "";
  document.getElementById("inProgressList").innerHTML = "";
  document.getElementById("completedList").innerHTML = "";
  document.getElementById("deadlineList").innerHTML = "";

  // Update stats
  const filteredByCurrent = filteredTasks.filter(task => currentFilter === "all" || task.priority === currentFilter);

  document.getElementById("totalTasks").textContent = filteredByCurrent.length;
  document.getElementById("notStartedTasks").textContent = filteredByCurrent.filter(t => t.status === "notStarted").length;
  document.getElementById("inProgressTasks").textContent = filteredByCurrent.filter(t => t.status === "inProgress").length;
  document.getElementById("completedTasks").textContent = filteredByCurrent.filter(t => t.status === "completed").length;

  // Render filtered tasks
  filteredByCurrent.forEach(task => {
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
      "bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold";

    let dueText = (task.dueDate || task.dueTime)
      ? `Due: ${task.dueDate || ""} ${task.dueTime || ""}`
      : "No deadline";

    let taskEl = document.createElement("div");
    taskEl.className = "bg-gray-600 text-gray-900 rounded-lg mb-3 flex shadow-md overflow-hidden";

    taskEl.innerHTML = `
      <div class="w-2 ${priorityBar}"></div>
      <div class="flex-1 p-4 flex flex-col gap-2">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-bold text-lg text-gray-100">${task.title}</p>
            <p class="text-xs text-gray-400">Date added: ${new Date(task.createdAt).toLocaleString()}</p>
            <p class="text-sm text-gray-300 whitespace-pre-line break-words">
              ${task.description || "No description provided"}
            </p>
            <p class="text-sm mt-1 flex items-center gap-2">
              <span class="${priorityBadge} capitalize">${task.priority}</span>
              <span class="text-gray-400">• ${dueText}</span>
            </p>
          </div>
          <select onchange="updateStatus(${task.id}, this.value)" 
            class="bg-gray-800 text-gray-200 px-2 py-1 rounded-md text-sm ml-4">
            <option value="notStarted" ${task.status === "notStarted" ? "selected" : ""}>Not Started</option>
            <option value="inProgress" ${task.status === "inProgress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
        </div>
        <div class="flex justify-end items-center mt-2 gap-3">
          <button onclick="editTaskPrompt(${task.id})" class="text-yellow-400">✏️</button>
          <button onclick="deleteTask(${task.id})" class="text-red-400">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(taskEl);
  });
}
