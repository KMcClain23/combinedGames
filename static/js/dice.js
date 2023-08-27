// DOM elements
const diceContainer = document.getElementById("dice");
const rollResultElement = document.getElementById("roll-result");
const scoreResultElement = document.getElementById("score-result");
const totalScoreElement = document.getElementById("total-score");
const winMessage = document.getElementById("win-message");
const rollButton = document.getElementById("roll-button");
const restartButton = document.getElementById("restart-button");


// Initialize game variables
let totalScore = 0;
const targetScore = 10000;
const diceImages = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

// Function to roll a single die
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Function to calculate the score for a roll
function calculateScore(diceValues) {
    let score = 0;

    // Count the occurrences of each number (1-6)
    const counts = [0, 0, 0, 0, 0, 0];
    for (const value of diceValues) {
        counts[value - 1]++;
    }

    // Calculate scores based on the rules
    for (let i = 0; i < 6; i++) {
        if (counts[i] >= 3) {
            if (i === 0) {
                score += 1000;
            } else {
                score += (i + 1) * 100;
            }
            counts[i] -= 3;
        }

        if (i === 0 && counts[i] > 0) {
            score += counts[i] * 100;
        } else if (i === 4 && counts[i] > 0) {
            score += counts[i] * 50;
        }
    }

    if (diceValues.join("") === "123456") {
        score += 1500;
    }

    return score;
}

// Function to update the total score
function updateTotalScore(score) {
    totalScore += score;
    totalScoreElement.textContent = totalScore;

    if (totalScore >= targetScore) {
        winMessage.textContent = "Congratulations! You won the game!";
        rollButton.disabled = true;
    }
}

// Function to display the dice roll and score

function displayRoll(diceValues, score) {
    diceContainer.textContent = diceValues.map((value) => diceImages[value - 1]).join(" ");

    const rollText = `Roll: [${diceValues.join(", ")}]`;
    const scoreText = `Score: ${score}`;

    rollResultElement.textContent = rollText;
    scoreResultElement.textContent = scoreText;

    // // Clear previous roll and score after a delay
    // clearTimeout(displayRoll.timeoutId);
    // displayRoll.timeoutId = setTimeout(() => {
    //     rollResultElement.textContent = "";
    //     scoreResultElement.textContent = "";
    // }, 4000);

    // Add the current roll and score to the history (if desired)
    const rollListItem = document.createElement("p");
    rollListItem.textContent = rollText;
    scoreList.appendChild(rollListItem);

    const scoreListItem = document.createElement("p");
    scoreListItem.textContent = scoreText;
    scoreScores.appendChild(scoreListItem);
}

// Function to handle a dice roll
function rollDice() {
    // Roll six dice
    const diceValues = [];
    for (let i = 0; i < 6; i++) {
        const value = rollDie();
        diceValues.push(value);
    }

    // Display the dice roll
    diceContainer.textContent = diceValues.map((value) => diceImages[value - 1]).join(" ");

    // Calculate the score for the roll
    const score = calculateScore(diceValues);

    // Update the total score and display the roll
    updateTotalScore(score);
    displayRoll(diceValues, score);
}

function restartGame() {
    // Reset game variables, scores, and any other necessary logic
    totalScore = 0;
    totalScoreElement.textContent = totalScore;
    winMessage.textContent = "";
    rollButton.disabled = false;

    // Clear roll and score displays
    diceContainer.textContent = "";
    rollResultElement.textContent = "";
    scoreResultElement.textContent = "";

    // Clear the history of rolls and scores
    scoreList.innerHTML = "";
    scoreScores.innerHTML = "";

    // Remove any remaining confetti elements from the DOM
    const confettiElements = document.querySelectorAll(".confetti");
    confettiElements.forEach((element) => {
        document.body.removeChild(element);
    });
}

// Add click event listener to the roll button
rollButton.addEventListener("click", rollDice);
restartButton.addEventListener("click", restartGame);

