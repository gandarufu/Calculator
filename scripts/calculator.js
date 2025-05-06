const allButtons = document.querySelectorAll(".btn");
const buttonsNumbers = document.querySelectorAll(".num");
const buttonsOperators = document.querySelectorAll(".operator");
const buttonAllClear = document.querySelector("#allclear");
const buttonPlusMinus = document.querySelector("#plusminus");
const buttonErase = document.querySelector("#erase");
const buttonEqual = document.querySelector("#equal");

const inputNumbers = document.querySelector(".input-numbers");
const inputOperators = document.querySelector(".input-operators");

let numberA = "0";
let numberB = null;
let currentOperator = null;
let lastActionWasEqual = false;
let lastOperator = null;
let lastNumberB = null;

const MAXDIGITS = 12;
const audio = document.getElementById("audio");

resetDisplay();

// Math functions
function add(a, b) {
  return a + b;
}
function subtract(a, b) {
  return a - b;
}
function multiply(a, b) {
  return a * b;
}
function divide(a, b) {
  return b === 0 ? "Error" : a / b;
}

function operate(a, b, operator) {
  // console.log(`${a} ${operator} ${b}`);
  switch (operator) {
    case "+":
      return add(a, b);
    case "-":
      return subtract(a, b);
    case "x":
      return multiply(a, b);
    case "/":
      return divide(a, b);
    default:
      return "Error";
  }
}

function calculate() {
  if (numberA !== null && numberB !== null && currentOperator) {
    lastOperator = currentOperator;
    lastNumberB = numberB;

    const result = operate(
      parseFloat(numberA),
      parseFloat(numberB),
      currentOperator
    );
    handleResult(result);
  }
}

// helper functions
function play() {
  audio.currentTime = 0; // Reset audio to start
  audio.play();
}

function toggleSign(value) {
  if (!value) return "0";
  if (value === "0" || value === "-0") return "0";
  let newValue = value.startsWith("-") ? value.slice(1) : "-" + value;

  const adjustedLimit = newValue.toString().includes(".")
    ? MAXDIGITS + 1
    : MAXDIGITS;
  if (newValue.length > adjustedLimit) return value;
  return newValue;
}

function resetDisplay() {
  numberA = "0";
  numberB = null;
  currentOperator = null;
  lastOperator = null;
  lastNumberB = null;
  inputNumbers.innerText = "0";
  inputOperators.innerText = "";
}

function formatNumberForDisplay(num) {
  if (num === null || num === "") return "0";
  const numStr = num.toString();
  if (numStr.includes(".")) {
    const parts = numStr.split(".");
    return parts[0] + '<span class="dot">.</span>' + parts[1];
  }
  return numStr;
}

function updateDisplay() {
  const displayValue = numberB !== null ? numberB : numberA;
  inputNumbers.innerHTML = formatNumberForDisplay(displayValue);
  inputOperators.innerHTML = numberB !== null ? "" : currentOperator;
  // console.log({ numberA, currentOperator, numberB });
}

function handleResult(result) {
  if (result === "Error") {
    resetDisplay();
    inputNumbers.innerText = "Error";
    return;
  }

  let formattedResult = result;
  if (typeof result === "number") {
    if (Math.abs(result) > 1e11) {
      formattedResult = result.toExponential(MAXDIGITS - 7);
    } else if (
      result.toString().includes(".") &&
      result.toString().length > MAXDIGITS
    ) {
      formattedResult = parseFloat(
        result.toFixed(MAXDIGITS - result.toString().split(".")[0].length)
      );
    }
  }

  numberA = formattedResult.toString();
  numberB = null;
  currentOperator = null;
  updateDisplay();
}

function handleNumberInput(input) {
  if (lastActionWasEqual) {
    numberA = "";
    currentOperator = null;
    lastActionWasEqual = false;
  }

  let target = currentOperator ? "numberB" : "numberA";
  let currentValue = (target === "numberA" ? numberA : numberB) || "";

  if (input === "." && currentValue.includes(".")) return;
  if (input === "." && currentValue === "") currentValue = "0.";
  if (input !== "." && currentValue === "0") currentValue = "";
  if (currentValue.replace(".", "").length >= MAXDIGITS) return;

  currentValue += input;

  // make sure only one dot is present
  if (currentValue.split(".").length > 2) {
    currentValue = currentValue.replace(/\.+$/, ".");
  }

  if (target === "numberA") {
    numberA = currentValue;
  } else {
    numberB = currentValue;
  }

  updateDisplay();
}

// handlers
function handleEqualClick() {
  if (numberA !== null && numberB !== null && currentOperator) {
    calculate();
    lastActionWasEqual = true;
  } else if (lastActionWasEqual && lastOperator && lastNumberB) {
    numberB = lastNumberB;
    currentOperator = lastOperator;
    calculate();
    lastActionWasEqual = true;
  }
}

function handleEraseClick() {
  if (lastActionWasEqual) {
    resetDisplay();
    return;
  }

  if (numberB !== null) {
    numberB = numberB.slice(0, -1) || null;
  } else if (currentOperator) {
    currentOperator = null;
  } else if (numberA !== null) {
    numberA = numberA.slice(0, -1) || "0";
  }
  if (numberB === "-") {
    numberB = "0";
  }
  if (numberA === "-") {
    numberA = "0";
  }
  updateDisplay();
}

function handlePlusMinusClick() {
  if (currentOperator && numberB !== null) {
    numberB = toggleSign(numberB);
  } else if (!currentOperator && parseFloat(numberA) !== null) {
    numberA = toggleSign(numberA);
  }
  updateDisplay();
}

function handleOperatorClick(e) {
  const operator = e.target.getAttribute("data-operator");
  if (!operator) return;

  lastActionWasEqual = false;

  if (numberA !== null && numberB !== null) {
    calculate();
  }

  currentOperator = operator;
  updateDisplay();
}

function handleNumbersClick(e) {
  handleNumberInput(e.target.innerText);
}

// Event listeners
allButtons.forEach((button) => {
  button.addEventListener("mousedown", (e) => {
    play();
  });
});
buttonEqual.addEventListener("mousedown", handleEqualClick);
buttonAllClear.addEventListener("mousedown", resetDisplay);
buttonErase.addEventListener("mousedown", handleEraseClick);
buttonPlusMinus.addEventListener("mousedown", handlePlusMinusClick);
buttonsOperators.forEach((button) => {
  button.addEventListener("mousedown", (e) => handleOperatorClick(e));
});
buttonsNumbers.forEach((button) => {
  button.addEventListener("mousedown", (e) =>
    handleNumberInput(e.target.innerText)
  );
});

// Add keyboard support for calculator
document.addEventListener("keydown", handleKeyPress);

// Map keyboard keys to calculator functions
function handleKeyPress(e) {
  // Prevent default actions
  if (
    /^[0-9.+\-*/=]$/.test(e.key) ||
    e.key === "Backspace" ||
    e.key === "Delete" ||
    e.key === "Escape" ||
    e.key === "p"
  ) {
    e.preventDefault();
    play();
  }

  let buttonPressed = null;

  // Map number keys
  if (/^[0-9.]$/.test(e.key)) {
    buttonPressed = [...buttonsNumbers].find((btn) => btn.innerText === e.key);
    handleNumberInput(e.key);
  }

  // Map operators
  switch (e.key) {
    case "+":
    case "-":
    case "/":
      buttonPressed = [...buttonsOperators].find(
        (btn) => btn.getAttribute("data-operator") === e.key
      );
      simulateOperatorClick(e.key);
      break;
    case "*":
    case "x":
      buttonPressed = [...buttonsOperators].find(
        (btn) => btn.getAttribute("data-operator") === "x"
      );
      simulateOperatorClick("x");
      break;

    case "=":
    case "Enter":
      buttonPressed = buttonEqual;
      handleEqualClick();
      break;

    case "Escape":
      buttonPressed = buttonAllClear;
      resetDisplay();
      break;

    case "Backspace":
    case "Delete":
      buttonPressed = buttonErase;
      handleEraseClick();
      break;

    case "p":
    case "`":
      buttonPressed = buttonPlusMinus;
      handlePlusMinusClick();
      break;
  }

  // Add active class to simulate button press
  if (buttonPressed) {
    buttonPressed.classList.add("active");

    setTimeout(() => {
      buttonPressed.classList.remove("active");
    }, 100);
  }
}

// Helper function to simulate operator button click
function simulateOperatorClick(operatorSymbol) {
  const operatorButtons = document.querySelectorAll(".operator");
  for (const button of operatorButtons) {
    if (button.getAttribute("data-operator") === operatorSymbol) {
      handleOperatorClick({ target: button });
      return;
    }
  }
}
