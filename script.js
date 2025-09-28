const MAX_POKEMON = 151;
const list_Wrapper = document.getElementById("main_content");
const search_Input = document.getElementById("search-input");
const notFoundMessage = document.getElementById("not-found-message");

let allPokemons = [];

fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
  .then((response) => response.json())
  .then((data) => {
    allPokemons = data.results;
    renderPokemons(allPokemons);
  });

async function fetchPokemonData(id) {
  try {
    const [pokemon, pokemonSpecies] = await Promise.all([
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json())
    ]);
    return true;
  } catch (error) {
    console.error("Failed to fetch Pokemon data before redirect");
  }
}

function renderPokemons(pokemon) {
  list_Wrapper.innerHTML = "";

  pokemon.forEach((pokemon) => {
    const pokemonID = pokemon.url.split("/")[6];
    const listItem = document.createElement("div");
    listItem.className = "list-item";
    listItem.innerHTML = `<div class="number-wrap">
                            <p class="caption-fonts">#${pokemonID}</p>
                          </div>
                          <div class=" img-wrap">
                            <img src="https://raw.githubusercontent.com/pokeapi/sprites/master/sprites/pokemon/other/dream-world/${pokemonID}.svg" alt="${pokemon.name}" />
                          </div>
                          <div class="name-wrap">
                            <p class="search-font">#${pokemon.name}</p>
                          </div>`;

    listItem.addEventListener("click", async () => {
      const success = await fetchPokemonData(pokemonID);
      if (success) {
        window.location.href = `./detail.html?id=${pokemonID}`;
      }
    });

    list_Wrapper.appendChild(listItem);
  });
}

search_Input.addEventListener("keyup", handleSearch);

function handleSearch() {
  const searchTerm = search_Input.value.toLowerCase();
  let filteredPokemons;

  renderPokemons(filteredPokemons);

  if (filteredPokemons.length === 0) {
    notFoundMessage.style.display = "block";
  } else {
    notFoundMessage.style.display = "none";
  }
}

const closeButton = document.getElementById("search-close-button");
closeButton.addEventListener("click", clearSearch);

function clearSearch(){
  search_Input.value = "";
  
}