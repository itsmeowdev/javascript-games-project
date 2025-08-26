class GuessTheNumber {
    constructor() {
        this.secretNumber = this.generateRandomNumber();
        this.attempts = 0;
        this.guessHistory = [];
        this.bestScore = localStorage.getItem('bestScore') || null;
        this.gameOver = false;
        
        this.initializeElements();
        this.setupEventListeners();
        this.updateDisplay();
    }

    // Inisialisasi elemen-elemen DOM
    initializeElements() {
        this.guessInput = document.getElementById('guessInput');
        this.submitBtn = document.getElementById('submitBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.message = document.getElementById('message');
        this.attemptsDisplay = document.getElementById('attempts');
        this.bestScoreDisplay = document.getElementById('bestScore');
        this.historySection = document.getElementById('historySection');
        this.historyList = document.getElementById('historyList');
    }

    // Setup event listeners
    setupEventListeners() {
        this.submitBtn.addEventListener('click', () => this.makeGuess());
        this.resetBtn.addEventListener('click', () => this.resetGame());
        
        // Enter key untuk submit
        this.guessInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.makeGuess();
            }
        });

        // Validasi input real-time
        this.guessInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1 || value > 100) {
                e.target.style.borderColor = '#ff6b6b';
            } else {
                e.target.style.borderColor = '#ddd';
            }
        });
    }

    // Generate angka acak antara 1-100
    generateRandomNumber() {
        return Math.floor(Math.random() * 100) + 1;
    }

    // Fungsi utama untuk menebak
    makeGuess() {
        if (this.gameOver) return;

        const guess = parseInt(this.guessInput.value);
        
        // Validasi input
        if (isNaN(guess) || guess < 1 || guess > 100) {
            this.showMessage('Masukkan angka antara 1-100!', 'error');
            return;
        }

        // Cek apakah sudah pernah ditebak
        if (this.guessHistory.includes(guess)) {
            this.showMessage('Anda sudah menebak angka ini!', 'error');
            return;
        }

        // Update data
        this.attempts++;
        this.guessHistory.push(guess);
        this.updateDisplay();

        // Cek apakah tebakan benar
        if (guess === this.secretNumber) {
            this.handleWin();
        } else {
            this.handleIncorrectGuess(guess);
        }

        // Reset input
        this.guessInput.value = '';
        this.updateHistoryDisplay();
    }

    // Handle ketika menang
    handleWin() {
        this.gameOver = true;
        this.showMessage(`🎉 Selamat! Anda menebak dengan benar dalam ${this.attempts} percobaan!`, 'success');
        
        // Update best score
        if (!this.bestScore || this.attempts < this.bestScore) {
            this.bestScore = this.attempts;
            localStorage.setItem('bestScore', this.bestScore);
            this.bestScoreDisplay.textContent = this.bestScore;
            this.showMessage(`🎉 Selamat! Anda menebak dengan benar dalam ${this.attempts} percobaan!\n🏆 Skor terbaik baru!`, 'success');
        }
        
        // Disable input
        this.submitBtn.disabled = true;
        this.guessInput.disabled = true;
    }

    // Handle tebakan yang salah
    handleIncorrectGuess(guess) {
        let hint = '';
        const difference = Math.abs(guess - this.secretNumber);
        
        // Berikan hint berdasarkan seberapa dekat tebakan
        if (difference <= 5) {
            hint = guess < this.secretNumber ? '🔥 Sangat dekat! Coba angka yang lebih besar!' : '🔥 Sangat dekat! Coba angka yang lebih kecil!';
        } else if (difference <= 10) {
            hint = guess < this.secretNumber ? '🌡️ Dekat! Coba angka yang lebih besar!' : '🌡️ Dekat! Coba angka yang lebih kecil!';
        } else if (difference <= 20) {
            hint = guess < this.secretNumber ? '📈 Terlalu kecil!' : '📉 Terlalu besar!';
        } else {
            hint = guess < this.secretNumber ? '❄️ Jauh terlalu kecil!' : '🔥 Jauh terlalu besar!';
        }

        this.showMessage(hint, 'hint');
    }

    // Tampilkan pesan
    showMessage(text, type) {
        this.message.textContent = text;
        this.message.className = `message ${type}`;
        this.message.style.display = 'block';
        
        // Auto hide setelah 4 detik
        setTimeout(() => {
            this.message.style.display = 'none';
        }, 4000);
    }

    // Update display counter
    updateDisplay() {
        this.attemptsDisplay.textContent = this.attempts;
        this.bestScoreDisplay.textContent = this.bestScore || '-';
    }

    // Update tampilan history
    updateHistoryDisplay() {
        if (this.guessHistory.length > 0) {
            this.historySection.style.display = 'block';
            this.historyList.innerHTML = this.guessHistory
                .map(guess => `<span class="history-item">${guess}</span>`)
                .join('');
        }
    }

    // Reset game
    resetGame() {
        this.secretNumber = this.generateRandomNumber();
        this.attempts = 0;
        this.guessHistory = [];
        this.gameOver = false;
        
        // Reset UI
        this.guessInput.value = '';
        this.guessInput.disabled = false;
        this.guessInput.style.borderColor = '#ddd';
        this.submitBtn.disabled = false;
        this.message.style.display = 'none';
        this.historySection.style.display = 'none';
        
        this.updateDisplay();
    }
}

// Initialize game ketika halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    new GuessTheNumber();
});