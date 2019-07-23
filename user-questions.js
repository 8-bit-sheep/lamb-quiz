d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
).then(data => {
  const contentId = window.location.search.substr(1).split("=")[1];
  const contentSegments = [
    ...new Set(
      data.filter(el => el.contentId === contentId).map(e => e.contentSegment)
    )
  ];
  const contentName = data.filter(el => el.contentId === contentId)[0].content;
  const briefText = document.getElementById("brief");
  const questionCriteria = ["significant", "interesting", "surprising"];
  briefText.innerText = `Before we start, please contribute one question about ${contentName}. What is the most ${
    questionCriteria[[Math.floor(Math.random() * questionCriteria.length)]]
  } piece of information that you want people to learn?`;

  const contentSelector = document.getElementById("contentSelector");
  contentSelector.innerHTML = contentSegments.reduce(
    (acc, curr) => `${acc}<option value="${curr}">${curr}</option>`,
    ""
  );
});
const username = document.getElementById("username");
const submitBtn = document.getElementById("submitBtn");
const question = document.getElementById("question");
const choice1 = document.getElementById("choice1");
const choice2 = document.getElementById("choice2");
const choice3 = document.getElementById("choice3");
const choice4 = document.getElementById("choice4");
const answer = document.getElementById("answer");

filledForm = () =>
  !(
    username.value &&
    answer.value !== "choose" &&
    question.value &&
    choice1.value &&
    choice2.value &&
    choice3.value &&
    choice4.value
  );
username.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
question.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
choice1.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
choice2.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
choice3.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
choice4.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
answer.onchange = () => (submitBtn.disabled = filledForm());
