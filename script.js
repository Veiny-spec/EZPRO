const games = [
  {id:"cosmic-dash", title:"Cosmic Dash", category:"Arcade", emoji:"🚀", rating:"4.8", description:"Tap the target as many times as you can in 10 seconds.", colors:["#4d38a6","#171a42"], gameType:"clicker"},
  {id:"neon-racer", title:"Neon Racer", category:"Racing", emoji:"🏎️", rating:"4.7", description:"Race through a glowing city.", colors:["#e75a8d","#542d92"], url:""},
  {id:"brain-blocks", title:"Brain Blocks", category:"Puzzle", emoji:"🧩", rating:"4.9", description:"Get three in a row in this classic puzzle.", colors:["#37b6a2","#15526d"], gameType:"tictactoe"},
  {id:"sky-striker", title:"Sky Striker", category:"Action", emoji:"🛩️", rating:"4.6", description:"Fly high and dodge the clouds.", colors:["#4d9fe8","#293c86"], url:""},
  {id:"hoop-heroes", title:"Hoop Heroes", category:"Sports", emoji:"🏀", rating:"4.5", description:"Shoot hoops and chase a high score.", colors:["#f7a343","#a83f34"], url:""},
  {id:"pixel-quest", title:"Pixel Quest", category:"Adventure", emoji:"🗡️", rating:"4.8", description:"Guess the secret number from 1 to 20.", colors:["#52a85c","#174c46"], gameType:"guess"},
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
  const area = document.querySelector("#game-play-area");
  area.innerHTML = "";
  area.classList.add("hidden");
  play.classList.add("hidden");

  if (game.gameType) {
    area.classList.remove("hidden");
    note.textContent = "Play right here — no extra website needed.";
    if (game.gameType === "clicker") renderClicker(area);
    if (game.gameType === "tictactoe") renderTicTacToe(area);
    if (game.gameType === "guess") renderGuess(area);
  } else if (game.url) {
    play.href = game.url;
    play.textContent = "Open game ↗";
    play.classList.remove("hidden");
    note.textContent = "This game opens in a new tab.";
  } else {
    note.textContent = "Demo card: add a real game URL to this game's url field in script.js to enable playing.";
  }
  dialog.showModal();
}

function renderClicker(area) {
  area.innerHTML = `<p class="mini-game-instructions">Click the green button as many times as you can in 10 seconds!</p>
    <div class="mini-game-status" id="click-status">Time: 10s · Score: 0</div>
    <button class="click-target" id="click-target">TAP!</button>
    <button class="secondary-button mini-reset" id="click-reset">Restart</button>`;
  let score = 0, time = 10, interval = null, running = false;
  const status = area.querySelector("#click-status");
  const target = area.querySelector("#click-target");
  function reset() {
    if (interval) clearInterval(interval);
    score = 0; time = 10; running = false;
    status.textContent = `Time: ${time}s · Score: ${score}`;
    target.disabled = false; target.textContent = "TAP!";
  }
  target.addEventListener("click", () => {
    if (!running) {
      running = true;
      interval = setInterval(() => {
        time--;
        status.textContent = `Time: ${time}s · Score: ${score}`;
        if (time <= 0) {
          clearInterval(interval); interval = null; running = false;
          target.disabled = true; target.textContent = "TIME!";
          status.textContent = `Finished! Your score: ${score}`;
        }
      }, 1000);
    }
    if (time > 0) { score++; status.textContent = `Time: ${time}s · Score: ${score}`; }
  });
  area.querySelector("#click-reset").addEventListener("click", reset);
}

function renderTicTacToe(area) {
  area.innerHTML = `<p class="mini-game-instructions">Take turns with a friend. First to get three in a row wins.</p>
    <div class="mini-game-status" id="ttt-status">X's turn</div>
    <div class="ttt-board" id="ttt-board">${Array.from({length:9},(_,i)=>`<button class="ttt-cell" data-cell="${i}" aria-label="Cell ${i+1}"></button>`).join("")}</div>
    <button class="secondary-button mini-reset" id="ttt-reset">New round</button>`;
  let board = Array(9).fill(""), turn = "X", finished = false;
  const status = area.querySelector("#ttt-status");
  const cells = [...area.querySelectorAll(".ttt-cell")];
  const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  function reset() {
    board = Array(9).fill(""); turn = "X"; finished = false;
    cells.forEach(cell => cell.textContent = "");
    status.textContent = "X's turn";
  }
  cells.forEach(cell => cell.addEventListener("click", () => {
    const i = Number(cell.dataset.cell);
    if (finished || board[i]) return;
    board[i] = turn; cell.textContent = turn; cell.classList.toggle("is-o", turn === "O");
    if (wins.some(line => line.every(n => board[n] === turn))) {
      status.textContent = `${turn} wins!`; finished = true; return;
    }
    if (board.every(Boolean)) { status.textContent = "It's a draw!"; finished = true; return; }
    turn = turn === "X" ? "O" : "X";
    status.textContent = `${turn}'s turn`;
  }));
  area.querySelector("#ttt-reset").addEventListener("click", reset);
}

function renderGuess(area) {
  let secret = Math.floor(Math.random() * 20) + 1;
  let attempts = 0;
  area.innerHTML = `<p class="mini-game-instructions">I'm thinking of a number from 1 to 20. Can you guess it?</p>
    <form id="guess-form" class="guess-form"><input id="guess-input" type="number" min="1" max="20" required placeholder="1–20" aria-label="Your guess"><button class="primary-button" type="submit">Guess</button></form>
    <div class="mini-game-status" id="guess-status">Make your first guess!</div>
    <button class="secondary-button mini-reset" id="guess-reset">New number</button>`;
  const input = area.querySelector("#guess-input");
  const status = area.querySelector("#guess-status");
  area.querySelector("#guess-form").addEventListener("submit", event => {
    event.preventDefault();
    const guess = Number(input.value);
    if (guess < 1 || guess > 20) { status.textContent = "Choose a number from 1 to 20."; return; }
    attempts++;
    if (guess === secret) {
      status.textContent = `Correct! You got it in ${attempts} ${attempts === 1 ? "guess" : "guesses"}!`;
    } else {
      status.textContent = guess < secret ? "Too low — try higher!" : "Too high — try lower!";
    }
    input.select();
  });
  area.querySelector("#guess-reset").addEventListener("click", () => {
    secret = Math.floor(Math.random() * 20) + 1; attempts = 0;
    status.textContent = "New number chosen. Make a guess!";
    input.value = "";
  });
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
