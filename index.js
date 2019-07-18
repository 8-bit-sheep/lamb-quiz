const contentBox = document.getElementById("content-box");
const home = document.getElementById("home");
let questions = [];
d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
).then(data => {
  getData(data);
});
const contentTitles = [
  ...new Set(questions.map(question => question.content))
];
const getData = questions => {
  const contentTitles = [
    ...new Set(questions.map(question => question.content))
  ];
  let content = [];
  content = contentTitles.map(title => ({
    title: title,
    id: questions.filter(question => question.content === title)[0].contentId
  }));
  createLinkBtn("All Content", 0);
  content.forEach(content => {
    createLinkBtn(content.title, content.id);
  });
};

const createLinkBtn = (text, id) => {
  const div = document.createElement("div");
  contentBox.appendChild(div);
  const h4 = document.createElement("h4");
  div.appendChild(h4);
  h4.innerText = text;
  const gameLink = document.createElement("a");
  div.appendChild(gameLink);
  const buttonText = document.createElement("p")
  gameLink.appendChild(buttonText)
  buttonText.classList.add("btn-link");
  buttonText.innerText = "Play!";
  const gameHref = document.createAttribute("href");
  gameLink.setAttributeNode(gameHref);
  gameHref.value = "game.html?contentId=" + id;
  const highScoreLink = document.createElement("a");
  //highScoreLink.classList.add("btn-gamelink");
  div.appendChild(highScoreLink);
  const hsbuttonText = document.createElement("p")
  highScoreLink.appendChild(hsbuttonText)
  hsbuttonText.classList.add("btn-link");

  const highScoreHref = document.createAttribute("href");
  highScoreHref.value = "highscores.html?contentId=" + id;
  highScoreLink.setAttributeNode(highScoreHref);
  div.classList.add("content-container");
  hsbuttonText.innerText = "High Scores";
};
