const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1);
  const secondNum = parseFloat(n2);

  if (operator === "add") return firstNum + secondNum;
  if (operator === "subtract") return firstNum - secondNum;
  if (operator === "multiply") return firstNum * secondNum;
  if (operator === "divide") return firstNum / secondNum;
};

const getKeyType = key => {
  const { action } = key.dataset;
  if (!action) return "number";
  if (
  action === "add" ||
  action === "subtract" ||
  action === "divide" ||
  action === "multiply")
  return "operator";
  return action;
};

const updateCalculatorState = (key, calculator, calculatedValue, displayedNumber) => {
  const keyType = getKeyType(key);
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType } =
  calculator.dataset;

  calculator.dataset.previousKeyType = keyType;

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action;
    calculator.dataset.firstValue = firstValue &&
    operator &&
    previousKeyType !== 'operator' &&
    previousKeyType !== 'calculate' ?
    calculatedValue :
    displayedNumber;
  }

  if (keyType === 'all-clear' && key.textContent === 'AC') {
    calculator.dataset.firstValue = '';
    calculator.dataset.modValue = '';
    calculator.dataset.operator = '';
    calculator.dataset.previousKeyType = '';
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate' ?
    modValue :
    displayedNumber;
  }

};

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key);
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'));

  if (keyType === 'operator') key.classList.add('is-depressed');
  if (keyType === 'all-clear' && key.textContent !== 'AC') key.textContent = 'AC';

  if (keyType !== 'all-clear') {
    const clearButton = calculator.querySelector('[data-action=all-clear]');
    clearButton.textContent = 'CE';
  }
};

const createResultString = (key, displayedNumber, state) => {
  const keyContent = key.textContent;
  const keyType = getKeyType(key);
  const {
    firstValue,
    modValue,
    operator,
    previousKeyType } =
  state;


  if (keyType === "number") {
    return displayedNumber === "0" ||
    previousKeyType === "operator" ||
    previousKeyType === "equals" ?
    keyContent :
    displayedNumber + keyContent;
  }

  if (keyType === 'decimal') {
    if (previousKeyType === "operator" || previousKeyType === "equals") return "0.";
    if (!displayedNumber.includes('.')) return displayedNumber + ".";
    return displayedNumber;
  }

  if (keyType === 'operator') {
    return firstValue &&
    operator &&
    previousKeyType !== 'operator' &&
    previousKeyType !== 'calculate' ?
    calculate(firstValue, operator, displayedNumber) :
    displayedNumber;
  }

  if (keyType === 'all-clear') return 0;

  if (keyType === 'equals') {
    return firstValue ?
    previousKeyType === 'calculate' ?
    calculate(displayedNum, operator, modValue) :
    calculate(firstValue, operator, displayedNumber) :
    displayedNumber;
  }
};




const calculator = document.querySelector(".container");
const keys = calculator.querySelector(".keys");
const display = document.querySelector(".screen");

keys.addEventListener("click", e => {
  if (!e.target.matches('button')) return;
  const key = e.target;
  const displayedNumber = display.textContent;
  const resultString = createResultString(key, displayedNumber, calculator.dataset);

  display.textContent = resultString;
  updateCalculatorState(key, calculator, resultString, displayedNumber);
  updateVisualState(key, calculator);
});