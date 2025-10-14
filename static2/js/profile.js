// ======================================================================
// File: static/js/profile.js
// ----------------------------------------------------------------------
// Description:
// Handles user profile info with Flask backend via fetch().
// Loads data dynamically from server-rendered context or updates via POST.
// No design changes—just backend integration.
// ======================================================================

document.addEventListener("DOMContentLoaded", async () => {
  // Try fetching current user data from backend session
  try {
    const res = await fetch("/profile"); // GET still returns HTML
    if (res.redirected) {
      // If user not logged in (Flask redirects), follow
      window.location.href = res.url;
      return;
    }
  } catch (err) {
    console.error("Error verifying session:", err);
  }

  const form = document.getElementById("profileForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newName = document.getElementById("profileName").value.trim();
    const newUsername = document.getElementById("profileUsername").value.trim();
    const newPassword = document.getElementById("profilePassword").value.trim();

    if (!newName || !newUsername) {
      alert("⚠️ Name and username cannot be empty.");
      return;
    }

    try {
      const response = await fetch("/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          username: newUsername,
          password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("✅ " + data.message);
      } else {
        alert("⚠️ " + data.message);
      }
    } catch (err) {
      console.error("Profile update error:", err);
      alert("❌ Server error. Please try again later.");
    }
  });
});
