// === Variablen ===
let POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
let POKE_API_LIMIT = 20;
let POKE_API_OFFSET = 0;
let SPRITE_DEFAULT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

let pokemonList = document.getElementById("pokemon-list");
let dialog = document.getElementById("pokemon-dialog");
let dialogWrapper = document.getElementById("dialog-wrapper");
let searchInput = document.getElementById("search-input");
let deleteSearchButton = document.querySelector(".delete-search-input");
let fetchURL =
  POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;

let allPokemonDetails = [];
let currentPokemonDetails = [];
let allPokemonNames = [];
let isSearchDataLoaded = false;
let currentDialogIndex = 0; // Aktueller Index im Dialog

// === Initialisierung ===
async function init() {
  await fetchInitialPokemon();
  currentPokemonDetails = allPokemonDetails;
  renderPokemon();
  setupEventListeners();
}

init();

// === Ereignisabfrage Funktionen ===
function setupEventListeners() {
  // Sucheingabe
  searchInput.addEventListener("input", function () {
    filterPokemon();
  });

  // Löschen
  deleteSearchButton.addEventListener("click", function () {
    clearSearch();
  });

  // Dialog Schließen
  dialog.addEventListener("click", function (e) {
    if (!dialogWrapper.contains(e.target)) {
      dialog.close();
    }
  });

  let navigationButtons = document.querySelectorAll(
    ".dialog-navigation-button"
  );
  navigationButtons[0].addEventListener("click", previousPokemon); // Vorherige
  navigationButtons[1].addEventListener("click", nextPokemon); // Nächste
}

// === Erste 20 Pokemon laden ===
async function fetchInitialPokemon() {
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
    }

    console.log("Erste 20 Pokemon geladen!");
  } catch (error) {
    console.log(error);
  }
}

// === Alle Namen laden ===
async function loadAllPokemonNames() {
  if (isSearchDataLoaded) return;

  try {
    console.log("Lade alle Pokemon-Namen für die Suche...");
    let response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100000"
    );
    let data = await response.json();

    // ALLE Pokemon ohne Filter
    allPokemonNames = data.results;

    isSearchDataLoaded = true;
    console.log(`${allPokemonNames.length} Pokemon-Namen geladen!`);
  } catch (error) {
    console.log("Fehler beim Laden der Pokemon-Namen:", error);
  }
}

// === Render Funktion ===
function renderPokemon() {
  pokemonList.innerHTML = "";

  for (let i = 0; i < currentPokemonDetails.length; i++) {
    let pokemon = currentPokemonDetails[i];
    let pokeName = pokemon.name.toUpperCase();
    let pokeId = pokemon.id;

    let spriteUrl = pokemon.sprites.other["official-artwork"].front_default;

    if (!spriteUrl) {
      spriteUrl =
        pokemon.sprites.front_default || SPRITE_DEFAULT + pokeId + ".png";
    }

    let pokeTypes = "";
    for (let j = 0; j < pokemon.types.length; j++) {
      let typeName = pokemon.types[j].type.name;
      let typeNameUpper = typeName.toUpperCase();
      pokeTypes += `<div class="pokemon-card-type type-${typeName}">${typeNameUpper}</div>`;
    }

    pokemonList.innerHTML += pokemonCardTemplate(
      pokeName,
      pokeId,
      pokeTypes,
      pokemon,
      spriteUrl
    );
  }
}

function pokemonCardTemplate(name, pokeId, pokeTypes, pokemon, spriteUrl) {
  let firstType = pokemon.types[0].type.name;

  return `<div class="pokemon-card">
    <div class="pokemon-card-sprite type-${firstType}" onclick="openDialogById(${pokeId})">
      <img src="${spriteUrl}" alt="${name}" />
    </div>
    <div class="pokemon-card-info">
      <p>#${pokeId}</p>
      <h2>${name}</h2>
      <div class="pokemon-card-types">
        ${pokeTypes}
      </div>
    </div>
  </div>`;
}

// === Filter Funktion ===
async function filterPokemon() {
  let searchTerm = searchInput.value.toLowerCase();

  // Delete-Button
  if (searchTerm.length > 0) {
    deleteSearchButton.style.display = "flex";
  } else {
    deleteSearchButton.style.display = "none";
  }

  if (searchTerm === "") {
    currentPokemonDetails = allPokemonDetails;
    renderPokemon();
    return;
  }

  // Liste sofort leeren BEVOR wir neue laden
  currentPokemonDetails = [];
  pokemonList.innerHTML = "";

  // Beim ersten Mal: Alle Namen laden
  if (!isSearchDataLoaded) {
    await loadAllPokemonNames();
  }

  let filteredNames = allPokemonNames.filter(function (pokemon) {
    return pokemon.name.toLowerCase().startsWith(searchTerm);
  });

  for (let i = 0; i < filteredNames.length; i++) {
    try {
      let response = await fetch(filteredNames[i].url);
      let pokemon = await response.json();

      if (searchInput.value.toLowerCase() === searchTerm) {
        currentPokemonDetails.push(pokemon);
      }
    } catch (error) {
      console.log("Fehler beim Laden:", error);
    }
  }

  if (searchInput.value.toLowerCase() === searchTerm) {
    renderPokemon();
  }
}

function clearSearch() {
  console.log("Clear Search aufgerufen!");
  searchInput.value = "";
  deleteSearchButton.style.display = "none";
  currentPokemonDetails = allPokemonDetails;
  renderPokemon();
}

// === Dialog Funktionen ===
async function openDialogById(pokeId) {
  let pokemon = currentPokemonDetails.find((p) => p.id === pokeId);

  // Zuweisung des Index im currentPokemonDetails Array
  currentDialogIndex = currentPokemonDetails.findIndex((p) => p.id === pokeId);

  if (!pokemon) {
    try {
      let response = await fetch(POKE_API_URL + "/" + pokeId);
      pokemon = await response.json();
    } catch (error) {
      console.log("Fehler beim Laden:", error);
      return;
    }
  }

  showPokemonInDialog(pokemon);
  dialog.showModal();
}

function showPokemonInDialog(pokemon) {
  let pokeName = pokemon.name.toUpperCase();
  let spriteUrl = pokemon.sprites.other["official-artwork"].front_default;

  if (!spriteUrl) {
    spriteUrl =
      pokemon.sprites.front_default || SPRITE_DEFAULT + pokemon.id + ".png";
  }

  let firstType = pokemon.types[0].type.name;
  let dialogImageSection = document.getElementById("dialog-image-section");
  dialogImageSection.className = "dialog-image-section type-" + firstType;

  document.getElementById("dialog-pokemon-name").innerHTML = pokeName;
  document.getElementById("dialog-pokemon-image").src = spriteUrl;
  document.getElementById("dialog-pokemon-image").alt = pokeName;

  let heightInMeters = pokemon.height / 10;
  document.getElementById("dialog-height").innerHTML = heightInMeters + "m";

  let weightInKg = pokemon.weight / 10;
  document.getElementById("dialog-weight").innerHTML = weightInKg + "kg";

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
}

function closeDialog() {
  dialog.close();
}

// === Navigation Funktionen ===
async function previousPokemon() {
  if (currentDialogIndex > 0) {
    currentDialogIndex--;
    let pokemon = currentPokemonDetails[currentDialogIndex];
    showPokemonInDialog(pokemon);
  } else {
    console.log("Bereits beim ersten Pokemon!");
  }
}

async function nextPokemon() {
  if (currentDialogIndex < currentPokemonDetails.length - 1) {
    currentDialogIndex++;
    let pokemon = currentPokemonDetails[currentDialogIndex];
    showPokemonInDialog(pokemon);
  } else {
    let currentPokemon = currentPokemonDetails[currentDialogIndex];
    let nextPokeId = currentPokemon.id + 1;

    try {
      let response = await fetch(POKE_API_URL + "/" + nextPokeId);

      if (!response.ok) {
        console.log("Kein weiteres Pokemon verfügbar!");
        return;
      }

      let nextPokemon = await response.json();

      currentPokemonDetails.push(nextPokemon);

      // Aktualisierung des Index
      currentDialogIndex++;
      showPokemonInDialog(nextPokemon);
    } catch (error) {
      console.log("Fehler beim Laden des nächsten Pokemons:", error);
    }
  }
}
