document.addEventListener("DOMContentLoaded", async () => {
  const undoBtn = document.getElementById("undoBtn");
  if (undoBtn) {
    undoBtn.addEventListener("click", undoDelete);
  }

  try {
    // Check if user is logged in
    const res = await fetch("/api/check-session");
    const data = await res.json();

    if (!data.logged_in) {
      window.location.href = "/"; // Go back to login if session expired
      return;
    }

    // ✅ Set header username if available
    const headerUser = document.getElementById("headerUsername");
    if (headerUser && data.username) {
      headerUser.textContent = data.username;
    }

    // ✅ If logged in, load tasks
    loadTasks();
  } catch (err) {
    console.error("Session check failed:", err);
    window.location.href = "/";
  }
});
