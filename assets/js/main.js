/*=============== SHOW MENU ===============*/
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close"),
  closeDisplayDrawerBtn = document.getElementById("closeDisplayDrawerBtn"),
  displayDrawer = document.getElementById("display__drawer"),
  account = document.getElementById("account");
languageToggle = document.getElementById("languageToggle");

const homeNaveAction = ["progress", "notification", "account"];
const authNaveAction = ["login", "register"];

closeDisplayDrawerBtn.addEventListener("click", () => {
  displayDrawer.style.display = "none";
  const audioPlayer = document.getElementById("audioPlayer");
  const videoPlayer = document.getElementById("videoPlayer");
  if (audioPlayer) {
    try {
      audioPlayer.pause(); // Pause the audio
      audioPlayer.currentTime = 0; // Reset to the beginning
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  } else if (videoPlayer) {
    try {
      videoPlayer.pause(); // Pause the audio
      videoPlayer.currentTime = 0; // Reset to the beginning
    } catch (error) {
      console.error("Audio playback failed:", error);
    }
  }
});

account.addEventListener("click", () => {
  sessionStorage.removeItem("token");
  mainRoute();
});

languageToggle.addEventListener("click", () => {
  const currentLanguage = languageToggle.textContent.trim();

  if (currentLanguage === "FR") {
    languageToggle.innerHTML =
      '<i class=" language-icon ri-earth-line"></i> العربية';
    // Switch to Arabic: Apply any required logic here
    document.documentElement.setAttribute("lang", "ar");
    sessionStorage.setItem("lang", "ar");
    document.body.style.direction = "rtl";
    loadTranslations("ar");
  } else {
    languageToggle.innerHTML =
      '<i class=" language-icon ri-earth-line"></i> FR';
    // Switch to French: Apply any required logic here
    document.documentElement.setAttribute("lang", "fr");
    sessionStorage.setItem("lang", "fr");
    document.body.style.direction = "ltr";
    loadTranslations("fr");
  }
});

/*===== MENU SHOW =====*/
/* Validate if constant exists */
if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

/*===== MENU HIDDEN =====*/
/* Validate if constant exists */
if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

/*=============== REMOVE MENU MOBILE ===============*/
const navLink = document.querySelectorAll(".nav__link");

const linkAction = () => {
  const navMenu = document.getElementById("nav-menu");
  // When we click on each nav__link, we remove the show-menu class
  navMenu.classList.remove("show-menu");
};
navLink.forEach((n) => n.addEventListener("click", linkAction));

/*=============== PARALLAX ===============*/
let parallax = new Rellax(".parallax");

/*=============== SCROLL REVEAL ANIMATION ===============*/

const sr = ScrollReveal({
  origin: "top",
  distance: "60px",
  duration: 2500,
  delay: 400,
});
sr.reveal(".footer");
function calculProgress() {
  const progressContainer = document.querySelector(".progress-container");
  const progressBar = document.querySelector(".progress-bar");
  const progressText = document.querySelector(".progress-text");
  //TODO: calculate percentage
  const percentage = 60;
  let width = (percentage * progressContainer?.offsetWidth) / 100;
  //insert percentage in progress text
  progressText.innerHTML = percentage + "%";
  progressBar.style.width = width + "px";
  progressBar.style.backgroundColor = percentage < 50 ? "red" : "green";
}

function calculNotification() {
  const notification = document.querySelector(".notification-icon");
  const notificationSpan = document.querySelector(".notification-span");
  //TODO: calculate NbrNotification
  const NbrNotification = 2;
  if (NbrNotification > 0) {
    notification.classList.remove("ri-notification-line");
    notification.classList.add("ri-notification-fill");
    notificationSpan.innerHTML = NbrNotification;
    notificationSpan.classList.add("notification-badge");
  } else {
    notification.classList.remove("ri-notification-fill");
    notification.classList.add("ri-notification-line");
    notificationSpan.classList.remove("notification-badge");
  }
}

function getAutoDevision() {
  const devisionList = document.querySelector(".devision__list");
  /*get Desvision [{label: "devision", value: "devision", img: "imgUrl"}}]*/
  let devision = [
    {
      label: "Exams",
      arabicLabel: "الامتحانات",
      id: "exams",
      img: "./assets/img/logo.png",
    },
    {
      label: "Cours",
      arabicLabel: "الدورات",
      id: "cours",
      img: "./assets/img/logo.png",
    },
    {
      label: "Questions",
      arabicLabel: "الاسئلة",
      id: "trajectory",
      img: "./assets/img/logo.png",
    },
    {
      label: "History",
      arabicLabel: "التاريخ",
      id: "history",
      img: "./assets/img/logo.png",
    },
  ];
  let isItMobile = window.innerWidth < 768;
  if(isItMobile){
    const selectHTML = `
    <select id="devisionSelect" class="devision__select">
      ${devision
        .map((item) => {
          const label =
            sessionStorage.getItem("lang") === "ar" ? item.arabicLabel : item.label;
          return `<option value="${item.id}">${label}</option>`;
        })
        .join("")}
    </select>
  `;
  devisionList.innerHTML = selectHTML;

  // Add event listener for selection change
  const devisionSelect = document.getElementById("devisionSelect");
  devisionSelect.addEventListener("change", (event) => {
    const selectedId = event.target.value;
    getAutoContent(selectedId);
  });
  }else {
  devisionList.innerHTML = devision
    .map((item) => {
      return `<li class="devision__item">
            <div class="devision__card">
                <div class="devision__img">
                    <img src="${item.img}" alt="${item.label}" />
                </div>
                <div class="devision__data">
                    <h3 class="devision__title" id="devision__${item.id}">${
        sessionStorage.getItem("lang") === "ar" ? item.arabicLabel : item.label
      }</h3>
                </div>
                <span class="devision__id" style="display: none">${
                  item.id
                }</span>
            </div>
        </li>`;
    })
    .join("");}
}

function addClickEvent() {
  const devisionItems = document.querySelectorAll(".devision__card");
  devisionItems.forEach((card) => {
    card.addEventListener("click", () => {
      const item = card.querySelector(".devision__id").textContent;
      console.log(item);
      getAutoContent(item);
    });
  });
}

function getAutoContent(id) {
  const contentList = document.querySelector(".content__list");
  fetch("./assets/data/data.json")
    .then((response) => response.json())
    .then((data) => {
      contentList.innerHTML = `<ul>${data?.contents
        ?.filter((item) => item.type === id)
        .map((item) => {
          return `<li class="content__item">
                    <div class="content__card ${
                      item.img
                        ? `img__card" style="background-image: url(${item.img})"`
                        : ""
                    }"">
                        <div class="content__data ${
                          item.img ? "img__data" : ""
                        }">
                            <h3 class="content__title">${
                              sessionStorage.getItem("lang") === "ar"
                                ? item.arabicLabel
                                : item.label
                            }</h3>
                        </div>
                        <span class="content__id" style="display: none">${id} - ${
            item.id
          }</span>
                    </div>
                </li>`;
        })
        .join("")}</ul>`;

      addChildClickEvent();
    });
}

function insertMedia(content) {
  const drawerMedia = document.querySelector(".drawer-media");
  let mediaHTML = "";
  if (content.videoUrl) {
    // Video content
    mediaHTML = `
      <video id="videoPlayer" controls style="width: 100%; height: 100%;">
        <source src="${content.videoUrl}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;
  } else if (content.imgUrl) {
    mediaHTML = `
      <div style="position: relative; width: 100%; height: 100%; overflow: hidden;">
        <img src="${content.imgUrl}" alt="Media Image">
        <audio id="audioPlayer" class="audio-player" controls style="display: none">
          <source src="${content.audioUrl}" type="audio/mp3">
          Your browser does not support the audio tag.
        </audio>
      </div>
    `;
  }
  drawerMedia.innerHTML = mediaHTML;
  const audioPlayer = document.getElementById("audioPlayer");
  const videoPlayer = document.getElementById("videoPlayer");
  if (audioPlayer) {
    audioPlayer.play().catch((error) => {
      console.error("Audio playback failed:", error);
    });
  } else if (videoPlayer) {
    videoPlayer.play().catch((error) => {
      console.error("Video playback failed:", error);
    });
  }
}

function insertQuestion(content) {
  const questionContent = document.querySelector(".question-content");
  const questionHTML = `
    <div style="padding: 10px; background-color: transparent; text-align: center;">
      <h3>Select the correct answer:</h3>
      <ul class="answer-list">
        ${content.questionPossible
          .map(
            (answer) => `
          <li>
            <button class="answer-btn" data-correct="${
              answer === content.questionCorrect
            }">
              ${answer}
            </button>
          </li>
        `
          )
          .join("")}
      </ul>
    </div>
  `;
  questionContent.innerHTML = questionHTML;

  const answerButtons = document.querySelectorAll(".answer-btn");
  answerButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      button.style.backgroundColor =
        button.style.backgroundColor === "blue" ? "#f0f7fe" : "blue";
    });
  });
}

function refactoDrawer(content) {
  insertMedia(content);
  insertQuestion(content);
}

function displayDrawrContent(id) {
  const drawerContent = document.querySelector(".drawer-content");
  const drawerContentList = [
    {
      id: "q1",
      imgUrl: "./assets/img/a1.jpg",
      audioUrl: "./assets/audio/o1.mp3",
      questionPossible: ["a1", "a2", "a3"],
      questionCorrect: "a1",
    },
    {
      id: "q2",
      imgUrl: "./assets/img/a1.jpg",
      audioUrl: "./assets/audio/o1.mp3",
      questionPossible: ["a1", "a2"],
      questionCorrect: "a1",
      current: true,
    },
    {
      id: "q3",
      videoUrl: "./assets/video/a1.mp4",
      questionPossible: ["a1", "a2"],
      questionCorrect: "a1",
    },
    {
      id: "q4",
      imgUrl: "./assets/img/a1.jpg",
      audioUrl: "./assets/audio/o1.mp3",
      questionPossible: ["a1", "a2"],
      questionCorrect: "a1",
    },
  ];
  let content =
    drawerContentList.find((item) => item.current === true) ||
    drawerContentList[0];

  drawerContent.innerHTML = `
    <div style="display: flex; flex-direction: column; height: 100%;">
      <div class="drawer-media" style="flex: 6; overflow: hidden;"></div>
      <div class="question-content" style="flex: 1; overflow: auto;"></div>

      <div style="flex: 1; overflow: auto;">
        <div>
          <button class="back-btn">
            return
          </button>
           <button class="submit-btn">
            Submit
          </button>
           <button class="next-btn">
            Next
          </button>
        </div>
      </div>
    </div>
  `;
  refactoDrawer(content);
  const submitBtn = document.querySelector(".submit-btn");
  const backBtn = document.querySelector(".back-btn");
  const nextBtn = document.querySelector(".next-btn");
  if (submitBtn) {
    submitBtn.addEventListener("click", () => {
      let answerButtons = document.querySelectorAll(".answer-btn");
      answerButtons.forEach((button) => {
        const isCorrect = button.getAttribute("data-correct") === "true";
        button.style.backgroundColor = isCorrect ? "green" : "red";
      });
    });
  }
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      const contetnIndex = drawerContentList.findIndex(
        (item) => item.id === content.id
      );
      content = drawerContentList[contetnIndex - 1];
      refactoDrawer(content);
      drawerContentList[contetnIndex - 1].current = true;
      drawerContentList[contetnIndex].current = false;
      if (contetnIndex === 1) {
        backBtn.style.display = "none";
      }
      if (contetnIndex <= drawerContentList.length - 2) {
        nextBtn.style.display = "";
      }
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const contetnIndex = drawerContentList.findIndex(
        (item) => item.id === content.id
      );
      console.log(contetnIndex, drawerContentList.length);
      console.log(content, drawerContentList[contetnIndex + 1]);
      content = drawerContentList[contetnIndex + 1];
      refactoDrawer(content);
      drawerContentList[contetnIndex + 1].current = true;
      drawerContentList[contetnIndex].current = false;
      if (contetnIndex === drawerContentList.length - 2) {
        nextBtn.style.display = "none";
      }
      if (contetnIndex >= 1) {
        backBtn.style.display = "";
      }
    });
  }
}

function addChildClickEvent() {
  const contentItems = document.querySelectorAll(".content__card");
  contentItems.forEach((card) => {
    card.addEventListener("click", () => {
      const item = card.querySelector(".content__id").textContent;
      console.log(item);
      displayDrawer.style.display = "flex";
      displayDrawrContent(item);
    });
  });
}

function displayHomePage() {
  calculProgress();
  calculNotification();
  getAutoDevision();
  addClickEvent();
  getAutoContent("trajectory");
}

function displayAuthPage() {
  const form = document.querySelector(".auth__form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    if (!email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    // Mock form submission logic
    console.log("Email:", email);
    console.log("Password:", password);
    sessionStorage.setItem("token", JSON.stringify({ email, password }));
    mainRoute();
  });
}

function navAction(activeActions = [], inactiveActions = []) {
  inactiveActions.forEach((action) => {
    let item = document.getElementById(action);
    item?.classList?.add("hidden__page");
  });
  activeActions.forEach((action) => {
    let item = document.getElementById(action);
    item?.classList?.remove("hidden__page");
  });
}
function mainRoute() {
  const homePage = document.getElementById("home"),
    authPage = document.getElementById("auth");
  const user = JSON.parse(sessionStorage.getItem("token"));
  console.log("user", localStorage, user);
  if (user) {
    console.log("home", homePage, authPage);
    homePage.classList.remove("hidden__page");
    authPage.classList.add("hidden__page");
    navAction(homeNaveAction, authNaveAction);
    displayHomePage();
  } else {
    homePage.classList.add("hidden__page");
    authPage.classList.remove("hidden__page");
    navAction(authNaveAction, homeNaveAction);
    displayAuthPage();
  }
}

async function loadTranslations(language) {
  try {
    const response = await fetch(`./translations/${language}.json`);
    const translations = await response.json();
    console.log("translations", translations);

    // Update UI with translations
    document.getElementById("autoEcoleTitle").textContent =
      translations.autoEcoleTitle;
    document.getElementById("autoEcoleLogo").textContent =
      translations.autoEcoleTitle;
    document.getElementById("auth__title").textContent = translations.authTitle;
    document.getElementById("auth__button").textContent =
      translations.authTitle;
    document.getElementById("auth__email__label").textContent =
      translations.email;
    document.getElementById("auth__password__label").textContent =
      translations.password;
    document.getElementById("auth__footer").textContent =
      translations.authFooter;
    getAutoDevision();
    getAutoContent("trajectory");
    addClickEvent();
  } catch (error) {
    console.error("Error loading translations :", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //displayHomePage()
  //check if user is logged in
  let currentLanguage = sessionStorage.getItem("lang") || "fr";
  loadTranslations(currentLanguage);
  mainRoute();
});
