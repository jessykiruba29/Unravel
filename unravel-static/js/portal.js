const container = document.getElementById("blood-container");

for (let i = 0; i < 15; i++) {
  const d = document.createElement("div");
  d.className = "blood-drip";
  d.style.left = Math.random() * 100 + "%";
  d.style.animationDelay = Math.random() * 5 + "s";
  d.style.animationDuration = 2 + Math.random() * 3 + "s";
  container.appendChild(d);
}
