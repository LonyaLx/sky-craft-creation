# 空岛材料审计与来源补丁（2026-09-10）

## 审计范围
- 当前任务：29 章、939 个任务。
- 扫描 1073 件物品检查要求、980 种唯一物品。
- 未安装模组引用：0。
- 递归扫描主 jar 与嵌套 jar 后，无普通 JSON 配方物品为 23 种；其中包含创造/调试物品、机器动态产物与模组状态物品。

## AE2 压印模板首件
原版模板只有“用模板复制模板”的压印室配方。新增：

- 8 铁锭 + 硅 → 硅压印模板
- 8 铁锭 + 赛特斯石英 → 计算压印模板
- 8 铁锭 + 金锭 → 逻辑压印模板
- 8 铁锭 + 钻石 → 工程压印模板

## 活化水晶与 Neo Eco
- 3 充能赛特斯石英 + 3 赛特斯石英粉 + 3 荧石粉 → 8 活化水晶粉尘
- 3 福鲁伊克斯水晶 + 3 福鲁伊克斯粉 + 3 红石 → 8 活化福鲁伊克斯粉尘
- 铝精华 + 铁精华 + 2 赛特斯石英粉 → 铝合金粉
- 已把超过 9 格的配方压缩到 3×3 工作台可摆放范围，修复 JEI broken recipe。

## 门瑞欧首件链
- 橡树树苗 + 4 自然精华 → 门瑞欧树苗
- 玻璃 + 门瑞欧树脂桶 → 门瑞欧玻璃（普通工作台替代路线）
- 获得树苗后可正常产出原木、树脂、结晶块和浆果；门瑞欧玻璃原干燥盆配方仍保留。

## 龙研
- 繁荣种子基底 + 2 至尊精华 + 2 天石粉 + 黑曜石 → Draconium 种子
- 8 Draconium 精华 → Draconium 粉尘
- 4 Draconium 粉尘 + 下界之星 + 混沌碎片 → 2 Awakened Draconium 粉尘

## 原版锻造模板首件
- 新增 `kubejs:smithing_template_blank`（锻造模板胚）。
- 模板胚：4 铁锭 + 4 钻石 + 1 黑曜石 → 4 个。
- 下界合金升级模板及 16 种盔甲纹饰模板，共 17 种，统一使用模板胚、4 钻石和 4 金锭的有序配方。
- 覆盖：netherite、coast、dune、eye、host、raiser、rib、sentry、shaper、silence、snout、spire、tide、vex、ward、wayfinder、wild。
## 升级锻造模板首件
- 原 Re-Avaritia「用已有模板复制模板」配方保留。

## 当前配方文件
- `kubejs/server_scripts/skyblock_materials.js`
- 共 13 条补充配方（新增坚固蜂笼配方）。
- 桌面与测试实例 SHA-256 一致。
- 脚本语法通过，引用物品 ID 全部存在。
- 已根据游戏日志修复三条超过 9 格的 broken JEI 配方。

## 剩余无普通配方项
- 创造/调试物品：按要求忽略。
- 工业先锋流体：机器动态产出。
- 动态联合和无线终端：模组自定义配方。
- 工作台、熔炉、避雷针：原版硬编码或普通配方。
## 2026-09-10 Avaritia
- 加入 Re-Avaritia 1.4.1 与 PackagedAvaritia 3.0.1.5。
- 158 条模组原生配方保留；关键终局链增加 8 条 KubeJS 配方。
- 四阶 Package Crafter、Extreme Crafting Table、中子机器和无限材料链已实机验证。
## 2026-09-10 v6：封包工作台重构材料审计
- 新增 `extendedcrafting:the_ultimate_ingot` 正向 tier 4 配方。
- 新增 `integrateddynamics:bucket_menril_resin` 空岛来源。
- 全 KubeJS 配方材料来源扫描：0 个未知来源。
- 终极奇点与无限催化剂属于模组动态 Recipe Serializer 产物，不直接写 result 字段。
- 普通 3×3 工作台不再接受 `packagedauto:package` 作为终局材料。
- 全任务材料复扫：980 种唯一物品，18 种没有普通 JSON 配方。
- 这 18 种均为创造/调试物品、工业先锋流体桶、动态联合特殊物品、无线终端或原版硬编码配方。
- `extendedcrafting:the_ultimate_ingot` 已不再是缺失项。
- 新增 11 条 Ex Deorum 碎矿正向转换，覆盖铁、金、铜、锇、锡、铅、铀、铝、镍、银、锌。
- 锇完整起步链：筛矿获得 4 锇碎矿 → 1 粗锇 → 熔炼/高炉成锇锭。
- 新增蜜脾首件来源：4 糖 + 黄色染料 + 线。
- 新增锇种子和蜜糖种子首件来源，解除农业种子循环。
## 2026-09-28 空岛来源与汉化复扫
- 原版下界恢复后，Mystical Agriculture 的灵魂石/离魂矿矿脉恢复，离魂粉与离魂粉来源不再缺失。
- 全量物品汉化扫描补齐 ProjectE、Integrated Dynamics、Ender Drives、Apotheosis、Functional Chemical、ProjectExpansion、AE2 Import Export Card、AppGen、FTB Filter System、Moonlight、Pipe Connector 等缺失条目。
- 全量扫描结果：物品/方块/流体名称汉化缺口为 0（测试/技术方块也已补名）。
- 发现并修复唯一剩余任务链来源缺口：Avaritia 无尽水桶需要原版粉雪桶；新增“桶 + 4 雪球 → 粉雪桶”，雪球可由 AE2 熵冷却水获得。
- 其余无普通配方候选为机器动态产物、作物方块、流体、装饰/技术方块，不属于空岛来源缺口。
