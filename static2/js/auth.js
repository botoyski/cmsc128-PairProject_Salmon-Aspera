// =====================================================================
// File: static/js/auth.js
// ---------------------------------------------------------------------
// Description:
// Handles password recovery and reset via Flask backend.
// Uses two-step JSON flow:
//   1️⃣ Verify username/email via POST { action: "verify" }
//   2️⃣ Reset password via POST { action: "reset" }
// Works with recover.html — no design changes.
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const usernameSection = document.getElementById("usernameSection");
  const passwordSection = document.getElementById("passwordSection");
  const verifyBtn = document.getElementById("verifyBtn");
  const form = document.getElementById("recoveryForm");

  // Step 1: Verify Account
  verifyBtn.addEventListener("click", async () => {
    const usernameInput = document.getElementById("usernameInput").value.trim();
    if (!usernameInput) {
      alert("Please enter your username or email.");
      return;
    }

    try {
      const res = await fetch("/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameInput, action: "verify" })
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Account verified! You may now reset your password.");
        usernameSection.classList.add("hidden");
        passwordSection.classList.remove("hidden");
      } else {
        alert(data.message || "Account not found.");
      }
    } catch (err) {
      console.error("Verify error:", err);
      alert("Server error while verifying account.");
    }
  });

  // Step 2: Reset Password
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const repeatPassword = document.getElementById("repeatPassword").value.trim();

    if (!newPassword || !repeatPassword) {
      alert("Please fill in both password fields.");
      return;
    }
    if (newPassword !== repeatPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword, repeatPassword, action: "reset" })
      });
      const data = await res.json();

      if (data.success) {
        alert("✅ Password reset successful! Redirecting to login...");
        setTimeout(() => {
          window.location.href = data.redirect || "/login";
        }, 1500);
      } else {
        alert(data.message || "Password reset failed.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Server error during password reset.");
    }
  });
});
