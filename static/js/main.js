document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("undoBtn").addEventListener("click", undoDelete);

  try {
    // Check if user is logged in
    const res = await fetch("/api/check-session");
    const data = await res.json();

    if (!data.logged_in) {
      window.location.href = "/"; // Go back to login if session expired
      return;
    }

    // ✅ If logged in, load tasks
    loadTasks();
  } catch (err) {
    console.error("Session check failed:", err);
    window.location.href = "/";
  }
});
