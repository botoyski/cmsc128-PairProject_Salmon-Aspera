document.getElementById("signupForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!name || !username || !password) {
    showMessage("⚠️ Please fill out all fields.", "text-red-400");
    return;
  }

  // Retrieve existing users from localStorage
  let users = JSON.parse(localStorage.getItem("users")) || [];

  // Check if username/email already exists
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
    showMessage("⚠️ Username or email already exists!", "text-red-400");
    return;
  }

  // Add new user object
  users.push({ name, username, password });
  localStorage.setItem("users", JSON.stringify(users));

  // Show success message
  showMessage("✅ Account created successfully! Redirecting to login...", "text-green-400");

  // Redirect to login page after delay
  setTimeout(() => {
    window.location.href = "login.html";
  }, 1500);
});

function showMessage(msg, color) {
  const message = document.getElementById("message");
  message.className = `text-center text-sm mt-4 ${color}`;
  message.textContent = msg;
}
