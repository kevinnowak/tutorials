// Getting all the elements
const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

// Ensuring the typing works
async function init() {
  let currentGuess = "";
  let currentRow = 0;

  function addLetter(letter) {
    if (currentGuess.length < ANSWER_LENGTH) {
      // Add letter to the end
      currentGuess += letter;
    } else {
      // Replace the last letter
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }

    letters[ANSWER_LENGTH * currentRow + currentGuess.length - 1].innerText =
      letter;
  }

  async function commit() {
    if (currentGuess.length !== ANSWER_LENGTH) {
      // Do nothing
      return;
    }

    currentRow++;
    currentGuess = "";
  }

  function backspace() {
    if (currentGuess.length > 0) {
      currentGuess = currentGuess.substring(0, currentGuess.length - 1);
      letters[ANSWER_LENGTH * currentRow + currentGuess.length].innerText = "";
    }
  }

  // Now we can do await wherever we want to here
  document.addEventListener("keydown", function handleKeypress(event) {
    const action = event.key;

    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      backspace();
    } else if (isLetter(action)) {
      addLetter(action.toUpperCase());
    } else {
      // Do nothing
    }
  });
}

init();
