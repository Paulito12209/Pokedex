// === Variablen ===
let POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
let POKE_API_LIMIT = 20;
let POKE_API_OFFSET = 0;
let SPRITE_DEFAULT = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

let pokemonList = document.getElementById("pokemon-list");
let fetchURL = POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;

async function fetchPokemonData() {
  try {
    let requestedData = await fetch(fetchURL);
    let requestedDataAsJson = await requestedData.json();
    if (!requestedData.ok) {
      console.log(requestedDataAsJson.description);
      return;
    }
    let pokeArray = requestedDataAsJson.results;
    
    // Für jedes Pokemon die Details holen
    for (let i = 0; i < pokeArray.length; i++) {
      let detailsResponse = await fetch(pokeArray[i].url);
      let pokemonDetails = await detailsResponse.json();
      renderPokemon(pokemonDetails, i);
    }
    
    console.log("Alle Pokemon geladen!");
  } catch (error) {
    console.log(error);
  }
}

fetchPokemonData();

function renderPokemon(pokemon, index) {
  let pokeName = pokemon.name.toUpperCase();
  let pokeIndex = index + POKE_API_OFFSET + 1;
  
  // Typen aus dem Array extrahieren
  let typesHTML = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name.toUpperCase();
    typesHTML += `<div class="pokemon-card-type">${typeName}</div>`;
  }
  
  pokemonList.innerHTML += pokemonCardTemplate(pokeName, pokeIndex, typesHTML);
}

function pokemonCardTemplate(name, index, typesHTML) {
  let spriteUrl = SPRITE_DEFAULT + index + ".png";
  return `<div class="pokemon-card">
    <div class="pokemon-card-sprite">
      <img src="${spriteUrl}" alt="${name}" />
    </div>
    <div class="pokemon-card-info">
      <p>#${index}</p>
      <h2>${name}</h2>
      <div class="pokemon-card-types">
        ${typesHTML}
      </div>
    </div>
  </div>`;
}