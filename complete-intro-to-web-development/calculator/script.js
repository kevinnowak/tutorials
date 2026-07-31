// State variables to hold calculator data independent of the DOM
let runningTotal = 0;
let buffer = "0";
let previousOperator = null;
let awaitingNextValue = false; // Flag to indicate if we are ready for a new number

const display = document.querySelector(".display");

// We use event delegation to attach a single listener to the parent container.
// This is more performant and easier to maintain than attaching listeners to each button.
document
  .querySelector(".calculator")
  .addEventListener("click", function (event) {
    // Find the closest button element to the click target
    const target = event.target.closest("button");
    if (!target) return; // Ignore clicks that aren't on buttons

    const action = target.dataset.action;
    const value = target.dataset.value;

    if (value !== undefined) {
      handleNumber(value);
    } else if (action !== undefined) {
      handleAction(action);
    }

    // Update the display after the state has changed
    display.innerText = buffer;
  });

function handleNumber(numberString) {
  // If we just pressed an operator or the display is "0", start a new number
  if (buffer === "0" || awaitingNextValue) {
    buffer = numberString;
    awaitingNextValue = false;
  } else {
    // Otherwise, append the digit to the current number
    buffer += numberString;
  }
}

function handleAction(action) {
  switch (action) {
    case "clear":
      buffer = "0";
      runningTotal = 0;
      previousOperator = null;
      awaitingNextValue = false;
      break;
    case "backspace":
      // We shouldn't backspace if we're looking at an evaluated result
      if (awaitingNextValue) return;

      if (buffer.length === 1) {
        buffer = "0";
      } else {
        buffer = buffer.substring(0, buffer.length - 1);
      }
      break;
    case "equal":
      if (previousOperator === null || awaitingNextValue) {
        // Nothing to evaluate
        return;
      }
      flushOperation(parseFloat(buffer));
      previousOperator = null;
      buffer = runningTotal.toString();
      runningTotal = 0;
      awaitingNextValue = true; // Next number should clear the display
      break;
    default:
      // All other actions are mathematical operations (add, subtract, etc.)
      handleMath(action);
      break;
  }
}

function handleMath(action) {
  // If the user already pressed an operator and presses another,
  // we just change the pending operator without doing math.
  if (awaitingNextValue) {
    if (previousOperator === null) {
      // If we just pressed equals, we want to continue math using the displayed result.
      runningTotal = parseFloat(buffer);
    }
    previousOperator = action;
    return;
  }

  // Use parseFloat so we don't drop decimals (even if this calculator currently has no decimal button, it's safer)
  const floatBuffer = parseFloat(buffer);

  if (runningTotal === 0 && previousOperator === null) {
    // First time an operator is pressed, just store the number
    runningTotal = floatBuffer;
  } else {
    // Consecutive operations (e.g. 5 + 5 + ...), we evaluate before storing the new operator
    flushOperation(floatBuffer);
  }

  previousOperator = action;
  buffer = runningTotal.toString(); // Show the intermediate result
  awaitingNextValue = true;
}

function flushOperation(floatBuffer) {
  switch (previousOperator) {
    case "add":
      runningTotal += floatBuffer;
      break;
    case "subtract":
      runningTotal -= floatBuffer;
      break;
    case "multiply":
      runningTotal *= floatBuffer;
      break;
    case "divide":
      runningTotal /= floatBuffer;
      break;
  }
}
