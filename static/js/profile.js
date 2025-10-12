document.addEventListener("DOMContentLoaded", () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const users = JSON.parse(localStorage.getItem("users")) || [];
  console.log("Loaded currentUser:", localStorage.getItem("currentUser"));


 if (!currentUser) {
    alert("You must be logged in first!");
    setTimeout(() => {
    window.location.href = "login.html";
    }, 5000); // 5000 milliseconds = 5 seconds
    return;
}


  // Fill in profile info
  document.getElementById("profileName").value = currentUser.name;
  document.getElementById("profileUsername").value = currentUser.username;
  document.getElementById("profilePassword").value = currentUser.password;

  // Update info handler
  document.getElementById("profileForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const newName = document.getElementById("profileName").value;
    const newUsername = document.getElementById("profileUsername").value;
    const newPassword = document.getElementById("profilePassword").value;

    // Update in localStorage
    const index = users.findIndex(u => u.username === currentUser.username);
    if (index !== -1) {
      users[index] = { name: newName, username: newUsername, password: newPassword };
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", JSON.stringify(users[index]));
      alert("Profile updated successfully!");
    }
  });
});
