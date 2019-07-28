d3.csv(
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSfBk-rwrIauBPn7iuoLXBxP2sSYOXRYCbJ2GflzSK6wxGVGDr_fAqORJ0JWPdajFLxnGegmrlI26HB/pub?output=csv"
).then(data => {
  const contentId = window.location.search.substr(1).split("=")[1];
  const urlLink = data.filter(x => x.contentId === contentId)[0].url;
  const loader = document.getElementById("loader");
  const contributionForm = document.getElementById("contributionForm");
  const startForm = () => {
    loader.classList.add("hidden");
    contributionForm.classList.remove("hidden");
  };
  const contentSegments = [
    ...new Set(
      data.filter(el => el.contentId === contentId).map(e => e.contentSegment)
    )
  ];
  const contentName = data.filter(el => el.contentId === contentId)[0].content;
  //<a href="https://youtu.be/KN8YgJnShPM">jeeeeet</a>;
  const briefText = document.getElementById("brief");
  const questionCriteria = ["significant", "interesting", "surprising"];
  briefText.innerHTML = `I hear and forget. I see and I remember. I do and I understand. To start the game, please contribute one question about <a href="${urlLink}" target="_blank"> ${contentName}</a>. What is the most ${
    questionCriteria[[Math.floor(Math.random() * questionCriteria.length)]]
  } piece of information that you want people to learn?`;

  const skipBtn = document.getElementById("skipBtn");
  skipBtn.href = `game.html?contentId=${contentId}&contributed=skipped`;

  const contentSelector = document.getElementById("contentSelector");
  contentSelector.innerHTML =
    `<option value="choose">Choose Segment</option>` +
    contentSegments.reduce(
      (acc, curr) => `${acc}<option value="${curr}">${curr}</option>`,
      ""
    ) +
    `<option value="other">Other</option>`;
  const username = document.forms["questionEntry"]["username"];
  const submitBtn = document.forms["questionEntry"]["submitBtn"];
  const question = document.forms["questionEntry"]["question"];
  const choice1 = document.forms["questionEntry"]["choice1"];
  const choice2 = document.forms["questionEntry"]["choice2"];
  const choice3 = document.forms["questionEntry"]["choice3"];
  const choice4 = document.forms["questionEntry"]["choice4"];
  const answer = document.forms["questionEntry"]["answer"];
  const segment = document.forms["questionEntry"]["contentSegment"];
  const open = document.forms["questionEntry"]["open"];
  const questionBlock = document.getElementById("question");

  filledForm = () =>
    !(
      username.value &&
      answer.value !== "choose" &&
      segment.value !== "choose" &&
      question.value &&
      choice1.value &&
      choice2.value &&
      choice3.value &&
      choice4.value
    );
  let timeoutIteration = null;
  const timeout = f => {
    clearTimeout(timeoutIteration);

    timeoutIteration = setTimeout(() => f(), 750);
  };
  username.addEventListener("keyup", () => (submitBtn.disabled = filledForm()));
  question.addEventListener("keyup", () => {
    submitBtn.disabled = filledForm();
    timeout(() => {
      choice1.classList.remove("hidden");
      choice2.classList.remove("hidden");
      choice3.classList.remove("hidden");
      choice4.classList.remove("hidden");
    });
  });

  const choiceBoxesFilled = () => {
    if (choice1.value && choice2.value && choice3.value && choice4.value) {
      timeout(() => {
        document.getElementById("answer").classList.remove("hidden");
        document.getElementById("open").classList.remove("hidden");
      });
    }
  };

  choice1.addEventListener("keyup", () => {
    submitBtn.disabled = filledForm();
    choiceBoxesFilled();
  });
  choice2.addEventListener("keyup", () => {
    submitBtn.disabled = filledForm();
    choiceBoxesFilled();
  });
  choice3.addEventListener("keyup", () => {
    submitBtn.disabled = filledForm();
    choiceBoxesFilled();
  });
  choice4.addEventListener("keyup", () => {
    submitBtn.disabled = filledForm();
    choiceBoxesFilled();
  });
  answer.onchange = () => {
    submitBtn.disabled = filledForm();
    if (answer.value !== "choose") {
      username.classList.remove("hidden");
      submitBtn.classList.remove("hidden");
    }
  };

  segment.onchange = () => {
    submitBtn.disabled = filledForm();
    if (segment.value !== "choose") questionBlock.classList.remove("hidden");
  };

  saveQuestion = e => {
    e.preventDefault();
    const saveQuestionUrl = `https://script.google.com/macros/s/AKfycbxvTTaWkMoFzp4zdgkABO6JmEnRj_E1C11eu21lT6KLmMxHaJE/exec?contentId=${2}&nickname=${
      username.value
    }&content=${contentName}&question=${question.value}&choice1=${
      choice1.value
    }&choice2=${choice2.value}&choice3=${choice3.value}&choice4=${
      choice4.value
    }&answer=${answer.value}&open=${open.value}&nickname=${
      username.value
    }&url=${urlLink}&contentSegment=${encodeURI(
      segment.value.replace(/#/g, "%23")
    )}`;
    console.log(saveQuestionUrl);
    fetch(saveQuestionUrl);
    setInterval(
      () =>
        window.location.assign(
          "game.html?contentId=" + contentId + "&contributed=true"
        ),
      0
    );
  };
  startForm();
});
