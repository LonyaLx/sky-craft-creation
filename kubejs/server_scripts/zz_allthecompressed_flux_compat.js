// Sky Craft Creation - Ex Machinis Flux Hammer compatibility.
// Hammering a compressed block keeps the same compression level.
ServerEvents.recipes(event => {
  const hammerGroups = [
    {
      inputs: ['cobblestone', 'diorite', 'granite', 'andesite'],
      result: 'gravel'
    },
    {
      inputs: ['gravel'],
      result: 'sand'
    },
    {
      inputs: ['sand', 'red_sand'],
      result: 'dust'
    },
    {
      inputs: ['netherrack'],
      result: 'crushed_netherrack'
    },
    {
      inputs: ['end_stone'],
      result: 'crushed_end_stone'
    },
    {
      inputs: ['blackstone'],
      result: 'crushed_blackstone'
    },
    {
      inputs: ['deepslate', 'cobbled_deepslate'],
      result: 'crushed_deepslate'
    },
    {
      inputs: ['crushed_netherrack'],
      result: 'red_sand'
    }
  ]

  hammerGroups.forEach(group => {
    for (var level = 1; level <= 9; level++) {
      // Rhino: no const/let declarations inside a loop body (redeclaration error).
      var suffix = level + 'x'
      var ingredients = group.inputs.map(material => ({
        item: 'allthecompressed:' + material + '_' + suffix
      }))

      event.custom({
        type: 'exdeorum:hammer',
        ingredient: ingredients,
        result: {
          count: 1,
          id: 'allthecompressed:' + group.result + '_' + suffix
        },
        result_amount: 1.0
      }).id('sky-craft-creation:flux_hammer/' + suffix + '/' + group.result)
    }
  })
})