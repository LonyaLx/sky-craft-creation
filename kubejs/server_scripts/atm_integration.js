// Sky Craft Creation - obtainable ATM smithing templates and tag-based upgrades.
ServerEvents.recipes(event => {
  const templates = [
    'allthemodium:allthemodium_upgrade_smithing_template',
    'allthemodium:vibranium_upgrade_smithing_template',
    'allthemodium:unobtainium_upgrade_smithing_template'
  ]

  // Replace ATM self-duplication recipes with a first-template recipe plus unified duplication.
  templates.forEach(id => event.remove({ output: id }))

  event.shaped(templates[0], [
    'RBR',
    'BCB',
    'RBR'
  ], {
    R: 'allthemodium:raw_allthemodium',
    B: 'minecraft:netherite_ingot',
    C: 'kubejs:smithing_template_blank'
  }).id('sky-craft-creation:atm/templates/allthemodium_first')

  event.shaped('2x ' + templates[0], [
    'RBR',
    'BCB',
    'RBR'
  ], {
    R: '#c:ingots/netherite',
    B: 'minecraft:deepslate',
    C: templates[0]
  }).id('sky-craft-creation:atm/templates/allthemodium_duplicate')

  event.shaped(templates[1], [
    'RVR',
    'VCV',
    'RVR'
  ], {
    R: 'allthemodium:raw_allthemodium',
    V: 'allthemodium:vibranium_ingot',
    C: 'kubejs:smithing_template_blank'
  }).id('sky-craft-creation:atm/templates/vibranium_first')

  event.shaped('2x ' + templates[1], [
    'RVR',
    'VCV',
    'RVR'
  ], {
    R: '#c:ingots/allthemodium',
    V: 'allthemodium:ancient_stone',
    C: templates[1]
  }).id('sky-craft-creation:atm/templates/vibranium_duplicate')

  event.shaped(templates[2], [
    'VUV',
    'UCU',
    'VUV'
  ], {
    V: 'allthemodium:vibranium_ingot',
    U: 'allthemodium:unobtainium_ingot',
    C: 'kubejs:smithing_template_blank'
  }).id('sky-craft-creation:atm/templates/unobtainium_first')

  event.shaped('2x ' + templates[2], [
    'VUV',
    'UCU',
    'VUV'
  ], {
    V: '#c:ingots/vibranium',
    U: 'minecraft:end_stone',
    C: templates[2]
  }).id('sky-craft-creation:atm/templates/unobtainium_duplicate')

  // Allow ATM equipment upgrades to accept common-tagged metals instead of one exact mod ID.
  event.forEachRecipe({ type: 'minecraft:smithing_transform' }, recipe => {
    const json = recipe.json
    if (!json || !json.get('template') || !json.get('addition')) return
    const template = json.getAsJsonObject('template')
    const addition = json.getAsJsonObject('addition')
    if (!template.has('item') || !addition.has('item')) return

    const templateId = template.get('item').getAsString()
    const additionId = addition.get('item').getAsString()
    let tag = null

    if (templateId === 'allthemodium:allthemodium_upgrade_smithing_template' && additionId === 'allthemodium:allthemodium_ingot') {
      tag = 'c:ingots/allthemodium'
    } else if (templateId === 'allthemodium:vibranium_upgrade_smithing_template' && additionId === 'allthemodium:vibranium_ingot') {
      tag = 'c:ingots/vibranium'
    } else if (templateId === 'allthemodium:unobtainium_upgrade_smithing_template' && additionId === 'allthemodium:unobtainium_ingot') {
      tag = 'c:ingots/unobtainium'
    }

    if (tag) {
      addition.remove('item')
      addition.addProperty('tag', tag)
      recipe.save()
    }
  })
})
