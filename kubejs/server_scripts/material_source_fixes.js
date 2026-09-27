// 空岛材料正向来源修正：PackagedAvaritia、Ex Deorum 与农业首件链。
ServerEvents.recipes(event => {
  // ExtendedCrafting 原本只有终极锭的反合成；这里补充正向来源。
  event.custom({
    type: 'avaritia:shaped_table',
    pattern: [
      'BSB',
      'SUS',
      'BSB'
    ],
    key: {
      B: { item: 'extendedcrafting:black_iron_ingot' },
      S: { item: 'ae2:singularity' },
      U: { item: 'extendedcrafting:ultimate_singularity' }
    },
    result: { id: 'extendedcrafting:the_ultimate_ingot', count: 1 },
    tier: 4
  }).id('sky-craft-creation:materials/the_ultimate_ingot')

  // Ex Deorum 碎矿 → 已安装模组的原料，解决只有反向配方的矿物死循环。
  const oreChunks = [
    ['exdeorum:iron_ore_chunk', 'minecraft:raw_iron'],
    ['exdeorum:gold_ore_chunk', 'minecraft:raw_gold'],
    ['exdeorum:copper_ore_chunk', 'minecraft:raw_copper'],
    ['exdeorum:osmium_ore_chunk', 'mekanism:raw_osmium'],
    ['exdeorum:tin_ore_chunk', 'mekanism:raw_tin'],
    ['exdeorum:lead_ore_chunk', 'mekanism:raw_lead'],
    ['exdeorum:uranium_ore_chunk', 'mekanism:raw_uranium'],
    ['exdeorum:aluminum_ore_chunk', 'immersiveengineering:raw_aluminum'],
    ['exdeorum:nickel_ore_chunk', 'immersiveengineering:raw_nickel'],
    ['exdeorum:silver_ore_chunk', 'immersiveengineering:raw_silver'],
    ['exdeorum:zinc_ore_chunk', 'create:raw_zinc']
  ]

  oreChunks.forEach(entry => {
    event.shapeless(entry[1], ['4x ' + entry[0]])
      .id('sky-craft-creation:materials/ore_chunks/' + entry[1].replace(':', '/'))
  })

  // 蜜脾首件来源，解除“坚固蜂笼需要蜜脾、蜜脾依赖蜜蜂”的循环。
  event.shapeless('minecraft:honeycomb', [
    '4x minecraft:sugar',
    'minecraft:yellow_dye',
    'minecraft:string'
  ]).id('sky-craft-creation:materials/honeycomb')

  // 锇农业种子首件来源，拿到首个锇后即可建立可再生线。
  event.shapeless('mysticalagriculture:osmium_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x mekanism:raw_osmium',
    '2x mysticalagriculture:earth_essence'
  ]).id('sky-craft-creation:materials/osmium_seeds')

  // 蜜脾农业种子首件来源，避免蜜蜂设施出故障时再次锁死。
  event.shapeless('mysticalagriculture:honey_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x minecraft:honeycomb',
    '2x mysticalagriculture:nature_essence'
  ]).id('sky-craft-creation:materials/honey_seeds')

  // 门瑞欧树脂桶在空岛上补充一条由门瑞欧浆果获取的首件来源。
  event.shapeless('integrateddynamics:bucket_menril_resin', [
    'minecraft:bucket',
    '4x integrateddynamics:menril_berries'
  ]).id('sky-craft-creation:materials/bucket_menril_resin')
})

// 难度适中版：下界与末地资源的首件来源。
ServerEvents.recipes(event => {
  event.shaped('minecraft:end_portal_frame', [
    'OOO',
    'OEO',
    'OOO'
  ], {
    O: 'minecraft:obsidian',
    E: 'minecraft:ender_eye'
  }).id('sky-craft-creation:materials/end_portal_frame')

  event.shapeless('mysticalagriculture:blaze_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x mysticalagriculture:fire_essence',
    '2x mysticalagriculture:inferium_essence',
    'minecraft:magma_cream'
  ]).id('sky-craft-creation:materials/blaze_seeds')

  event.shapeless('mysticalagriculture:ghast_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x mysticalagriculture:nether_essence',
    '2x mysticalagriculture:air_essence',
    'minecraft:ghast_tear'
  ]).id('sky-craft-creation:materials/ghast_seeds')

  event.shapeless('mysticalagriculture:wither_skeleton_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '4x mysticalagriculture:nether_essence',
    '2x mysticalagriculture:earth_essence',
    'minecraft:wither_skeleton_skull'
  ]).id('sky-craft-creation:materials/wither_skeleton_seeds')

  event.shapeless('mysticalagriculture:nether_quartz_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x mysticalagriculture:nether_essence',
    '2x mysticalagriculture:earth_essence',
    'minecraft:quartz'
  ]).id('sky-craft-creation:materials/nether_quartz_seeds')

  event.shapeless('mysticalagriculture:glowstone_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x mysticalagriculture:nether_essence',
    '2x mysticalagriculture:fire_essence',
    'minecraft:glowstone_dust'
  ]).id('sky-craft-creation:materials/glowstone_seeds')

  event.shapeless('mysticalagriculture:enderman_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    '2x mysticalagriculture:enderman_essence',
    '2x mysticalagriculture:air_essence',
    'minecraft:ender_pearl'
  ]).id('sky-craft-creation:materials/enderman_seeds')
  // 灵魂沙首件来源：8沙 + 1末影珍珠 → 4灵魂沙
  event.shaped('4x minecraft:soul_sand', [
    'SSS',
    'SES',
    'SSS'
  ], {
    S: 'minecraft:sand',
    E: 'minecraft:ender_pearl'
  }).id('sky-craft-creation:materials/soul_sand')

  // 灵魂土首件来源：灵魂沙 + 地狱岩
  event.shapeless('minecraft:soul_soil', [
    'minecraft:soul_sand',
    'minecraft:netherrack'
  ]).id('sky-craft-creation:materials/soul_soil')
})

// 粉雪桶：空岛没有原版雪原降雪，提供压缩雪球的替代来源，
// 供 Avaritia 无尽水桶使用。雪球可由 AE2 熵冷却水获得。
ServerEvents.recipes(event => {
  event.shapeless('minecraft:powder_snow_bucket', [
    'minecraft:bucket',
    '4x minecraft:snowball'
  ]).id('sky-craft-creation:materials/powder_snow_bucket')
})
