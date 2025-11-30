// ======================================================================
// File: static/js/logout.js
// ----------------------------------------------------------------------
// Description:
// Logs the user out by POSTing to Flask backend /logout.
// Shows confirmation modal before logging out.
// Clears session on server and redirects to login page.
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  const logoutModal = document.getElementById("logoutModal");
  const logoutCancelBtn = document.getElementById("logoutCancelBtn");
  const logoutConfirmBtn = document.getElementById("logoutConfirmBtn");

  if (logoutBtn && logoutModal) {
    // Show confirmation modal when logout button is clicked
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutModal.classList.remove("hidden");
    });

    // Cancel logout - hide modal
    if (logoutCancelBtn) {
      logoutCancelBtn.addEventListener("click", () => {
        logoutModal.classList.add("hidden");
      });
    }

    // Confirm logout - proceed with logout
    if (logoutConfirmBtn) {
      logoutConfirmBtn.addEventListener("click", async () => {
        try {
          const response = await fetch("/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          });

          const data = await response.json();

          if (data.success) {
            // Hide modal and redirect
            logoutModal.classList.add("hidden");
            if (data.redirect) {
              window.location.href = data.redirect;
            }
          } else {
            alert("⚠️ Logout failed. Try again.");
            logoutModal.classList.add("hidden");
          }
        } catch (err) {
          console.error("Logout error:", err);
          alert("❌ Server error. Please try again later.");
          logoutModal.classList.add("hidden");
        }
      });
    }
  }
});
