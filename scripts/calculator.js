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
  const inputString = inputArrayNumberA.join("");
  inputNumbers.innerHTML = inputString ? inputString : "0";
  inputOperatos.innerHTML = inputArrayOperators[0]
    ? inputArrayOperators[0]
    : "";
  console.log(inputArrayNumberA);
}

// event listeners
buttonAllClear.addEventListener("click", () => {
  resetDisplay();
});

buttonErase.addEventListener("click", () => {
  if (inputArrayOperators.length === 1) {
    inputArrayOperators.pop();
    updateDisplay();

    return;
  }
  if (inputArrayNumberA.length > 0) {
    inputArrayNumberA.pop();
    updateDisplay();
  }
});

buttonsOperators.forEach((button) => {
  button.addEventListener("click", (e) => {
    const operator = e.target.getAttribute("data-operator");
    if (inputArrayNumberA.length > 0) {
      inputArrayOperators.splice(-1, 1, operator);
      updateDisplay();
    }
  });
});

buttonsNumbers.forEach((button) => {
  button.addEventListener("click", (e) => {
    const input = e.target.innerText;
    if (inputArrayNumberA.length < MAXDIGITS) {
      // only one dot
      if (
        input === "." &&
        inputArrayNumberA.includes("<span class='dot'>.</span>")
      )
        return;
      if (input === ".")
        inputArrayNumberA.push("<span class='dot'>" + input + "</span>");
      else inputArrayNumberA.push(input);
      updateDisplay();
    }
  });
});
