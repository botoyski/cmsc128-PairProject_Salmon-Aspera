// =====================================================================
// File: static/js/signup.js
// ---------------------------------------------------------------------
// Description:
// Handles user account creation by sending form data to Flask backend.
// Replaces localStorage logic with fetch() to /signup (JSON API).
// Maintains same design and UX (alert + redirect).
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const message = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!name || !username || !password) {
      message.textContent = "Please fill out all fields.";
      message.className = "text-red-400 text-center text-sm mt-4";
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, password }),
      });

      const data = await response.json();

      if (data.status === "success") {
        message.textContent = "✅ Account created! Redirecting to login...";
        message.className = "text-green-400 text-center text-sm mt-4";
        
        // Clear form fields
        form.reset();

        // Safer redirect (always go to /login even if backend forgot redirect)
        setTimeout(() => {
          window.location.href = data.redirect || "/login";
        }, 1000);
      } else {
        message.textContent = data.message || "Signup failed.";
        message.className = "text-red-400 text-center text-sm mt-4";
      }
    } catch (err) {
      console.error("Signup error:", err);
      message.textContent = "Server error. Please try again later.";
      message.className = "text-red-400 text-center text-sm mt-4";
    }
  });
});

