// ======================================================================
// File: static/js/logout.js
// ----------------------------------------------------------------------
// Description:
// Logs the user out by POSTing to Flask backend /logout.
// Clears session on server and redirects to login page.
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();

      try {
        const response = await fetch("/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        const data = await response.json();

        if (data.success) {
          alert(data.message);
          if (data.redirect) {
            window.location.href = data.redirect;
          }
        } else {
          alert("⚠️ Logout failed. Try again.");
        }
      } catch (err) {
        console.error("Logout error:", err);
        alert("❌ Server error. Please try again later.");
      }
    });
  }
});
