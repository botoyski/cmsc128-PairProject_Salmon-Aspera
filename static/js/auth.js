// =====================================================================
// File: static/js/auth.js
// ---------------------------------------------------------------------
// Description:
// Handles password recovery and reset via Flask backend.
// Uses three-step JSON flow with modal notifications instead of alerts.
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  const usernameSection = document.getElementById("usernameSection");
  const securitySection = document.getElementById("securitySection");
  const passwordSection = document.getElementById("passwordSection");
  const verifyBtn = document.getElementById("verifyBtn");
  const verifyAnswerBtn = document.getElementById("verifyAnswerBtn");
  const form = document.getElementById("recoveryForm");

  let verifiedUsername = ""; // Store username for later steps

  // Step 1: Verify Account
  verifyBtn.addEventListener("click", async () => {
    const usernameInput = document.getElementById("usernameInput").value.trim();
    if (!usernameInput) {
      showRecoveryMessage("⚠️ Please enter your username or email.", true);
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
        verifiedUsername = usernameInput;
        
        // Display the user's security question
        const securityQuestionDisplay = document.getElementById("securityQuestionDisplay");
        if (securityQuestionDisplay) {
          securityQuestionDisplay.textContent = data.securityQuestion || "Your security question";
        }

        showRecoveryMessage("✅ Account verified! Please answer your security question.", true, () => {
          usernameSection.classList.add("hidden");
          securitySection.classList.remove("hidden");
        });
      } else {
        showRecoveryMessage("⚠️ " + (data.message || "Account not found."), true);
      }
    } catch (err) {
      console.error("Verify error:", err);
      showRecoveryMessage("❌ Server error while verifying account.", true);
    }
  });

  // Step 2: Verify Security Answer
  verifyAnswerBtn.addEventListener("click", async () => {
    const securityAnswer = document.getElementById("securityAnswerInput").value.trim();
    if (!securityAnswer) {
      showRecoveryMessage("⚠️ Please enter your security answer.", true);
      return;
    }

    try {
      const res = await fetch("/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          usernameInput: verifiedUsername, 
          securityAnswer, 
          action: "verifyAnswer" 
        })
      });
      const data = await res.json();

      if (data.success) {
        showRecoveryMessage("✅ Security answer verified! You may now reset your password.", true, () => {
          securitySection.classList.add("hidden");
          passwordSection.classList.remove("hidden");
        });
      } else {
        showRecoveryMessage("⚠️ " + (data.message || "Incorrect security answer."), true);
      }
    } catch (err) {
      console.error("Verify answer error:", err);
      showRecoveryMessage("❌ Server error while verifying answer.", true);
    }
  });

  // Step 3: Reset Password
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById("newPassword").value.trim();
    const repeatPassword = document.getElementById("repeatPassword").value.trim();

    if (!newPassword || !repeatPassword) {
      showRecoveryMessage("⚠️ Please fill in both password fields.", true);
      return;
    }
    if (newPassword !== repeatPassword) {
      showRecoveryMessage("⚠️ Passwords do not match!", true);
      return;
    }

    try {
      const res = await fetch("/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          usernameInput: verifiedUsername,
          newPassword, 
          repeatPassword, 
          action: "reset" 
        })
      });
      const data = await res.json();

      if (data.success) {
        // Show success message WITHOUT OK button (auto-close and redirect)
        showRecoveryMessage("✅ Password reset successful! Redirecting to login...", false, () => {
          setTimeout(() => {
            window.location.href = data.redirect || "/login";
          }, 2000);
        });
      } else {
        showRecoveryMessage("⚠️ " + (data.message || "Password reset failed."), true);
      }
    } catch (err) {
      console.error("Reset error:", err);
      showRecoveryMessage("❌ Server error during password reset.", true);
    }
  });
});

// Modal helper function
function showRecoveryMessage(msg, showButton, callback) {
  const modal = document.getElementById('recoveryModal');
  const message = document.getElementById('recoveryModalMessage');
  const closeBtn = document.getElementById('recoveryModalClose');
  
  if (modal && message && closeBtn) {
    message.textContent = msg;
    modal.classList.remove('hidden');
    
    // Show or hide the OK button
    if (showButton) {
      closeBtn.classList.remove('hidden');
      closeBtn.onclick = () => {
        modal.classList.add('hidden');
        if (callback) callback(); // Execute callback after closing modal
      };
    } else {
      closeBtn.classList.add('hidden');
      if (callback) callback(); // Execute callback immediately (no button to click)
    }
  } else {
    // Fallback to alert if modal elements not found
    alert(msg);
    if (callback) callback();
  }
}
