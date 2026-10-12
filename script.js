const games = [
  {id:"cosmic-dash", title:"Cosmic Dash", category:"Arcade", emoji:"🚀", rating:"4.8", description:"Dodge obstacles in outer space.", colors:["#4d38a6","#171a42"], url:"", featured:true},
  {id:"neon-racer", title:"Neon Racer", category:"Racing", emoji:"🏎️", rating:"4.7", description:"Race through a glowing city.", colors:["#e75a8d","#542d92"], url:""},
  {id:"brain-blocks", title:"Brain Blocks", category:"Puzzle", emoji:"🧩", rating:"4.9", description:"Solve clever little puzzles.", colors:["#37b6a2","#15526d"], url:""},
  {id:"sky-striker", title:"Sky Striker", category:"Action", emoji:"🛩️", rating:"4.6", description:"Fly high and dodge the clouds.", colors:["#4d9fe8","#293c86"], url:""},
  {id:"hoop-heroes", title:"Hoop Heroes", category:"Sports", emoji:"🏀", rating:"4.5", description:"Shoot hoops and chase a high score.", colors:["#f7a343","#a83f34"], url:""},
  {id:"pixel-quest", title:"Pixel Quest", category:"Adventure", emoji:"🗡️", rating:"4.8", description:"Explore a tiny pixel world.", colors:["#52a85c","#174c46"], url:""},
  {id:"bubble-pop", title:"Bubble Pop", category:"Puzzle", emoji:"🫧", rating:"4.6", description:"Match colors and pop bubbles.", colors:["#e66fc1","#6848a9"], url:""},
  {id:"turbo-trials", title:"Turbo Trials", category:"Racing", emoji:"🏁", rating:"4.7", description:"Take on fast, twisty tracks.", colors:["#ef674e","#8d283c"], url:""},
  {id:"shadow-ninja", title:"Shadow Ninja", category:"Action", emoji:"🥷", rating:"4.8", description:"Test your timing and reflexes.", colors:["#64718d","#252b47"], url:""},
  {id:"goal-machine", title:"Goal Machine", category:"Sports", emoji:"⚽", rating:"4.4", description:"Aim carefully and score goals.", colors:["#62bd6c","#24654c"], url:""},
  {id:"fruit-frenzy", title:"Fruit Frenzy", category:"Arcade", emoji:"🍉", rating:"4.5", description:"A colorful, quick-fire arcade pick.", colors:["#f37b72","#a92c68"], url:""},
  {id:"chess-club", title:"Chess Club", category:"Puzzle", emoji:"♟️", rating:"4.9", description:"Think ahead and plan your moves.", colors:["#b8a7e7","#54417f"], url:""}
];

const grid = document.querySelector("#games-grid");
const searchInput = document.querySelector("#search-input");
const count = document.querySelector("#results-count");
const title = document.querySelector("#section-title");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#game-dialog");
let activeCategory = "All";

function getVisibleGames() {
  const query = searchInput.value.trim().toLowerCase();
  return games.filter(game => {
    const categoryMatches = activeCategory === "All" || game.category === activeCategory;
    const searchMatches = !query || [game.title, game.category, game.description].join(" ").toLowerCase().includes(query);
    return categoryMatches && searchMatches;
  });
}

function renderGames() {
  const visible = getVisibleGames();
  grid.innerHTML = "";
  visible.forEach(game => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `View ${game.title}`);
    card.innerHTML = `
      <div class="game-art" style="background:linear-gradient(135deg,${game.colors[0]},${game.colors[1]})">
        <span class="game-tag">${escapeHTML(game.category.toUpperCase())}</span>
        <span class="game-emoji" aria-hidden="true">${game.emoji}</span>
      </div>
      <div class="game-info">
        <div class="game-title-row"><h3 class="game-title">${escapeHTML(game.title)}</h3><span class="game-rating">★ ${game.rating}</span></div>
        <p class="game-description">${escapeHTML(game.description)}</p>
      </div>`;
    card.addEventListener("click", () => openGame(game));
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); openGame(game); }
    });
    grid.appendChild(card);
  });
  count.textContent = `${visible.length} ${visible.length === 1 ? "game" : "games"}`;
  emptyState.classList.toggle("hidden", visible.length !== 0);
  grid.classList.toggle("hidden", visible.length === 0);
  title.innerHTML = activeCategory === "All" ? 'Popular right now <span>↗</span>' : `${escapeHTML(activeCategory)} games <span>↗</span>`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
}

function setCategory(category) {
  activeCategory = category;
  document.querySelectorAll("[data-category]").forEach(button => {
    const selected = button.dataset.category === category;
    button.classList.toggle("active", selected);
    button.classList.toggle("selected", selected);
  });
  renderGames();
}

function openGame(game) {
  document.querySelector("#dialog-art").textContent = game.emoji;
  document.querySelector("#dialog-art").style.background = `linear-gradient(135deg,${game.colors[0]},${game.colors[1]})`;
  document.querySelector("#dialog-category").textContent = game.category.toUpperCase();
  document.querySelector("#dialog-title").textContent = game.title;
  document.querySelector("#dialog-description").textContent = game.description;
  const play = document.querySelector("#dialog-play");
  const note = document.querySelector("#dialog-note");
  if (game.url) {
    play.href = game.url;
    play.classList.remove("hidden");
    note.textContent = "This game opens in a new tab.";
  } else {
    play.href = "#";
    play.classList.add("hidden");
    note.textContent = "Demo card: add a real browser-game URL to this game's url field in script.js to enable playing.";
  }
  dialog.showModal();
}

document.querySelectorAll("[data-category]").forEach(button => button.addEventListener("click", () => setCategory(button.dataset.category)));
searchInput.addEventListener("input", renderGames);
document.querySelector("#search-form").addEventListener("submit", event => { event.preventDefault(); renderGames(); });
document.querySelector("#reset-search").addEventListener("click", () => { searchInput.value = ""; setCategory("All"); });
document.querySelector("#theme-toggle").addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  document.querySelector("#theme-toggle").textContent = isLight ? "☾" : "☼";
  document.querySelector("#theme-toggle").setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
});
document.addEventListener("keydown", event => {
  if (event.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    event.preventDefault(); searchInput.focus();
  }
  if (event.key === "Escape" && dialog.open) dialog.close();
});
document.querySelector("#year").textContent = new Date().getFullYear();
renderGames();
