const parseUrlParameters = parameter =>
  parameter
    .substr(1)
    .split("&")
    .map(el => el.split("="))
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});

const username = document.getElementById("username");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const saveScoreBtn = document.getElementById("saveScoreButton");
const urlParams = parseUrlParameters(window.location.search);
const playAgainButton = document.getElementById("again-button");

const highscores =
  JSON.parse(localStorage.getItem("highscores" + urlParams.contentId)) || [];
const MAX_HIGHSCORES = 5;

finalScore.innerText = mostRecentScore;
playAgainButton.href = "game.html?contentId=" + urlParams.contentId;

const saveHighscore = e => {
  e.preventDefault();
  const currentScore = {
    score: mostRecentScore,
    name: username.value
  };
    const rankingUrl = `https://script.google.com/macros/s/AKfycbwdGGPzI9JdH_6FN-na4boXQNZmGyv6y_690ErJc0Xhzd_CQ4A_/exec?gameId=${urlParams.contentId}&score=${mostRecentScore}&name=${username.value}`;
    fetch(rankingUrl);
    highscores.push(currentScore);
  highscores.sort((x, y) => y.score - x.score);
  highscores.splice(MAX_HIGHSCORES);
  localStorage.setItem(
    "highscores" + urlParams.contentId,
    JSON.stringify(highscores)
  );
  window.location.assign("highscores.html?contentId=" + urlParams.contentId);
};

if (urlParams.all === "1") {
  username.classList.remove("hidden");
  saveScoreBtn.classList.remove("hidden");
  username.addEventListener(
    "keyup",
    () => (saveScoreBtn.disabled = !username.value)
  );
}
