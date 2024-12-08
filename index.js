// Key Functions:
// 1: Generate a random sequence of button presses.
// 2: Play the sequence using light and sound effects.
// 3: Detect user input and validate against the sequence.
// 4: Handle win/lose conditions.

let gamePattern = [];
let buttonColours = ["red", "blue", "green", "yellow"];
let userClickPattern = [];
let level = 0;
let started = false;
let highScore = localStorage.getItem("highScore") || 0;

// Update scoreboard dynamically
function updateScoreboard() {
  $("#current-level").text(level);
  $("#high-score").text(highScore);
}

// Start the game when a key is pressed or the screen is tapped (mobile-friendly)
$(document).on("keypress touchstart", function () {
  if (!started) {
    $("h1").text("Level " + level);
    nextSequence();
    started = true;
  }
});

function playGamePattern() {
  let index = 0;

  // Recursively play the colors in the game pattern with a delay
  function playNextColor() {
    if (index < gamePattern.length) {
      const color = gamePattern[index];
      $("#" + color).fadeIn(100).fadeOut(100).fadeIn(100); // Flash the color
      makeSound(color); // Play the associated sound
      index++;
      setTimeout(playNextColor, 600); // Delay between flashes
    }
  }

  playNextColor();
}

function nextSequence() {
  userClickPattern = []; // Reset the user's input for the current level
  level++;
  updateHighScore();
  $("h1").text("Level " + level);

  // Generate a new random color
  let randomNumber = Math.floor(Math.random() * buttonColours.length);
  let randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  setTimeout(() => {
    playGamePattern(); // Play the entire sequence
  }, 1000); // Delay before playing the sequence
}


// Handle user button clicks
$(".button").click(function () {
  let userChosenColour = $(this).attr("id");
  userClickPattern.push(userChosenColour);

  makeSound(userChosenColour);
  animatePress(userChosenColour);

  checkAnswer(userClickPattern.length - 1);
});

// Check user input against the game sequence
function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickPattern[currentLevel]) {
    if (userClickPattern.length === gamePattern.length) {
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    gameOver();
  }
}

// Update high score if the current level surpasses it
function updateHighScore() {
  if (level - 1 > highScore) {
    highScore = level - 1; // Adjust for 1-based level display
    localStorage.setItem("highScore", highScore);
  }
}

// Game over sequence
function gameOver() {
  makeSound("wrong");
  $("body").addClass("game-over");
  $("h1").text("Game Over! Press Any Key to Restart");

  setTimeout(() => {
    $("body").removeClass("game-over");
  }, 200);

  startOver();
}

// Reset the game state
function startOver() {
  updateHighScore();
  updateScoreboard();
  level = 0;
  gamePattern = [];
  userClickPattern = [];
  started = false;
}

// Play sound effects based on button colors
function makeSound(color) {
  let audio = new Audio(`./sounds/${color}.mp3`);
  audio.play();
}

// Add visual animation to button clicks
function animatePress(currentColor) {
  $("#" + currentColor).addClass("pressed");
  setTimeout(() => {
    $("#" + currentColor).removeClass("pressed");
  }, 100);
}
