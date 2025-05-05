const buttonsNumbers = document.querySelectorAll(".num");
const buttonsOperators = document.querySelectorAll(".operator");
const buttonAllClear = document.querySelector("#allclear");
const buttonPlusMinus = document.querySelector("#plusminus");
const buttonErase = document.querySelector("#erase");
const buttonEqual = document.querySelector("#equal");

const operators = ["+", "-", "x", "/"];
const inputNumbers = document.querySelector(".input-numbers");
const inputOperatos = document.querySelector(".input-operators");
const inputArrayNumberA = [];
const inputArrayNumberB = [];
const inputArrayOperators = [];

const MAXDIGITS = 12;

//  initialize
resetDisplay();

// math functions
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
  if (b === 0) return "Error";
  return a / b;
}

function operate(a, b, operator) {
  a = a.map((item) => {
    if (item === "<span class='dot'>.</span>") return ".";
    return item;
  });
  b = b.map((item) => {
    if (item === "<span class='dot'>.</span>") return ".";
    return item;
  });

  a = parseFloat(a.join(""));
  b = parseFloat(b.join(""));

  console.log(`${a} ${operator} ${b}`);
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
  if (inputArrayNumberA.length > 0 && inputArrayNumberB.length > 0) {
    const operator = inputArrayOperators[0];
    const result = operate(inputArrayNumberA, inputArrayNumberB, operator);
    console.log("=", result);
    handleResult(result);
  }
}

// helper functions
function resetDisplay() {
  inputArrayNumberA.length = 0;
  inputArrayNumberB.length = 0;
  inputArrayOperators.length = 0;
  inputNumbers.innerText = "0";
  inputOperatos.innerText = "";
}

function updateDisplay() {
  const inputStringA = inputArrayNumberA
    .join("")
    .replace(".", "<span class='dot'>.</span>");
  const inputStringB = inputArrayNumberB
    .join("")
    .replace(".", "<span class='dot'>.</span>");

  if (inputArrayNumberB.length === 0) {
    inputNumbers.innerHTML = inputStringA ? inputStringA : "0";
    inputOperatos.innerHTML = inputArrayOperators[0]
      ? inputArrayOperators[0]
      : "";
  } else {
    inputNumbers.innerHTML = inputStringB ? inputStringB : "0";
    inputOperatos.innerHTML = "";
  }
  console.log(inputArrayNumberA);
}

function handleResult(result) {
  resetDisplay();
  if (result.toString().length > MAXDIGITS) {
    result = result.toString().slice(0, MAXDIGITS + 1);
  }
  // push result as single sting elements to inputArrayNumberA
  inputArrayNumberA.length = 0;
  for (let i = 0; i < result.toString().length; i++) {
    inputArrayNumberA.push(result.toString()[i]);
  }
  // inputArrayNumberA.push(result);
  inputArrayNumberB.length = 0;
  updateDisplay();
}

function handleArrayInput(array, input) {
  const maxLength = array.includes(".") ? MAXDIGITS + 1 : MAXDIGITS;
  if (array.length < maxLength) {
    if (input === ".") {
      if (array.includes(".")) return;
      if (array.length === 0) {
        array.push(0);
        array.push(".");
        updateDisplay();
        return;
      }
      array.push(".");
      updateDisplay();
      return;
    } else array.push(input);
    updateDisplay();
  }
}

// event listeners
buttonEqual.addEventListener("mousedown", () => {
  if (inputArrayNumberA.length > 0 && inputArrayNumberB.length > 0) {
    calculate();
  }
});

buttonAllClear.addEventListener("mousedown", () => {
  resetDisplay();
});

buttonErase.addEventListener("mousedown", () => {
  if (inputArrayNumberB.length > 0) {
    inputArrayNumberB.pop();
    if (inputArrayNumberB[inputArrayNumberB.length - 1] === 0)
      inputArrayNumberA.length = 0;
    updateDisplay();
    return;
  }
  if (inputArrayOperators.length === 1) {
    inputArrayOperators.pop();
    updateDisplay();
    return;
  }
  if (inputArrayNumberA.length > 0) {
    // set to 0 if minus sign is the only element in the array
    if (inputArrayNumberA.length === 2 && inputArrayNumberA[0] === "-") {
      inputArrayNumberA.length = 0;
    }
    inputArrayNumberA.pop();
    if (inputArrayNumberA[inputArrayNumberA.length - 1] === 0)
      inputArrayNumberA.length = 0;
    updateDisplay();
  }
});

buttonsOperators.forEach((button) => {
  button.addEventListener("mousedown", (e) => {
    const operator = e.target.getAttribute("data-operator");
    if (
      inputArrayNumberA.length > 0 &&
      inputArrayNumberB.length === 0 &&
      operator
    ) {
      inputArrayOperators.length = 0;
      inputArrayOperators.push(operator);
      updateDisplay();
    }
  });
});

buttonsNumbers.forEach((button) => {
  button.addEventListener("mousedown", (e) => {
    const input = e.target.innerText;
    switch (inputArrayOperators.length) {
      case 0:
        handleArrayInput(inputArrayNumberA, input);
        break;
      case 1:
        handleArrayInput(inputArrayNumberB, input);
        break;
    }
  });
});
