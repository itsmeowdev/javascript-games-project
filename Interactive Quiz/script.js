const originalQuestions = [
  {
    question: "Ibukota Indonesia adalah?",
    answers: [
      { text: "Jakarta", correct: true },
      { text: "Bandung", correct: false },
      { text: "Surabaya", correct: false },
      { text: "Medan", correct: false }
    ]
  },
  {
    question: "2 + 2 = ?",
    answers: [
      { text: "3", correct: false },
      { text: "4", correct: true },
      { text: "5", correct: false },
      { text: "6", correct: false }
    ]
  },
  {
    question: "Siapa presiden pertama Indonesia?",
    answers: [
      { text: "Jokowi", correct: false },
      { text: "Soekarno", correct: true },
      { text: "Habibie", correct: false },
      { text: "Megawati", correct: false }
    ]
  }
];

let questions = shuffleArray([...originalQuestions]);

const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const nextBtn = document.getElementById("next-btn");
const resultEl = document.getElementById("result");
const timerEl = document.getElementById("timer");
const highScoreEl = document.getElementById("high-score");
const restartBtn = document.getElementById("restart-btn");

let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 10;
let highScore = localStorage.getItem("highScore") || 0;
let scoreHistory = JSON.parse(localStorage.getItem("scoreHistory") || "[]");

let quizChart = null;

highScoreEl.innerText = `Skor Tertinggi: ${highScore}`;

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  resetState();
  showTimer();
  const q = questions[currentQuestion];
  questionEl.innerText = q.question;

  q.answers.forEach((answer) => {
    const btn = document.createElement("button");
    btn.innerText = answer.text;
    btn.addEventListener("click", () => {
      clearInterval(timer);
      selectAnswer(btn, answer.correct);
    });
    answersEl.appendChild(btn);
  });
}

function showTimer() {
  timeLeft = 10;
  timerEl.innerText = `Waktu: ${timeLeft}`;
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `Waktu: ${timeLeft}`;
    if (timeLeft === 0) {
      clearInterval(timer);
      autoSelectWrong();
    }
  }, 1000);
}

function autoSelectWrong() {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = true;
    const isCorrect = questions[currentQuestion].answers.find(a => a.text === btn.innerText).correct;
    btn.classList.add(isCorrect ? "correct" : "wrong");
  });
  nextBtn.classList.remove("hidden");
}

restartBtn.addEventListener("click", () => {
  currentQuestion = 0;
  score = 0;
  questions = shuffleArray([...originalQuestions]);
  resultEl.classList.add("hidden");
  restartBtn.classList.add("hidden");
  document.getElementById("scoreChart").classList.add("hidden");
  document.getElementById("quiz-container").classList.remove("hidden");
  showQuestion();
});

function resetState() {
  nextBtn.classList.add("hidden");
  answersEl.innerHTML = "";
  clearInterval(timer);
}

function selectAnswer(button, correct) {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = true;
    const isCorrect = questions[currentQuestion].answers.find(a => a.text === btn.innerText).correct;
    btn.classList.add(isCorrect ? "correct" : "wrong");
  });

  if (correct) score++;
  nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

function renderChart() {
  const ctx = document.getElementById("scoreChart").getContext("2d");
  document.getElementById("scoreChart").classList.remove("hidden");

  // Destroy chart sebelumnya jika ada
  if (quizChart) {
    quizChart.destroy();
  }

  quizChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: scoreHistory.map((_, i) => `Percobaan ${i + 1}`),
      datasets: [{
        label: "Skor Kuis",
        data: scoreHistory,
        borderColor: "blue",
        backgroundColor: "rgba(0, 0, 255, 0.1)",
        fill: true,
        tension: 0.3,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: originalQuestions.length
        }
      }
    }
  });
}

function showResult() {
  document.getElementById("quiz-container").classList.add("hidden");
  resultEl.classList.remove("hidden");
  restartBtn.classList.remove("hidden");
  resultEl.innerText = `Kuis selesai! Skor Anda: ${score} dari ${questions.length}`;

  if (score > highScore) {
    localStorage.setItem("highScore", score);
    highScore = score;
  }
  highScoreEl.innerText = `Skor Tertinggi: ${highScore}`;

  // Simpan ke riwayat
  scoreHistory.push(score);
  localStorage.setItem("scoreHistory", JSON.stringify(scoreHistory));

  renderChart();
}

showQuestion();
