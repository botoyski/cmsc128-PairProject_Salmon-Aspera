document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');

  // 🧠 Load saved username if Remember Me was checked before
  const rememberedUsername = localStorage.getItem("rememberedUsername");
  if (rememberedUsername) {
    usernameInput.value = rememberedUsername;
    rememberMeCheckbox.checked = true;
  }

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
      showMessage("Invalid username or password.", "text-red-400");
      return;
    }

    // ✅ Store logged-in user for profile access
    localStorage.setItem("currentUser", JSON.stringify(user));

    // 💾 Save only the username if "Remember Me" is checked
    if (rememberMeCheckbox.checked) {
      localStorage.setItem("rememberedUsername", username);
    } else {
      localStorage.removeItem("rememberedUsername");
    }

    showMessage("Login successful!", "text-green-400");

    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1000);
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
