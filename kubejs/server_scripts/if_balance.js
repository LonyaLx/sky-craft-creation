// 天工创世 · Industrial Foregoing 平衡调整。
ServerEvents.recipes(event => {
  // 激光钻头：从简单合成升级为后期终极矿石自动化设备。
  event.remove({ output: 'industrialforegoing:laser_drill' })

  event.shaped('industrialforegoing:laser_drill', [
    'APA',
    'FBF',
    'OSO'
  ], {
    A: 'industrialforegoing:machine_frame_advanced',
    P: 'industrialforegoing:plastic',
    F: 'industrialforegoing:machine_frame_supreme',
    B: 'industrialforegoing:fluid_laser_base',
    O: 'minecraft:obsidian',
    S: 'industrialforegoing:pink_slime'
  }).id('sky-craft-creation:if/laser_drill')
})