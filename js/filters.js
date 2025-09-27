// Select all buttons with the class "priority-btn" (All, High, Mid, Low)
document.querySelectorAll(".priority-btn").forEach(btn => {

  // Add a click event listener to each priority button
  btn.addEventListener("click", () => {

    // When any button is clicked, remove the "active" styling from all buttons
    // This ensures only the clicked button is highlighted
    document.querySelectorAll(".priority-btn").forEach(b => 
      b.classList.remove(
        "active",        // Custom class indicating active filter
        "ring-2",        // Tailwind class for 2px ring around button
        "ring-offset-2", // Tailwind class for ring offset
        "ring-white"     // Tailwind class to set ring color
      )
    );

    // Add active styling to the clicked button
    btn.classList.add(
      "active",
      "ring-2",
      "ring-offset-2",
      "ring-white"
    );

    // Update the current filter value to match the clicked button's data-priority attribute
    // Example: "all", "high", "mid", "low"
    currentFilter = btn.getAttribute("data-priority");

    // Re-render the tasks based on the updated filter
    // This function will show only tasks matching the selected priority
    renderTasks();
  });
});
