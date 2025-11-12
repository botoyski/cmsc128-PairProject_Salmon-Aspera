// ======================================================================
// File: static/js/profile.js
// ----------------------------------------------------------------------
// Description:
// Handles updating user profile via Flask backend (/profile POST).
// Ensures form fields are validated and gives user feedback.
// ======================================================================

document.addEventListener("DOMContentLoaded", async () => {
  // Check user session validity
  try {
    const res = await fetch("/profile", { method: "GET" });
    if (res.redirected) {
      window.location.href = res.url;
      return;
    }
  } catch (err) {
    console.error("Session check failed:", err);
  }

  const form = document.getElementById("profileForm");
  const message = document.getElementById("profileMessage");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("profileName").value.trim();
    const username = document.getElementById("profileUsername").value.trim();
    const password = document.getElementById("profilePassword").value.trim();

    if (!name || !username) {
      showMessage("⚠️ Name and username cannot be empty.", "red");
      return;
    }

    try {
      const res = await fetch("/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      const data = await res.json();

      if (data.success) {
        showMessage("✅ " + data.message, "green");
      } else {
        showMessage("⚠️ " + data.message, "red");
      }
    } catch (err) {
      console.error("Profile update error:", err);
      showMessage("❌ Server error. Please try again later.", "red");
    }
  });

  function showMessage(text, color) {
    if (message) {
      message.textContent = text;
      message.className = `text-${color}-400 text-center mt-2`;
    } else {
      alert(text);
    }
  }
});
