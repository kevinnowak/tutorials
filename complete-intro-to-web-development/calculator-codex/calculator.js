const display = document.querySelector("#calculator-display");
const keypad = document.querySelector(".calculator__keys");

const operations = {
  add: (left, right) => left + right,
  subtract: (left, right) => left - right,
  multiply: (left, right) => left * right,
  divide: (left, right) => (right === 0 ? NaN : left / right),
};

const keyboardMap = new Map([
  ["+", { action: "operator", operator: "add" }],
  ["-", { action: "operator", operator: "subtract" }],
  ["*", { action: "operator", operator: "multiply" }],
  ["/", { action: "operator", operator: "divide" }],
  ["Enter", { action: "equals" }],
  ["=", { action: "equals" }],
  ["Backspace", { action: "backspace" }],
  ["Escape", { action: "clear" }],
  ["Delete", { action: "clear" }],
]);

const state = {
  displayValue: "0",
  firstOperand: null,
  waitingForSecondOperand: false,
  operator: null,
  lastOperation: null,
};

keypad.addEventListener("click", (event) => {
  const key = event.target.closest("button[data-action]");

  if (!key) return;

  dispatch({
    action: key.dataset.action,
    value: key.dataset.value,
    operator: key.dataset.operator,
  });
});

document.addEventListener("keydown", (event) => {
  const command = getKeyboardCommand(event);

  if (!command) return;

  event.preventDefault();
  dispatch(command);
  animateKey(command);
});

function dispatch(command) {
  const handlers = {
    digit: inputDigit,
    decimal: inputDecimal,
    operator: chooseOperator,
    equals: calculateResult,
    backspace: backspace,
    clear: resetCalculator,
  };

  handlers[command.action]?.(command);
  render();
}

function inputDigit({ value }) {
  if (state.waitingForSecondOperand) {
    state.displayValue = value;
    state.waitingForSecondOperand = false;
    return;
  }

  state.displayValue = state.displayValue === "0" ? value : state.displayValue + value;
}

function inputDecimal() {
  if (state.waitingForSecondOperand) {
    state.displayValue = "0.";
    state.waitingForSecondOperand = false;
    return;
  }

  if (!state.displayValue.includes(".")) {
    state.displayValue += ".";
  }
}

function chooseOperator({ operator }) {
  const inputValue = Number(state.displayValue);

  if (state.operator && state.waitingForSecondOperand) {
    state.operator = operator;
    return;
  }

  if (state.firstOperand === null) {
    state.firstOperand = inputValue;
  } else if (state.operator) {
    const result = performCalculation(state.firstOperand, inputValue, state.operator);
    state.displayValue = formatNumber(result);
    state.firstOperand = result;
  }

  state.operator = operator;
  state.waitingForSecondOperand = true;
  state.lastOperation = null;
}

function calculateResult() {
  if (!state.operator && !state.lastOperation) return;

  const operation = state.operator
    ? { operator: state.operator, rightOperand: Number(state.displayValue) }
    : state.lastOperation;

  const leftOperand = state.operator ? state.firstOperand : Number(state.displayValue);
  const result = performCalculation(leftOperand, operation.rightOperand, operation.operator);

  state.displayValue = formatNumber(result);
  state.firstOperand = null;
  state.operator = null;
  state.waitingForSecondOperand = true;
  state.lastOperation = operation;
}

function backspace() {
  if (state.waitingForSecondOperand) return;

  state.displayValue = state.displayValue.length > 1
    ? state.displayValue.slice(0, -1)
    : "0";
}

function resetCalculator() {
  state.displayValue = "0";
  state.firstOperand = null;
  state.waitingForSecondOperand = false;
  state.operator = null;
  state.lastOperation = null;
}

function performCalculation(leftOperand, rightOperand, operator) {
  return operations[operator](leftOperand, rightOperand);
}

function formatNumber(value) {
  if (!Number.isFinite(value)) return "Error";

  const rounded = Number.parseFloat(value.toPrecision(12));
  return rounded.toLocaleString("en-US", {
    maximumFractionDigits: 10,
    useGrouping: false,
  });
}

function getKeyboardCommand(event) {
  if (/^\d$/.test(event.key)) {
    return { action: "digit", value: event.key };
  }

  if (event.key === ".") {
    return { action: "decimal" };
  }

  return keyboardMap.get(event.key);
}

function animateKey(command) {
  const selector = command.value
    ? `[data-value="${command.value}"]`
    : `[data-action="${command.action}"]${command.operator ? `[data-operator="${command.operator}"]` : ""}`;
  const key = keypad.querySelector(selector);

  if (!key) return;

  key.classList.add("is-pressed");
  window.setTimeout(() => key.classList.remove("is-pressed"), 100);
}

function render() {
  display.value = state.displayValue;
  display.textContent = state.displayValue;

  keypad.querySelectorAll(".key--operator").forEach((key) => {
    key.classList.toggle(
      "is-selected",
      state.waitingForSecondOperand && key.dataset.operator === state.operator,
    );
  });
}
