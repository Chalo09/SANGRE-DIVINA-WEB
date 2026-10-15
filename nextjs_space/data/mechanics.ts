export const XP_TABLE: Record<number, number> = {
  1: 0, 2: 300, 3: 900, 4: 2700, 5: 6500, 6: 14000, 7: 23000, 8: 34000,
  9: 48000, 10: 64000, 11: 85000, 12: 100000, 13: 120000, 14: 140000,
  15: 165000, 16: 195000, 17: 225000, 18: 265000, 19: 305000, 20: 355000,
}

export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9,
}

export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8]

export function getModifier(value: number): number {
  return Math.floor((value - 10) / 2)
}

export function getProficiencyBonus(level: number): number {
  if (level <= 4) return 2
  if (level <= 8) return 3
  if (level <= 12) return 4
  if (level <= 16) return 5
  return 6
}

export function getDieMax(dado: string): number {
  const map: Record<string, number> = { d6: 6, d8: 8, d10: 10, d12: 12 }
  return map[dado] ?? 8
}

export function getDieAvg(dado: string): number {
  const map: Record<string, number> = { d6: 4, d8: 5, d10: 6, d12: 7 }
  return map[dado] ?? 5
}

export function calculateHP(dadoGolpe: string, conMod: number, level: number): number {
  const maxDie = getDieMax(dadoGolpe)
  const avgDie = getDieAvg(dadoGolpe)
  const lvl1 = maxDie + conMod
  const additional = Math.max(0, level - 1) * (avgDie + conMod)
  return Math.max(1, lvl1 + additional)
}

export function calculateSD(sdBase: number, sabMod: number): number {
  return sdBase + sabMod
}

export function calculatePointBuyRemaining(atributos: Record<string, number>): number {
  let spent = 0
  for (const val of Object.values(atributos)) {
    spent += POINT_BUY_COSTS[val] ?? 0
  }
  return 27 - spent
}

export const DONES_DIVINOS = [
  { nombre: 'Sangre Poderosa', desc: 'SD máxima +4.' },
  { nombre: 'Resistencia Divina', desc: 'Resistencia a un tipo de daño a tu elección.' },
  { nombre: 'Tacto Mágico', desc: 'Aprendes 2 trucos de cualquier lista de hechizos.' },
  { nombre: 'Velocidad Sobrehumana', desc: 'Velocidad +3m, Desenredar sin acción adicional.' },
  { nombre: 'Mente Olímpica', desc: '+1 INT, +1 SAB. CD de poderes +1.' },
  { nombre: 'Corazón de Campeón', desc: 'A 0 PG, 1 vez/descanso largo: recuperas PG = nivel + mod CON.' },
  { nombre: 'Sexto Sentido', desc: 'Inmune a sorpresa. Percibes criaturas invisibles a 1,5m.' },
  { nombre: 'Alianza Divina', desc: 'Elige otro Linaje, obtienes uno de sus poderes pasivos.' },
]

export const ATRIBUTO_NOMBRES: Record<string, string> = {
  FUE: 'Fuerza', DES: 'Destreza', CON: 'Constitución',
  INT: 'Inteligencia', SAB: 'Sabiduría', CAR: 'Carisma',
}
