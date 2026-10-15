import { Linaje } from '@/types/character'

export const linajes: Linaje[] = [
  {
    id: 'zeus', nombre: 'Zeus — Señor del Olimpo',
    descripcion: 'El trueno no pide permiso. Hijo del rey de los dioses, llevas el poder de los cielos y la autoridad que hace temblar el Olimpo.',
    bonificadores: { CAR: 2, FUE: 1 }, sdBase: 12, salvacionAdicional: 'CAR',
    entornos: [
      { tipo: 'Lugares altos (montañas, torres)', mod: 2 },
      { tipo: 'Durante tormenta eléctrica', mod: 3 },
      { tipo: 'Bajo tierra o cavernas', mod: -2 },
      { tipo: 'Bajo el agua', mod: -2 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Electricidad Innata', desc: 'Resistencia al daño eléctrico. Las pequeñas descargas estáticas obedecen tu voluntad.' },
        { nombre: 'Voz de Mando', desc: 'Puedes repetir una tirada de Intimidación fallida una vez por descanso corto.' },
      ],
      activos: [
        { nombre: 'Chispa de Mando', costeSd: 1, nivelMin: 1, desc: 'Como acción adicional, otórgarte ventaja en una tirada de CAR.' },
        { nombre: 'Rayo de Zeus', costeSd: 3, nivelMin: 1, desc: 'Lanzar un rayo a objetivo visible en 18m. Ataque CAR+BC. Daño: 2d6+nivel eléctrico. Escala: +1d6 en niveles 5, 9, 13 y 17.' },
        { nombre: 'Llamada de la Tormenta', costeSd: 5, nivelMin: 5, desc: 'Invocar nubes de tormenta en área de 18m diámetro. 1 minuto: desventaja en DES, Rayo de Zeus como acción adicional.' },
      ],
      apice: { nombre: 'Señor de los Cielos', nivelMin: 11, desc: 'Vuelo 18m durante 10 minutos. Rayo de Zeus sin coste SD mientras vuelas. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'poseidon', nombre: 'Poseidón — Señor de los Mares',
    descripcion: 'El océano no conoce fronteras, y tampoco yo. El mar te reconoce. Las olas ceden ante ti.',
    bonificadores: { FUE: 2, CON: 1 }, sdBase: 12, salvacionAdicional: 'CON',
    entornos: [
      { tipo: 'Zonas costeras o acuáticas', mod: 3 },
      { tipo: 'Lluvia intensa o tormenta', mod: 2 },
      { tipo: 'Desierto o zona árida', mod: -2 },
      { tipo: 'Volcán activo', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Piel de Mar', desc: 'Respiración acuática indefinida. Velocidad de natación = velocidad × 2.' },
        { nombre: 'Empatía Marina', desc: 'Puedes comunicarte básicamente con criaturas marinas.' },
      ],
      activos: [
        { nombre: 'Control del Agua', costeSd: 2, nivelMin: 1, desc: 'Mover masa de agua de hasta 3m³ como proyectil (2d8 daño) o protección (+2 CA 1 ronda).' },
        { nombre: 'Ola de Choque', costeSd: 3, nivelMin: 1, desc: 'Ola de presión en línea de 9m. Tirada FUE o empujados 4,5m y derribados.' },
        { nombre: 'Temblor', costeSd: 4, nivelMin: 7, desc: 'Sacudir suelo en 6m a tu alrededor. Tirada DES o caer derribado. Puede dañar estructuras.' },
      ],
      apice: { nombre: 'Tsunami Menor', nivelMin: 11, desc: 'Muro de agua 12m alto y 18m ancho que avanza 9m/turno durante 3 turnos. Daño: 4d10. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'demeter', nombre: 'Deméter — Señora de la Cosecha',
    descripcion: 'La tierra recuerda todo. Y yo también. La naturaleza te habla, las plantas crecen donde pones el pie.',
    bonificadores: { SAB: 2, CON: 1 }, sdBase: 10, salvacionAdicional: 'SAB',
    entornos: [
      { tipo: 'Campos abiertos, bosques o jardines', mod: 3 },
      { tipo: 'Temporada de cosecha', mod: 2 },
      { tipo: 'Ciudad o zona sin vegetación', mod: -2 },
      { tipo: 'Desierto o zona árida', mod: -3 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Afín a la Naturaleza', desc: 'Hablas con plantas (respuestas simples). Al tocar una planta conoces sus propiedades medicinales o tóxicas.' },
        { nombre: 'Paso Silencioso', desc: 'En terreno natural, ventaja en tiradas de Sigilo.' },
      ],
      activos: [
        { nombre: 'Crecimiento Acelerado', costeSd: 2, nivelMin: 1, desc: 'Hacer crecer plantas en 3×3m. Terreno difícil o cobertura (+2 CA).' },
        { nombre: 'Curación de la Tierra', costeSd: 3, nivelMin: 1, desc: 'Tocar aliado: recupera 2d8 + mod SAB PG. Solo en contacto con tierra o vegetación.' },
        { nombre: 'Control Floral', costeSd: 4, nivelMin: 7, desc: 'Animar plantas en radio 9m. Agarrar enemigos (FUE para liberarse) o atacar (1d8).' },
      ],
      apice: { nombre: 'Estación de Prosperidad', nivelMin: 11, desc: 'Zona sagrada 12m radio, 1 hora. Aliados recuperan 1d6 PG/turno, ventaja en CON, sin necesidad de comida/agua. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'ares', nombre: 'Ares — Dios de la Guerra',
    descripcion: 'La batalla es lo único honesto. Naciste para el combate, lo necesitas. El campo de batalla es tu hogar.',
    bonificadores: { FUE: 2, CON: 1 }, sdBase: 11, salvacionAdicional: 'FUE',
    entornos: [
      { tipo: 'Campo de batalla activo o ruinas de guerra', mod: 3 },
      { tipo: 'Zona urbana en conflicto', mod: 2 },
      { tipo: 'Templo de paz o zona de tregua', mod: -2 },
      { tipo: 'Ambientes domésticos y tranquilos', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Sed de Sangre', desc: 'Al reducir un enemigo a 0 PG, ganas 1d6 PG temporales.' },
        { nombre: 'Instinto Táctico', desc: 'Nunca puedes ser sorprendido mientras estés consciente.' },
      ],
      activos: [
        { nombre: 'Furia de Combate', costeSd: 2, nivelMin: 1, desc: 'Como acción adicional, frenesí: +2 a tiradas de ataque y daño durante 1 minuto.' },
        { nombre: 'Aura de Miedo', costeSd: 3, nivelMin: 5, desc: 'Enemigos en 4,5m deben tirar SAB o quedar Asustados hasta fin de su siguiente turno.' },
        { nombre: 'Golpe Aplastante', costeSd: 4, nivelMin: 1, desc: 'Declara antes de atacar. Si impacta: +2d8 daño extra y objetivo tira FUE o cae derribado.' },
      ],
      apice: { nombre: 'Señor de la Batalla', nivelMin: 11, desc: '1 minuto: Acción adicional cada turno (atacar/correr). Críticos en este estado aturden al objetivo 1 ronda. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'apolo', nombre: 'Apolo — Dios del Sol',
    descripcion: 'Luz, música y verdad. Todo tiene su precio. El sol brilla sobre tus acciones y las musas susurran en tu oído.',
    bonificadores: { DES: 2, INT: 1 }, sdBase: 10, salvacionAdicional: 'DES',
    entornos: [
      { tipo: 'Durante el día, bajo sol directo', mod: 3 },
      { tipo: 'Festivales y celebraciones', mod: 2 },
      { tipo: 'De noche o en oscuridad total', mod: -2 },
      { tipo: 'Inframundo o cuevas profundas', mod: -3 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Curación Intuitiva', desc: '1 vez por descanso corto, tocar aliado: cura 1d8 + mod SAB PG.' },
        { nombre: 'Oído Perfecto', desc: 'Ventaja en tiradas de Percepción basadas en sonido.' },
      ],
      activos: [
        { nombre: 'Melodía del Sol', costeSd: 2, nivelMin: 1, desc: 'Interpretar/cantar como acción. Un aliado tiene ventaja en su próxima tirada.' },
        { nombre: 'Flecha de Luz', costeSd: 3, nivelMin: 1, desc: 'Flecha de energía solar sin arco. Ataque a distancia 36m. Daño: 2d8+nivel radiante. Escala: +1d8 en niveles 5, 9, 13, 17.' },
        { nombre: 'Profecía Menor', costeSd: 4, nivelMin: 7, desc: 'Trance (acción): visión vaga del futuro (8 horas). Ventaja en próxima tirada de iniciativa o habilidad a tu elección.' },
      ],
      apice: { nombre: 'Carro del Sol', nivelMin: 11, desc: 'Aura de luz solar 9m radio, 1 minuto. Muertos vivientes/sombras: 3d6 radiante/turno. Aliados: ventaja en CON. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'atenea', nombre: 'Atenea — Diosa de la Sabiduría',
    descripcion: 'La victoria se planea antes de empuñar la espada. Tu mente es tu arma más afilada y la estrategia tu escudo.',
    bonificadores: { INT: 2, SAB: 1 }, sdBase: 11, salvacionAdicional: 'INT',
    entornos: [
      { tipo: 'Bibliotecas, academias y centros de conocimiento', mod: 3 },
      { tipo: 'Planificando batalla (antes del combate)', mod: 2 },
      { tipo: 'Caos total sin posibilidad de planificación', mod: -2 },
      { tipo: 'Zonas de engaño e ilusión', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Mente Estratégica', desc: 'Ventaja en tiradas de Iniciativa. Puedes usar INT en lugar de DES para la iniciativa.' },
        { nombre: 'Égida del Conocimiento', desc: 'Competencia en todas las habilidades de INT. Si ya eres competente, doble BC.' },
      ],
      activos: [
        { nombre: 'Consejo Táctico', costeSd: 1, nivelMin: 1, desc: 'Como acción adicional, otorga a un aliado visible +2 a su próxima tirada de ataque o salvación.' },
        { nombre: 'Lanza de Atenea', costeSd: 3, nivelMin: 1, desc: 'Invoca una lanza de energía brillante. Ataque INT+BC a 18m. Daño: 2d6+nivel de fuerza. Escala: +1d6 en niveles 5, 9, 13, 17.' },
        { nombre: 'Plan Perfecto', costeSd: 4, nivelMin: 7, desc: 'Acción: elige hasta 3 aliados. Durante 1 minuto, tienen ventaja en ataques y tiradas de salvación mientras estén a 9m de ti.' },
      ],
      apice: { nombre: 'Estratega Divina', nivelMin: 11, desc: '1 minuto: tú y aliados en 9m pueden usar reacción para imponer desventaja a un ataque enemigo. Ataques coordinados (mismo objetivo) obtienen +1d8 extra. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'hera', nombre: 'Hera — Reina del Olimpo',
    descripcion: 'El poder verdadero no necesita hacer ruido. Llevas la autoridad del trono del Olimpo en tu sangre.',
    bonificadores: { CAR: 2, SAB: 1 }, sdBase: 10, salvacionAdicional: 'SAB',
    entornos: [
      { tipo: 'Hogares, templos y santuarios', mod: 3 },
      { tipo: 'Bodas y ceremonias', mod: 2 },
      { tipo: 'Zonas de caos o desorden total', mod: -2 },
      { tipo: 'Campos de batalla activos', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Majestad Real', desc: 'Ventaja en Persuasión e Intimidación con figuras de autoridad, nobles o líderes.' },
        { nombre: 'Guardiana del Linaje', desc: 'Aliados en 6m a tu alrededor tienen +1 a sus tiradas de salvación.' },
      ],
      activos: [
        { nombre: 'Vínculo de Familia', costeSd: 2, nivelMin: 1, desc: 'Fortalecer lazo con aliado visible: +1 a todas sus tiradas durante 1 minuto.' },
        { nombre: 'Celos Divinos', costeSd: 3, nivelMin: 1, desc: 'Maldecir objetivo visible (tirada SAB para resistir): desventaja en tiradas de CAR durante 1 hora.' },
        { nombre: 'Transformación', costeSd: 4, nivelMin: 7, desc: 'Cambiar apariencia tuya o de un aliado consentidor durante 1 hora. La ilusión es perfecta a los sentidos.' },
      ],
      apice: { nombre: 'Guardiana del Hogar', nivelMin: 11, desc: 'Santuario sagrado 9m radio, 1 hora. Aliados: resistencia a todo daño, no pueden ser forzados a salir. Atacantes: tirada SAB o Aturdidos 1 ronda. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'hefesto', nombre: 'Hefesto — Dios de la Forja',
    descripcion: 'Todo puede ser mejorado. Todo puede ser arreglado. El fuego obedece tu mano y el metal es tu arcilla.',
    bonificadores: { INT: 2, FUE: 1 }, sdBase: 11, salvacionAdicional: 'INT',
    entornos: [
      { tipo: 'Forjas, volcanes y zonas de fuego', mod: 3 },
      { tipo: 'Talleres e industrias', mod: 2 },
      { tipo: 'Zonas acuáticas o bajo el agua', mod: -3 },
      { tipo: 'Bosques y naturaleza salvaje', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Resistencia al Fuego', desc: 'Inmune al daño por fuego mundano (no mágico). Resistencia al daño por fuego mágico.' },
        { nombre: 'Mecánica Intuitiva', desc: 'Competencia con todas las herramientas de artesano. Al usarlas puedes añadir tu BC aunque ya lo incluyas.' },
      ],
      activos: [
        { nombre: 'Llama de Forja', costeSd: 2, nivelMin: 1, desc: 'Chorro de fuego de forja en línea recta 9m. Daño: 2d6+nivel fuego. Escala: +1d6 en niveles 5, 9, 13, 17.' },
        { nombre: 'Reparación', costeSd: 2, nivelMin: 1, desc: 'Restaurar objeto dañado como acción. Reparar armaduras en combate (+1d4 CA temporal) o restaurar objetos mágicos.' },
        { nombre: 'Autómata de Combate', costeSd: 5, nivelMin: 9, desc: 'Construir autómata metálico en 10 min. PG: nivel×3, CA 14, ataca (1d6+INT). Dura hasta siguiente descanso largo.' },
      ],
      apice: { nombre: 'La Gran Forja', nivelMin: 11, desc: 'En 1 hora: crear arma, armadura u objeto mágico excepcional desde materiales en bruto. Pierde propiedades mágicas tras 1 semana sin mantenimiento. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'afrodita', nombre: 'Afrodita — Diosa del Amor',
    descripcion: 'El amor es la fuerza más destructiva del universo. Y yo la controlo. La gente te mira dos veces. Siempre.',
    bonificadores: { CAR: 2, DES: 1 }, sdBase: 10, salvacionAdicional: 'CAR',
    entornos: [
      { tipo: 'Fiestas, banquetes y celebraciones', mod: 3 },
      { tipo: 'Zonas de lujo y belleza', mod: 2 },
      { tipo: 'Zona de guerra activa', mod: -2 },
      { tipo: 'Ruinas desoladas y pobreza extrema', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Presencia Irresistible', desc: '+1 a todas las tiradas de CAR. La CD para resistir tus encantos aumenta en +2.' },
        { nombre: 'Lectura del Corazón', desc: 'Ventaja en tiradas de Perspicacia.' },
      ],
      activos: [
        { nombre: 'Encanto Menor', costeSd: 2, nivelMin: 1, desc: 'Encantar humanoide visible (tirada SAB para resistir): te considera amigo cercano durante 1 hora.' },
        { nombre: 'Aura de Atracción', costeSd: 3, nivelMin: 1, desc: 'Enemigos en 4,5m tienen desventaja en ataques contra tus aliados durante 1 minuto.' },
        { nombre: 'Flecha de Eros', costeSd: 4, nivelMin: 7, desc: 'Objetivo que falle SAB se obsesiona con la siguiente criatura que vea. En combate: mueve hacia ella y usa acción en actividad no hostil. 1 minuto.' },
      ],
      apice: { nombre: 'Bendición de la Belleza', nivelMin: 11, desc: 'Aura de encanto divino 9m radio, 1 hora. Humanoides que fallen SAB no pueden atacar a tus aliados. Los que superen: desventaja. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'hermes', nombre: 'Hermes — Dios de los Viajeros',
    descripcion: 'Las reglas son para los que no pueden correr más rápido que las consecuencias. Siempre has sido más rápido que los demás.',
    bonificadores: { DES: 2, INT: 1 }, sdBase: 11, salvacionAdicional: 'DES',
    entornos: [
      { tipo: 'Mercados, caminos y cruces de carreteras', mod: 3 },
      { tipo: 'Ciudades cosmopolitas', mod: 2 },
      { tipo: 'Zonas cerradas o laberintos sin salida', mod: -2 },
      { tipo: 'Inframundo (sin permiso de Hades)', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Pies Alados', desc: '+3 metros a tu velocidad de movimiento. No provocas ataques de oportunidad al alejarte de enemigos.' },
        { nombre: 'Dedos Ágiles', desc: 'Siempre tienes competencia en Juego de Manos y Sigilo. Si ya tienes competencia, doble BC.' },
      ],
      activos: [
        { nombre: 'Mensaje Divino', costeSd: 2, nivelMin: 1, desc: 'Enviar mensaje mental de hasta 25 palabras a persona conocida, sin importar distancia.' },
        { nombre: 'Paso de Mercurio', costeSd: 3, nivelMin: 1, desc: 'Como acción adicional, teletransportarte hasta 9m a espacio visible y desocupado.' },
        { nombre: 'Ladrón de los Dioses', costeSd: 4, nivelMin: 7, desc: 'Tirada de Prestidigitación para robar objeto, conocimiento específico o 1d4 horas de memoria reciente a objetivo en contacto.' },
      ],
      apice: { nombre: 'Velocidad Divina', nivelMin: 11, desc: '1 minuto: velocidad se triplica, Paso de Mercurio sin coste SD ilimitado, +5 CA. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'dioniso', nombre: 'Dioniso — Dios del Vino',
    descripcion: 'El caos es solo el orden que todavía no entiendes. Ves el mundo de otra manera. Literalmente, a veces.',
    bonificadores: { CAR: 2, CON: 1 }, sdBase: 10, salvacionAdicional: 'CON',
    entornos: [
      { tipo: 'Festivales, celebraciones y bacanales', mod: 3 },
      { tipo: 'De noche en espacios abiertos', mod: 2 },
      { tipo: 'Zonas de estricto orden o templos de ley', mod: -2 },
      { tipo: 'Durante el día en entornos formales', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Resistencia a Venenos', desc: 'Inmune a efectos negativos del alcohol. Resistencia a venenos mundanos.' },
        { nombre: 'Caos Perceptivo', desc: 'Ventaja en tiradas de salvación contra ilusiones y efectos de confusión mental.' },
      ],
      activos: [
        { nombre: 'Éxtasis de Batalla', costeSd: 2, nivelMin: 1, desc: 'Como acción adicional, frenesí divino: +2 FUE y DES durante 1 minuto. Inmune al miedo pero no puedes retirarte.' },
        { nombre: 'Niebla de Locura', costeSd: 3, nivelMin: 1, desc: 'Objetivo visible tira SAB o queda Confundido 1 minuto (DO tira 1d4: 1-inmovilizado, 2-movimiento aleatorio, 3-ataca aliado más cercano, 4-normal).' },
        { nombre: 'Alucinación', costeSd: 4, nivelMin: 7, desc: 'Crear ilusión sensorial completa de hasta 9m³ durante 10 minutos. Los que fallen INT la creerán real.' },
      ],
      apice: { nombre: 'Festival Divino', nivelMin: 11, desc: 'Campo de caos puro 9m radio, 1 minuto. Enemigos: Confusión automática (sin tirada) + 2d6 daño psíquico/turno. 1 uso por descanso largo.' },
    },
  },
  {
    id: 'hades', nombre: 'Hades — Señor del Inframundo',
    descripcion: 'Todos llegan al final. Yo decido cuándo. La muerte no te asusta porque la entiendes.',
    bonificadores: { INT: 2, SAB: 1 }, sdBase: 12, salvacionAdicional: 'SAB',
    entornos: [
      { tipo: 'Cuevas, cementerios o el Inframundo', mod: 3 },
      { tipo: 'De noche o zonas de sombra intensa', mod: 2 },
      { tipo: 'Bajo luz solar directa', mod: -2 },
      { tipo: 'Zonas extremadamente luminosas', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Visión de la Muerte', desc: 'Percibes vagamente el tiempo de vida restante de criaturas cercanas. Ves sombras de los recién fallecidos.' },
        { nombre: 'Afinidad con las Sombras', desc: 'En oscuridad parcial o total, ventaja en tiradas de Sigilo y Percepción.' },
      ],
      activos: [
        { nombre: 'Sombras Vivientes', costeSd: 2, nivelMin: 1, desc: 'Manipular sombras en 9m: oscurecer área, agarrar objetivo (FUE para liberarse) o distraerlo (desventaja Percepción 1 min).' },
        { nombre: 'Toque de Muerte', costeSd: 3, nivelMin: 1, desc: 'Ataque de contacto. Daño: 2d8+nivel necrótico. Ignora resistencias de fuente no divina.' },
        { nombre: 'Portador del Olvido', costeSd: 4, nivelMin: 7, desc: 'Objetivo tira SAB o pierde los recuerdos de los últimos 1d4 horas. Se restauran tras 24 horas.' },
      ],
      apice: { nombre: 'Grieta al Inframundo', nivelMin: 11, desc: 'Abrir grieta dimensional al Inframundo. Escapar a zona segura, perseguir enemigo derrotado, o invocar 1d4 espíritus guerreros (1 hora). 1 uso por descanso largo.' },
    },
  },
  {
    id: 'hecate', nombre: 'Hécate — Diosa de la Magia',
    descripcion: 'La magia no tiene dueño. Solo tiene consecuencias. Donde termina el conocimiento de los demás es donde empieza el tuyo.',
    bonificadores: { INT: 2, SAB: 1 }, sdBase: 14, salvacionAdicional: 'INT',
    entornos: [
      { tipo: 'Encrucijadas y cruces de caminos', mod: 3 },
      { tipo: 'De noche y lugares de poder mágico', mod: 2 },
      { tipo: 'Zonas de antimagia o magia nula', mod: -3 },
      { tipo: 'Templos de dioses solares', mod: -1 },
    ],
    poderes: {
      pasivos: [
        { nombre: 'Visión Arcana', desc: 'Ves auras mágicas en todo momento. Detectas objetos mágicos y criaturas invisibles a 9m con una acción.' },
        { nombre: 'Magia de Encrucijada', desc: 'En cualquier cruce de caminos o encrucijada, ventaja en todas las tiradas de INT y SAB.' },
      ],
      activos: [
        { nombre: 'Magia Innata', costeSd: 2, nivelMin: 1, desc: 'Lanzar un hechizo de nivel 1 de la lista del Mago sin grimorio ni preparación.' },
        { nombre: 'Barrera de Encrucijada', costeSd: 3, nivelMin: 1, desc: 'En encrucijada: muro de energía 3m alto × 6m ancho. Cruzarlo: 2d8 de fuerza. Dura 1 minuto (PG: 30+nivel×5).' },
        { nombre: 'Transformación Menor', costeSd: 4, nivelMin: 7, desc: 'Objetivo que falle SAB: se transforma en animal pequeño no peligroso durante 1 minuto. No puede lanzar hechizos ni usar poderes.' },
      ],
      apice: { nombre: 'Trío de Hécate', nivelMin: 11, desc: 'Proyectar 2 copias ilusorias idénticas. Pueden atacar (1d6+INT, 1 PG). Enemigos necesitan acción para identificar cuál eres real (tirada INT). 1 minuto. 1 uso por descanso largo.' },
    },
  },
]
