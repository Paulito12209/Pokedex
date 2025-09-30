// === Variablen ===
let POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
let POKE_API_LIMIT = 20;
let POKE_API_OFFSET = 0;
let SPRITE_DEFAULT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

let pokemonList = document.getElementById("pokemon-list");
let dialog = document.getElementById("pokemon-dialog");
let dialogWrapper = document.getElementById("dialog-wrapper");
let fetchURL =
  POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;

let allPokemonDetails = [];

async function fetchPokemonData() {
  try {
    let requestedData = await fetch(fetchURL);
    let requestedDataAsJson = await requestedData.json();
    if (!requestedData.ok) {
      console.log(requestedDataAsJson.description);
      return;
    }
    let pokeArray = requestedDataAsJson.results;

    for (let i = 0; i < pokeArray.length; i++) {
      let detailsResponse = await fetch(pokeArray[i].url);
      let pokemonDetails = await detailsResponse.json();
      allPokemonDetails.push(pokemonDetails);
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

  let pokeTypes = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    let typeNameUpper = typeName.toUpperCase();
    pokeTypes += `<div class="pokemon-card-type type-${typeName}">${typeNameUpper}</div>`;
  }

  pokemonList.innerHTML += pokemonCardTemplate(pokeName, pokeIndex, pokeTypes);
}

function pokemonCardTemplate(name, index, pokeTypes) {
  let spriteUrl = SPRITE_DEFAULT + index + ".png";
  return `<div class="pokemon-card">
    <div class="pokemon-card-sprite" onclick="openDialog(${index})">
      <img src="${spriteUrl}" alt="${name}" />
    </div>
    <div class="pokemon-card-info">
      <p>#${index}</p>
      <h2>${name}</h2>
      <div class="pokemon-card-types">
        ${pokeTypes}
      </div>
    </div>
  </div>`;
}

function openDialog(pokeIndex) {
  let pokemon = allPokemonDetails[pokeIndex - 1];
  let pokeName = pokemon.name.toUpperCase();
  let spriteUrl = SPRITE_DEFAULT + pokeIndex + ".png";

  document.getElementById("dialog-pokemon-name").innerHTML = pokeName;
  document.getElementById("dialog-pokemon-id").innerHTML = "#" + pokeIndex;
  document.getElementById("dialog-pokemon-image").src = spriteUrl;
  document.getElementById("dialog-pokemon-image").alt = pokeName;
  document.getElementById("dialog-height").innerHTML = pokemon.height;
  document.getElementById("dialog-weight").innerHTML = pokemon.weight;

  // Stats auslesen
  document.getElementById("dialog-hp").innerHTML = pokemon.stats[0].base_stat;
  document.getElementById("dialog-attack").innerHTML =
    pokemon.stats[1].base_stat;
  document.getElementById("dialog-defense").innerHTML =
    pokemon.stats[2].base_stat;

  let typesContainer = document.getElementById("dialog-pokemon-types");
  typesContainer.innerHTML = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    let typeNameUpper = typeName.toUpperCase();
    typesContainer.innerHTML += `<div class="pokemon-card-type type-${typeName}">${typeNameUpper}</div>`;
  }

  dialog.showModal();
}

function closeDialog() {
  dialog.close();
}

// Event Bubbling wie bei Fotogram
dialog.addEventListener("click", function (e) {
  if (!dialogWrapper.contains(e.target)) {
    dialog.close();
  }
});
