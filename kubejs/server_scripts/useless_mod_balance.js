// 天工创世 · useless_mod 万象合金炉进度重做。
// 合成方式：低阶使用原版工作台，高阶使用 Avaritia Tier 合成台。
ServerEvents.recipes(event => {
  // Remove the AE gift package recipe; it bypasses early AE2 progression.
  event.remove({ output: 'useless_mod:ae2_gift_package' })

  // 保护性移除：禁止 Create 动力搅拌直接产出万象进度物品。
  const blockedMixingOutputs = [
    'useless_mod:useless_ingot_tier_1', 'useless_mod:useless_ingot_tier_2', 'useless_mod:useless_ingot_tier_3',
    'useless_mod:useless_ingot_tier_4', 'useless_mod:useless_ingot_tier_5', 'useless_mod:useless_ingot_tier_6',
    'useless_mod:useless_ingot_tier_7', 'useless_mod:useless_ingot_tier_8', 'useless_mod:useless_ingot_tier_9',
    'useless_mod:useless_gear_tier_1', 'useless_mod:useless_gear_tier_2', 'useless_mod:useless_gear_tier_3',
    'useless_mod:useless_gear_tier_4', 'useless_mod:useless_gear_tier_5', 'useless_mod:useless_gear_tier_6',
    'useless_mod:useless_gear_tier_7', 'useless_mod:useless_gear_tier_8', 'useless_mod:useless_gear_tier_9',
    'useless_mod:useless_glass_tier_1', 'useless_mod:useless_glass_tier_2', 'useless_mod:useless_glass_tier_3',
    'useless_mod:useless_glass_tier_4', 'useless_mod:useless_glass_tier_5', 'useless_mod:useless_glass_tier_6',
    'useless_mod:useless_glass_tier_7', 'useless_mod:useless_glass_tier_8', 'useless_mod:useless_glass_tier_9',
    'useless_mod:possible_useful_ingot', 'useless_mod:useful_ingot',
    'useless_mod:useless_coil_tier_1', 'useless_mod:useless_coil_tier_2', 'useless_mod:useless_coil_tier_3',
    'useless_mod:useless_coil_tier_4', 'useless_mod:useless_coil_tier_5', 'useless_mod:useless_coil_tier_6',
    'useless_mod:useless_coil_tier_7', 'useless_mod:useless_coil_tier_8', 'useless_mod:useless_coil_tier_9',
    'useless_mod:omniversal_furnace_casing', 'useless_mod:advanced_alloy_furnace_block',
    'useless_mod:multiblock_alloy_furnace_core', 'useless_mod:omniversal_mold_hub',
    'useless_mod:me_pattern_assembly', 'useless_mod:passive_crafting_hatch', 'useless_mod:omniversal_pattern_converter',
    'useless_mod:metal_mold_plate', 'useless_mod:metal_mold_rod', 'useless_mod:metal_mold_gear',
    'useless_mod:metal_mold_wire', 'useless_mod:metal_mold_block', 'useless_mod:ore_generator_block',
    'useless_mod:endless_beaf_item', 'useless_mod:supervisor'
  ]
  blockedMixingOutputs.forEach(id => event.remove({ type: 'create:mixing', output: id }))
  const tableSize = { 1: 3, 2: 5, 3: 7, 4: 9 }
  const stack = (id, count) => ({ count: count, ingredient: { item: id } })
  const output = (id, count) => ({ id: id, count: count || 1 })
  const counted = entry => entry.count + 'x ' + entry.ingredient.item

  function tableRecipe(result, resultCount, ingredients, tier, recipeId) {
    const size = tableSize[tier]
    const total = ingredients.reduce((sum, entry) => sum + entry[1], 0)
    if (total > size * size) throw new Error(`Useless table recipe ${recipeId} uses ${total} items, max is ${size * size}`)

    const key = {}
    const pairAssignments = []
    const singleSymbols = []
    const centerSymbols = []
    ingredients.forEach((entry, index) => {
      const symbol = String.fromCharCode(65 + index)
      let count = entry[1]
      key[symbol] = { item: entry[0] }
      if (count % 2 === 1 && centerSymbols.length < size) {
        centerSymbols.push(symbol)
        count--
      }
      for (let pairIndex = 0; pairIndex < Math.floor(count / 2); pairIndex++) {
        pairAssignments.push([symbol, symbol])
      }
      if (count % 2 === 1) singleSymbols.push(symbol)
    })

    if (singleSymbols.length % 2 !== 0) throw new Error(`Useless table recipe ${recipeId} cannot pair singleton materials`)
    for (let singleIndex = 0; singleIndex < singleSymbols.length; singleIndex += 2) {
      pairAssignments.push([singleSymbols[singleIndex], singleSymbols[singleIndex + 1]])
    }

    const pairSlotCapacity = size * Math.floor(size / 2)
    while (pairAssignments.length > pairSlotCapacity) {
      centerSymbols.push.apply(centerSymbols, pairAssignments.shift())
    }

    const center = Math.floor(size / 2)
    const slotPairs = []
    for (let radius = 1; radius <= center; radius++) {
      for (let row = 0; row < size; row++) {
        for (let column = 0; column < center; column++) {
          if (Math.max(Math.abs(row - center), Math.abs(column - center)) !== radius) continue
          slotPairs.push([row * size + column, row * size + size - 1 - column])
        }
      }
    }

    const grid = new Array(size * size).fill(' ')
    const centerRows = [center]
    for (let offset = 1; offset <= center; offset++) centerRows.push(center - offset, center + offset)
    centerSymbols.forEach((symbol, index) => {
      if (index < centerRows.length) grid[centerRows[index] * size + center] = symbol
    })
    pairAssignments.forEach((pair, index) => {
      const slots = slotPairs[index]
      grid[slots[0]] = pair[0]
      grid[slots[1]] = pair[1]
    })

    const pattern = []
    for (let row = 0; row < size; row++) pattern.push(grid.slice(row * size, row * size + size).join(''))
    event.custom({ type: 'avaritia:shaped_table', pattern: pattern, key: key, result: { id: result, count: resultCount }, tier: tier }).id(recipeId)
  }

  const profiles = [
    { tier: 1, processor: 'immersiveengineering:component_electronic_adv', alloy: 'enderio:conductive_alloy_ingot', extra: 'minecraft:gold_ingot' },
    { tier: 2, processor: 'ae2:calculation_processor', alloy: 'mekanism:alloy_reinforced', extra: 'minecraft:gold_block' },
    { tier: 3, processor: 'pneumaticcraft:printed_circuit_board', alloy: 'enderio:energetic_alloy_ingot', extra: 'minecraft:blaze_rod' },
    { tier: 4, processor: 'ae2:logic_processor', alloy: 'mekanism:alloy_atomic', extra: 'minecraft:ender_pearl' },
    { tier: 5, processor: 'ae2:engineering_processor', alloy: 'enderio:vibrant_alloy_ingot', extra: 'minecraft:netherite_ingot' },
    { tier: 6, processor: 'advanced_ae:quantum_processor', alloy: 'enderio_evolution:crystalline_alloy_ingot', extra: 'industrialforegoing:plastic' },
    { tier: 7, processor: 'kubejs:quantum_control_matrix', alloy: 'enderio_evolution:crystalline_pink_slime_ingot', extra: 'avaritia:crystal_matrix_ingot' },
    { tier: 8, processor: 'mekanismsun:supernova_control_circuit', alloy: 'enderio_evolution:stellar_alloy_ingot', extra: 'draconicevolution:chaos_shard' },
    { tier: 9, processor: 'avaritia:infinity_catalyst', alloy: 'mekanism_extras:infinite_control_circuit', extra: 'kubejs:endless_structure_core' }
  ]

  const ingotIngredients = [
    [stack('immersiveengineering:ingot_steel', 8), stack('immersiveengineering:component_electronic_adv', 4), stack('mekanism:alloy_infused', 4), stack('enderio:conductive_alloy_ingot', 4), stack('minecraft:gold_ingot', 8), stack('minecraft:diamond', 4)],
    [stack('useless_mod:useless_ingot_tier_1', 2), stack('immersiveengineering:plate_steel', 8), stack('mekanism:alloy_reinforced', 8), stack('enderio:conductive_alloy_ingot', 8), stack('ae2:calculation_processor', 4), stack('minecraft:gold_block', 4)],
    [stack('useless_mod:useless_ingot_tier_2', 2), stack('pneumaticcraft:printed_circuit_board', 4), stack('ae2:calculation_processor', 4), stack('enderio:energetic_alloy_ingot', 4), stack('mekanism:alloy_reinforced', 8), stack('minecraft:blaze_rod', 8)],
    [stack('useless_mod:useless_ingot_tier_3', 2), stack('ae2:logic_processor', 4), stack('enderio:energetic_alloy_ingot', 8), stack('mekanism:alloy_atomic', 4), stack('advanced_ae:quantum_processor', 4), stack('minecraft:ender_pearl', 8)],
    [stack('useless_mod:useless_ingot_tier_4', 2), stack('ae2:engineering_processor', 4), stack('advanced_ae:quantum_processor', 4), stack('enderio:vibrant_alloy_ingot', 8), stack('mekanism:ultimate_control_circuit', 4), stack('minecraft:netherite_ingot', 4)],
    [stack('useless_mod:useless_ingot_tier_5', 2), stack('advanced_ae:quantum_core', 2), stack('enderio_evolution:crystalline_alloy_ingot', 4), stack('mekanism_extras:absolute_control_circuit', 2), stack('industrialforegoing:plastic', 16), stack('minecraft:enchanted_golden_apple', 4)],
    [stack('useless_mod:useless_ingot_tier_6', 2), stack('kubejs:quantum_control_matrix', 2), stack('mekanismsun:supernova_control_circuit', 2), stack('draconicevolution:awakened_core', 2), stack('enderio_evolution:crystalline_pink_slime_ingot', 4), stack('avaritia:crystal_matrix_ingot', 4)],
    [stack('useless_mod:useless_ingot_tier_7', 2), stack('kubejs:endless_structure_core', 2), stack('draconicevolution:chaos_shard', 8), stack('enderio_evolution:stellar_alloy_ingot', 4), stack('avaritia:infinity_catalyst', 2), stack('mekanism_extras:infinite_control_circuit', 2)],
    [stack('useless_mod:useless_ingot_tier_8', 2), stack('kubejs:tiangong_heart', 2), stack('avaritia:infinity_ingot', 2), stack('mekanism_extras:infinite_control_circuit', 4), stack('draconicevolution:chaos_shard', 16), stack('mekanismsun:supernova_alloy', 4)]
  ]
  const workbenchIngots = [
    { pattern: ['SCS','ADA','SCS'], key: { S: 'immersiveengineering:ingot_steel', C: 'immersiveengineering:component_electronic_adv', A: 'mekanism:alloy_infused', D: 'enderio:conductive_alloy_ingot' } },
    { pattern: ['SCS','ADA','SCS'], key: { S: 'immersiveengineering:plate_steel', C: 'mekanism:alloy_reinforced', A: 'ae2:calculation_processor', D: 'useless_mod:useless_ingot_tier_1' } },
    { pattern: ['SCS','ADA','SCS'], key: { S: 'enderio:energetic_alloy_ingot', C: 'ae2:calculation_processor', A: 'pneumaticcraft:printed_circuit_board', D: 'useless_mod:useless_ingot_tier_2' } },
    { pattern: ['SCS','ADA','SCS'], key: { S: 'enderio:energetic_alloy_ingot', C: 'mekanism:alloy_atomic', A: 'advanced_ae:quantum_processor', D: 'useless_mod:useless_ingot_tier_3' } }
  ]

  profiles.forEach((profile, index) => {
    const tier = profile.tier
    const ingotId = 'useless_mod:useless_ingot_tier_' + tier
    const gearId = 'useless_mod:useless_gear_tier_' + tier
    const glassId = 'useless_mod:useless_glass_tier_' + tier

    event.remove({ id: 'useless_mod:advanced_alloy/ingot/useless_ingot_tier_' + tier })
    if (tier <= 4) {
      event.shaped(ingotId, workbenchIngots[tier - 1].pattern, workbenchIngots[tier - 1].key).id('sky-craft-creation:useless_mod/ingot_tier_' + tier)
    } else {
      tableRecipe(ingotId, 1, ingotIngredients[index].map(entry => [entry.ingredient.item, entry.count]), tier >= 8 ? 4 : 3, 'sky-craft-creation:useless_mod/ingot_tier_' + tier)
    }

    event.remove({ id: 'useless_mod:advanced_alloy/gear/useless_gear_tier_' + tier })
    event.shaped(gearId, ['IGI','AMA','IPI'], {
      I: ingotId,
      G: 'useless_mod:metal_mold_gear',
      A: profile.alloy,
      M: profile.processor,
      P: profile.extra
    }).id('sky-craft-creation:useless_mod/gear_tier_' + tier)

    event.remove({ id: 'useless_mod:advanced_alloy/glass/useless_glass_tier_' + tier })
    event.shaped(glassId, ['IGI','AMA','IPI'], {
      I: ingotId,
      G: 'useless_mod:metal_mold_plate',
      A: profile.processor,
      M: 'minecraft:glass',
      P: profile.alloy
    }).id('sky-craft-creation:useless_mod/glass_tier_' + tier)
  })

  profiles.forEach(profile => {
    const tier = profile.tier
    const previousTier = Math.max(1, tier - 1)
    event.remove({ id: 'useless_mod:crafting/useless_coil_tier_' + tier })
    event.shaped('2x useless_mod:useless_coil_tier_' + tier, ['CGC','RAR','LPL'], {
      C: 'minecraft:copper_ingot',
      G: 'useless_mod:useless_gear_tier_' + previousTier,
      R: 'minecraft:redstone',
      A: profile.alloy,
      L: 'useless_mod:useless_glass_tier_' + previousTier,
      P: profile.processor
    }).id('sky-craft-creation:useless_mod/coil_tier_' + tier)
  })

  event.remove({ id: 'useless_mod:crafting/omniversal_furnace_casing' })
  event.shaped('4x useless_mod:omniversal_furnace_casing', ['PAP','SCS','PAP'], {
    P: 'immersiveengineering:plate_steel',
    A: 'immersiveengineering:plate_aluminum',
    S: 'immersiveengineering:component_electronic_adv',
    C: 'industrialforegoing:plastic'
  }).id('sky-craft-creation:useless_mod/omniversal_furnace_casing')

  event.remove({ id: 'useless_mod:advanced_alloy_furnace_block' })
  event.shaped('useless_mod:advanced_alloy_furnace_block', ['CQC','AMA','CQC'], {
    C: 'useless_mod:omniversal_furnace_casing',
    Q: 'mekanism:ultimate_control_circuit',
    A: 'enderio_evolution:crystalline_alloy_ingot',
    M: 'advanced_ae:quantum_core'
  }).id('sky-craft-creation:useless_mod/advanced_alloy_furnace_block')

  event.remove({ id: 'useless_mod:crafting/multiblock_alloy_furnace_core' })
  tableRecipe('useless_mod:multiblock_alloy_furnace_core', 1, [
    ['useless_mod:omniversal_furnace_casing', 16],
    ['useless_mod:useless_coil_tier_3', 8],
    ['mekanism:ultimate_control_circuit', 4],
    ['advanced_ae:quantum_core', 2],
    ['useless_mod:advanced_alloy_furnace_block', 1]
  ], 3, 'sky-craft-creation:useless_mod/multiblock_alloy_furnace_core')

  event.remove({ id: 'useless_mod:crafting/omniversal_mold_hub' })
  tableRecipe('useless_mod:omniversal_mold_hub', 1, [
    ['useless_mod:omniversal_furnace_casing', 8],
    ['useless_mod:useless_coil_tier_6', 4],
    ['ae2:pattern_provider', 4],
    ['advanced_ae:quantum_storage_component', 2],
    ['useless_mod:metal_mold_block', 1]
  ], 2, 'sky-craft-creation:useless_mod/omniversal_mold_hub')

  event.remove({ id: 'useless_mod:crafting/me_pattern_assembly' })
  tableRecipe('useless_mod:me_pattern_assembly', 1, [
    ['useless_mod:omniversal_furnace_casing', 8],
    ['useless_mod:useless_coil_tier_7', 4],
    ['ae2:pattern_provider', 4],
    ['advanced_ae:quantum_storage_component', 2],
    ['kubejs:quantum_control_matrix', 1]
  ], 2, 'sky-craft-creation:useless_mod/me_pattern_assembly')

  event.remove({ id: 'useless_mod:crafting/passive_crafting_hatch' })
  tableRecipe('useless_mod:passive_crafting_hatch', 1, [
    ['useless_mod:omniversal_furnace_casing', 8],
    ['useless_mod:useless_coil_tier_8', 4],
    ['ae2:export_bus', 4],
    ['useless_mod:me_pattern_assembly', 2],
    ['kubejs:quantum_control_matrix', 1]
  ], 2, 'sky-craft-creation:useless_mod/passive_crafting_hatch')

  event.remove({ id: 'useless_mod:crafting/omniversal_pattern_converter' })
  tableRecipe('useless_mod:omniversal_pattern_converter', 1, [
    ['useless_mod:omniversal_furnace_casing', 8],
    ['useless_mod:useless_coil_tier_7', 4],
    ['ae2:logic_processor', 4],
    ['integrateddynamics:logic_director', 2],
    ['ae2:blank_pattern', 1]
  ], 2, 'sky-craft-creation:useless_mod/omniversal_pattern_converter')
  event.remove({ id: 'useless_mod:crafting/possible_useful_ingot' })
  tableRecipe('useless_mod:possible_useful_ingot', 1, ingotIngredients.map((entry, index) => ['useless_mod:useless_ingot_tier_' + (index + 1), 4]), 4, 'sky-craft-creation:useless_mod/possible_useful_ingot')

  event.remove({ id: 'useless_mod:advanced_alloy/ingot/useful_ingot' })
  tableRecipe('useless_mod:useful_ingot', 1, [
    ['useless_mod:possible_useful_ingot', 4],
    ['minecraft:iron_block', 12],
    ['minecraft:gold_block', 12],
    ['minecraft:diamond_block', 12],
    ['minecraft:emerald_block', 12],
    ['minecraft:netherite_block', 12]
  ], 4, 'sky-craft-creation:useless_mod/useful_ingot')
})