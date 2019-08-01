const parseUrlParameters = parameter =>
  parameter //"?key1=value1&key2=value2&key3=value3"
    .substr(1) //"key1=value1&key2=value2&key3=value3"
    .split("&") //["key1=value1" "key2=value2" key3=value3"]
    .map(el => el.split("=")) //[["key1" "value1"] ["key2" "value2"] [key3" "value3"]]
    .reduce((acc, cur) => ({ ...acc, [cur[0]]: cur[1] }), {}); //{key1: value1, key2: value2, key3, value3}

d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTKBOji3CenMyR-hvdBIBZTYL82uHhMHOoUIbiK1XYr2CycXkVBY96aWeVnfp77mkELAlNIR0Dk934g/pub?output=csv"
).then(highscores => {
  const params = parseUrlParameters(window.location.search);
  const id = params.contentId;
  let ranking = highscores.filter(x => x.contentId === id);
  ranking.push(params);
  ranking = [...new Set(ranking)]
    .sort((a, b) => parseInt(b.score) - parseInt(a.score))
    .slice(0, 10);
  const highscoreList = document.getElementById("highscoreList");
  let contentName = document.getElementById("contentName");

  highscoreList.innerHTML = ranking
    .map(
      row =>
        `<tr>
    <th class="highscoreNames">${row.name.substring(
      0,
      16
    )}</th><th class="highscoreScores">${row.score}</th></tr>`
    )
    .join("");
  globalData = highscores;

  d3.csv(
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
  ).then(names => {
    const contentNames =
      id !== "0" ? names.filter(x => x.contentId === id)[0].content : "All";

    contentName.innerText = contentNames;
  });
});
