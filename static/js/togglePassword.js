document.addEventListener("DOMContentLoaded", () => {
  const passwordInput = document.getElementById("password");
  const toggleIcon = document.getElementById("togglePassword");

  toggleIcon.addEventListener("click", () => {
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";

    // Change icon color slightly to indicate toggle
    toggleIcon.classList.toggle("text-blue-400");

    // Optional: swap icon path for "hidden" eye (for better UX)
    if (isPassword) {
      toggleIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13.875 18.825A10.05 10.05 0 0112 19
             c-4.478 0-8.268-2.943-9.542-7
             a10.05 10.05 0 012.432-3.89M15 12a3 3 0 11-6 0 3 3 0 016 0z
             M2 2l20 20" />
      `;
    } else {
      toggleIcon.innerHTML = `
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M2.458 12C3.732 7.943 7.523 5 12 5
             c4.478 0 8.268 2.943 9.542 7
             -1.274 4.057-5.064 7-9.542 7
             -4.477 0-8.268-2.943-9.542-7z" />
      `;
    }
  });
});
