// === Variablen ===
let POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
let POKE_API_LIMIT = 20; // kann man anpassen
let POKE_API_OFFSET = 0;
let SPRITE_DEFAULT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// HTML Position
let listEl = document.getElementById("pokemon-list");

// === INIT ===
async function init() {
  let pokemons = await fetchPokemons();
  renderPokemons(pokemons);
}
init();

// == FETCH ==
async function fetchPokemons() {
  let url = POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;
  let res = await fetch(url);
  if (!res.ok) {
    console.error("api error");
    return [];
  }
  let json = await res.json();
  return json.results;
}

// === TEMPLATE ===
function pokemonCardTemplate(name, index) {
  let imgUrl = SPRITE_DEFAULT + index + ".png";
  return `<div class="pokemon-card">
       <img src="${imgUrl}" alt="${name}">
       <h2>${index} ⏐ ${name}</h2>
     </div>`;
}

// === RENDER ===
// Schrittweise anhängen: innerHTML += ...
function renderPokemons(pokemons) {
  for (let i = 0; i < pokemons.length; i++) {
    let pokeIndex = i + POKE_API_OFFSET + 1; // Index startet bei 1
    listEl.innerHTML += pokemonCardTemplate(pokemons[i].name, pokeIndex);
  }
}
