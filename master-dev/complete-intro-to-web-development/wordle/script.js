// Getting all the elements
const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const ROUNDS = 6;

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function setLoading(isLoading) {
  loadingDiv.classList.toggle("hidden", !isLoading);
}

function makeMap(array) {
  const obj = {};

  for (let i = 0; i < array.length; i++) {
    const letter = array[i];

    if (obj[letter]) {
      obj[letter]++;
    } else {
      obj[letter] = 1;
    }
  }

  return obj;
}

// Ensuring the typing works
async function init() {
  let isLoading = true;

  // Grabbing the word of the day
  const res = await fetch("https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  // Another approach called "destructuring": const { word } = await res.json();
  const wordParts = word.split("");
  const map = makeMap(wordParts);
  let done = false;

  setLoading(false);
  isLoading = false;

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

    const guessParts = currentGuess.split("");

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      // Mark as correct
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
      if (guessParts[i] === wordParts[i]) {
        // Do nothing
      } else if (wordParts.includes(guessParts[i]) && map[guessParts[i]] > 0) {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
      } else {
        letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
      }
    }

    currentRow++;

    if (currentGuess === word) {
      alert("You have won!");
      done = true;
    } else if (currentRow === ROUNDS) {
      alert(`You lost! The word was ${word}`);
      done = true;
    }

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
    if (done || isLoading) {
      // Do nothing
      return;
    }

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
