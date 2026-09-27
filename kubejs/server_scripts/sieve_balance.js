// Sky Craft Creation - Ex Deorum sieve balance.
// AllTheCompressed 1x blocks are the only compressed sieve inputs.
ServerEvents.recipes(event => {
  const globalDropMultiplier = 1.5
  // Keep the existing balance rule: probability uses 1.2 x 1.5 = 1.8x.
  const chanceMultiplier = 1.2 * globalDropMultiplier
  const baseCompressedSieveRolls = 7.0
  const compressedBlockEquivalent = 9.0

  const allTheCompressedMaterials = {
    andesite: 'andesite_1x',
    blackstone: 'blackstone_1x',
    cobbled_deepslate: 'cobbled_deepslate_1x',
    cobblestone: 'cobblestone_1x',
    crushed_blackstone: 'crushed_blackstone_1x',
    crushed_deepslate: 'crushed_deepslate_1x',
    crushed_end_stone: 'crushed_end_stone_1x',
    crushed_netherrack: 'crushed_netherrack_1x',
    deepslate: 'deepslate_1x',
    diorite: 'diorite_1x',
    dirt: 'dirt_1x',
    dust: 'dust_1x',
    end_stone: 'end_stone_1x',
    granite: 'granite_1x',
    gravel: 'gravel_1x',
    moss_block: 'moss_block_1x',
    netherrack: 'netherrack_1x',
    red_sand: 'red_sand_1x',
    sand: 'sand_1x',
    soul_sand: 'soul_sand_1x'
  }

  const oreChunkItems = [
    'minecraft:raw_iron', 'minecraft:raw_gold', 'minecraft:raw_copper',
    'mekanism:raw_osmium', 'mekanism:raw_tin', 'mekanism:raw_lead',
    'mekanism:raw_uranium',
    'immersiveengineering:raw_aluminum', 'immersiveengineering:raw_nickel',
    'immersiveengineering:raw_silver', 'create:raw_zinc',
    'exdeorum:iron_ore_chunk', 'exdeorum:gold_ore_chunk',
    'exdeorum:copper_ore_chunk', 'exdeorum:osmium_ore_chunk',
    'exdeorum:tin_ore_chunk', 'exdeorum:lead_ore_chunk',
    'exdeorum:uranium_ore_chunk', 'exdeorum:aluminum_ore_chunk',
    'exdeorum:nickel_ore_chunk', 'exdeorum:silver_ore_chunk',
    'exdeorum:zinc_ore_chunk'
  ]
  const rareItems = [
    'minecraft:diamond', 'minecraft:emerald',
    'allthemodium:raw_allthemodium', 'allthemodium:raw_vibranium',
    'allthemodium:raw_unobtainium'
  ]

  // Multipliers are relative to one normal sieve operation.
  function getNormalOutputMultiplier(resultId) {
    if (oreChunkItems.includes(resultId)) return 2.5 * globalDropMultiplier
    if (rareItems.includes(resultId)) return 1.5 * globalDropMultiplier
    return 2.0 * globalDropMultiplier
  }

  // Compressed output is exactly 9x the normal output multiplier.
  // Ex Deorum's original compressed recipe uses 7 rolls, so divide the
  // required 9x compressed multiplier by 7 when editing the source recipe.
  function getCompressedRecipeMultiplier(resultId) {
    return getNormalOutputMultiplier(resultId) * compressedBlockEquivalent / baseCompressedSieveRolls
  }

  function isRemovedPebble(meshId, resultId) {
    return (meshId === 'exdeorum:diamond_mesh' || meshId === 'exdeorum:netherite_mesh')
      && resultId.endsWith('_pebble')
  }

  function balanceResultAmount(amount, outputMultiplier, countCap) {
    if (!amount || !amount.has('type')) return

    const type = amount.get('type').getAsString()

    if (type === 'minecraft:binomial') {
      if (amount.has('n')) {
        amount.addProperty('n', Math.min(amount.get('n').getAsDouble() * outputMultiplier, countCap))
      }
      if (amount.has('p')) {
        amount.addProperty('p', Math.min(amount.get('p').getAsDouble() * chanceMultiplier, 1.0))
      }
    } else if (type === 'minecraft:uniform') {
      if (amount.has('min')) amount.addProperty('min', amount.get('min').getAsDouble() * outputMultiplier)
      if (amount.has('max')) amount.addProperty('max', amount.get('max').getAsDouble() * outputMultiplier)
    } else if (type === 'minecraft:constant') {
      if (amount.has('value')) amount.addProperty('value', amount.get('value').getAsDouble() * outputMultiplier)
    }
  }

  const fluxSieveRecipes = []

  function queueFluxSieveRecipe(material, output, mesh, amountN, amountP, resultCount) {
    const allId = allTheCompressedMaterials[material]
    if (!allId || amountN === undefined || amountP === undefined) return

    fluxSieveRecipes.push({
      material: material,
      input: 'allthecompressed:' + allId,
      output: output,
      resultCount: resultCount || 1,
      mesh: mesh,
      n: amountN,
      p: amountP
    })
  }

  function balanceRecipe(recipe, compressed) {
    const json = recipe.json
    if (!json.has('result')) return

    const result = json.getAsJsonObject('result')
    if (!result.has('id')) return
    const resultId = result.get('id').getAsString()

    const mesh = json.has('mesh') ? json.getAsJsonObject('mesh') : null
    const meshId = mesh && mesh.has('item') ? mesh.get('item').getAsString() : null
    if (isRemovedPebble(meshId, resultId)) {
      recipe.remove()
      return
    }

    const outputMultiplier = compressed
      ? getCompressedRecipeMultiplier(resultId)
      : getNormalOutputMultiplier(resultId)
    const countCap = compressed ? 8.0 * compressedBlockEquivalent : 8.0
    const amount = json.has('result_amount') ? json.getAsJsonObject('result_amount') : null
    balanceResultAmount(amount, outputMultiplier, countCap)
    recipe.save()

    if (compressed && amount && amount.has('n') && amount.has('p')) {
      const ingredient = json.has('ingredient') ? json.getAsJsonObject('ingredient') : null
      const tag = ingredient && ingredient.has('tag') ? ingredient.get('tag').getAsString() : null
      const prefix = 'exdeorum:compressed/'
      if (tag && tag.indexOf(prefix) === 0) {
        queueFluxSieveRecipe(
          tag.substring(prefix.length),
          resultId,
          meshId,
          amount.get('n').getAsDouble(),
          amount.get('p').getAsDouble(),
          result.has('count') ? result.get('count').getAsInt() : 1
        )
      }
    }
  }

  event.forEachRecipe({ type: 'exdeorum:sieve' }, recipe => balanceRecipe(recipe, false))
  event.forEachRecipe({ type: 'exdeorum:compressed_sieve' }, recipe => balanceRecipe(recipe, true))

  const meshChances = {
    flint: 1.0,
    string: 1.25,
    iron: 1.6,
    golden: 2.0,
    diamond: 2.6,
    netherite: 3.2
  }

  // 自定义掉落默认只乘全局倍率；balanced = true 时与普通筛「次要资源」规则完全一致：
  // 数量 ×(2.0 × 全局倍率) = 3.0，概率 ×(1.2 × 全局倍率) = 1.8，压缩筛同步为该值的 9 倍。
  function getCustomDropChance(baseChance, mesh, balanced) {
    const multiplier = balanced ? chanceMultiplier : globalDropMultiplier
    return Math.min(baseChance * meshChances[mesh] * multiplier, 1.0)
  }

  function getCustomDropCount(balanced) {
    return balanced ? 2.0 * globalDropMultiplier : 1.0
  }

  function addSieveDrop(input, output, mesh, baseChance, namespace, balanced) {
    event.custom({
      type: 'exdeorum:sieve',
      ingredient: { item: input },
      mesh: { item: 'exdeorum:' + mesh + '_mesh' },
      result: { count: 1, id: output },
      result_amount: {
        type: 'minecraft:binomial',
        n: getCustomDropCount(balanced),
        p: getCustomDropChance(baseChance, mesh, balanced)
      }
    }).id('sky-craft-creation:sieve/' + namespace + '/' + mesh)
  }

  function addCompressedSieveDrop(material, output, mesh, baseChance, namespace, balanced) {
    const chance = getCustomDropChance(baseChance, mesh, balanced)
    const count = compressedBlockEquivalent * getCustomDropCount(balanced)
    event.custom({
      type: 'exdeorum:compressed_sieve',
      ingredient: { tag: 'exdeorum:compressed/' + material },
      mesh: { item: 'exdeorum:' + mesh + '_mesh' },
      result: { count: 1, id: output },
      result_amount: {
        type: 'minecraft:binomial',
        n: count,
        p: chance
      }
    }).id('sky-craft-creation:compressed_sieve/' + namespace + '/' + mesh)

    queueFluxSieveRecipe(material, output, 'exdeorum:' + mesh + '_mesh', count, chance, 1)
  }

  function addConfiguredDrops(input, material, output, baseChance, namespace, balanced) {
    Object.keys(meshChances).forEach(mesh => {
      addSieveDrop(input, output, mesh, baseChance, namespace, balanced)
      addCompressedSieveDrop(material, output, mesh, baseChance, namespace, balanced)
    })
  }

  addConfiguredDrops('minecraft:netherrack', 'netherrack', 'enderio:pulsating_crystal', 0.018, 'pulsating_crystal')
  addConfiguredDrops('minecraft:soul_sand', 'soul_sand', 'actuallyadditions:black_quartz', 0.045, 'black_quartz')
  addConfiguredDrops('minecraft:netherrack', 'netherrack', 'mysticalagriculture:prosperity_shard', 0.026, 'prosperity_shard')
  addConfiguredDrops('minecraft:netherrack', 'netherrack', 'allthemodium:raw_allthemodium', 0.007, 'raw_allthemodium')
  addConfiguredDrops('minecraft:soul_sand', 'soul_sand', 'allthemodium:raw_vibranium', 0.005, 'raw_vibranium')
  addConfiguredDrops('exdeorum:crushed_end_stone', 'crushed_end_stone', 'allthemodium:raw_unobtainium', 0.004, 'raw_unobtainium')
  addConfiguredDrops('minecraft:netherrack', 'netherrack', 'naturesaura:infused_iron', 0.015, 'infused_iron')
  // 神秘农业基础材料：空岛没有下级矿石，改成筛泥土产出（普通筛 / 压缩筛 / 通量筛同步生效）。
  addConfiguredDrops('minecraft:dirt', 'dirt', 'mysticalagriculture:inferium_essence', 0.04, 'inferium_essence', true)

  // Flux Sieve only sees normal exdeorum:sieve recipes. These clones expose
  // the balanced compressed recipes to Ex Machinis for every AllTheCompressed
  // tier 1x-9x; a Nx block settles 9 x N rolls.
  const fluxSieveTierMax = 9
  fluxSieveRecipes.forEach((entry, index) => {
    for (var tier = 1; tier <= fluxSieveTierMax; tier++) {
      event.custom({
        type: 'exdeorum:sieve',
        ingredient: { item: 'allthecompressed:' + entry.material + '_' + tier + 'x' },
        mesh: { item: entry.mesh },
        result: { count: entry.resultCount, id: entry.output },
        result_amount: {
          type: 'minecraft:binomial',
          n: entry.n * tier,
          p: entry.p
        }
      }).id('sky-craft-creation:flux_sieve/' + index + '_' + entry.material + '_' + tier + 'x/' + entry.mesh.replace(':', '_'))
    }
  })

  event.shapeless('2x enderio:pulsating_crystal', [
    '4x minecraft:quartz',
    'minecraft:glowstone_dust',
    'minecraft:redstone'
  ]).id('sky-craft-creation:materials/pulsating_crystal_fallback')

  event.shapeless('2x actuallyadditions:black_quartz', [
    '4x minecraft:quartz',
    '2x minecraft:coal'
  ]).id('sky-craft-creation:materials/black_quartz_fallback')
})