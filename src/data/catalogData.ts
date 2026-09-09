import { EquipmentItem } from '../types';

// High-resolution local visual assets generated for NUEVO AUDIO
import techoTrussImg from '../assets/images/techo_truss_stage_1788365593963.jpg';
import tarimaImg from '../assets/images/tarima_modular_stage_1788365611288.jpg';
import sonidoLineArrayImg from '../assets/images/sonido_line_array_1788365635373.jpg';
import pantallaLedImg from '../assets/images/pantalla_led_gigante_1788365655512.jpg';
import plantaElectricaImg from '../assets/images/planta_electrica_pro_1788365673708.jpg';
import transmisionStreamingImg from '../assets/images/transmision_streaming_live_1788365689069.jpg';
import puenteTrussImg from '../assets/images/puente_truss_luces_1788365707192.jpg';

export const COMPANY_INFO = {
  name: 'NUEVO AUDIO',
  tagline: 'Producción Audiovisual de Alto Impacto',
  heroStatement:
    'SOMOS UNA EMPRESA CON AÑOS DE EXPERIENCIA EN EL MUNDO AUDIO VISUAL, EXPERTOS EN TODO TIPO DE EVENTOS, E ILUMINACIÓN.',
  phone: '+58 412-0000000',
  whatsappNumber: '584120000000',
  email: 'contacto@nuevoaudio.com',
  city: 'Valencia / Caracas / Cobertura Nacional',
  address: 'Zona Industrial y Cobertura Nacional para Eventos',
  experienceYears: '12+',
  eventsCompleted: '1,500+',
  satisfactionRate: '100%',
};

export const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'Todo el Catálogo', icon: 'Sparkles' },
  { id: 'tarimas', label: 'Tarimas y Escenarios', icon: 'Layers' },
  { id: 'truss', label: 'Estructuras & Techos Truss', icon: 'Grid' },
  { id: 'sonido', label: 'Sonido Móvil', icon: 'Volume2' },
  { id: 'iluminacion', label: 'Cabezales Móviles', icon: 'Sun' },
  { id: 'robot-led', label: 'Show Robot LED', icon: 'Bot' },
  { id: 'pantallas', label: 'Pantallas LED', icon: 'Tv' },
  { id: 'energia', label: 'Alquiler de Plantas Eléctricas', icon: 'Zap' },
  { id: 'efectos', label: 'Efectos Especiales', icon: 'Flame' },
];

export const CATALOG_ITEMS: EquipmentItem[] = [
  {
    id: 'tarima-modular-pro',
    name: 'Tarima Modular y Escenarios',
    category: 'tarimas',
    tagline: 'Módulos resistentes con acabado antideslizante',
    description:
      'Escenarios y tarimas modulares configurables en múltiples dimensiones para cualquier tipo de evento.',
    image: '/TARIMA.jpg',
    fallbackImage: '/TARIMA.jpg',
    features: [
      'Módulos resistentes con superficie antiresbalante',
      'Faldón perimetral de tela negra incluido',
      'Montaje rápido y seguro adaptado a tu espacio',
    ],
    specs: [],
    idealFor: ['Conciertos', 'Eventos Corporativos', 'Festivales', 'Bodas y Galas'],
    badge: 'Seguridad Certificada',
    popular: true,
  },
  {
    id: 'escenario-conciertos-pro',
    name: 'Escenarios para Conciertos y Eventos Masivos',
    category: 'tarimas',
    tagline: 'Montajes de gran escala para bandas en vivo y festivales',
    description:
      'Montaje completo de tarimas y escenarios para eventos masivos, con alas laterales de sonido y acceso seguro para artistas.',
    image: '/TRANSMISIONENVIVO.jpg',
    fallbackImage: '/TRANSMISIONENVIVO.jpg',
    features: [
      'Montajes en diferentes tamaños y superficies útiles',
      'Estructura firme y segura para shows en vivo',
      'Espacio lateral para sistemas de sonido y acceso cómodo',
    ],
    specs: [],
    idealFor: ['Festivales Musicales', 'Conciertos Masivos', 'Graduaciones', 'Giras'],
    badge: 'Gran Formato',
    popular: true,
  },
  {
    id: 'vallas-seguridad-pasamanos',
    name: 'Vallas de Seguridad y Pasamanos',
    category: 'tarimas',
    tagline: 'Control perimetral y acceso seguro para el público',
    description:
      'Vallas de contención perimetral y pasamanos para delimitar zonas VIP, pasillos de artistas y consolas de sonido.',
    image: '/VALLASDESEGURIDAD.jpg',
    fallbackImage: '/VALLASDESEGURIDAD.jpg',
    features: [
      'Vallas de alta resistencia para control de público',
      'Pasamanos dobles con anclaje firme',
      'Delimitación clara y organizada para tu evento',
    ],
    specs: [],
    idealFor: ['Front Stage', 'Control de Acceso', 'Zona de Consola', 'Pasillos VIP'],
  },
  {
    id: 'techo-truss-10x10',
    name: 'Techo Truss 10x10 con Lona Negra',
    category: 'truss',
    tagline: 'Estructura monumental 10x10m con cobertura total para exteriores',
    description:
      'Estructura de techo profesional en Truss de aluminio de 10 x 10 metros con lona negra impermeable. Protege el escenario y sostiene sonido, luces y pantallas.',
    image: '/LONA.jpg',
    fallbackImage: '/LONA.jpg',
    features: [
      'Medida de 10 x 10 metros con cobertura de lona negra',
      'Protección contra sol y lluvia para escenarios al aire libre',
      'Soporte seguro para colgado de luces, pantallas y sonido',
    ],
    specs: [],
    idealFor: ['Festivales al aire libre', 'Conciertos masivos', 'Grandes ferias', 'Eventos masivos'],
    badge: 'Destacado Principal',
    popular: true,
  },
  {
    id: 'lona-cubierta-truss',
    name: 'Lona Negra de Alta Densidad para Techos',
    category: 'truss',
    tagline: 'Protección climática 100% impermeable',
    description:
      'Lonas vinílicas negras impermeables para estructuras truss, protegiendo del sol, la lluvia y brindando un acabado estético profesional.',
    image: '/CONCIERTOS.jpg',
    fallbackImage: '/CONCIERTOS.jpg',
    features: [
      'Material impermeable que protege del sol y la lluvia',
      'Acabado negro sobrio y elegante para el escenario',
      'Amarre firme y seguro a las estructuras',
    ],
    specs: [],
    idealFor: ['Techos Truss', 'Fondos de Escenario', 'Túneles de Acceso'],
  },
  {
    id: 'puente-truss-estructuras',
    name: 'Estructuras y Puentes Truss para Luces',
    category: 'truss',
    tagline: 'Estructuras de elevación frontal y perimetral',
    description:
      'Estructuras y puentes truss modulares de aluminio para colgar luces robóticas, pantallas y proyectores en eventos abiertos o cerrados.',
    image: '/ESTRUCTURAS.jpg',
    fallbackImage: '/ESTRUCTURAS.jpg',
    features: [
      'Estructuras de aluminio seguras y modulares',
      'Elevación para luces y efectos especiales',
      'Adaptables a diferentes dimensiones de salones o pistas',
    ],
    specs: [],
    idealFor: ['Discotecas móviles', 'Tarimas intermedias', 'Bodas y Quinceaños', 'Expos'],
  },
  {
    id: 'sonido-movil-monitores',
    name: 'Sonido Móvil',
    category: 'sonido',
    tagline: 'Camión informativo y sonido móvil para máxima difusión',
    description:
      'Camión informativo equipado con sistema de sonido de alta potencia. Su función es recorrer las calles y llevar a cada rincón la información de eventos, conciertos, inauguraciones de locales y activaciones comerciales.',
    image: '/SONIDOSMOVIL2.jpg',
    fallbackImage: '/SONIDOSMOVIL2.jpg',
    features: [
      'Camión informativo con sistema de audio de largo alcance',
      'Lleva a cada rincón la información de eventos, conciertos e inauguraciones de locales',
      'Rutas programadas de perifoneo y publicidad móvil efectiva',
      'Operador técnico y chofer calificado para todo el recorrido',
    ],
    specs: [],
    idealFor: [
      'Inauguraciones de Locales',
      'Conciertos y Festivales',
      'Publicidad y Perifoneo',
      'Eventos y Activaciones Comerciales',
    ],
    popular: true,
  },
  {
    id: 'cabezales-moviles-pro',
    name: 'Cabezales Móviles Beam & Wash',
    category: 'iluminacion',
    tagline: 'Iluminación inteligente y efectos de luces en movimiento',
    description:
      'Cabezales móviles y luces robóticas con haces de luz, cambios de color y efectos dinámicos para ambientar conciertos, bodas y pistas de baile.',
    image: '/ROBOTLED.jpg',
    fallbackImage: '/ROBOTLED.jpg',
    features: [
      'Haces de luz potentes con amplia variedad de colores y figuras',
      'Efectos dinámicos sincronizados al ritmo de la música',
      'Ideal para iluminar tarimas, fondos y pistas de baile',
    ],
    specs: [],
    idealFor: ['Shows en Vivo', 'Discotecas & DJ Sets', 'Bodas de Gala', 'Graduaciones'],
    badge: 'Impacto Visual',
    popular: true,
  },
  {
    id: 'show-robot-led',
    name: 'Show de Robot LED',
    category: 'robot-led',
    tagline: 'Animación interactiva y show de luces para tu fiesta',
    description:
      'Espectáculo con Robot LED y efectos de iluminación para prender la hora loca y animar a todos tus invitados en la pista de baile.',
    image: '/ROBOTLED.jpg',
    fallbackImage: '/ROBOTLED.jpg',
    features: [
      'Robot LED con vestuario de luces multicolores',
      'Animación interactiva en pista de baile para hora loca',
      'Efectos visuales y diversión garantizada para todos tus invitados',
    ],
    specs: [],
    idealFor: ['Hora Loca', 'Bodas', 'Quinceaños', 'Graduaciones', 'Festivales'],
    badge: 'Animación Top',
    popular: true,
  },
  {
    id: 'videoconferencias-corporativas',
    name: 'Videoconferencias & Salas Híbridas',
    category: 'pantallas',
    tagline: 'Audio y video profesional para reuniones y asambleas',
    description:
      'Servicio de audio, video y pantallas para que tus reuniones de empresa o asambleas por Zoom o Teams se transmitan de forma clara, sencilla y sin interrupciones.',
    image: '/VIDEOONFERENCIAS.jpg',
    fallbackImage: '/VIDEOONFERENCIAS.jpg',
    features: [
      'Microfonía clara y nítida para cada participante',
      'Conexión rápida con Zoom, Microsoft Teams o cualquier plataforma',
      'Pantallas y monitores para visualización de presentaciones',
    ],
    specs: [],
    idealFor: ['Reuniones Empresariales', 'Asambleas', 'Conferencias', 'Cursos Virtuales'],
  },
  {
    id: 'pantallas-led-gigantes',
    name: 'Pantallas LED (Indoor & Outdoor)',
    category: 'pantallas',
    tagline: 'Módulos LED de alta definición y máxima luminosidad',
    description:
      'Pantallas LED de alta calidad para fondos de tarima, proyección de videos, transmisiones en vivo y publicidad en eventos cerrados o al aire libre.',
    image: '/PANTALLA.jpg',
    fallbackImage: '/PANTALLA.jpg',
    features: [
      'Imagen de alta calidad y brillo visible de día y de noche',
      'Tamaños adaptables al espacio de tu evento',
      'Conexión directa a computadoras y cámaras de video',
    ],
    specs: [],
    idealFor: ['Fondos de Escenario', 'Eventos Corporativos', 'Festivales', 'Bodas'],
    badge: 'Alta Definición',
    popular: true,
  },
  {
    id: 'planta-electrica-generador',
    name: 'Alquiler de Plantas Eléctricas',
    category: 'energia',
    tagline: 'Energía eléctrica continua para que tu evento nunca se detenga',
    description:
      'Generadores eléctricos silenciosos para suministrar corriente continua y segura a todo el sonido, pantallas e iluminación de tu evento, sin importar si no hay electricidad en el lugar.',
    image: '/PLANTAELECTRICA.jpg',
    fallbackImage: '/PLANTAELECTRICA.jpg',
    features: [
      'Generador insonorizado que no genera ruido molesto',
      'Energía protegida y estable para todos los equipos',
      'Operador técnico y combustible incluido durante todo el evento',
    ],
    specs: [],
    idealFor: ['Eventos al aire libre', 'Fincas y Jardines', 'Bodas', 'Festivales y Ferias'],
    badge: 'Energía Segura',
    popular: true,
  },
  {
    id: 'efectos-especiales-sparkular-humo',
    name: 'Efectos Especiales: Confeti y Humo Bajo',
    category: 'efectos',
    tagline: 'Momentos inolvidables con cañones de confeti y humo bajo',
    description:
      'Efectos especiales para tu evento con cañones de confeti y humo bajo para el vals de bodas o momentos cumbre.',
    image: '/EfectosEspeciales.jpg',
    fallbackImage: '/EfectosEspeciales.jpg',
    features: [
      'Cañones de confeti para el momento cumbre del show',
      'Humo bajo tipo nube para el vals de novios o quinceañeras',
    ],
    specs: [],
    idealFor: ['Entradas de Bodas', 'Quinceaños', 'Clímax de Conciertos', 'Lanzamientos'],
    badge: 'Magia Visual',
    popular: true,
  },
  {
    id: 'maquina-espuma-efectos',
    name: 'Máquinas de Espuma y Efectos de Fiesta',
    category: 'efectos',
    tagline: 'Diversión masiva con espuma no tóxica y segura',
    description:
      'Cañones de espuma para fiestas en piscina, festivales playeros y celebraciones. Espuma segura que no irrita los ojos ni mancha la ropa.',
    image: '/MAQUINADEESPUMA2.jpg',
    fallbackImage: '/MAQUINADEESPUMA2.jpg',
    features: [
      'Chorro continuo de espuma densa y divertida',
      'Líquido seguro, hipoalergénico que no irrita los ojos',
      'Operador incluido con instalación segura',
    ],
    specs: [],
    idealFor: ['Pool Parties', 'Festivales Playeros', 'Fiestas Juveniles', 'Colegios'],
  },
];

export const AVAILABLE_PUBLIC_IMAGES = [
  { label: 'TARIMA.jpg (Tarima Modular y Escenarios)', path: '/TARIMA.jpg' },
  { label: 'TRANSMISIONENVIVO.jpg (Escenarios Conciertos y Masivos)', path: '/TRANSMISIONENVIVO.jpg' },
  { label: 'VALLASDESEGURIDAD.jpg (Vallas de Seguridad y Pasamanos)', path: '/VALLASDESEGURIDAD.jpg' },
  { label: 'LONA.jpg (Techo Truss 10x10 con Lona Negra)', path: '/LONA.jpg' },
  { label: 'CONCIERTOS.jpg (Lona Negra Alta Densidad)', path: '/CONCIERTOS.jpg' },
  { label: 'ESTRUCTURAS.jpg (Estructuras y Puentes Truss)', path: '/ESTRUCTURAS.jpg' },
  { label: 'SONIDOSMOVIL2.jpg (Sonido Móvil)', path: '/SONIDOSMOVIL2.jpg' },
  { label: 'VIDEOONFERENCIAS.jpg (Videoconferencias & Salas Híbridas)', path: '/VIDEOONFERENCIAS.jpg' },
  { label: 'PANTALLA.jpg (Pantallas LED)', path: '/PANTALLA.jpg' },
  { label: 'PLANTAELECTRICA.jpg (Alquiler de Plantas Eléctricas)', path: '/PLANTAELECTRICA.jpg' },
  { label: 'ROBOTLED.jpg (Cabezales Móviles Beam & Wash)', path: '/ROBOTLED.jpg' },
  { label: 'ROBOTLED.jpg (Show de Robot LED)', path: '/ROBOTLED.jpg' },
  { label: 'EfectosEspeciales.jpg (Efectos Especiales Confeti / Humo)', path: '/EfectosEspeciales.jpg' },
  { label: 'MAQUINADEESPUMA2.jpg (Máquinas de Espuma)', path: '/MAQUINADEESPUMA2.jpg' },
];
