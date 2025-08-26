let playerScore = 0;
let computerScore = 0;
const choices = ['rock', 'paper', 'scissors'];
const emojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

function getComputerChoice() {
    return choices[Math.floor(Math.random() * choices.length)];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    }
    
    return 'lose';
}

function updateScore(result) {
    if (result === 'win') {
        playerScore++;
        document.getElementById('playerScore').textContent = playerScore;
    } else if (result === 'lose') {
        computerScore++;
        document.getElementById('computerScore').textContent = computerScore;
    }
}

function displayResult(result, playerChoice, computerChoice) {
    const resultElement = document.getElementById('result');
    const battleDisplay = document.getElementById('battleDisplay');
    const playerChoiceElement = document.getElementById('playerChoice');
    const computerChoiceElement = document.getElementById('computerChoice');

    // Show battle display
    battleDisplay.style.display = 'flex';
    playerChoiceElement.textContent = emojis[playerChoice];
    computerChoiceElement.textContent = emojis[computerChoice];

    // Update result text and styling
    resultElement.className = 'result ' + result;
    
    if (result === 'win') {
        resultElement.textContent = '🎉 Kamu Menang! 🎉';
    } else if (result === 'lose') {
        resultElement.textContent = '😢 Kamu Kalah! 😢';
    } else {
        resultElement.textContent = '🤝 Seri! 🤝';
    }
}

function playGame(playerChoice) {
    // Remove previous selections
    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected');
    });

    // Highlight selected choice
    document.querySelector(`[data-choice="${playerChoice}"]`).classList.add('selected');

    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    // Add delay for dramatic effect
    setTimeout(() => {
        displayResult(result, playerChoice, computerChoice);
        updateScore(result);
    }, 500);
}

function resetGame() {
    playerScore = 0;
    computerScore = 0;
    document.getElementById('playerScore').textContent = '0';
    document.getElementById('computerScore').textContent = '0';
    document.getElementById('result').textContent = 'Pilih Rock, Paper, atau Scissors untuk mulai!';
    document.getElementById('result').className = 'result';
    document.getElementById('battleDisplay').style.display = 'none';
    
    // Remove all selections
    document.querySelectorAll('.choice').forEach(choice => {
        choice.classList.remove('selected');
    });
}

// Add event listeners to choices
document.querySelectorAll('.choice').forEach(choice => {
    choice.addEventListener('click', function() {
        const playerChoice = this.getAttribute('data-choice');
        playGame(playerChoice);
    });
});

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key === '1' || event.key.toLowerCase() === 'r') {
        playGame('rock');
    } else if (event.key === '2' || event.key.toLowerCase() === 'p') {
        playGame('paper');
    } else if (event.key === '3' || event.key.toLowerCase() === 's') {
        playGame('scissors');
    }
});