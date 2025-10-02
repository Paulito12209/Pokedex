// === Template Funktion ===
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
