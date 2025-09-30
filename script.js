// === Variablen ===
let POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
let POKE_API_LIMIT = 20; // kann man anpassen
let POKE_API_OFFSET = 0;
let SPRITE_DEFAULT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

// DOM Ablage in der Main Sektion
let pokemonList = document.getElementById("pokemon-list");

let fetchURL =
  POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;

async function fetchPokemonData() {
  try {
    let requestedData = await fetch(fetchURL);
    let requestedDataAsJson = await requestedData.json();
    if (!requestedData.ok) {
      console.log(requestedDataAsJson.description);
      return;
    }
    let pokeArray = requestedDataAsJson.results;
    renderPokemons(pokeArray);
    console.log(pokeArray);
  } catch (error) {
    console.log(error);
  }
}

fetchPokemonData();
// 'pokemons' dient hier als Platzhalter für 'pokeArray'
function renderPokemons(pokemons) {
  for (let i = 0; i < pokemons.length; i++) {
    let pokeName = pokemons[i].name.toUpperCase();
    let pokeIndex = i + POKE_API_OFFSET + 1; // Index startet bei 1
    pokemonList.innerHTML += pokemonCardTemplate(pokeName, pokeIndex);
  }
}

function pokemonCardTemplate(name, index) {
  let spriteUrl = SPRITE_DEFAULT + index + ".png";
  return `<div class="pokemon-card">
  <div class="pokemon-card-sprite">
  <img src="${spriteUrl}" alt="${name}" />
  </div>
  <div class="pokemon-card-info">
    <p>#${index}</p>
    <h2>${name}</h2>
    <div class="pokemon-card-types">
        <div class="pokemon-card-type>Typ 1</div>
        <div class="pokemon-card-type>Typ 2</div>
    </div>
  </div>
</div>`;
}

// function pokemonCardTemplate(name, index) {
//   return `<div class="pokemon-card">
//   <div class="pokemon-card-sprite">
//     <img src="${spriteUrl}" alt="${name}" />
//   </div>
//   <div class="pokemon-card-info">
//     <p>#${index}</p>
//     <h2>${name}</h2>
//     <div class="pokemon-card-types">
//         <div>Typ 1</div>
//         <div>Typ 2</div>
//     </div>
//   </div>
// </div>`;
// }

// // === INIT ===
// async function init() {
//   let pokemons = await fetchPokemons();
//   renderPokemons(pokemons);
// }
// init();

// // == FETCH ==
// async function fetchPokemons() {
//   let url = POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;
//   let data = await fetch(url);
//   let dataAsJson = await data.json();
//   if (!data.ok) {
//     console.error("api error");
//     return [];
//   }
//   return dataAsJson.results;
// }

// // === RENDER ===
// // Schrittweise anhängen: innerHTML += ...
// function renderPokemons(pokemons) {
//   for (let i = 0; i < pokemons.length; i++) {
//     let poke = pokemons[i];
//     let pokeIndex = i + POKE_API_OFFSET + 1; // Index startet bei 1
//     pokemonList.innerHTML += pokemonCardTemplate(pokemons[i].name, pokeIndex);
//   }
// }

// // === TEMPLATE ===
// function pokemonCardTemplate(name, index) {
//   let spriteUrl = SPRITE_DEFAULT + index + ".png";
//   return `<div class="pokemon-card">
//        <h2>#${index} ⏐ ${name}</h2>
//        <img src="${spriteUrl}" alt="${name}">
//        <p>TYP: WIP</p>
//      </div>`;
// }
