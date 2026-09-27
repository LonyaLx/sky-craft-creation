// 天工创世 · Industrial Foregoing 与 PneumaticCraft 塑料片 1:1 互通。
ServerEvents.recipes(event => {
  event.shapeless('pneumaticcraft:plastic', [
    'industrialforegoing:plastic'
  ]).id('sky-craft-creation:materials/plastic_if_to_pnc')

  event.shapeless('industrialforegoing:plastic', [
    'pneumaticcraft:plastic'
  ]).id('sky-craft-creation:materials/plastic_pnc_to_if')
})