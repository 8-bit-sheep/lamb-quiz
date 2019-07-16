d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTKBOji3CenMyR-hvdBIBZTYL82uHhMHOoUIbiK1XYr2CycXkVBY96aWeVnfp77mkELAlNIR0Dk934g/pub?output=csv"
)
  .then(highscores => {
    const id = window.location.search.split("=")[1];
    const ranking = highscores.filter(x => x.gameId === id).sort((a, b) => parseInt(b.score) > parseInt(a.score)).slice(10);
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

    d3.csv(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
    )
      .then(
        names => {        
          const contentNames = (id !== "0") ? 
          names.filter(x => x.contentId === id)[0].content :
          "All";
          
          contentName.innerText = contentNames;
        }
      )


  })