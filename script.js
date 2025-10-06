// === Variablen ===
const POKE_API_URL = "https://pokeapi.co/api/v2/pokemon";
const POKE_API_LIMIT = 20;
let POKE_API_OFFSET = 0;
const SPRITE_DEFAULT =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

let pokemonList = document.getElementById("pokemon-list");
let dialog = document.getElementById("pokemon-dialog");
let dialogWrapper = document.getElementById("dialog-wrapper");
let searchInput = document.getElementById("search-input");
let deleteSearchButton = document.getElementById("delete-search-button");
let fetchURL =
  POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;

let allPokemonDetails = [];
let currentPokemonDetails = [];
let allPokemonNames = [];
let isSearchDataLoaded = false;
let currentDialogIndex = 0;

// === Initialisierung ===
async function init() {
  await fetchInitialPokemon();
  currentPokemonDetails = [...allPokemonDetails];
  renderPokemon();
  hideLoadingSpinner();
  setupEventListeners();
}

init();

// === Event Listener Funktionen ===
function setupEventListeners() {
  searchInput.addEventListener("input", function () {
    filterPokemon();
  });

  deleteSearchButton.addEventListener("click", function () {
    clearSearch();
  });

  dialog.addEventListener("click", function (e) {
    if (!dialogWrapper.contains(e.target)) {
      closeDialog();
    }
  });

  dialog.addEventListener("close", function () {
    document.body.style.overflow = "";
  });

  let previousButton = document.getElementById("previous-button");
  let nextButton = document.getElementById("next-button");
  previousButton.addEventListener("click", previousPokemon);
  nextButton.addEventListener("click", nextPokemon);
}

// === Erste 20 Pokemon laden ===
async function fetchInitialPokemon() {
  try {
    let response = await fetch(fetchURL);
    let data = await response.json();
    if (!response.ok) return;

    await fetchAndStorePokemonDetails(data.results, false);
  } catch (error) {}
}

// === Alle Namen laden ===
async function loadAllPokemonNames() {
  if (isSearchDataLoaded) return;

  try {
    let response = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=100000"
    );
    let data = await response.json();
    allPokemonNames = data.results;
    isSearchDataLoaded = true;
  } catch (error) {}
}

// === Render Funktion ===
function renderPokemon() {
  pokemonList.innerHTML = "";

  for (let i = 0; i < currentPokemonDetails.length; i++) {
    let pokemon = currentPokemonDetails[i];
    let spriteUrl = getPokemonSpriteUrl(pokemon);
    let pokeTypes = generateTypesBadges(pokemon);

    pokemonList.innerHTML += pokemonCardTemplate(
      pokemon.name,
      pokemon.id,
      pokeTypes,
      pokemon,
      spriteUrl
    );
  }
}

// === Filter Funktion ===
async function filterPokemon() {
  let searchTerm = searchInput.value.toLowerCase();
  toggleDeleteButton(searchTerm);

  if (searchTerm === "") {
    handleEmptySearch();
    return;
  }

  currentPokemonDetails = [];
  pokemonList.innerHTML = "";
  toggleNoResultsMessage(false);

  if (!isSearchDataLoaded) await loadAllPokemonNames();

  let filteredNames = allPokemonNames.filter((p) =>
    p.name.toLowerCase().startsWith(searchTerm)
  );
  await fetchFilteredPokemon(filteredNames, searchTerm);

  if (searchInput.value.toLowerCase() === searchTerm) {
    toggleNoResultsMessage(currentPokemonDetails.length === 0);
    renderPokemon();
  }
}

// == Aushilfs-Funktionen ==
function toggleDeleteButton(searchTerm) {
  deleteSearchButton.style.display = searchTerm.length > 0 ? "flex" : "none";
}

function toggleNoResultsMessage(show) {
  let noResultsMessage = document.getElementById("no-results");
  noResultsMessage.style.display = show ? "flex" : "none";
}

function handleEmptySearch() {
  currentPokemonDetails = allPokemonDetails;
  toggleNoResultsMessage(false);
  renderPokemon();
}

async function fetchFilteredPokemon(filteredNames, searchTerm) {
  for (let i = 0; i < filteredNames.length; i++) {
    try {
      let response = await fetch(filteredNames[i].url);
      let pokemon = await response.json();
      if (searchInput.value.toLowerCase() === searchTerm) {
        currentPokemonDetails.push(pokemon);
      }
    } catch (error) {}
  }
}

function clearSearch() {
  searchInput.value = "";
  deleteSearchButton.style.display = "none";
  let noResultsMessage = document.getElementById("no-results");
  noResultsMessage.style.display = "none";
  currentPokemonDetails = allPokemonDetails;
  renderPokemon();
}

// === Dialog Functions ===
async function openDialogById(pokeId) {
  let pokemon = await findOrFetchPokemon(pokeId);
  if (!pokemon) return;

  currentDialogIndex = currentPokemonDetails.findIndex((p) => p.id === pokeId);
  showPokemonInDialog(pokemon);
  dialog.showModal();
  document.body.style.overflow = "hidden";
}

async function findOrFetchPokemon(pokeId) {
  let pokemon = currentPokemonDetails.find((p) => p.id === pokeId);

  if (!pokemon) {
    try {
      let response = await fetch(POKE_API_URL + "/" + pokeId);
      pokemon = await response.json();
    } catch (error) {
      return null;
    }
  }
  return pokemon;
}

function showPokemonInDialog(pokemon) {
  let spriteUrl = getPokemonSpriteUrl(pokemon);
  updateDialogDOM(pokemon, spriteUrl);
}

function closeDialog() {
  dialog.close();
  document.body.style.overflow = "";
}

// === Navigation Funktionen ===
async function previousPokemon() {
  if (currentDialogIndex > 0) {
    currentDialogIndex--;
    let pokemon = currentPokemonDetails[currentDialogIndex];
    showPokemonInDialog(pokemon);
  }
}

async function nextPokemon() {
  if (currentDialogIndex < currentPokemonDetails.length - 1) {
    currentDialogIndex++;
    showPokemonInDialog(currentPokemonDetails[currentDialogIndex]);
  } else {
    let nextPokemon = await loadNextPokemonFromAPI();
    if (nextPokemon) {
      currentDialogIndex++;
      showPokemonInDialog(nextPokemon);
    }
  }
}

async function loadNextPokemonFromAPI() {
  let currentPokemon = currentPokemonDetails[currentDialogIndex];
  let nextPokeId = currentPokemon.id + 1;

  try {
    let response = await fetch(POKE_API_URL + "/" + nextPokeId);
    if (!response.ok) return null;

    let nextPokemon = await response.json();
    currentPokemonDetails.push(nextPokemon);
    return nextPokemon;
  } catch (error) {
    return null;
  }
}

// === Loading Spinner ===
function hideLoadingSpinner() {
  let spinner = document.getElementById("loading-spinner");
  spinner.style.display = "none";
}

// === Mehr Pokemon laden ===
async function loadMorePokemon() {
  setLoadingState(true);
  try {
    POKE_API_OFFSET += POKE_API_LIMIT;
    let newFetchURL =
      POKE_API_URL + `?limit=${POKE_API_LIMIT}&offset=${POKE_API_OFFSET}`;
    let response = await fetch(newFetchURL);
    let data = await response.json();

    if (!response.ok) return;

    await fetchAndStorePokemonDetails(data.results);
    renderPokemon();
  } catch (error) {
  } finally {
    setLoadingState(false);
  }
}

async function fetchAndStorePokemonDetails(pokeArray, addToCurrent = true) {
  for (let i = 0; i < pokeArray.length; i++) {
    let response = await fetch(pokeArray[i].url);
    let pokemonDetails = await response.json();
    allPokemonDetails.push(pokemonDetails);
    if (addToCurrent) currentPokemonDetails.push(pokemonDetails);
  }
}

function setLoadingState(isLoading) {
  let loadMoreButton = document.getElementById("load-more-button");
  let spinner = document.getElementById("loading-spinner");

  spinner.style.display = isLoading ? "flex" : "none";
  loadMoreButton.disabled = isLoading;
  loadMoreButton.innerHTML = isLoading ? "Lädt..." : "Mehr laden";
}
