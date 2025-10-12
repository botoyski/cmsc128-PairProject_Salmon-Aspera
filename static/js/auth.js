// =====================================================================
// File: static/js/auth.js
// ---------------------------------------------------------------------
// Description:
// This script handles all authentication-related functionality for the
// Move It! web app, including:
//   • Account creation (signup)
//   • Login authentication
//   • Profile page data rendering
//   • Password recovery and reset
//
// The script interacts with browser localStorage to simulate a simple
// database where user information is saved and retrieved.
//
// Pages that use this file:
//   - create_account.html  (Signup Page)
//   - login.html           (Login Page)
//   - profile.html         (User Profile Page)
//   - recovery.html        (Password Recovery Page)
//
// Author: [Your Name]
// Last Updated: October 2025
// =====================================================================

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------
  // ELEMENT REFERENCES
  // --------------------------------------------------------------
  // Detect forms and buttons based on which page is currently open.
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const recoveryForm = document.getElementById("recoveryForm");
  const verifyBtn = document.getElementById("verifyBtn");

  // Load stored users from localStorage or initialize an empty list.
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // ==============================================================
  // SIGN-UP HANDLER — Account Creation Logic
  // --------------------------------------------------------------
  // Validates user inputs and saves the new account data into
  // localStorage. Prevents duplicate usernames and requires all
  // fields to be filled out before registration.
  // ==============================================================
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Retrieve form data and clean extra spaces
      const name = document.getElementById("name").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Check if any field is left blank
      if (!name || !username || !password) {
        alert("⚠️ Please fill out all fields.");
        return;
      }

      // Prevent duplicate username or email registration
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        alert("⚠️ Username or email already exists!");
        return;
      }

      // Add new user to the array and save to localStorage
      users.push({ name, username, password });
      localStorage.setItem("users", JSON.stringify(users));

      // Notify user and redirect to login page
      alert("✅ Account created successfully! You can now log in.");
      window.location.href = "login.html";
    });
  }

  // ==============================================================
  // LOGIN HANDLER — User Authentication Logic
  // --------------------------------------------------------------
  // Checks entered credentials against stored user data.
  // If valid, saves only the username in localStorage for session tracking.
  // Redirects authenticated users to profile.html.
  // ==============================================================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Retrieve login input values
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Find a matching user in localStorage
      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        // Save only the username to identify the logged-in user
        localStorage.setItem("loggedUsername", user.username);
        window.location.href = "profile.html";
      } else {
        alert("Invalid username or password. Please try again.");
      }
    });
  }

  // ==============================================================
  // PROFILE PAGE HANDLER — Display and Logout Logic
  // --------------------------------------------------------------
  // Loads user data into the profile page, ensuring only logged-in
  // users can view their info. Includes a logout handler that clears
  // the session and redirects to the login page.
  // ==============================================================
  if (window.location.pathname.includes("profile.html")) {
    const username = localStorage.getItem("loggedUsername");

    // Redirect to login page if user is not logged in
    if (!username) {
      window.location.href = "login.html";
      return;
    }

    // Find current logged-in user's data
    const user = users.find(u => u.username === username);
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Populate profile fields with stored user data
    const nameField = document.querySelector('input[type="text"]');
    const emailField = document.querySelectorAll('input[type="text"]')[1];
    if (nameField && emailField) {
      nameField.value = user.name;
      emailField.value = user.username;
    }

    // --------------------------------------------------------------
    // LOGOUT HANDLER
    // --------------------------------------------------------------
    // When the user clicks the logout link, their session is removed
    // from localStorage, forcing re-login next time.
    const logoutLink = document.querySelector('a[href="login.html"]');
    if (logoutLink) {
      logoutLink.addEventListener("click", () => {
        localStorage.removeItem("loggedUsername");
      });
    }
  }

  // ==============================================================
  // PASSWORD RECOVERY HANDLER — Account Verification & Reset
  // --------------------------------------------------------------
  // Enables users to reset their password if they forget it.
  // Process:
  //   1. Verify username or email
  //   2. Show password reset form
  //   3. Update stored password in localStorage
  // ==============================================================
  if (verifyBtn && recoveryForm) {
    // Page elements used in the recovery process
    const usernameInput = document.getElementById("usernameInput");
    const usernameSection = document.getElementById("usernameSection");
    const passwordSection = document.getElementById("passwordSection");

    // Holds the verified user temporarily
    let verifiedUser = null;

    // Step 1: Verify if username/email exists
    verifyBtn.addEventListener("click", () => {
      const username = usernameInput.value.trim();

      if (username === "") {
        alert("Please enter your username or email.");
        return;
      }

      // Reload latest user list
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username);

      // Handle account not found
      if (!user) {
        alert("No account found with that username or email.");
        return;
      }

      // Account found: proceed to password reset
      verifiedUser = user;
      alert("Account verified! You may now reset your password.");

      usernameSection.classList.add("hidden");
      passwordSection.classList.remove("hidden");
    });

    // Step 2: Handle password reset form submission
    recoveryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newPass = document.getElementById("newPassword").value;
      const repeatPass = document.getElementById("repeatPassword").value;

      // Check for matching passwords
      if (newPass !== repeatPass) {
        alert("Passwords do not match!");
        return;
      }

      // Ensure account was verified before allowing reset
      if (!verifiedUser) {
        alert("Please verify your account first.");
        return;
      }

      // Reload stored users and update password for verified account
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex(u => u.username === verifiedUser.username);

      if (index !== -1) {
        users[index].password = newPass;
        localStorage.setItem("users", JSON.stringify(users));

        // Confirmation message and redirect to login
        alert("Password successfully updated! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      }
    });
  }
});
