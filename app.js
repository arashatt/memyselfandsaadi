const state = {
  poemsIndex: [],
  currentPoem: null
};


// =========================
// STORAGE HELPERS
// =========================

function getFavorites() {
  return JSON.parse(
    localStorage.getItem("favorites")
  ) || [];
}

function getReadPoems() {
  return JSON.parse(
    localStorage.getItem("readPoems")
  ) || [];
}


// =========================
// LOAD INDEX
// =========================

async function loadPoemsIndex() {

  const response =
    await fetch("poems/index.json");

  const data =
    await response.json();

  state.poemsIndex = data;
}


// =========================
// ROUTER
// =========================

function navigate(path) {
  window.location.hash = path;
}



window.addEventListener(
  "hashchange",
  router
);


async function router() {

  const path =
    window.location.hash.replace("#", "") || "/";


  // HOME
  if (path === "/") {

    render("home");
    return;
  }


  // LIST
  if (path === "/list") {

    render("list");
    return;
  }


  // FAVORITES
  if (path === "/favorites") {

    render("favorites");
    return;
  }


  // READ
  if (path === "/read") {

    render("read");
    return;
  }


  // POEM
  if (path.startsWith("/poem/")) {

    const id =
      path.split("/poem/")[1];

    await openPoem(id, false);

    return;
  }


  // FALLBACK
  render("home");
}


// =========================
// OPEN POEM
// =========================

async function openPoem(
  id,
  updateUrl = true
) {

  const metadata =
    state.poemsIndex.find(
      p => p.id === id
    );

  if (!metadata) return;


  const response =
    await fetch(`poems/${id}.json`);

  const content =
    await response.json();


  state.currentPoem = {
    ...metadata,
    ...content
  };


  if (updateUrl) {
    window.location.hash = `/poem/${id}`;
  }


  render("poem");
}


// =========================
// RENDER
// =========================

function render(view) {

  const content =
    document.getElementById("content");

  content.innerHTML = "";


  switch(view) {

    case "list":
      renderList(content);
      break;

    case "favorites":
      renderFavorites(content);
      break;

    case "read":
      renderRead(content);
      break;

    case "poem":
      renderPoem(content);
      break;

    default:
      renderHome(content);
  }
}


// =========================
// HOME
// =========================

function renderHome(content) {

  const title =
    document.createElement("h2");

  title.textContent =
    "memyselfandsaadi";


  const text =
    document.createElement("p");

  text.textContent =
    "A quiet collection of poems and reflections.";


  content.appendChild(title);

  content.appendChild(text);
}


// =========================
// POEM VIEW
// =========================

function renderPoem(content) {

  const poem =
    state.currentPoem;

  if (!poem) return;


  const wrapper =
    document.createElement("div");

  wrapper.className =
    "poem-wrapper";


  const title =
    document.createElement("h2");

  title.textContent =
    poem.title;

  const divider =
    document.createElement("hr");
  const breaker =
    document.createElement("br");


  const text =
    document.createElement("div");

  text.id =
    "poem-text";


  if (Array.isArray(poem.text)) {

    text.innerHTML =
      poem.text.join("<br>");

  } else {

    text.innerHTML =
      poem.text;
  }


  // FAVORITE BUTTON

  const favoriteButton =
    document.createElement("button");

  favoriteButton.id =
    "favorite-button";


  const favorites =
    getFavorites();


  favoriteButton.textContent =
    favorites.includes(poem.id)
      ? "❤️"
      : "🤍";


  favoriteButton.onclick = () => {

    let favorites =
      getFavorites();


    if (favorites.includes(poem.id)) {

      favorites =
        favorites.filter(
          id => id !== poem.id
        );

    } else {

      favorites.push(poem.id);
    }


    localStorage.setItem(
      "favorites",
      JSON.stringify(favorites)
    );


    render("poem");
  };


  // READ BUTTON

  const readButton =
    document.createElement("button");

  readButton.id =
    "read-button";


  const readPoems =
    getReadPoems();


  readButton.textContent =
    readPoems.includes(poem.id)
      ? "✓ خوانده شده"
      : "مارک کن خوانده ام";


  readButton.onclick = () => {

    let read =
      getReadPoems();


    if (read.includes(poem.id)) {

      read =
        read.filter(
          id => id !== poem.id
        );

    } else {

      read.push(poem.id);
    }


    localStorage.setItem(
      "readPoems",
      JSON.stringify(read)
    );


    render("poem");
  };


  // SHARE BUTTON

  const shareButton =
    document.createElement("button");

  shareButton.id =
    "share-button";

  shareButton.textContent =
    "اشتراک گذاری";


  shareButton.onclick = async () => {

    try {

      await navigator.clipboard.writeText(
        window.location.href
      );

      shareButton.textContent =
        "کپی شد ✓";


      setTimeout(() => {

        shareButton.textContent =
          "اشتراک گذاری";

      }, 2000);

    } catch (error) {

      alert("خطا در کپی لینک");
    }
  };


  wrapper.appendChild(title);
  wrapper.appendChild(divider);
  wrapper.appendChild(breaker);
  wrapper.appendChild(text);

  // NEXT + PREV BUTTONS

  const navigationWrapper =
    document.createElement("div");

  navigationWrapper.className =
    "poem-navigation";


  const currentIndex =
    state.poemsIndex.findIndex(
      p => p.id === poem.id
    );


  const prevButton =
    document.createElement("button");

  prevButton.textContent =
    "قبلی";


  prevButton.onclick = () => {

    if (currentIndex > 0) {

      const prevPoem =
        state.poemsIndex[
          currentIndex - 1
        ];


      openPoem(prevPoem.id);
    }
  };


  const nextButton =
    document.createElement("button");

  nextButton.textContent =
    "بعدی";


  nextButton.onclick = () => {

    if (
      currentIndex <
      state.poemsIndex.length - 1
    ) {

      const nextPoem =
        state.poemsIndex[
          currentIndex + 1
        ];


      openPoem(nextPoem.id);
    }
  };




  navigationWrapper.appendChild(prevButton);

  navigationWrapper.appendChild(nextButton);


  wrapper.appendChild(favoriteButton);

  wrapper.appendChild(readButton);

  wrapper.appendChild(shareButton);

  wrapper.appendChild(navigationWrapper);


  content.appendChild(wrapper);
}


// =========================
// LIST VIEW
// =========================

function renderList(content) {

  const title =
    document.createElement("h2");

  title.textContent =
    "لیست محتوا";


  content.appendChild(title);


  for (const poem of state.poemsIndex) {

    const button =
      document.createElement("button");

    button.textContent =
      poem.title;

    button.id =
      "list-button";


    button.onclick =
      () => openPoem(poem.id);


    content.appendChild(button);
  }
}


// =========================
// FAVORITES VIEW
// =========================

function renderFavorites(content) {

  const title =
    document.createElement("h2");

  title.textContent =
    "مورد علاقه";


  content.appendChild(title);


  const favorites =
    getFavorites();


  const poems =
    state.poemsIndex.filter(
      p => favorites.includes(p.id)
    );


  if (poems.length === 0) {

    const empty =
      document.createElement("p");

    empty.textContent =
      "محتوا مورد علاقه یافت نشد";


    content.appendChild(empty);

    return;
  }


  for (const poem of poems) {

    const button =
      document.createElement("button");

    button.textContent =
      poem.title;

    button.id =
      "list-button";


    button.onclick =
      () => openPoem(poem.id);


    content.appendChild(button);
  }
}


// =========================
// READ VIEW
// =========================

function renderRead(content) {

  const title =
    document.createElement("h2");

  title.textContent =
    "خوانده شده";


  content.appendChild(title);


  const read =
    getReadPoems();


  const poems =
    state.poemsIndex.filter(
      p => read.includes(p.id)
    );


  if (poems.length === 0) {

    const empty =
      document.createElement("p");

    empty.textContent =
      "محتوا خوانده شده یافت نشد";


    content.appendChild(empty);

    return;
  }


  for (const poem of poems) {

    const button =
      document.createElement("button");

    button.textContent =
      poem.title;

    button.id =
      "list-button";


    button.onclick =
      () => openPoem(poem.id);


    content.appendChild(button);
  }
}


// =========================
// SIDEBAR BUTTONS
// =========================


document
  .getElementById("list-button")
  .onclick = () => {

    navigate("/list");
  };



document
  .getElementById("favorites-button")
  .onclick = () => {

    navigate("/favorites");
  };



document
  .getElementById("read-list-button")
  .onclick = () => {

    navigate("/read");
  };


// =========================
// LUCK BUTTON
// =========================


document
  .getElementById("luck-button")
  .onclick = () => {

    const read =
      getReadPoems();


    const unread =
      state.poemsIndex.filter(
        p => !read.includes(p.id)
      );


    if (unread.length === 0) {

      alert(
        "You have reflected on all poems."
      );

      return;
    }


    const random =
      unread[
        Math.floor(
          Math.random() * unread.length
        )
      ];


    openPoem(random.id);
  };


// =========================
// DARK MODE
// =========================

const themeButton =
  document.getElementById("theme-button");



themeButton.onclick = () => {

  document.body.classList.toggle("dark");


  const isDark =
    document.body.classList.contains("dark");


  localStorage.setItem("theme", isDark);
};


const savedTheme =
  localStorage.getItem("theme");


if (savedTheme === "true") {
  document.body.classList.add("dark");
}


// =========================
// START APP
// =========================

async function start() {

  await loadPoemsIndex();

  await router();
}


start();
