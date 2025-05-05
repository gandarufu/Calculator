const buttonsNumbers = document.querySelectorAll(".num");
const buttonsOperators = document.querySelectorAll(".operator");
const buttonAllClear = document.querySelector("#allclear");
const buttonPlusMinus = document.querySelector("#plusminus");
const buttonPercent = document.querySelector("#percent");
const buttonEqual = document.querySelector("#equal");

const inputDisplay = document.querySelector(".input-display");
const inputArray = [];

const MAXDIGITS = 12;

resetDisplay();
// EventListeners

function resetDisplay() {
  inputArray.length = 0;
  inputDisplay.innerText = "0";
}

buttonAllClear.addEventListener("click", () => {
  resetDisplay();
});

buttonsNumbers.forEach((button) => {
  button.addEventListener("click", (e) => {
    const value = e.target.innerText;
    const inputLength = inputArray.includes("<span class='dot'>.</span>")
      ? inputArray.length - 1
      : inputArray.length;
    if (inputLength < MAXDIGITS) {
      // only one dot
      if (value === "." && inputArray.includes("<span class='dot'>.</span>"))
        return;
      if (value === ".")
        inputArray.push("<span class='dot'>" + value + "</span>");
      else inputArray.push(value);
      // console.log(inputArray);
      const inputString = inputArray.join("");
      inputDisplay.innerHTML = inputString;
    }
  });
});
