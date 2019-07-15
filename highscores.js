const highscoreList = document.getElementById("highscoreList");
const id = window.location.search.split("=")[1];
const highscores = JSON.parse(localStorage.getItem("highscores" + id)) || [];
let contentName = document.getElementById("contentName");

highscoreList.innerHTML = highscores
  .map(
    score =>
      `<tr>
    <th class="highscoreNames">${score.name.substring(
      0,
      16
    )}</th><th class="highscoreScores">${score.score}</th></tr>`
  )
  .join("");

if (id === "1") {
  contentName.innerText = "Crash Course Computer Science";
}
if (id === "2") {
  contentName.innerText = "JavaScript";
}
if (id === "0") {
  contentName.innerText = "All Content";
}
