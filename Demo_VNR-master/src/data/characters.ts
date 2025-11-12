import charactersRaw from '../data.json'
import type { Character, ResourceType } from '../types'

const coerceResourceType = (value: string): ResourceType => {
  const legalTypes: ResourceType[] = ['quote', 'video', 'image', 'pdf', 'audio']
  return (legalTypes.includes(value as ResourceType) ? value : 'image') as ResourceType
}

export const characters: Character[] = (charactersRaw as Character[]).map((character) => ({
  ...character,
  resources: character.resources.map((resource) => ({
    ...resource,
    type: coerceResourceType(resource.type)
  }))
}))

export const characterById = new Map<number, Character>()
characters.forEach((character) => {
  characterById.set(character.id, character)
})
