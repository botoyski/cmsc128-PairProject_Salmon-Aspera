document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();

      // Clear current user session
      localStorage.removeItem("currentUser");

      // Optional confirmation and redirect
      alert("You have been logged out.");
      window.location.href = "login.html";
    });
  }
});
