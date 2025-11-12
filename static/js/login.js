// ======================================================================
// File: static/js/login.js
// ----------------------------------------------------------------------
// Description:
// Handles login authentication using Flask backend via fetch().
// Sends JSON credentials to /login and redirects on success.
// Keeps same UX as before (alert messages + redirect).
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');

  // Load remembered username (if previously saved)
  const rememberedUsername = localStorage.getItem("rememberedUsername");
  if (rememberedUsername) {
    usernameInput.value = rememberedUsername;
    rememberMeCheckbox.checked = true;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
      showMessage("⚠️ Please fill out all fields.", "text-red-400");
      return;
    }

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Handle Remember Me
        if (rememberMeCheckbox.checked) {
          localStorage.setItem("rememberedUsername", username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        showMessage("✅ " + data.message, "text-green-400");

        if (data.redirect) {
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 1000);
        }
      } else {
        showMessage("⚠️ " + data.message, "text-red-400");
      }
    } catch (err) {
      console.error("Login error:", err);
      showMessage("❌ Server error. Please try again later.", "text-red-400");
    }
  });
});

function showMessage(msg, color) {
  const message = document.getElementById("loginMessage");
  if (message) {
    message.className = `text-center text-sm mt-4 ${color}`;
    message.textContent = msg;
  } else {
    alert(msg);
  }
}
