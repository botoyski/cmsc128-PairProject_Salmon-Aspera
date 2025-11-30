// ======================================================================
// File: static/js/profile.js
// ----------------------------------------------------------------------
// Description:
// Handles updating user profile via Flask backend (/profile POST).
// Ensures form fields are validated and gives user feedback.
// Also loads existing name/username via /api/profile on page load.
// ======================================================================

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("profileForm");
  const message = document.getElementById("profileMessage");
  const nameInput = document.getElementById("profileName");
  const usernameInput = document.getElementById("profileUsername");

  if (!form) return;

  // 1) Load existing profile data and pre-fill inputs
  try {
    const res = await fetch("/api/profile");
    const data = await res.json();

    if (data.success) {
      if (nameInput) nameInput.value = data.name || "";
      if (usernameInput) usernameInput.value = data.username || "";
    } else {
      console.error("Failed to load profile:", data.message);
    }
  } catch (err) {
    console.error("Error loading profile:", err);
  }

  // 2) Handle profile update submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput ? nameInput.value.trim() : "";
    const username = usernameInput ? usernameInput.value.trim() : "";
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
