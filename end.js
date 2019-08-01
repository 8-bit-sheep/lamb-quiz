const parseUrlParameters = parameter =>
  parameter
    .substr(1)
    .split("&")
    .map(el => el.split("="))
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {});

const username = document.getElementById("username");
finalScore = document.getElementById("finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");
const saveScoreBtn = document.getElementById("saveScoreButton");
const urlParams = parseUrlParameters(window.location.search);
const playAgainButton = document.getElementById("again-button");

finalScore.innerText = mostRecentScore;
playAgainButton.href = "game.html?contentId=" + urlParams.contentId;

const saveHighscore = e => {
  e.preventDefault();

  const rankingUrl = `https://script.google.com/macros/s/AKfycbwdGGPzI9JdH_6FN-na4boXQNZmGyv6y_690ErJc0Xhzd_CQ4A_/exec?contentId=${
    urlParams.contentId
  }&name=${username.value}&score=${mostRecentScore}`;
  fetch(rankingUrl);
  setInterval(
    () =>
      window.location.assign(
        "highscores.html?contentId=" +
          urlParams.contentId +
          "&name=" +
          username.value +
          "&score=" +
          mostRecentScore
      ),
    0
  );
};

if (urlParams.all === "1") {
  username.classList.remove("hidden");
  saveScoreBtn.classList.remove("hidden");
  username.addEventListener(
    "keyup",
    () => (saveScoreBtn.disabled = !username.value)
  );
}
