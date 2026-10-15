import { Character } from '@/types/character'

const STORAGE_KEY = 'sangre_divina_characters'

export function getCharacters(): Character[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function getCharacterById(id: string): Character | null {
  const chars = getCharacters()
  return chars?.find((c: Character) => c?.id === id) ?? null
}

export function saveCharacter(char: Character): void {
  const chars = getCharacters()
  const idx = chars.findIndex((c: Character) => c?.id === char?.id)
  if (idx >= 0) {
    chars[idx] = { ...(char ?? {}), updatedAt: new Date().toISOString() }
  } else {
    chars.push({ ...(char ?? {}), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() })
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars))
}

export function deleteCharacter(id: string): void {
  const chars = getCharacters().filter((c: Character) => c?.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chars))
}

export function exportCharacterJSON(char: Character): void {
  const blob = new Blob([JSON.stringify(char, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${char?.nombre ?? 'personaje'}_sangre_divina.json`
  a.click()
  URL.revokeObjectURL(url)
}

export function importCharacterJSON(file: File): Promise<Character> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e?.target?.result as string)
        if (!data?.nombre || !data?.linaje || !data?.clase) {
          reject(new Error('Archivo JSON inválido'))
          return
        }
        resolve(data as Character)
      } catch {
        reject(new Error('Error al leer el archivo'))
      }
    }
    reader.onerror = () => reject(new Error('Error al leer el archivo'))
    reader.readAsText(file)
  })
}
