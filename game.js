const parseUrlParameters = parameter =>
  parameter //"?key1=value1&key2=value2&key3=value3"
    .substr(1) //"key1=value1&key2=value2&key3=value3"
    .split("&") //["key1=value1" "key2=value2" key3=value3"]
    .map(el => el.split("=")) //[["key1" "value1"] ["key2" "value2"] [key3" "value3"]]
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});
// dom references

const loader = document.getElementById("loader");
const game = document.getElementById("game");
const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const questionCounterText = document.getElementById("questionCounter");
const scoreText = document.getElementById("score");
const episodeNameText = document.getElementById("episodeName");
const contentNameText = document.getElementById("contentName");
const urlNameText = document.getElementById("episodeurl");
const params = parseUrlParameters(window.location.search);
const contentId = params.contentId;
const contributed = params.contributed;
const segmentBox = document.getElementById("segment-index");
const segmentButtons = document.getElementById("segment-buttons");
const choiceBox = document.getElementById("choice-box");
const openAnswerForm = document.getElementById("answer-form");
const saveAnswerBtn = document.getElementById("saveAnswerButton");
const openAnswerInput = document.getElementById("answer");
const correctAnswerBox = document.getElementById("correct-answer-box");
const redAnswer = document.getElementById("red-answer");
const improvementBtn = document.getElementById("improvement-btn");
const improvementForm = document.getElementById("improvement-form");
const exitImprovement = document.getElementById("exit-improvement");
const usernameInput = document.getElementById("username-input");
const feedback = document.getElementById("improvement-input");
const emailInput = document.getElementById("email-input");
const saveImprovementBtn = document.getElementById("save-improvement-button");
const improvementThnx = document.getElementById("improvement-thnx");

// state
let currentQuestion = {};
let acceptingAnswers = false;
let continueToNext = false;
let openFlag = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let maxQuestions = 20;
let isSegmentGame = false;

// config
const CORRECT_BONUS = 10;
const OPEN_PROBABILITY = 0.5;

const startGame = () => {
  if (!contributed && contentId !== "0")
    window.location.assign("user-questions.html?contentId=" + contentId);
  questionCounter = 0;
  score = 0;
  scoreText.innerText = score;
  loader.classList.add("hidden");
  if (contentId === "0") {
    game.classList.remove("hidden");
    availableQuestions = [...questions];
    maxQuestions = 50;
    getNewQuestion();
  } else if (contributed) {
    segmentBox.classList.remove("hidden");
    segmentSelector();
  }
};

const segmentSelector = () => {
  const segmentList = [
    ...new Set(questions.map(question => question.contentSegment))
  ];
  if (segmentList.length < 2) {
    game.classList.remove("hidden");
    availableQuestions = [...questions];
    segmentBox.classList.add("hidden");
    getNewQuestion();
  }
  createButtonInsideListItem(document.getElementById("all-btns"), "Play All!");
  segmentList.forEach(segment =>
    createButtonInsideListItem(segmentButtons, segment)
  );
};

const createButtonInsideListItem = (list, text) => {
  const li = document.createElement("li");
  list.appendChild(li);
  const button = document.createElement("button");
  li.appendChild(button);
  button.innerText = text;
  if (text === "Play All!") {
    button.classList.add("all-btn");
  } else {
    button.classList.add("segment-btn");
  }
  button.addEventListener("click", startSegmentGame);
};

const startSegmentGame = e => {
  if (e.target.innerText === "Play All!") {
    availableQuestions = [...questions];
  } else {
    availableQuestions = questions.filter(
      question => question.contentSegment === e.target.innerText
    );
    isSegmentGame = true;
  }
  if (availableQuestions.length < maxQuestions) {
    maxQuestions = availableQuestions.length;
  }
  getNewQuestion();
  game.classList.remove("hidden");
  segmentBox.classList.add("hidden");
};

const getNewQuestion = () => {
  improvementBtn.classList.remove("hidden");
  continueToNext = false;
  if (availableQuestions.length === 0 || questionCounter > maxQuestions - 1) {
    localStorage.setItem("mostRecentScore", score);
    if (isSegmentGame === false) {
      return window.location.assign(
        "end.html?contentId=" + contentId + "&all=1"
      );
    } else {
      return window.location.assign("end.html?contentId=" + contentId);
    }
  }

  questionCounter++;
  questionCounterText.innerText = questionCounter + "/" + maxQuestions;
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  episodeNameText.innerText = currentQuestion.contentSegment;
  contentNameText.innerText = currentQuestion.content;
  question.innerText = currentQuestion.question;
  urlNameText.href = currentQuestion.url;

  if (currentQuestion.open === "TRUE" && Math.random() > OPEN_PROBABILITY) {
    openFlag = true;
    openAnswerForm.classList.remove("hidden");
    choiceBox.classList.add("hidden");
    openAnswerInput.addEventListener(
      "keyup",
      () => (saveAnswerBtn.disabled = !openAnswerInput.value)
    );
    saveAnswerBtn.addEventListener("click", e => {
      e.preventDefault();
      if (!acceptingAnswers) return;
      acceptingAnswers = false;
      checkOpenAnswer(openAnswerInput.value);
    });
  } else {
    choiceBox.classList.remove("hidden");
    choices.forEach(choice => {
      const number = choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
    });
    openFlag = false;
  }

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};
let classToApply;
checkOpenAnswer = textInput => {
  if (currentQuestion.exactMatch === "TRUE") {
    classToApply =
      textInput === currentQuestion["choice" + currentQuestion.answer]
        ? "correct"
        : "incorrect";
  } else {
    lowerCaseInput = textInput.toLowerCase().split(" ");
    lowerCaseAnswer = currentQuestion["choice" + currentQuestion.answer]
      .toLowerCase()
      .split(" ");
    console.log(lowerCaseInput);
    classToApply =
      lowerCaseInput
        .map(word => lowerCaseAnswer.indexOf(word))
        .filter(b => b !== -1).length > 0
        ? "correct"
        : "incorrect";
  }
  if (classToApply === "correct") {
    incrementScore(CORRECT_BONUS);
  }
  openAnswerInput.classList.add(classToApply);
  acceptingAnswers = false;
  if (classToApply === "correct") {
    setTimeout(() => {
      openAnswerInput.classList.remove(classToApply);
      openAnswerInput.value = "";
      openAnswerForm.classList.add("hidden");
      getNewQuestion();
    }, 500);
  } else {
    wrongOpenAnswer();
  }
};

wrongOpenAnswer = () => {
  setTimeout(() => {
    redAnswer.innerText = currentQuestion["choice" + currentQuestion.answer];
    correctAnswerBox.classList.remove("hidden");
    continueToNext = true;
  }, 500);
};

const wrongAnswer = () => {
  setTimeout(() => {
    choices.forEach(choice => {
      if (choice.dataset["number"] === currentQuestion.answer) {
        choice.parentElement.classList.add("correct");
      }
    });
    continueToNext = true;
  }, 200);
};

const continueGame = () => {
  if (continueToNext) {
    choices.forEach(choice => {
      choice.parentElement.classList.remove(["incorrect"]);
      choice.parentElement.classList.remove(["correct"]);
    });
    correctAnswerBox.classList.add("hidden");
    openAnswerForm.classList.add("hidden");
    openAnswerInput.classList.remove("incorrect");
    openAnswerInput.value = "";
    getNewQuestion();
  } else return;
};

checkChoice = (selectedAnswer, selectedChoice) => {
  const classToApply =
    selectedAnswer === currentQuestion.answer ? "correct" : "incorrect";

  if (classToApply === "correct") {
    incrementScore(CORRECT_BONUS);
  }
  selectedChoice.parentElement.classList.add(classToApply);

  if (classToApply === "correct") {
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 500);
  } else {
    acceptingAnswers = false;
    wrongAnswer();
  }
};

const keyboardMap = {
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  13: "99"
};

const keypress = kp => {
  if (openFlag || !keyboardMap[kp]) return;
  if (!acceptingAnswers | continueToNext) {
    continueGame();
  } else if (kp !== 13) {
    choices.forEach(choice => {
      if (choice.dataset["number"] === keyboardMap[kp]) {
        selectedChoice = choice;
      }
    });
    checkChoice(keyboardMap[kp], selectedChoice);
  }
};

document.onkeyup = e => keypress(e.which);

document.body.addEventListener("click", e => continueGame());

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers | continueToNext) return;
    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    checkChoice(selectedAnswer, selectedChoice);
  });
});

const incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

improvementBtn.addEventListener("click", e => {
  improvementForm.classList.remove("hidden");
  exitImprovement.classList.remove("hidden");
});

exitImprovement.addEventListener("click", e => {
  improvementForm.classList.add("hidden");
  exitImprovement.classList.add("hidden");
});

filledForm = () => !(usernameInput.value && feedback.value && emailInput.value);
usernameInput.addEventListener(
  "keyup",
  () => (saveImprovementBtn.disabled = filledForm())
);
emailInput.addEventListener(
  "keyup",
  () => (saveImprovementBtn.disabled = filledForm())
);
feedback.addEventListener(
  "keyup",
  () => (saveImprovementBtn.disabled = filledForm())
);

saveImprovement = e => {
  e.preventDefault();
  const saveImprovementUrl = `https://script.google.com/macros/s/AKfycbwXBGlvexKjpcZ9ccWN3o4lrm4_DnKvTuTYfHE2o7_QmrgcveDf/exec?nickname=${
    usernameInput.value
  }&feedback=${feedback.value}&question=${currentQuestion.question}&email=${
    emailInput.value
  }`;
  fetch(saveImprovementUrl);
  improvementForm.classList.add("hidden");
  exitImprovement.classList.add("hidden");
  improvementBtn.classList.add("hidden");
  improvementThnx.classList.remove("hidden");
  setTimeout(() => {
    improvementThnx.classList.add("hidden");
  }, 4000);
};

d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
).then(data => {
  questions = data.filter(question => {
    if (contentId === "0") return true;
    else return question.contentId === contentId;
  });
  startGame();
});
