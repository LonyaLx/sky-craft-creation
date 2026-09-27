// Sky Craft Creation - completely hide Ex Deorum / Ex Compressum duplicate compressed blocks.
var HIDDEN_EXCOMPRESSUM_COMPRESSED_TAB = [
  'excompressum:compressed_andesite',
  'excompressum:compressed_cobblestone',
  'excompressum:compressed_crushed_andesite',
  'excompressum:compressed_crushed_diorite',
  'excompressum:compressed_crushed_end_stone',
  'excompressum:compressed_crushed_granite',
  'excompressum:compressed_crushed_netherrack',
  'excompressum:compressed_diorite',
  'excompressum:compressed_dirt',
  'excompressum:compressed_dust',
  'excompressum:compressed_end_stone',
  'excompressum:compressed_flint',
  'excompressum:compressed_granite',
  'excompressum:compressed_gravel',
  'excompressum:compressed_netherrack',
  'excompressum:compressed_sand',
  'excompressum:compressed_soul_sand'
]

var HIDDEN_EXDEORUM_COMPRESSED_TAB = [
  'exdeorum:compressed_andesite',
  'exdeorum:compressed_blackstone',
  'exdeorum:compressed_cobbled_deepslate',
  'exdeorum:compressed_cobblestone',
  'exdeorum:compressed_crushed_blackstone',
  'exdeorum:compressed_crushed_deepslate',
  'exdeorum:compressed_crushed_end_stone',
  'exdeorum:compressed_crushed_netherrack',
  'exdeorum:compressed_deepslate',
  'exdeorum:compressed_diorite',
  'exdeorum:compressed_dirt',
  'exdeorum:compressed_dust',
  'exdeorum:compressed_end_stone',
  'exdeorum:compressed_granite',
  'exdeorum:compressed_gravel',
  'exdeorum:compressed_moss_block',
  'exdeorum:compressed_netherrack',
  'exdeorum:compressed_red_sand',
  'exdeorum:compressed_sand',
  'exdeorum:compressed_soul_sand'
]

StartupEvents.modifyCreativeTab('excompressum:excompressum', event => {
  for (var i = 0; i < HIDDEN_EXCOMPRESSUM_COMPRESSED_TAB.length; i++) {
    var stack = Item.of(HIDDEN_EXCOMPRESSUM_COMPRESSED_TAB[i])
    event.removeFromParent(stack)
    event.removeFromSearch(stack)
  }
})

StartupEvents.modifyCreativeTab('exdeorum:exdeorum', event => {
  for (var i = 0; i < HIDDEN_EXDEORUM_COMPRESSED_TAB.length; i++) {
    var stack = Item.of(HIDDEN_EXDEORUM_COMPRESSED_TAB[i])
    event.removeFromParent(stack)
    event.removeFromSearch(stack)
  }
})