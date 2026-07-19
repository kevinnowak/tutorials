function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

const grid = document.querySelector("#letterGrid");
const columns = 5;
const rows = 6;
const numberOfBoxes = columns * rows;

// Die 30 Eingabefelder automatisch erstellen
for (let index = 0; index < numberOfBoxes; index++) {
  const input = document.createElement("input");

  input.className = "letter-box";
  input.type = "text";
  input.maxLength = 1;
  input.inputMode = "text";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute(
    "aria-label",
    `Zeile ${Math.floor(index / columns) + 1}, Spalte ${(index % columns) + 1}`
  );

  grid.appendChild(input);
}
