// ======================================================================
// File: static/js/login.js
// ----------------------------------------------------------------------
// Description:
// Handles the user login functionality for the Move It! web app.
//
// Core features:
//  - Validates user credentials against localStorage data
//  - Supports a “Remember Me” option that remembers the username only
//  - Displays dynamic feedback messages for login success/failure
//  - Redirects authenticated users to their profile page
//
// Dependencies:
//  - localStorage entries created by signup.js (stores user data)
//  - profile.html (redirect destination after successful login)
//
// Author: [Your Name]
// Last Updated: October 2025
// ======================================================================

document.addEventListener("DOMContentLoaded", () => {
  // --------------------------------------------------------------
  // ELEMENT REFERENCES
  // --------------------------------------------------------------
  // Retrieve elements from the login form for interaction.
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');

  // --------------------------------------------------------------
  // REMEMBER ME: AUTO-FILL USERNAME
  // --------------------------------------------------------------
  // If the user previously chose "Remember Me", retrieve the saved
  // username from localStorage and pre-fill the login input field.
  const rememberedUsername = localStorage.getItem("rememberedUsername");
  if (rememberedUsername) {
    usernameInput.value = rememberedUsername;
    rememberMeCheckbox.checked = true;
  }

  // --------------------------------------------------------------
  // LOGIN FORM SUBMISSION HANDLER
  // --------------------------------------------------------------
  // Validates entered credentials and either logs the user in or
  // displays an error message. If successful, stores currentUser
  // in localStorage for later profile access.
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent form from submitting the usual way

    // Clean and retrieve user inputs
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Load all registered users from localStorage
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Find a user with matching credentials
    const user = users.find(u => u.username === username && u.password === password);

    // --------------------------------------------------------------
    // INVALID LOGIN CASE
    // --------------------------------------------------------------
    // If no user matches, show an error message and stop execution.
    if (!user) {
      showMessage("Invalid username or password.", "text-red-400");
      return;
    }

    // --------------------------------------------------------------
    // SUCCESSFUL LOGIN
    // --------------------------------------------------------------
    // Save the authenticated user object for access in profile.html.
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Handle the Remember Me functionality:
    // Save only the username if checkbox is checked, otherwise clear it.
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    // Notify the user visually
    showMessage("Login successful!", "text-green-400");

    // Delay for UX — allow user to see success message before redirect
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1000);
  });
});


// ======================================================================
// Helper Function: showMessage()
// ----------------------------------------------------------------------
// Displays a styled feedback message under the login form.
// If the message element doesn’t exist, falls back to a browser alert.
// ======================================================================
function showMessage(msg, color) {
  const message = document.getElementById("loginMessage");

  // Display text in the designated message container if available
  if (message) {
    message.className = `text-center text-sm mt-4 ${color}`;
    message.textContent = msg;
  } 
  // Fallback — basic alert for debugging or when no message element exists
  else {
    alert(msg);
  }
}
