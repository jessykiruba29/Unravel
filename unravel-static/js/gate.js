function startGame() {
  localStorage.setItem("unravel_started", "true");

  // ✅ RESET TIMER ONLY ON START
  localStorage.removeItem("unravel_start_time");

  window.location.href = "index.html";
}
