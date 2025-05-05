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

const MAXDIGITS = 13;

//  initialize
resetDisplay();

function resetDisplay() {
  inputArrayNumberA.length = 0;
  inputArrayNumberB.length = 0;
  inputArrayOperators.length = 0;
  inputNumbers.innerText = "0";
  inputOperatos.innerText = "";
}

function updateDisplay() {
  const inputStringA = inputArrayNumberA.join("");
  const inputStringB = inputArrayNumberB.join("");

  if (inputArrayNumberB.length === 0) {
    inputNumbers.innerHTML = inputStringA ? inputStringA : "0";
    inputOperatos.innerHTML = inputArrayOperators[0]
      ? inputArrayOperators[0]
      : "";
  } else {
    inputNumbers.innerHTML = inputStringB ? inputStringB : "0";
    inputOperatos.innerHTML = "";
  }

  console.log("Input A", inputArrayNumberA);
  console.log("Input B", inputArrayNumberB);
}

function handleArrayInput(array, input) {
  if (array.length < MAXDIGITS) {
    if (input === ".") {
      if (array.includes("<span class='dot'>.</span>")) return;
      if (array.length === 0) {
        array.push(0);
        array.push("<span class='dot'>.</span>");
        updateDisplay();
        return;
      }
      array.push("<span class='dot'>.</span>");
      updateDisplay();
      return;
    } else array.push(input);
    updateDisplay();
  }
}

// event listeners
buttonAllClear.addEventListener("click", () => {
  resetDisplay();
});

buttonErase.addEventListener("click", () => {
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
    inputArrayNumberA.pop();
    if (inputArrayNumberA[inputArrayNumberA.length - 1] === 0)
      inputArrayNumberA.length = 0;
    updateDisplay();
  }
});

buttonsOperators.forEach((button) => {
  button.addEventListener("click", (e) => {
    const operator = e.target.getAttribute("data-operator");
    if (inputArrayNumberA.length > 0) {
      inputArrayOperators.length = 0;
      inputArrayOperators.push(operator);
      updateDisplay();
    }
  });
});

buttonsNumbers.forEach((button) => {
  button.addEventListener("click", (e) => {
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
