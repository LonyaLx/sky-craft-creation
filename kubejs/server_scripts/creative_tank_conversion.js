// 天工创世 · Create / Mekanism 创造流体储罐双向转换。
ServerEvents.recipes(event => {
  event.shapeless('mekanism:creative_fluid_tank', [
    'create:creative_fluid_tank'
  ]).id('sky-craft-creation:endgame/creative_fluid_tank_create_to_mekanism')

  event.shapeless('create:creative_fluid_tank', [
    'mekanism:creative_fluid_tank'
  ]).id('sky-craft-creation:endgame/creative_fluid_tank_mekanism_to_create')
})