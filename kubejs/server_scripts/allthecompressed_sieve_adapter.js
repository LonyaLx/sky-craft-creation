// Sky Craft Creation - AllTheCompressed 1x-9x blocks are the compressed sieve inputs.
const ALLTHECOMPRESSED_SIEVE_MATERIALS = {
  andesite: 'andesite',
  blackstone: 'blackstone',
  cobbled_deepslate: 'cobbled_deepslate',
  cobblestone: 'cobblestone',
  crushed_blackstone: 'crushed_blackstone',
  crushed_deepslate: 'crushed_deepslate',
  crushed_end_stone: 'crushed_end_stone',
  crushed_netherrack: 'crushed_netherrack',
  deepslate: 'deepslate',
  diorite: 'diorite',
  dirt: 'dirt',
  dust: 'dust',
  end_stone: 'end_stone',
  granite: 'granite',
  gravel: 'gravel',
  moss_block: 'moss_block',
  netherrack: 'netherrack',
  red_sand: 'red_sand',
  sand: 'sand',
  soul_sand: 'soul_sand'
}

// Highest AllTheCompressed tier. Tiers 1x-9x can all be sieved.
const SIEVE_TIER_MAX = 9
// One 1x block equals 9 base blocks.
const HEAVY_SIEVE_ROLLS_PER_TIER = 9

ServerEvents.tags('item', event => {
  for (var material in ALLTHECOMPRESSED_SIEVE_MATERIALS) {
    var tag = 'exdeorum:compressed/' + material
    event.removeAll(tag)
    for (var tier = 1; tier <= SIEVE_TIER_MAX; tier++) {
      event.add(tag, 'allthecompressed:' + ALLTHECOMPRESSED_SIEVE_MATERIALS[material] + '_' + tier + 'x')
    }
  }
})

// Ex Compressum heavy sieves consume the same AllTheCompressed blocks.
// One 1x block is 9 base blocks, so a Nx block settles 9 x N rolls.
const HEAVY_SIEVE_ALL_INPUTS = {
  'minecraft:cobblestone': 'cobblestone',
  'exnihilosequentia:crushed_end_stone': 'crushed_end_stone',
  'exnihilosequentia:crushed_netherrack': 'crushed_netherrack',
  'minecraft:dirt': 'dirt',
  'exnihilosequentia:dust': 'dust',
  'minecraft:end_stone': 'end_stone',
  'minecraft:gravel': 'gravel',
  'minecraft:netherrack': 'netherrack',
  'minecraft:sand': 'sand',
  'minecraft:soul_sand': 'soul_sand'
}

ServerEvents.recipes(event => {
  const heavySieveSources = []

  event.forEachRecipe({ type: 'excompressum:heavy_sieve_generated' }, recipe => {
    const json = recipe.json
    if (!json.has('source') || !json.has('input')) {
      recipe.remove()
      return
    }

    const source = json.get('source').getAsString()
    const allInput = HEAVY_SIEVE_ALL_INPUTS[source]
    if (!allInput) {
      recipe.remove()
      return
    }

    json.getAsJsonObject('input').addProperty('item', 'allthecompressed:' + allInput + '_1x')
    json.addProperty('rolls', HEAVY_SIEVE_ROLLS_PER_TIER)
    recipe.save()

    heavySieveSources.push({ material: allInput, source: source })
  })

  // 2x-9x keep the same source chain and settle 9 x tier rolls.
  heavySieveSources.forEach((entry, index) => {
    for (var tier = 2; tier <= SIEVE_TIER_MAX; tier++) {
      event.custom({
        type: 'excompressum:heavy_sieve_generated',
        input: { item: 'allthecompressed:' + entry.material + '_' + tier + 'x' },
        source: entry.source,
        rolls: HEAVY_SIEVE_ROLLS_PER_TIER * tier
      }).id('sky-craft-creation:heavy_sieve/' + index + '_' + entry.material + '_' + tier + 'x')
    }
  })
})
