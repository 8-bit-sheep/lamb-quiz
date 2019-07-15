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
const id = window.location.search.split("=")[1];
const segmentBox = document.getElementById("segment-index");
const segmentButtons = document.getElementById("segment-buttons");

// state
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let cont = false;
let maxQuestions = 20;
let isSegmentGame = false;

// state
const CORRECT_BONUS = 10;

const startGame = () => {
  questionCounter = 0;
  score = 0;
  scoreText.innerText = score;
  loader.classList.add("hidden");
  if (id === "0") {
    game.classList.remove("hidden");
    availableQuestions = [...questions];
    maxQuestions = 50;
    getNewQuestion();
  } else {
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
    if(text === "Play All!") {
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
  cont = false;
  if (availableQuestions.length === 0 || questionCounter > maxQuestions - 1) {
    localStorage.setItem("mostRecentScore", score);
    if (isSegmentGame === false) {
      return window.location.assign("end.html?contentId=" + id + "&all=1");
    } else {
      return window.location.assign("end.html?contentId=" + id);
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
  choices.forEach(choice => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

const wrongAnswer = () => {
  setTimeout(() => {
    choices.forEach(choice => {
      if (choice.dataset["number"] === currentQuestion.answer) {
        choice.parentElement.classList.add("correct");
      }
    });
    cont = true;
  }, 200);
};

const continueGame = () => {
  if (cont) {
    choices.forEach(choice => {
      choice.parentElement.classList.remove(["incorrect"]);
      choice.parentElement.classList.remove(["correct"]);
    });
    getNewQuestion();
  } else return;
};

document.body.addEventListener("click", e => continueGame());

choices.forEach(choice => {
  choice.addEventListener("click", e => {
    if (!acceptingAnswers | cont) return;
    acceptinganswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
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
  });
});

const incrementScore = num => {
  score += num;
  scoreText.innerText = score;
};

d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
).then(data => {
  questions = data.filter(question => {
    if (id === "0") return true;
    else return question.contentId === id;
  });
  startGame();
});
