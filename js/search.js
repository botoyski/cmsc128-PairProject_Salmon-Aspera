// -----------------------------
// Global search query
// -----------------------------
let currentSearch = "";

// -----------------------------
// Search input element
// -----------------------------
const searchInput = document.getElementById("searchInput");

// -----------------------------
// Listen for search input changes
// -----------------------------
searchInput.addEventListener("input", () => {
  currentSearch = searchInput.value.toLowerCase();
  renderTasks(); // call the main render function
});
