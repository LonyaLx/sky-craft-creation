// Sky Craft Creation - show only directly siftable 1x compressed blocks in the Ex Deorum tab.
var ALLTHECOMPRESSED_TAB_ADDED = ALLTHECOMPRESSED_TAB_ADDED || false
var ALLTHECOMPRESSED_TAB_MATERIALS = [
  'gravel', 'dirt', 'sand', 'red_sand', 'dust', 'soul_sand', 'moss_block',
  'crushed_netherrack', 'crushed_end_stone', 'crushed_deepslate', 'crushed_blackstone'
]

StartupEvents.modifyCreativeTab('exdeorum:exdeorum', event => {
  if (ALLTHECOMPRESSED_TAB_ADDED) return
  ALLTHECOMPRESSED_TAB_ADDED = true
  for (var m = 0; m < ALLTHECOMPRESSED_TAB_MATERIALS.length; m++) {
    event.add(Item.of('allthecompressed:' + ALLTHECOMPRESSED_TAB_MATERIALS[m] + '_1x'))
  }
})
