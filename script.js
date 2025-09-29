// Variablen
let POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
let POKE_API_LIMIT = 20; // kann man anpassen
let POKE_API_OFFSET = 0;
let SPRITE_DEFAULT = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// cache DOM refs einmalig per ID
let listEl = document.getElementById("pokemon-list");

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

function pokemonCardTemplate(name, index) {
  let imgUrl = SPRITE_DEFAULT + index + ".png";
  return (
    `<div class="pokemon-card">
       <img src="${imgUrl}" alt="${name}">
       <h2>${index} ⏐ ${name}</h2>
     </div>`
  );
}

function renderPokemon(pokemon, index) {
  // index beginnt bei 0, Pokedex-Index ab 1
  let pokeIndex = index + POKE_API_OFFSET + 1;
  listEl.insertAdjacentHTML("beforeend", pokemonCardTemplate(pokemon.name, pokeIndex));
}

async function init() {
  let pokemons = await fetchPokemons();
  for (let pokemonIndex = 0; pokemonIndex < pokemons.length; pokemonIndex++) {
    renderPokemon(pokemons[pokemonIndex], pokemonIndex);
  }
}

init();