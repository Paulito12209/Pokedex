// === Pokemon Card Template ===
function pokemonCardTemplate(pokeName, pokeId, pokeTypes, pokemon, spriteUrl) {
  let firstType = pokemon.types[0].type.name;
  
  return `
    <div class="pokemon-card" onclick="openDialogById(${pokeId})">
      <div class="pokemon-card-sprite type-${firstType}">
        <img src="${spriteUrl}" alt="${pokeName}">
      </div>
      <div class="pokemon-card-info">
        <p>#${pokeId}</p>
        <h2>${pokeName}</h2>
        <div class="pokemon-card-types">
          ${pokeTypes}
        </div>
      </div>
    </div>
  `;
}

// === Type Badges generieren als Card ===
function generateTypesBadges(pokemon) {
  let typesHTML = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    typesHTML += `<div class="pokemon-card-type type-${typeName}">${typeName}</div>`;
  }
  return typesHTML;
}

// === Type Badges generieren im Dialog ===
function generateDialogTypes(pokemon) {
  let typesHTML = "";
  for (let i = 0; i < pokemon.types.length; i++) {
    let typeName = pokemon.types[i].type.name;
    typesHTML += `<div class="pokemon-card-type type-${typeName}">${typeName}</div>`;
  }
  return typesHTML;
}

// === Sprite URL mit Fallback ===
function getPokemonSpriteUrl(pokemon) {
  let spriteUrl = pokemon.sprites.other["official-artwork"].front_default;
  if (!spriteUrl) {
    spriteUrl = pokemon.sprites.front_default || SPRITE_DEFAULT + pokemon.id + ".png";
  }
  return spriteUrl;
}

// === Dialog DOM Updates ===
function updateDialogDOM(pokemon, spriteUrl) {
  let firstType = pokemon.types[0].type.name;
  
  document.getElementById("dialog-image-section").className = "dialog-image-section type-" + firstType;
  document.getElementById("dialog-pokemon-name").innerHTML = pokemon.name;
  document.getElementById("dialog-pokemon-image").src = spriteUrl;
  document.getElementById("dialog-pokemon-image").alt = pokemon.name;
  document.getElementById("dialog-height").innerHTML = (pokemon.height / 10) + "m";
  document.getElementById("dialog-weight").innerHTML = (pokemon.weight / 10) + "kg";
  document.getElementById("dialog-hp").innerHTML = pokemon.stats[0].base_stat;
  document.getElementById("dialog-attack").innerHTML = pokemon.stats[1].base_stat;
  document.getElementById("dialog-defense").innerHTML = pokemon.stats[2].base_stat;
  document.getElementById("dialog-pokemon-types").innerHTML = generateDialogTypes(pokemon);
}