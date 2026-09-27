# 天工创世 · 项目记忆（2026-09-28）

## 当前状态
- 桌面包：`C:\Users\admin\Desktop\NewAgeSky-1.21.1`
- 测试实例：`D:\我的世界整合包\1\versions\测试`
- Minecraft 1.21.1 + NeoForge 21.1.249 + Java 21；mods 232。
- 游戏窗口标题：《天工创世》v1.1.1 --凉寻Lonya。
- 整合包英文名称：sky-craft-creation。内部技术命名空间同步为 `sky-craft-creation`。
- FTB Quests：23 章、7 组、857 个任务、2 个奖励表；最终目标为创造收敛核心。
- 不安装 data_energistics、Refined Storage、apothicenchantingaddition。
- 渲染组合：Sodium + Iris。
- 下界恢复原版生成（SkyblockBuilder Nether.isCustom=false）；新生成区块使用原版下界地形与 Mystical Agriculture 灵魂石/离魂矿矿脉。
- 已补齐 ProjectE、Integrated Dynamics、Ender Drives、Apotheosis、Functional Chemical、ProjectExpansion 等缺失物品汉化；全量物品/方块名称汉化缺口为 0。
- 空岛来源复扫发现并修复 Avaritia 无尽水桶所需粉雪桶：新增“桶 + 4 雪球 → 粉雪桶”。
- 1.1.1 发布前修复 Avaritia extreme_smithing 的 base/template 字段，并修复 Industrial Foregoing 激光钻头 JEI broken recipe。
- 修复 ProjectE Zero-EMC 数据的 emc_value 格式，并把 17 个锻造模板与 Avaritia 升级模板设为 0 EMC。
- 清理 AllTheCompressed/Ex Deorum/Ex Compressum 的 314 个无用兼容方块（JEI/创造页隐藏 + 透明纹理），并修复 FullEng 终端与 AE2 Utility 配方查找器纹理。
- 新增终局合成、ProjectE 与无尽装备章节，最终目标为创造收敛核心。
- 已加入 Create Ultimine 1.21.1-neoforge-1.3.3。

## 当前任务线
- 当前任务书已同步：23 章、7 组、857 个任务；857 个任务 ID 无重复，307 条依赖无悬空。
- 主线与专题章节结构已调整，新增气动工业章节。
- 最终目标仍为 19 个连续创造链任务。

## 终局平衡
- `packagedauto:package` 不再作为普通工作台材料。

## 无尽贪婪
- 模组：Re-Avaritia 1.4.2、PackagedAvaritia 3.0.1.5。
- 四级 Package Crafter、Extreme Crafting Table、中子收集/压缩和无限材料链已接入。
- 极端工作台必须消耗 End Package Crafter。
- Avaritia 原生 158 条配方保留，关键终局链由 KubeJS 重排。

## 材料来源
- 已补 AE2 压印模板、门瑞欧树苗/玻璃/树脂桶、坚固蜂笼、Draconium、Awakened Draconium、Neo Eco 三种粉尘。
- 已补 `extendedcrafting:the_ultimate_ingot` 正向来源。
- 已补 `avaritia:upgrade_smithing_template` 首件有序配方；原模组复制模板配方保留。
- 新增锻造模板胚，并为原版下界合金升级模板和 16 种盔甲纹饰模板补全 17 条有序首件配方。
- 当前 KubeJS 配方材料审计：0 个未知来源。
- 已补 11 条 Ex Deorum 碎矿转换，锇可通过碎矿→粗锇→锇锭起步。
- 蜜脾、锇种子和蜜糖种子已有非循环首件来源。
- 全任务材料复扫 980 种，剩余 18 种均为创造/调试、动态机器产物或原版硬编码。
- 本次实机 KubeJS 新增 92 条、移除 34 条配方，0 失败。终局自定义物品共 11 个。
- 2026-09-24 模组批量更新：保留 52 个版本更新，新增 Useless Stretcher；JEI 与 Multiblocked2 保持原版本。
- 发布包审计：164/164 个 CurseForge 项目与下载源通过，54 个随包模组齐全。

## 实机验收
- KubeJS：0 错误、0 失败配方；本次新增 92 条、移除 34 条。
- JEI：本次新增配方 0 broken。
- 发布包结构校验：CurseForge 清单更新为 164 个远程文件、54 个内置模组，名称/制作人/说明/校验文件齐全。
- 桌面端与测试实例相关文件 SHA-256 一致。
- 游戏已关闭；后续测试或修改前不要覆盖运行中的任务文件。

## 下次继续
- 用 PCL/HMCL 实际导入 `天工创世-发布/01-整合包/天工创世-1.1.1-CurseForge.zip`，验证 175 个远程模组下载和 57 个内置模组安装。
- 在游戏内实际制作一条创造链，重点验证 Extreme Package Crafter、封包编码器和最终 ME 创造存储元件。
- 检查新增中间物在 JEI 中的合成树和批量产出显示。
- 继续从任务物品反查根来源，排查“有配方但配方链自我循环”的材料。
- 若继续改配方，必须先退出测试实例，再同步 `config/` 与 `kubejs/`。
- 本次备份：`_excluded/creative_chain_b_20260910_214607/`。
- 任务链备份：`_excluded/creative_quest_chain_20260910_215512/`。
- 最终发布目录：`C:\Users\admin\Desktop\天工创世-发布`。
- 发布渠道：BBSMC、MCMOD、CurseForge；不发布 Modrinth。
- 唯一安装包：`01-整合包/天工创世-1.1.1-CurseForge.zip`；175 个模组由启动器下载，57 个随包提供。大小 81.39 MB，SHA-256：F15FBC91426DFF83B7DDE20031CDC9563A20E141C9707895FA238EF577755932。
- 安装包 SHA-256：F15FBC91426DFF83B7DDE20031CDC9563A20E141C9707895FA238EF577755932。
- 发布目录维护规则：`天工创世-发布\00-维护\更新流程.md`。
- GitHub 发布规则：每个版本一个独立 Release，附件使用 ASCII 文件名 `sky-craft-creation-<版本>-CurseForge.zip`，保留各版本标签。
- 发布封面：使用 `C:\Users\admin\Desktop\天工创世-发布\封面\天工创世封面_空岛版.jpg`，文件名不写版本号，并同步为安装包根目录 `cover.jpg`；不再使用旧封面模板生成流程。
- 启动器图标：`PCL/Logo.png`；游戏窗口图标：`config/customwindowtitle/icon.png`，均使用 `天工创世图标v4.jpg` 生成。
- 游戏窗口图标配置：`config/customwindowtitle-client.toml` 中的 `icon = 'customwindowtitle/icon.png'`。
- 启动随机文案：`kubejs/startup_scripts/skycraft_launch_wish.js`，内含 100 条阳光祝福，每次启动随机输出一条到启动日志。
- 游戏窗口标题：`kubejs/client_scripts/skycraft_window_title.js` 在启动后随机选择一条文案，将窗口标题设置为“原标题 tips:随机文案”，并在客户端 tick 中周期校验、进入世界时再次补齐，防止被其他模组覆盖。
- 模组更新备份：`_excluded/mod_backups/pre_update_20260924_230041/`。
- 2026-09-24 窗口标题随机 tips：已实机启动验证，窗口标题会显示为“《天工创世》v1.1.1 --凉寻Lonya tips:随机文案”。
- 每个版本在 `04-更新日志\<版本号>.txt` 记录更新，发布目录只保留当前版本包和一张无版本号封面。
- 更新日志规则：每次修改都追加到当前版本日志，并在每组记录前写 `更新时间：YYYY-MM-DD HH:mm`；未明确指定新版本号时保持同一日志文件，指定新版本号后重新生成对应版本号的日志。
- 模板配方备份：`_excluded/avaritia_template_20260910_222858/`。
- 全模板配方备份：`_excluded/all_smithing_templates_20260910_223314/`。
## 工作规则
1. 任务只在测试实例中编辑，退出游戏后再同步。
2. 同步顺序：备份 → 测试实例 → 桌面包 → 逐文件哈希。
3. config/kubejs 改动必须两端同步。
4. 空岛模板只对新档生效；任务缓存未刷新时新建世界或清理存档任务缓存。
5. 语言文件使用 UTF-8 无 BOM；清理键名前先备份。

## 参考
- `MATERIAL_AUDIT.md`
- `BALANCE_PLAN.md`
- `CHANGELOG.md`
- `MODLIST.txt`
- `_excluded/`
- CurseForge 项目状态审计：164/166 个远程项目仍在；AE2 Lightning Tech 与 Thunderbolt 已下架，改为随包提供。
