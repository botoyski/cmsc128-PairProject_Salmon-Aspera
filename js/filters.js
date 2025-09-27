document.querySelectorAll(".priority-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".priority-btn").forEach(b => 
      b.classList.remove("active", "ring-2", "ring-offset-2", "ring-white")
    );
    btn.classList.add("active", "ring-2", "ring-offset-2", "ring-white");

    currentFilter = btn.getAttribute("data-priority");
    renderTasks();
  });
});
