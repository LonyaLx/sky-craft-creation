// Sky Craft Creation - bridge tags for materials that do not share a standard c: tag.
// All other c:<form>/<material> tags from every installed mod are unified centrally by
// config/almostunified/unification/materials.json.
ServerEvents.tags('item', event => {
  const plasticItems = [
    'industrialforegoing:plastic',
    'pneumaticcraft:plastic'
  ]

  plasticItems.forEach(id => {
    event.add('c:plastic', id)
    event.add('c:plastics', id)
    event.add('c:plastics/generic', id)
    event.add('c:plates/plastic', id)
  })
})
