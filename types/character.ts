export type AtributoKey = 'FUE' | 'DES' | 'CON' | 'INT' | 'SAB' | 'CAR'

export interface Entorno {
  tipo: string
  mod: number
}

export interface Poder {
  nombre: string
  desc: string
  costeSd?: number
  nivelMin?: number
}

export interface Linaje {
  id: string
  nombre: string
  descripcion: string
  bonificadores: Partial<Record<AtributoKey, number>>
  sdBase: number
  salvacionAdicional: AtributoKey
  entornos: Entorno[]
  poderes: {
    pasivos: Poder[]
    activos: Poder[]
    apice: Poder
  }
}

export interface SubclaseData {
  id: string
  nombre: string
  descripcion: string
  nivelDesbloqueo: number
}

export interface RasgoClase {
  nivel: number
  nombre: string
  desc?: string
}

export interface Clase {
  id: string
  nombre: string
  descripcion: string
  dadoGolpe: string
  atributoPrincipal: AtributoKey[]
  salvaciones: AtributoKey[]
  armaduras: string[]
  armas: string[]
  numHabilidades: number
  habilidadesDisponibles: string[]
  subclases: SubclaseData[]
  rasgos: RasgoClase[]
  herramientas?: string[]
}

export interface TrasfondoData {
  id: string
  nombre: string
  descripcion: string
  competencias: string[]
  herramientas: string[]
  idiomas: number | string | string[]
  rasgo: { nombre: string; desc: string }
}

export interface HabilidadData {
  id: string
  nombre: string
  atributo: AtributoKey
}

export interface Character {
  id: string
  nombre: string
  nivel: number
  linaje: string
  clase: string
  subclase: string
  trasfondo: string
  atributos: Record<AtributoKey, number>
  habilidades: string[]
  hpActual: number
  hpMaximo: number
  hpTemp: number
  sdActual: number
  sdMaximo: number
  puntosGloria: number
  xp: number
  sexo: string
  apariencia: string
  historia: string
  personalidad: string
  idiomas: string[]
  notas: string
  createdAt: string
  updatedAt: string
}
