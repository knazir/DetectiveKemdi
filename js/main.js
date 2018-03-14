const errorElement = document.querySelector("#error");
const inputsList = document.querySelector("#inputs-list");
const answersTitle = document.querySelector("#answers-title");
const answersList = document.querySelector("#answers-list");
const guessInput = document.querySelector("#num");
const circlesSelect = document.querySelector("#circles");
const trianglesSelect = document.querySelector("#triangles");

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let guesses = [];
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

function inputValid() {
  const numStr = guessInput.value;
  const num = Number(numStr);
  if (isNaN(num) || num < 100 || num > 999) return setError("Please enter a 3-digit number");

  const chars = {};
  for (let i = 0; i < numStr.length; i++) {
    if (chars[numStr[i]]) return setError("All three digits must be unique");
    else if (numStr[i] === "0") return setError("0 is not a valid digit");
    chars[numStr[i]] = true;
  }

  const circles = Number(circlesSelect.value);
  if (isNaN(circles)) return setError("Please select the number of circles");
  const triangles = Number(trianglesSelect.value);
  if (isNaN(triangles)) return setError("Please select the number of triangles");
  return true;
}

function containsForbiddenDigit(num) {
  const numStr = String(num);
  for (let i = 0; i < numStr.length; i++) {
      if (forbiddenDigits.indexOf(Number(numStr[i])) !== -1) return true;
  }
  return false;
}

function guess() {
  setError("");
  if (!inputValid()) return;
  const num = Number(guessInput.value);
  const circles = Number(circlesSelect.value);
  const triangles = Number(trianglesSelect.value);
  addGuessToDisplay(num, circles, triangles);
}


// init
(function () {
  for (let i = 100; i <= 999; i++) {
    if (!containsForbiddenDigit(i)) answers.push(i);
  }
  renderAnswers();
})();