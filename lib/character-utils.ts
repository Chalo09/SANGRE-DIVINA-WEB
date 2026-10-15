import { AtributoKey, Character } from '@/types/character'
import { linajes } from '@/data/linajes'
import { clases } from '@/data/clases'
import { trasfondos } from '@/data/trasfondos'
import { habilidades } from '@/data/habilidades'
import { getModifier, getProficiencyBonus, calculateHP, calculateSD } from '@/data/mechanics'

export function getLinaje(id: string) {
  return linajes?.find((l) => l?.id === id) ?? null
}

export function getClase(id: string) {
  return clases?.find((c) => c?.id === id) ?? null
}

export function getTrasfondo(id: string) {
  return trasfondos?.find((t) => t?.id === id) ?? null
}

export function getHabilidad(id: string) {
  return habilidades?.find((h) => h?.id === id) ?? null
}

export function calcularAtributoFinal(base: number, linajeBono: number): number {
  return base + linajeBono
}

export function calcularModificador(valor: number): number {
  return getModifier(valor)
}

export function calcularCA(desMod: number): number {
  return 10 + desMod
}

export function calcularIniciativa(desMod: number): number {
  return desMod
}

export function getSkillMod(char: Character, skillId: string): number {
  const skill = getHabilidad(skillId)
  if (!skill) return 0
  const attrVal = char?.atributos?.[skill.atributo] ?? 10
  const mod = getModifier(attrVal)
  const isProficient = char?.habilidades?.includes?.(skillId) ?? false
  const bc = getProficiencyBonus(char?.nivel ?? 1)
  return mod + (isProficient ? bc : 0)
}

export function getSaveMod(char: Character, attr: AtributoKey): { mod: number; proficient: boolean } {
  const clase = getClase(char?.clase)
  const linaje = getLinaje(char?.linaje)
  const attrVal = char?.atributos?.[attr] ?? 10
  const mod = getModifier(attrVal)
  const bc = getProficiencyBonus(char?.nivel ?? 1)
  const classSaves = clase?.salvaciones ?? []
  const linajeSave = linaje?.salvacionAdicional
  const proficient = classSaves.includes(attr) || linajeSave === attr
  return { mod: mod + (proficient ? bc : 0), proficient }
}

export function buildCharacterStats(char: Character) {
  const linaje = getLinaje(char?.linaje)
  const clase = getClase(char?.clase)
  const trasf = getTrasfondo(char?.trasfondo)
  const nivel = char?.nivel ?? 1
  const bc = getProficiencyBonus(nivel)
  const desMod = getModifier(char?.atributos?.DES ?? 10)
  const conMod = getModifier(char?.atributos?.CON ?? 10)
  const sabMod = getModifier(char?.atributos?.SAB ?? 10)

  const hpMax = calculateHP(clase?.dadoGolpe ?? 'd8', conMod, nivel)
  const sdMax = calculateSD(linaje?.sdBase ?? 10, sabMod)
  const ca = calcularCA(desMod)
  const iniciativa = calcularIniciativa(desMod)
  const velocidad = 9 // 9 metros base

  return { linaje, clase, trasf, nivel, bc, hpMax, sdMax, ca, iniciativa, velocidad, conMod, desMod, sabMod }
}

export function getClassTraitsForLevel(claseId: string, nivel: number) {
  const clase = getClase(claseId)
  return clase?.rasgos?.filter?.((r) => (r?.nivel ?? 99) <= nivel) ?? []
}

export function getAvailablePowers(linajeId: string, nivel: number) {
  const linaje = getLinaje(linajeId)
  if (!linaje) return { pasivos: [], activos: [], apice: null, locked: [] }
  const pasivos = linaje?.poderes?.pasivos ?? []
  const activos = (linaje?.poderes?.activos ?? []).filter((p) => (p?.nivelMin ?? 1) <= nivel)
  const lockedActivos = (linaje?.poderes?.activos ?? []).filter((p) => (p?.nivelMin ?? 1) > nivel)
  const apice = (linaje?.poderes?.apice?.nivelMin ?? 99) <= nivel ? linaje?.poderes?.apice : null
  const locked = [
    ...lockedActivos,
    ...(apice ? [] : [linaje?.poderes?.apice].filter(Boolean)),
  ] as any[]
  return { pasivos, activos, apice, locked }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9)
}
