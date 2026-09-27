// 天工创世 · Ex Machinis 通量筛矿系统整合
// 定位：唯一自动化筛矿路线，FE 驱动，中期解锁
// 配套：Ex Deorum 手动筛（前期）+ Ex Compressum 重型筛（中期过渡）
ServerEvents.recipes(event => {

  // ── 1. 移除其他自动化筛矿路线 ──
  // Ex Deorum 机械筛：不再作为自动化选项
  event.remove({ output: 'exdeorum:mechanical_sieve' })
  // Ex Compressum 自动筛/重型自动筛：不再作为自动化选项
  event.remove({ output: 'excompressum:auto_sieve' })
  event.remove({ output: 'excompressum:auto_heavy_sieve' })

  // ── 2. 通量筛配方调整 ──
  // 定位为中期 FE 自动化入口，加入基础控制电路作为阶段门槛
  event.remove({ id: 'exmachinis:flux_sieve' })
  event.shaped('exmachinis:flux_sieve', [
    'BBB',
    'BSB',
    'ICI'
  ], {
    B: 'minecraft:iron_bars',
    S: '#exmachinis:sieves',
    I: 'minecraft:iron_block',
    C: 'mekanism:basic_control_circuit'
  }).id('sky-craft-creation:exmachinis/flux_sieve')

  // ── 3. 通量锤配方（待验证） ──
  // ⚠️ 物品 ID 需验证：exmachinis:flux_hammer
  // 通量锤：FE 驱动，自动砸方块/压缩方块
  // 定位：中期自动化粉碎
  // event.remove({ output: 'exmachinis:flux_hammer' })
  // event.shaped('exmachinis:flux_hammer', [
  //   ' I ',
  //   ' H ',
  //   ' B '
  // ], {
  //   I: 'minecraft:iron_block',
  //   H: 'minecraft:iron_pickaxe',
  //   B: 'mekanism:basic_control_circuit'
  // }).id('sky-craft-creation:exmachinis/flux_hammer')

  // ── 4. 通量压缩机配方（待验证） ──
  // ⚠️ 物品 ID 需验证：exmachinis:flux_compressor
  // 通量压缩机：FE 驱动，自动压缩 9合1
  // 定位：中期自动化压缩
  // event.remove({ output: 'exmachinis:flux_compressor' })
  // event.shaped('exmachinis:flux_compressor', [
  //   'III',
  //   'C C',
  //   'III'
  // ], {
  //   I: 'minecraft:iron_ingot',
  //   C: 'mekanism:basic_control_circuit'
  // }).id('sky-craft-creation:exmachinis/flux_compressor')

  // ── 5. 升级配件平衡 ──
  // ⚠️ 升级配件物品 ID 需验证
  // 金升级 → 钻石升级 → 下界合金升级
  // 每级提升速度和效率，但能耗也增加
  // 保留原配方，如发现不平衡再调整

  // ── 6. 与通量网络的配合 ──
  // Flux Networks 可直接给 Ex Machinis 机器无线供能
  // 无需额外配方，通过通量点接入即可
})

// ── 能量消耗参考（exmachinis-server.toml 默认值） ──
// 金升级：   160 tick/操作，1280 RF/方块 → 8 RF/t
// 钻石升级：  80 tick/操作，2560 RF/方块 → 2048 RF/t
// 下界合金：  20 tick/操作，2560 RF/方块 → 8192 RF/t
//
// 注：当前配置下钻石和下界合金能耗较高，前期可能带不动
// 如需调整，修改 config/exmachinis-server.toml
//
// ── 筛矿路线梯度 ──
// 前期：手动筛（Ex Deorum）
// 中期过渡：重型筛（Ex Compressum）手动筛压缩方块
// 中后期：通量筛（Ex Machinis）+ 金/钻石升级 → FE 驱动自动化
