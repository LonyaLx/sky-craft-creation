// Sky Craft Creation - force the creative energy cube recipe to use Mekanism Long.MAX_VALUE energy.
// JS numbers cannot represent 9223372036854775807 exactly, so the exact JSON integer is applied last.
ServerEvents.recipes(event => {
  const JsonParser = Java.loadClass('com.google.gson.JsonParser')
  const maxLongText = '9223372036854775807'

  event.forEachRecipe({
    type: 'avaritia:shaped_table',
    output: 'mekanism:creative_energy_cube'
  }, recipe => {
    const result = recipe.json.getAsJsonObject('result')
    if (!result || !result.has('components')) {
      throw new Error('Creative energy cube recipe is missing Mekanism components')
    }

    const components = result.getAsJsonObject('components')
    const energy = components.getAsJsonObject('mekanism:energy')
    const containers = energy.getAsJsonArray('energy_containers')
    const exactMaxLong = JsonParser.parseString(maxLongText)

    containers.set(0, exactMaxLong)
    if (containers.get(0).toString() !== maxLongText) {
      throw new Error('Failed to apply exact Mekanism creative energy value')
    }
    recipe.save()
  })
})

// Runtime fallback: Avaritia custom recipes can strip item components on some crafting paths.
// Re-apply Mekanism's own max energy container to crafted items and placed blocks.
const $Long = Java.loadClass('java.lang.Long')
const $ContainerType = Java.loadClass('mekanism.common.attachments.containers.ContainerType')

function fillCreativeEnergyCube(stack) {
  if (!stack || stack.isEmpty()) return
  const handler = $ContainerType.ENERGY.createHandler(stack)
  if (!handler) return
  handler.getEnergyContainers(null).forEach(container => {
    container.setEnergy($Long.MAX_VALUE)
  })
}

ItemEvents.crafted('mekanism:creative_energy_cube', event => {
  fillCreativeEnergyCube(event.item)
})

BlockEvents.placed('mekanism:creative_energy_cube', event => {
  const blockEntity = event.block.entity
  if (blockEntity && blockEntity.getEnergyContainer) {
    blockEntity.getEnergyContainer().setEnergy($Long.MAX_VALUE)
  }
})
