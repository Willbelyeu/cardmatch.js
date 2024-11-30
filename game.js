// Word pairs data
const wordSets = [
    { word: "Cat", match: "Feline" },
    { word: "Dog", match: "Canine" },
    { word: "Car", match: "Vehicle" },
    { word: "Tree", match: "Plant" },
    { word: "Book", match: "Literature" },
    { word: "Moon", match: "Satellite" },
    { word: "Sun", match: "Star" },
    { word: "Fish", match: "Aquatic" }
];

// State variables
let firstCard = null;
let secondCard = null;
let matchedPairs = 0;

// Shuffle the cards randomly
function shuffleCards(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap elements
    }
}

// Create the cards and add them to the game board
function createGameBoard() {
    const gameBoard = document.getElementById("game-board");
    let cards = [];
    
    // Create cards from wordSets
    wordSets.forEach(pair => {
        cards.push({ type: 'word', value: pair.word, match: pair.match });
        cards.push({ type: 'match', value: pair.match, match: pair.word });
    });

    shuffleCards(cards); // Shuffle the cards randomly

    // Generate the HTML for each card
    cards.forEach(card => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.innerHTML = `
            <div class="front-face"></div>
            <div class="back-face">${card.value}</div>
        `;
        cardElement.addEventListener("click", () => onCardClick(cardElement, card));
        gameBoard.appendChild(cardElement);
    });

    // Initially flip all cards to their backsides for 2 seconds
    setTimeout(() => {
        document.querySelectorAll('.card').forEach(card => {
            card.classList.add('revealed');
        });

        // Flip all cards back after 2 seconds
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                card.classList.remove('revealed');
            });
        }, 2000);
    }, 100);
}

// Handle card click
function onCardClick(cardElement, card) {
    // Ignore clicks on matched cards or if two cards are already revealed
    if (cardElement.classList.contains("revealed") || cardElement.classList.contains("matched") || secondCard) {
        return;
    }

    // Reveal the card
    cardElement.classList.add("revealed");

    // First card selected
    if (!firstCard) {
        firstCard = { cardElement, card };
    }
    // Second card selected
    else {
        secondCard = { cardElement, card };
        checkForMatch();
    }
}

// Check if the two selected cards match
function checkForMatch() {
    console.log('First Card:', firstCard.card.value, 'Second Card:', secondCard.card.value);

    // Check if the two cards are a word-match pair from the same wordSet
    if ((firstCard.card.value === secondCard.card.match) || (firstCard.card.match === secondCard.card.value)) {
        // Cards match
        firstCard.cardElement.classList.add("matched");
        secondCard.cardElement.classList.add("matched");
        matchedPairs++;

        // Reset for the next pair
        resetCards();

        // Check if all pairs are matched
        if (matchedPairs === wordSets.length) {
            showSuccessScreen();
        }
    } else {
        // Cards don't match
        setTimeout(() => {
            firstCard.cardElement.classList.remove("revealed");
            secondCard.cardElement.classList.remove("revealed");
            resetCards();
        }, 2000);
    }
}

// Reset the selected cards
function resetCards() {
    firstCard = null;
    secondCard = null;
}

// Show success message when all pairs are matched
function showSuccessScreen() {
    const successMessage = document.createElement("div");
    successMessage.classList.add("success");
    successMessage.innerHTML = `
        <h2>Congratulations! You've matched all pairs!</h2>
    `;
    document.body.appendChild(successMessage);

    // Enable the restart button
    document.getElementById("restart-btn").style.display = "block";
}

// Restart the game
function restartGame() {
    location.reload(); // Reload the page to restart the game
}

// Start the game
createGameBoard();
document.getElementById("restart-btn").style.display = "none"; // Hide restart button at the start
