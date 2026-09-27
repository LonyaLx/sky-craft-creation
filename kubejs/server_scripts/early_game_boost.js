// 天工创世 · 前期关键材料的轻量兜底，不覆盖已有完整科技线。
ServerEvents.recipes(event => {
  event.shapeless('2x mysticalagriculture:inferium_seeds', [
    'mysticalagriculture:prosperity_seed_base',
    'mysticalagriculture:inferium_essence'
  ]).id('sky-craft-creation:early/inferium_seeds')

  event.shapeless('2x minecraft:andesite', [
    'minecraft:cobblestone',
    'minecraft:flint'
  ]).id('sky-craft-creation:early/andesite')

  event.shapeless('create:andesite_alloy', [
    'minecraft:andesite',
    'minecraft:iron_nugget'
  ]).id('sky-craft-creation:early/andesite_alloy')
})