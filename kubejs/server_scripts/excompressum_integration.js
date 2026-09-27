// 天工创世 · Ex Compressum 压缩系统整合
// 定位：提供压缩工具、重型筛（手动）、自动压缩机、自动锤
// 注意：自动筛/重型自动筛已移除，自动化筛矿统一走 Ex Machinis 通量筛
// ⚠️ 部分物品 ID 为推测值，需进游戏验证：
//    - compressed_wooden_hammer / compressed_stone_hammer / compressed_iron_hammer
//    - compressed_crook
//    - heavy_sieve
//    如配方不生效，需用 JEI 查看正确 ID 后调整
ServerEvents.recipes(event => {

  // ── 1. 移除自动筛配方（筛矿自动化统一为 Ex Machinis） ──
  event.remove({ output: 'excompressum:auto_sieve' })
  event.remove({ output: 'excompressum:auto_heavy_sieve' })

  // ── 2. 重型筛配方调整 ──
  // 重型筛定位为中期手动筛进阶，介于普通手动筛和通量筛之间
  // 降低一点制作成本，让玩家更早用上压缩筛矿
  event.remove({ output: 'excompressum:oak_heavy_sieve' })
  event.shaped('excompressum:oak_heavy_sieve', [
    'S S',
    'SHS',
    'S S'
  ], {
    S: 'minecraft:iron_ingot',
    H: 'exdeorum:iron_mesh'
  }).id('sky-craft-creation:excompressum/heavy_sieve')

  // ── 3. 压缩锤子首件优化 ──
  // 压缩木锤：前期快速处理压缩方块的工具
  // 确保用前期可获取材料就能做
  event.remove({ output: 'excompressum:compressed_wooden_hammer' })
  event.shaped('excompressum:compressed_wooden_hammer', [
    'P',
    'S'
  ], {
    P: 'minecraft:wooden_pickaxe',
    S: 'minecraft:stick'
  }).id('sky-craft-creation:excompressum/compressed_wooden_hammer')

  // 压缩石锤
  event.remove({ output: 'excompressum:compressed_stone_hammer' })
  event.shaped('excompressum:compressed_stone_hammer', [
    'P',
    'S'
  ], {
    P: 'minecraft:stone_pickaxe',
    S: 'minecraft:stick'
  }).id('sky-craft-creation:excompressum/compressed_stone_hammer')

  // 压缩铁锤
  event.remove({ output: 'excompressum:compressed_iron_hammer' })
  event.shaped('excompressum:compressed_iron_hammer', [
    'P',
    'S'
  ], {
    P: 'minecraft:iron_pickaxe',
    S: 'minecraft:stick'
  }).id('sky-craft-creation:excompressum/compressed_iron_hammer')

  // ── 4. 压缩弯钩首件优化 ──
  // 压缩弯钩：打树叶神器，快速获取树苗、苹果、蚕
  event.remove({ output: 'excompressum:compressed_crook' })
  event.shaped('excompressum:compressed_crook', [
    'B',
    'S'
  ], {
    B: 'minecraft:bone',
    S: 'minecraft:stick'
  }).id('sky-craft-creation:excompressum/compressed_crook')

  // ── 5. 自动压缩机配方确认 ──
  // 自动压缩机：FE 驱动，自动压缩物品（9合1）
  // 作为前期自动化压缩的方案，配合通量筛使用
  // 保留原配方，如发现空岛获取困难再调整

  // ── 6. 自动锤配方确认 ──
  // 自动锤：FE 驱动，自动粉碎/砸开压缩方块
  // 保留原配方，如发现空岛获取困难再调整

  // ── 7. All The Compressed 压缩方块辅助配方 ──
  // 确保核心压缩方块在空岛有明确来源
  // （大部分由 All The Compressed 模组自带 3x3 合成，无需额外添加）

  // 注：如需补充特定压缩方块的首件配方，在此处添加
  // 格式：event.shaped('allthecompressed:compressed_cobblestone_1', ['CCC','CCC','CCC'], { C: 'minecraft:cobblestone' })
  // （通常模组自带，如发现缺失再补充）
})

// ── 筛矿路线梯度 ──
// 前期：Ex Deorum 手动筛（燧石/线/铁/金/钻石/下界合金筛网）
// 中期过渡：Ex Compressum 重型筛（手动筛压缩方块，1顶9）
// 中后期：Ex Machinis 通量筛（FE 驱动，唯一自动化筛矿路线）
//
// 压缩工具路线：
// 前期：压缩木锤/石锤 + 压缩弯钩（手动处理压缩方块）
// 中期：自动压缩机 + 自动锤（FE 驱动，自动化压缩/粉碎）
