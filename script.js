let correctAnswer;
let score = 0;
let difficulty;
let explanation; // Declare explanation variable globally
let timeRemaining; // Time remaining will be set based on difficulty
let timerInterval; // Declare timerInterval globally
let playerName = '';  // Variable to store player's name
let totalScore = 0;   // Variable to store the player's total score
let answers = [];     // Array to store the player's answers
const timerElement = document.getElementById('timer');


// Start the timer
function startTimer(duration) {
  timeRemaining = duration; // Set the time remaining based on difficulty
  timerInterval = setInterval(updateTimer, 1000);
}


// Update the timer display
function updateTimer() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  if (timeRemaining <= 0) {
    clearInterval(timerInterval);
    document.getElementById("result").style.color = "red";
    document.getElementById("result").innerHTML = `Time's up! The correct answer was ${correctAnswer}.<br><strong>Explanation:</strong> ${explanation}`;
    updateScore(-5);
    // Show Next button when time is up
    document.getElementById("next-button").classList.remove("hidden");
  } else {
    timeRemaining--;  // Decrement the time remaining
  }
}
function recordAnswer(answer) {
  answers.push(answer);
}

// Example function to update the score
function updateScore(points) {
  score += points;
}

function getAnswers() {
  return answers;
}

function getScore() {
  return score;
}
// Generate floating equations
function createFloatingEquations() {
  const equations = [
    "d = vt", "ax² + bx + c = 0", "E = mc²", "x = (-b ± √(b²-4ac)) / 2a",
    "A = πr²", "v = u + at", "s = ut + 0.5at²", "F = ma", "P = IV",
    "sin²θ + cos²θ = 1", "log x", "x²", "x³", "13x + 91y = 1900",
    "V = IR", "F = GMm / R²", "sec²x = 1 + tan²x", "log10 = 1",
    "loge = 1", "loga x logb = (loga+b)", "W = F x s", "W = P x dV", "v = d/t",
  ];
  const container = document.getElementById("floating-equations");

  for (let i = 0; i < 15; i++) {
    const equation = equations[Math.floor(Math.random() * equations.length)];
    const div = document.createElement("div");
    div.className = "floating-equation";
    div.innerText = equation;

    div.style.left = `${Math.random() * 120 - 10}vw`;
    div.style.top = `${Math.random() * 120 - 10}vh`;
    div.style.animationDuration = `${10 + Math.random() * 20}s`;
    div.style.setProperty("--x-dir", `${Math.random() * 20 - 10}vw`);

    container.appendChild(div);
  }
}


// Function to start the game with the selected difficulty
function startGame(difficulty) {
  // Initialize game based on difficulty...
  // After selecting difficulty, start the game
}

// Function to capture the answers and score
function generateQuestion() {
  let answer = document.getElementById('answer').value;
  answers.push(answer);  // Add answer to the list
  score += calculateScore(answer);  // Add to score based on the answer
  totalScore += score;  // Keep track of total score
  updateScoreDisplay();  // Update score on the UI
  
  // Next question logic...
}

// Function to send the player's score and answers to the backend
function saveScore() {
  fetch('http://op.code-wizard.in:9060/save-score', {  // Replace with your backend URL
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      playerName,
      score,
      totalScore,
      answers,
    }),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data.message);  // Log success message from backend
  })
  .catch(error => {
    console.error('Error saving score:', error);
  });
}

// Function to call when quitting the game (or at the end of the game)
function quitGame() {
  saveScore();  // Send score data to backend when quitting or finishing
  // Optionally, reset game data or return to the start screen
}

// Example of calculating score (based on your logic)
function calculateScore(answer) {
  // Add your score calculation logic here
  return 10;  // Example: return 10 points for each correct answer
}

// Update the score display on the UI
function updateScoreDisplay() {
  document.getElementById('score').textContent = `Score: ${score}`;
}
createFloatingEquations();

function goToDifficultyScreen() {
  document.getElementById("main-start-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
}

function checkAnswer() {
  const userAnswer = document.getElementById("answer").value;
  const resultElement = document.getElementById("result");
  const nextButton = document.getElementById("next-button");

  // Stop the timer
  clearInterval(timerInterval);

  if (userAnswer === correctAnswer.toString()) {
    resultElement.style.color = "green";
    resultElement.innerText = "Correct! Well done!";
    updateScore(10);
  } else {
    resultElement.style.color = "red";
    resultElement.innerHTML = `Wrong! The correct answer was ${correctAnswer}.<br><strong>Explanation:</strong> ${explanation}`;
    updateScore(-5);
  }

  // Show the Next button
  nextButton.classList.remove("hidden");
}

function generateQuestion() {
  const nextButton = document.getElementById("next-button");
  nextButton.classList.add("hidden"); // Hide Next button until the answer is checked

  const { min, max } = getDifficultyRange();
  const num1 = getRandomNumber(min, max);
  const num2 = getRandomNumber(min, max);
  const operations = ["+", "-", "*", "/", "log", "square", "cube"];
  const operator = operations[Math.floor(Math.random() * operations.length)];

  switch (operator) {
    case "+":
      correctAnswer = num1 + num2;
      explanation = `The sum of ${num1} and ${num2} is ${correctAnswer}.`;
      break;
    case "-":
      correctAnswer = num1 - num2;
      explanation = `The difference between ${num1} and ${num2} is ${correctAnswer}.`;
      break;
    case "*":
      correctAnswer = num1 * num2;
      explanation = `The product of ${num1} and ${num2} is ${correctAnswer}.`;
      break;
    case "/":
      correctAnswer = (num1 / num2).toFixed(2);
      explanation = `${num1} divided by ${num2} equals ${correctAnswer}.`;
      break;
    case "log":
      correctAnswer = Math.log10(num1).toFixed(2);
      explanation = `The logarithm base 10 of ${num1} is ${correctAnswer}.`;
      break;
    case "square":
      correctAnswer = num1 ** 2;
      explanation = `${num1} squared (or ${num1} × ${num1}) is ${correctAnswer}.`;
      break;
    case "cube":
      correctAnswer = num1 ** 3;
      explanation = `${num1} cubed (or ${num1} × ${num1} × ${num1}) is ${correctAnswer}.`;
      break;
  }

  const questionText =
    operator === "log" ? `What is log(${num1})?` :
    operator === "square" ? `What is ${num1}²?` :
    operator === "cube" ? `What is ${num1}³?` :
    `What is ${num1} ${operator} ${num2}?`;

  document.getElementById("question").innerText = questionText;
  document.getElementById("result").innerText = "";
  document.getElementById("answer").value = "";

  // Reset the timer
  startTimer(300); // Reset time remaining to 5 minutes
}

// Utility functions
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDifficultyRange() {
  switch (difficulty) {
    case 'easy': return { min: 1, max: 20 };
    case 'medium': return { min: 10, max: 100 };
    case 'hard': return { min: 50, max: 1000 };
  }
}

function updateScore(points) {
  score += points;
  document.getElementById("score").innerText = `Score: ${score}`;
}

// Event listeners
document.getElementById("next-button").addEventListener("click", function() {
  const userAnswer = document.getElementById("answer").value;

  // Proceed to generate the next question if an answer is provided
  if (userAnswer !== "") {
    generateQuestion();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") checkAnswer();
  if (event.key === "Escape") quitGame();
});

function quitGame() {
  document.getElementById("game-screen").classList.add("hidden");
  document.getElementById("start-screen").classList.remove("hidden");
}

function startGame(selectedDifficulty) {
  difficulty = selectedDifficulty; // Set the difficulty level
  let timeLimit;

  switch (difficulty) {
    case 'easy':
      timeLimit = 300; // 5 minutes
      break;
    case 'medium':
      timeLimit = 180; // 3 minutes
      break;
    case 'hard':
      timeLimit = 120; // 2 minutes
      break;
  }
  // Hide the difficulty selection screen
  document.getElementById('start-screen').classList.add('hidden');
  
  // Show the game screen
  document.getElementById('game-screen').classList.remove('hidden');
  
  // Start the timer and generate the first question
  startTimer(timeLimit);
  generateQuestion(); // Generate first question
}
