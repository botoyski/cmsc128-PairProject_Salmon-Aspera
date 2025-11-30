// ======================================================================
// File: static/js/login.js
// ----------------------------------------------------------------------
// Description:
// Handles login authentication using Flask backend via fetch().
// Sends JSON credentials to /login and redirects on success.
// Uses modal instead of alerts for better UX.
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
      showMessage("⚠️ Please fill out all fields.", "text-red-400", true);
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

        // Show success message without OK button (auto-close)
        showMessage("✅ " + data.message, "text-green-400", false);

        if (data.redirect) {
          setTimeout(() => {
            window.location.href = data.redirect;
          }, 1000);
        }
      } else {
        showMessage("⚠️ " + data.message, "text-red-400", true);
      }
    } catch (err) {
      console.error("Login error:", err);
      showMessage("❌ Server error. Please try again later.", "text-red-400", true);
    }
  });
});

function showMessage(msg, color, showButton) {
  const modal = document.getElementById('loginModal');
  const message = document.getElementById('loginModalMessage');
  const closeBtn = document.getElementById('loginModalClose');
  
  if (modal && message && closeBtn) {
    message.textContent = msg;
    message.className = `text-gray-300 mb-5 ${color}`;
    modal.classList.remove('hidden');
    
    // Show or hide the OK button based on the showButton parameter
    if (showButton) {
      closeBtn.classList.remove('hidden');
      closeBtn.onclick = () => {
        modal.classList.add('hidden');
      };
    } else {
      closeBtn.classList.add('hidden');
      // Auto-hide modal after showing success message
      setTimeout(() => {
        modal.classList.add('hidden');
      }, 1500);
    }
  } else {
    // Fallback to alert if modal elements not found
    alert(msg);
  }
}
