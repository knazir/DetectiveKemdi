const errorElement = document.querySelector("#error");
const inputsList = document.querySelector("#inputs-list");
const answersTitle = document.querySelector("#answers-title");
const answersList = document.querySelector("#answers-list");
const guessInput = document.querySelector("#num");
const quickInput = document.querySelector("#quick");
const circlesSelect = document.querySelector("#circles");
const trianglesSelect = document.querySelector("#triangles");

let answers = [];
let forbiddenDigits = [0];

///////////////// DOM Methods /////////////////

function setError(message) {
  errorElement.innerText = message;
  return false;
}

function createSeparator() {
  const separator = document.createElement("span");
  separator.classList.add("separator");
  separator.innerText = "/";
  return separator;
}

function createInputItem(num, circles, triangles) {
  const listItem = document.createElement("li");
  listItem.classList.add("input-item");

  const numberSpan = document.createElement("span");
  numberSpan.classList.add("guess");
  numberSpan.innerText = num;
  listItem.appendChild(numberSpan);
  listItem.appendChild(createSeparator());

  const circlesSpan = document.createElement("span");
  circlesSpan.classList.add("circles");
  circlesSpan.innerText = circles;
  listItem.appendChild(circlesSpan);
  listItem.appendChild(createSeparator());

  const trianglesSpan = document.createElement("span");
  trianglesSpan.classList.add("triangles");
  trianglesSpan.innerText = triangles;
  listItem.appendChild(trianglesSpan);

  return listItem;
}

function addGuessToDisplay(num, circles, triangles) {
  inputsList.appendChild(createInputItem(num, circles, triangles));
  guessInput.value = "";
  quickInput.value = "";
  circlesSelect.selectedIndex = 0;
  trianglesSelect.selectedIndex = 0;
}

function renderAnswers() {
  answersTitle.innerText = `Possible Answers (${answers.length})`;
  answersList.innerHTML = "";
  answers.forEach(num => {
    const element = document.createElement("li");
    element.classList.add("answer-item");
    element.innerText = num;
    answersList.appendChild(element);
  });
}

///////////////// Algorithm /////////////////

function digitsInCommon(a, b) {
  const aDigits = getDigits(a);
  const bDigits = getDigits(b);
  return aDigits.filter(n => bDigits.indexOf(n) !== -1);
}

function numDigitsInCommon(a, b) {
  return digitsInCommon(a, b).length;
}

function digitsInSamePlace(a, b) {
  const aDigits = getDigits(a);
  const bDigits = getDigits(b);
  let result = [];
  for (let i = 0; i < aDigits.length; i++) {
    if (aDigits[i] === bDigits[i]) result.push(i);
  }
  return result;
}

function numDigitsInSamePlace(a, b) {
  return digitsInSamePlace(a, b).length;
}

function containsForbiddenDigit(num) {
  const numStr = String(num);
  for (let i = 0; i < numStr.length; i++) {
    if (forbiddenDigits.indexOf(Number(numStr[i])) !== -1) return true;
  }
  return false;
}

function containsDigit(num, digit) {
  const numStr = String(num);
  return numStr.indexOf(String(digit)) !== -1;
}

function containsUniqueDigits(num) {
  const numStr = String(num);
  const chars = {};
  for (let i = 0; i < numStr.length; i++) {
    if (chars[numStr[i]]) return false;
    chars[numStr[i]] = true;
  }
  return true;
}

function inputValid(num, circles, triangles) {
  const numStr = guessInput.value;
  if (isNaN(num) || num < 100 || num > 999) return setError("Please enter a 3-digit number");

  if (!containsUniqueDigits(num)) return setError("All three digits must be unique");
  if (containsDigit(num, 0)) return setError("0 is not a valid digit");

  if (isNaN(circles)) return setError("Please select the number of circles");
  if (isNaN(triangles)) return setError("Please select the number of triangles");

  if (circles + triangles > 3) return setError("The number of circles and triangles can be at most 3");

  return true;
}

function getDigits(num) {
  const result = [];
  const numStr = String(num);
  for (let i = 0; i < numStr.length; i++) result.push(Number(numStr[i]));
  return result;
}

function updateAnswers(num, circles, triangles) {
  const inCommon = circles + triangles;
  answers = answers.filter(answer => numDigitsInCommon(num, answer) === inCommon)
    .filter(answer => numDigitsInSamePlace(num, answer) === circles);
}

function guess() {
  setError("");
  const num = Number(guessInput.value);
  const circles = Number(circlesSelect.value);
  const triangles = Number(trianglesSelect.value);
  if (!inputValid(num, circles, triangles)) return;
  updateAnswers(num, circles, triangles);
  addGuessToDisplay(num, circles, triangles);
  renderAnswers();
}

function quickGuess() {
  setError("");
  const guessStr = quickInput.value.replace(/\s+/g, "");
  if (guessStr.length !== 5 || isNaN(Number(guessStr))) return setError("Must contain exactly 5 digits");
  const num = Number(guessStr.substr(0, 3));
  const circles = Number(guessStr[3]);
  const triangles = Number(guessStr[4]);
  if (!inputValid(num, circles, triangles)) return;
  updateAnswers(num, circles, triangles);
  addGuessToDisplay(num, circles, triangles);
  renderAnswers();
  quickInput.focus();
}

function handleQuickGuessKeyPress(event) {
  // enter
  if (event.which === 13) quickGuess();
}

// init
(function () {
  for (let i = 100; i <= 999; i++) {
    if (!containsForbiddenDigit(i) && containsUniqueDigits(i)) answers.push(i);
  }
  renderAnswers();
})();
