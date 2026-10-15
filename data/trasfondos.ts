import { TrasfondoData } from '@/types/character'

export const trasfondos: TrasfondoData[] = [
  {
    id: 'cazador_monstruos', nombre: 'Cazador de Monstruos',
    descripcion: 'Has estado rastreando criaturas sobrenaturales desde antes de saber que tú mismo eras sobrenatural.',
    competencias: ['Atletismo', 'Supervivencia'], herramientas: ['Kit de curandero'], idiomas: 1,
    rasgo: { nombre: 'Rastreador Implacable', desc: 'Si has rastreado a un monstruo durante al menos 1 hora, tienes ventaja en todos los ataques contra ese monstruo específico ese día.' },
  },
  {
    id: 'explorador_laberinto', nombre: 'Explorador del Laberinto',
    descripcion: 'Has pasado tiempo considerable en el Laberinto de Dédalo. Te has acostumbrado a lo imposible.',
    competencias: ['Investigación', 'Percepción'], herramientas: ['Kit de cartógrafo'], idiomas: 1,
    rasgo: { nombre: 'Orientación Espacial Perfecta', desc: 'Nunca te pierdes en espacios interiores, aunque sean mágicamente alterados. Siempre sabes cómo salir.' },
  },
  {
    id: 'exiliado_olimpo', nombre: 'Exiliado del Olimpo',
    descripcion: 'Fuiste rechazado o ignorado por tu progenitor divino, y eso te hizo más fuerte y más amargo.',
    competencias: ['Engaño', 'Perspicacia'], herramientas: ['Kit de disfraz'], idiomas: 1,
    rasgo: { nombre: 'Desconfianza Refinada', desc: 'Ventaja en tiradas para detectar mentiras, y ventaja en tiradas de SAB contra efectos de encantamiento.' },
  },
  {
    id: 'heroe_campamento', nombre: 'Héroe de Campamento',
    descripcion: 'Creciste en uno de los Campamentos para semidioses. El entrenamiento te formó, los amigos te definieron.',
    competencias: ['Atletismo', 'Acrobacias'], herramientas: ['Una herramienta de tu clase'], idiomas: ['Griego antiguo'],
    rasgo: { nombre: 'Camaradería de Campamento', desc: 'Cuando ayudas a un aliado (acción Ayudar), el dado de ventaja también da ventaja en la tirada de salvación que siga.' },
  },
  {
    id: 'mortal_despertado', nombre: 'Mortal que Despertó Tarde',
    descripcion: 'Durante años no sabías quién eras. Esa vida te enseñó a adaptarte.',
    competencias: ['Persuasión', 'Engaño'], herramientas: ['Kit de falsificación'], idiomas: 2,
    rasgo: { nombre: 'Mundo Normal', desc: 'Puedes pasar por mortal ordinario. Criaturas sobrenaturales necesitan tirada de Percepción contra tu CD de Engaño para reconocerte.' },
  },
  {
    id: 'hijo_destino', nombre: 'Hijo del Destino',
    descripcion: 'Una profecía marca tu nombre. No sabes exactamente lo que dice, pero sus efectos ya se sienten.',
    competencias: ['Historia Antigua', 'Religión'], herramientas: ['Juego de naipes oracular'], idiomas: ['Griego antiguo'],
    rasgo: { nombre: 'Destino Inevitable', desc: 'Una vez por sesión, cuando fallarías con un resultado que te dejaría incapacitado o muerto, puedes convertirlo en un éxito marginal.' },
  },
  {
    id: 'viajero_mundos', nombre: 'Viajero entre Mundos',
    descripcion: 'Has cruzado el Velo entre el mundo mortal y el divino más de una vez. Sabes cosas que la mayoría ignoran.',
    competencias: ['Conocimiento Arcano', 'Supervivencia'], herramientas: ['Brújula divina'], idiomas: ['Griego antiguo', '+1 idioma antiguo'],
    rasgo: { nombre: 'Conocimiento de lo Inusual', desc: 'Puedes pedir al DO una pista sobre cualquier criatura, lugar o fenómeno sobrenatural que encuentres.' },
  },
  {
    id: 'guardian_equilibrio', nombre: 'Guardián del Equilibrio',
    descripcion: 'Crees que el mundo tiene un orden frágil que debe mantenerse. Los dioses te aceptan como aliado, no como peón.',
    competencias: ['Perspicacia', 'Persuasión'], herramientas: ['Kit de herborista'], idiomas: ['Griego antiguo'],
    rasgo: { nombre: 'Autoridad Neutral', desc: 'Eres reconocido como alguien imparcial. Una vez por sesión, puedes solicitar una tregua de 1 minuto a cualquier facción sin tirada.' },
  },
]
