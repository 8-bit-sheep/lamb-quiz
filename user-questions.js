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
