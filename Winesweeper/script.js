const rows = 10;
const cols = 10;
const wineCount = 10;
const board = document.getElementById("board");
const timerEl = document.getElementById("timer");
const bestTimeEl = document.getElementById("best-time");
const cells = [];

let gameOver = false;
let revealedCount = 0;
let startTime;
let timerInterval;

function createBoard() {
  board.innerHTML = "";
  cells.length = 0;
  revealedCount = 0;
  gameOver = false;
  timerEl.textContent = "⏱️ 0 detik";
  stopTimer();
  startTimer();

  for (let i = 0; i < rows * cols; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;

    cell.addEventListener("click", handleClick);
    cell.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      toggleFlag(i);
    });

    board.appendChild(cell);
    cells.push({
      element: cell,
      hasWine: false,
      revealed: false,
      neighborWines: 0,
    });
  }

  placeWines();
  calculateNeighbors();
}

function placeWines() {
  let placed = 0;
  while (placed < wineCount) {
    const idx = Math.floor(Math.random() * cells.length);
    if (!cells[idx].hasWine) {
      cells[idx].hasWine = true;
      placed++;
    }
  }
}

function calculateNeighbors() {
  cells.forEach((cell, idx) => {
    const neighbors = getNeighbors(idx);
    cell.neighborWines = neighbors.reduce(
      (count, i) => count + (cells[i].hasWine ? 1 : 0),
      0
    );
  });
}

function getNeighbors(index) {
  const neighbors = [];
  const row = Math.floor(index / cols);
  const col = index % cols;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue;
      if (r >= 0 && r < rows && c >= 0 && c < cols) {
        neighbors.push(r * cols + c);
      }
    }
  }

  return neighbors;
}

function handleClick(e) {
  const idx = parseInt(e.target.dataset.index);
  if (gameOver || cells[idx].revealed || cells[idx].element.textContent === "🚩") return;

  revealCell(idx);
  checkWin();
}

function revealCell(idx) {
  const cell = cells[idx];
  if (cell.revealed || gameOver) return;

  cell.revealed = true;
  revealedCount++;
  cell.element.classList.add("revealed");

  if (cell.hasWine) {
    cell.element.textContent = "🍷";
    endGame(false);
  } else if (cell.neighborWines > 0) {
    cell.element.textContent = cell.neighborWines;
  } else {
    getNeighbors(idx).forEach((n) => {
      if (!cells[n].revealed) revealCell(n);
    });
  }
}

function toggleFlag(idx) {
  const cell = cells[idx];
  if (cell.revealed || gameOver) return;

  if (cell.element.textContent === "🚩") {
    cell.element.textContent = "";
    cell.element.classList.remove("flagged");
  } else {
    cell.element.textContent = "🚩";
    cell.element.classList.add("flagged");
  }
}

function checkWin() {
  if (revealedCount === rows * cols - wineCount) {
    endGame(true);
  }
}

function endGame(win) {
  gameOver = true;
  stopTimer();
  revealAll();

  if (win) {
    const currentTime = Math.floor((Date.now() - startTime) / 1000);
    const bestTime = localStorage.getItem("bestTime");
    if (!bestTime || currentTime < bestTime) {
      localStorage.setItem("bestTime", currentTime);
      alert(`🎉 Rekor baru! Waktu terbaik: ${currentTime} detik`);
    } else {
      alert(`Kamu menang! Waktu: ${currentTime} detik\nRekor: ${bestTime} detik`);
    }
    bestTimeEl.textContent = `🏆 Best Time: ${localStorage.getItem("bestTime")} detik`;
  } else {
    alert("Oops, kamu menemukan wine 🍷 Game over!");
  }
}

function revealAll() {
  cells.forEach((cell) => {
    if (cell.hasWine) {
      cell.element.textContent = "🍷";
    }
    cell.element.classList.add("revealed");
  });
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerEl.textContent = `⏱️ ${seconds} detik`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Load preferensi dark mode & skor terbaik saat buka halaman
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
  }
  const best = localStorage.getItem("bestTime");
  if (best) bestTimeEl.textContent = `🏆 Best Time: ${best} detik`;

  createBoard();
});

