function renderTasks() {
  // ---------- CLEAR EXISTING TASK LISTS ----------
  document.getElementById("notStartedList").innerHTML = "";
  document.getElementById("inProgressList").innerHTML = "";
  document.getElementById("completedList").innerHTML = "";

  // ---------- FILTER TASKS BY PRIORITY AND SEARCH ----------
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = currentFilter === "all" || task.priority === currentFilter;
    const matchesSearch = !currentSearch || task.title.toLowerCase().includes(currentSearch) ||
      (task.description && task.description.toLowerCase().includes(currentSearch));
    return matchesFilter && matchesSearch;
  });

  // ---------- CALCULATE TASK STATS ----------
  const total = filteredTasks.length;
  const notStarted = filteredTasks.filter(t => t.status === "notStarted").length;
  const inProgress = filteredTasks.filter(t => t.status === "inProgress").length;
  const completed = filteredTasks.filter(t => t.status === "completed").length;

  document.getElementById("totalTasks").textContent = total;
  document.getElementById("notStartedTasks").textContent = notStarted;
  document.getElementById("inProgressTasks").textContent = inProgress;
  document.getElementById("completedTasks").textContent = completed;

  // ---------- RENDER FILTERED TASKS ----------
  filteredTasks.forEach(task => {
    let containerId =
      task.status === "notStarted" ? "notStartedList" :
      task.status === "inProgress" ? "inProgressList" : "completedList";
    let container = document.getElementById(containerId);

    // Priority styles
    let priorityBar =
      task.priority === "high" ? "bg-red-500" :
      task.priority === "mid" ? "bg-yellow-500" :
      "bg-green-500";

    let priorityBadge =
      task.priority === "high" ? "bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold" :
      task.priority === "mid" ? "bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold" :
      "bg-green-600 text-white px-2 py-1 rounded-md text-xs font-semibold";

    let dueText = (task.dueDate || task.dueTime)
      ? `Due: ${task.dueDate || ""} ${task.dueTime || ""}`
      : "No deadline";

    // Create task element
    let taskEl = document.createElement("div");
    taskEl.className = "bg-gray-600 text-gray-900 rounded-lg mb-3 flex shadow-md overflow-hidden";

    taskEl.innerHTML = `
      <div class="w-2 ${priorityBar}"></div>
      <div class="flex-1 p-4 flex flex-col">
        <div class="flex justify-between items-start">
          <div>
            <p class="font-bold text-lg text-gray-100 m-0 leading-none">${task.title}</p>
            <p class="text-xs text-gray-400 m-0 leading-none">Date added: ${new Date(task.createdAt).toLocaleString()}</p>
            <p id="desc-${task.id}" class="text-sm text-gray-300 whitespace-pre-line break-words leading-snug max-h-16 overflow-hidden transition-all duration-300 ease-in-out m-0">
              ${task.description || "No description provided"}
            </p>
            <button id="toggleBtn-${task.id}" onclick="toggleDescription(${task.id})" class="hidden text-blue-400 text-xs mt-1">Read more</button>
            <p class="text-sm mt-1 flex items-center gap-2 m-0">
              <span class="${priorityBadge} capitalize">${task.priority}</span>
              <span class="text-gray-400">• ${dueText}</span>
            </p>
          </div>
          <select onchange="updateStatus(${task.id}, this.value)" class="bg-gray-800 text-gray-200 px-2 py-1 rounded-md text-sm ml-4">
            <option value="notStarted" ${task.status === "notStarted" ? "selected" : ""}>Not Started</option>
            <option value="inProgress" ${task.status === "inProgress" ? "selected" : ""}>In Progress</option>
            <option value="completed" ${task.status === "completed" ? "selected" : ""}>Completed</option>
          </select>
        </div>
        <div class="flex justify-end items-center mt-2 gap-3">
          <button onclick="editTaskPrompt(${task.id})" class="text-yellow-400">✏️</button>
          <button class="delete-btn text-red-400" data-id="${task.id}">🗑</button>
        </div>
      </div>
    `;

    container.appendChild(taskEl);

    // Attach delete listener
    taskEl.querySelector(".delete-btn").addEventListener("click", () => {
      deleteTask(task.id);
    });

    // Show toggle button if description is long
    const descEl = document.getElementById(`desc-${task.id}`);
    const toggleBtn = document.getElementById(`toggleBtn-${task.id}`);
    if (descEl.scrollHeight > descEl.clientHeight + 5) toggleBtn.classList.remove("hidden");
  });

  // ---------- EMPTY STATE MESSAGE ----------
  const noTasksMsg = document.getElementById("noTasksMessage");
  if (noTasksMsg) {
    if (!filteredTasks || filteredTasks.length === 0) {
      noTasksMsg.classList.remove("hidden");
    } else {
      noTasksMsg.classList.add("hidden");
    }
  }
}
