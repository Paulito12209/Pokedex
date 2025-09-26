let api_Url = "https://pokeapi.co/api/v2/pokemon";
let poke_Name = "/bulbasaur";
// let poke_name_info = pokemon.forms[0];

let pokemon_Url = api_Url + poke_Name;
console.log(pokemon_Url);

// function init() {
//   getPokemonName();
// }

async function getPokemonName() {
  let response = await fetch(pokemon_Url);
  let responseAsJson = await response.json();
  document.getElementById("main_content").innerHTML = "";

  for (let index = 0; index < 3; index++) {
    // let name = responseAsJson[index].name

    document.getElementById(
      "main_content"
    ).innerHTML += `<div class="pokedex-card">
                        <div class="pokedex-card-image">
                        <img class="pokedex-icon" src="assets/img/pokedex.png" alt="" />
                        <img class="pokemon-image" src="assets/img/bisasam.png" alt="">
                        </div>
                        <div id="pokemon-name-info">${name} </div>
                    </div>`;
  }
}

getPokemonName();
