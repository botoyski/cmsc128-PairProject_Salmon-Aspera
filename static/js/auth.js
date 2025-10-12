// static/js/auth.js

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const recoveryForm = document.getElementById("recoveryForm");
  const verifyBtn = document.getElementById("verifyBtn");

  // 🧠 Load users from localStorage or initialize an empty array
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // ========================
  // SIGN UP HANDLER
  // ========================
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      // Check if user already exists
      if (users.find(u => u.username === username)) {
        alert("Username already exists! Please use a different one.");
        return;
      }

      const newUser = { name, username, password };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      alert("Account created successfully! You can now log in.");
      window.location.href = "login.html";
    });
  }

  // ========================
  // LOGIN HANDLER
  // ========================
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      const user = users.find(u => u.username === username && u.password === password);

      if (user) {
        localStorage.setItem("loggedUser", JSON.stringify(user));
        window.location.href = "profile.html";
      } else {
        alert("Invalid username or password. Please try again.");
      }
    });
  }

  // ========================
  // PROFILE PAGE HANDLER
  // ========================
  if (window.location.pathname.includes("profile.html")) {
    const user = JSON.parse(localStorage.getItem("loggedUser"));

    if (!user) {
      window.location.href = "login.html";
      return;
    }

    // Fill in profile fields if they exist
    const nameField = document.querySelector('input[value="John Doe"]') || document.querySelector('input[type="text"]');
    const emailField = document.querySelector('input[value="johndoe@example.com"]') || document.querySelectorAll('input[type="text"]')[1];

    if (nameField && emailField) {
      nameField.value = user.name;
      emailField.value = user.username;
    }

    // Handle logout
    const logoutLink = document.querySelector('a[href="login.html"]');
    if (logoutLink) {
      logoutLink.addEventListener("click", () => {
        localStorage.removeItem("loggedUser");
      });
    }
  }

  // ===============================
  // PASSWORD RECOVERY LOGIC
  // ===============================
  if (verifyBtn && recoveryForm) {
    const usernameInput = document.getElementById("usernameInput");
    const usernameSection = document.getElementById("usernameSection");
    const passwordSection = document.getElementById("passwordSection");

    let verifiedUser = null;

    verifyBtn.addEventListener("click", () => {
      const username = usernameInput.value.trim();
      if (username === "") {
        alert("Please enter your username or email.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(u => u.username === username || u.email === username);

      if (!user) {
        alert("No account found with that username or email.");
        return;
      }

      verifiedUser = user;
      alert("Account verified! You may now reset your password.");

      usernameSection.classList.add("hidden");
      passwordSection.classList.remove("hidden");
    });

    recoveryForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const newPass = document.getElementById("newPassword").value;
      const repeatPass = document.getElementById("repeatPassword").value;

      if (newPass !== repeatPass) {
        alert("Passwords do not match!");
        return;
      }

      if (!verifiedUser) {
        alert("Please verify your account first.");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const index = users.findIndex(u => u.username === verifiedUser.username);

      if (index !== -1) {
        users[index].password = newPass;
        localStorage.setItem("users", JSON.stringify(users));
        alert("Password successfully updated! Redirecting to login...");
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1500);
      }
    });
  }
});
