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
    'SOMOS UNA EMPRESA CON AÑOS DE EXPERIENCIA EN EL MUNDO AUDIO VISUAL, EXPERTOS EN TODO TIPO DE EVENTOS, E ILUMINACIÓN, ESTRUCTURAS TRUS, TECHO, PANTALLAS. SONIDO, PLANTA ELECTRICA, EFECTOS ESPECIALES.',
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
  { id: 'sonido', label: 'Sonido & Monitores', icon: 'Volume2' },
  { id: 'iluminacion', label: 'Cabezales & Iluminación', icon: 'Sun' },
  { id: 'pantallas', label: 'Pantallas LED', icon: 'Tv' },
  { id: 'efectos', label: 'Efectos Especiales', icon: 'Flame' },
  { id: 'energia', label: 'Planta Eléctrica', icon: 'Zap' },
];

export const CATALOG_ITEMS: EquipmentItem[] = [
  {
    id: 'tarima-modular-pro',
    name: 'Tarima Modular y Escenarios',
    category: 'tarimas',
    tagline: 'Módulos de alta resistencia con acabado antideslizante',
    description:
      'Escenarios y tarimas modulares configurables en múltiples alturas y dimensiones. Fabricadas con perfilería de aluminio de alta resistencia y tablero fenólico antideslizante hidrófugo.',
    image: '/TARIMA.jpg',
    fallbackImage: '/TARIMA.jpg',
    features: [
      'Capacidad de carga de 750 kg/m² certificada',
      'Patas telescópicas ajustables de 40 cm a 1.50 m',
      'Faldón perimetral de tela negra ignífuga incluido',
      'Montaje rápido, seguro y nivelación milimétrica',
    ],
    specs: [
      { label: 'Dimensiones modulares', value: '2.00m x 1.00m por módulo' },
      { label: 'Superficie', value: 'Fenólico texturizado antideslizante' },
      { label: 'Capacidad de Carga', value: '750 kg / m²' },
      { label: 'Alturas disponibles', value: '40cm, 60cm, 80cm, 1.00m, 1.20m' },
    ],
    idealFor: ['Conciertos', 'Eventos Corporativos', 'Festivales', 'Bodas y Galas'],
    badge: 'Seguridad Certificada',
    popular: true,
  },
  {
    id: 'escenario-conciertos-pro',
    name: 'Escenarios para Conciertos y Eventos Masivos',
    category: 'tarimas',
    tagline: 'Grandes montajes para bandas en vivo, festivales y tarimas VIP',
    description:
      'Montaje integral de escenarios completos con tarima modular reforzada, frentes acústicos, alas laterales para sonido (alas de audio) y rampas de carga para instrumentos pesados.',
    image: '/TRANSMISIONENVIVO.jpg',
    fallbackImage: '/TRANSMISIONENVIVO.jpg',
    features: [
      'Configuraciones desde 6x4m hasta 14x10m de superficie útil',
      'Estructura de soporte antisísmica con trabas de seguridad',
      'Alas laterales para Line Array y torres de delay',
      'Rampas de acceso y escaleras duales para staff y artistas',
    ],
    specs: [
      { label: 'Áreas típicas', value: '24m², 48m², 80m², 120m²' },
      { label: 'Acabado perimetral', value: 'Encarpado negro mate profesional' },
      { label: 'Nivelación', value: 'Gatos mecánicos para suelos irregulares' },
      { label: 'Tiempo de montaje', value: 'Optimizado por cuadrilla certificada' },
    ],
    idealFor: ['Festivales Musicales', 'Conciertos Masivos', 'Graduaciones', 'Giras'],
    badge: 'Gran Formato',
    popular: true,
  },
  {
    id: 'vallas-seguridad-pasamanos',
    name: 'Vallas de Seguridad y Pasamanos',
    category: 'tarimas',
    tagline: 'Control perimetral y acceso seguro y normativo para el público',
    description:
      'Vallas de contención perimetral tipo Mojo y pasamanos bilaterales de aluminio reforzado. Diseñadas para aislar consolas de sonido, pasillos de artistas y delimitar áreas VIP.',
    image: '/VALLASDESEGURIDAD.jpg',
    fallbackImage: '/VALLASDESEGURIDAD.jpg',
    features: [
      'Vallas antiavalancha de alta resistencia con escalón para seguridad',
      'Pasamanos dobles desmontables con anclaje de alta fijación',
      'Peldaños con huella antiresbalante para tarimas',
      'Cumplimiento de estándares de seguridad y protección civil',
    ],
    specs: [
      { label: 'Material', value: 'Aluminio estructural 6082-T6 y acero zincado' },
      { label: 'Dimensiones valla', value: '1.00m ancho x 1.20m alto por sección' },
      { label: 'Sistema de unión', value: 'Pasadores rápidos autoblocantes' },
      { label: 'Plegables', value: 'Fácil transporte y despliegue rápido' },
    ],
    idealFor: ['Front Stage', 'Control de Acceso', 'Zona de Consola FOH', 'Pasillos VIP'],
  },
  {
    id: 'techo-truss-10x10',
    name: 'Techo Truss 10x10 con Lona Negra',
    category: 'truss',
    tagline: 'Estructura monumental 10x10m con cobertura total para exteriores',
    description:
      'Estructura de techo profesional en Truss de aluminio de 10 x 10 metros, con lona negra impermeable ignífuga de alta densidad. Diseñada para proteger escenarios principales y suspender grandes arreglos de sonido Line Array, iluminación y pantallas LED.',
    image: '/LONA.jpg',
    fallbackImage: '/LONA.jpg',
    features: [
      'Medida monumental 10 x 10 metros con lona negra premium',
      'Sistema de elevación Ground Support con motores/malacates certificados',
      'Lona 100% impermeable, resistente a rayos UV y viento',
      'Capacidad de carga superior para colgado de audio e iluminación pesada',
    ],
    specs: [
      { label: 'Medidas', value: '10.00m x 10.00m de cobertura' },
      { label: 'Perfil Truss', value: 'Aluminio Cuadrado 30x30 / 40x40 cm' },
      { label: 'Cubierta', value: 'Lona vinílica negra de alta densidad' },
      { label: 'Altura libre', value: 'Hasta 7.50 metros de elevación' },
    ],
    idealFor: ['Festivales al aire libre', 'Conciertos masivos', 'Grandes ferias', 'Eventos de gran formato'],
    badge: 'Destacado Principal',
    popular: true,
  },
  {
    id: 'lona-cubierta-truss',
    name: 'Lona Negra de Alta Densidad para Techos',
    category: 'truss',
    tagline: 'Protección climática 100% impermeable e ignífuga',
    description:
      'Lonas vinílicas negras especialmente confeccionadas para estructuras truss, con tratamiento anti-UV, faldones laterales para lluvia y sistema de amarre de alta tensión mediante ojales y pulpos elásticos.',
    image: '/CONCIERTOS.jpg',
    fallbackImage: '/CONCIERTOS.jpg',
    features: [
      'Material PVC blackout que no deja pasar luz ni calor',
      'Costuras termoselladas con doble refuerzo perimetral',
      'Paredes laterales traseras y laterales (Backdrop / Sidewalls)',
      'Resistencia probada ante lluvias torrenciales y ráfagas de viento',
    ],
    specs: [
      { label: 'Gramaje', value: '650 g/m² PVC blackout multicapa' },
      { label: 'Certificación', value: 'Ignífugo norma M2 / B1' },
      { label: 'Compatibilidad', value: 'Techos 6x4m, 8x6m, 10x10m y 12x10m' },
      { label: 'Color', value: 'Negro mate antirreflejo para shows' },
    ],
    idealFor: ['Techos Truss', 'Fondos de Escenario', 'Túneles de Acceso'],
  },
  {
    id: 'puente-truss-estructuras',
    name: 'Estructuras y Puentes Truss para Luces',
    category: 'truss',
    tagline: 'Estructuras de elevación frontal, trasera y jaulas perimetrales',
    description:
      'Estructuras truss modulares en aluminio estructural de alta resistencia, ideales para colgar cabezales móviles, barras LED, proyectores y arreglos de sonido en eventos cerrados o abiertos.',
    image: '/ESTRUCTURAS.jpg',
    fallbackImage: '/ESTRUCTURAS.jpg',
    features: [
      'Estructura cuadrada de 30x30 cm con acople rápido cónico',
      'Torres elevadoras tipo malacate / Ground Support de hasta 6 metros',
      'Configuraciones en portería, puente doble o jaula perimetral',
      'Distribución de cables y energía integrada y oculta',
    ],
    specs: [
      { label: 'Longitudes', value: 'Desde 4m hasta 16m de vano continuo' },
      { label: 'Capacidad puntual', value: 'Hasta 400 kg en centro' },
      { label: 'Torres', value: 'Mástiles con bloqueo de seguridad' },
      { label: 'Aleación', value: 'Aluminio aeroespacial 6082-T6' },
    ],
    idealFor: ['Discotecas móviles', 'Tarimas intermedias', 'Bodas y Quinceaños', 'Expos'],
  },
  {
    id: 'sonido-movil-monitores',
    name: 'Sonido Móvil & Monitores de Escenario',
    category: 'sonido',
    tagline: 'Monitoreo de alta fidelidad, claridad y sonido versátil',
    description:
      'Sistemas de sonido móvil para eventos sociales y corporativos, junto a sistemas de monitoreo de piso bi-amplificados e In-Ear inalámbricos para bandas y conferencistas.',
    image: '/SONIDOSMOVIL2.jpg',
    fallbackImage: '/SONIDOSMOVIL2.jpg',
    features: [
      'Monitores de cuña de piso 12" y 15" con drivers de neodimio',
      'Sistemas inalámbricos In-Ear con auriculares aislantes de doble vía',
      'Mezclas independientes personalizadas para cada músico',
      'Procesamiento DSP digital anti-acople integrado',
    ],
    specs: [
      { label: 'Potencia RMS', value: '800W - 1200W por monitor' },
      { label: 'Respuesta de Frecuencia', value: '55 Hz - 20 kHz' },
      { label: 'Ángulo de dispersión', value: '60° x 40° asimétrico' },
      { label: 'Conectividad', value: 'XLR balanceado / UHF inalámbrico' },
    ],
    idealFor: ['Bandas en Vivo', 'Orquestas', 'Pastores / Conferencistas', 'Solistas'],
    popular: true,
  },
  {
    id: 'cabezales-moviles-robot-led',
    name: 'Cabezales Móviles & Show Robot LED',
    category: 'iluminacion',
    tagline: 'Show de luces robóticas sincronizadas DMX, prismas y animación LED',
    description:
      'Cabezales móviles de haz concentrado (Beam 7R / 230W) y wash LED con mezcla de color RGBW, complementados con shows interactivos de Robot LED para máxima animación de eventos.',
    image: '/ROBOTLED.jpg',
    fallbackImage: '/ROBOTLED.jpg',
    features: [
      'Haces de luz de alta intensidad con rueda de 14 colores y 17 gobos',
      'Prisma rotativo circular de 8 y 16 caras con efectos 3D',
      'Consola de control DMX / Avolites con shows programados al ritmo de la música',
      'Show de Robot LED interactivo con cañón de confeti/CO2 para hora loca',
    ],
    specs: [
      { label: 'Tipo de Lámpara', value: 'Beam 230W 7R / Wash LED 36x10W RGBW' },
      { label: 'Protocolo de Control', value: 'DMX512 / Art-Net / RDM' },
      { label: 'Canales DMX', value: '16 / 20 canales por unidad' },
      { label: 'Alcance Lumínico', value: 'Haces visibles a más de 300 metros' },
    ],
    idealFor: ['Shows en Vivo', 'Discotecas & DJ Sets', 'Bodas de Gala', 'Horas Locas'],
    badge: 'Impacto Visual',
    popular: true,
  },
  {
    id: 'videoconferencias-corporativas',
    name: 'Videoconferencias & Salas Híbridas',
    category: 'pantallas',
    tagline: 'Audio cristalino y video corporativo para asambleas y reuniones Zoom/Teams',
    description:
      'Soluciones audiovisuales integrales para salas de conferencias, asambleas de accionistas y simposios médicos. Microfonía de cuello de ganso, pantallas de retorno y conexión directa a plataformas virtuales.',
    image: '/VIDEOONFERENCIAS.jpg',
    fallbackImage: '/VIDEOONFERENCIAS.jpg',
    features: [
      'Microfonía de mesa delegados con botón de habla y cancelación de eco',
      'Integración nativa con Zoom Rooms, Microsoft Teams y Webex',
      'Monitores de retorno en podio para visualización de diapositivas',
      'Grabación en audio y video con actas digitales de la sesión',
    ],
    specs: [
      { label: 'Microfonía', value: 'Inalámbrica digital con encriptación AES-256' },
      { label: 'DSP de Sala', value: 'Supresor automático de feedback acústico' },
      { label: 'Captura', value: 'Cámaras PTZ con seguimiento por voz' },
      { label: 'Capacidad', value: 'Desde 10 hasta 500 participantes' },
    ],
    idealFor: ['Asambleas', 'Simposios', 'Ruedas de Prensa', 'Cursos Híbridos'],
  },
  {
    id: 'pantallas-led-gigantes',
    name: 'Pantallas Gigantes LED (Indoor & Outdoor)',
    category: 'pantallas',
    tagline: 'Módulos LED de alta luminosidad y pitch ultrafino P2.9 y P3.9',
    description:
      'Pantallas gigantes modulares de tecnología LED de alto refresco (3840Hz), ideales para fondos de escenario, visuales dinámicos, transmisión de video en vivo y publicidad.',
    image: '/PANTALLA.jpg',
    fallbackImage: '/PANTALLA.jpg',
    features: [
      'Brillo superior de hasta 5,000 nits para visibilidad total bajo luz solar',
      'Gabinetes ligeros de aluminio de 50x50 cm y 50x100 cm para rápida instalación',
      'Procesadores de video NovaStar con entradas HDMI, SDI y escalador 4K',
      'Configuraciones rectas, curvas o en tótems independientes',
    ],
    specs: [
      { label: 'Pixel Pitch', value: 'P2.9 mm (Interior) / P3.9 mm (Exterior IP65)' },
      { label: 'Frecuencia de Refresco', value: '3,840 Hz (anti-parpadeo en cámara)' },
      { label: 'Formatos Típicos', value: '3x2m, 4x3m, 6x3.5m, 8x4m o a medida' },
      { label: 'Ángulo de Visión', value: '160° Horizontal / 140° Vertical' },
    ],
    idealFor: ['Fondos de Escenario', 'Eventos Corporativos', 'Festivales', 'Deportivos'],
    badge: 'Alto Brillo',
    popular: true,
  },
  {
    id: 'planta-electrica-generador',
    name: 'Planta Eléctrica Insonorizada',
    category: 'energia',
    tagline: 'Energía continua y blindada para que el show nunca se detenga',
    description:
      'Generadores eléctricos diésel insonorizados de alta capacidad con tableros de transferencia y distribución eléctrica trifásica profesional. Garantiza estabilidad total sin caídas de tensión.',
    image: '/PLANTAELECTRICA.jpg',
    fallbackImage: '/PLANTAELECTRICA.jpg',
    features: [
      'Cabinada súper insonorizada (bajísimo nivel de ruido en decibeles)',
      'Tableros de distribución con breakers independientes y conectores Camlock',
      'Operador técnico y combustible incluido durante todo el evento',
      'Regulación electrónica de voltaje (AVR) para proteger equipos digitales',
    ],
    specs: [
      { label: 'Capacidades', value: '30 kVA, 60 kVA, 100 kVA y 150 kVA' },
      { label: 'Voltajes', value: '110V / 220V Trifásico y Monofásico' },
      { label: 'Autonomía', value: '10 a 14 horas continuas con tanque lleno' },
      { label: 'Insonorización', value: '< 68 dB a 7 metros' },
    ],
    idealFor: ['Cualquier evento sin toma eléctrica segura', 'Festivales', 'Bodas en fincas'],
    badge: 'Cero Riesgos',
    popular: true,
  },
  {
    id: 'efectos-especiales-sparkular-humo',
    name: 'Efectos Especiales: Confeti, Humo y Chispas Frías',
    category: 'efectos',
    tagline: 'Momentos inolvidables con cañones de confeti, chispas frías y humo bajo',
    description:
      'Pack de efectos especiales sin pólvora ni peligro. Máquinas de confeti continuo, chispas frías Sparkular (no queman ni generan humo tóxico) y máquinas de humo bajo criogénico para efecto nube.',
    image: '/EfectosEspeciales.jpg',
    fallbackImage: '/EfectosEspeciales.jpg',
    features: [
      'Cañones de confeti continuo y serpentinas de impacto masivo',
      'Chispa fría 100% segura para interiores, sin riesgo de quemadura',
      'Humo bajo (efecto bailar sobre las nubes para vals o bodas)',
      'Jets de CO2 con disparos verticales de impacto rítmico',
    ],
    specs: [
      { label: 'Lanzamiento confeti', value: 'Hasta 12 metros de altura y cobertura total' },
      { label: 'Altura de Chispas', value: 'Ajustable de 1.5m a 5.0m por DMX' },
      { label: 'Seguridad', value: 'Certificación CE y apto para hoteles/salones' },
      { label: 'Consumibles', value: 'Papel metalizado ignífugo / Polvo de titanio' },
    ],
    idealFor: ['Entradas de Bodas', 'Quinceaños', 'Clímax de Conciertos', 'Lanzamientos'],
    badge: 'Magia Visual',
    popular: true,
  },
  {
    id: 'maquina-espuma-efectos',
    name: 'Máquinas de Espuma y Efectos de Fiesta',
    category: 'efectos',
    tagline: 'Diversión masiva con espuma no tóxica, hipoalergénica y de secado rápido',
    description:
      'Cañones de espuma de gran caudal para fiestas en piscina, festivales playeros, eventos infantiles y celebraciones juveniles. Espuma 100% segura que no irrita los ojos ni mancha la ropa.',
    image: '/MAQUINADEESPUMA2.jpg',
    fallbackImage: '/MAQUINADEESPUMA2.jpg',
    features: [
      'Generación continua de espuma densa hasta 6 metros de distancia',
      'Líquido espumógeno dermatológicamente probado y neutro',
      'Operador calificado con instalación eléctrica protegida',
      'Ideal para eventos diurnos y fiestas temáticas',
    ],
    specs: [
      { label: 'Rendimiento', value: 'Hasta 50 m³ de espuma por minuto' },
      { label: 'Fórmula', value: 'Biodegradable, hipoalergénica y pH neutro' },
      { label: 'Alimentación', value: '110V con toma de agua estándar' },
      { label: 'Alcance del chorro', value: '4 a 8 metros de proyección' },
    ],
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
  { label: 'SONIDOSMOVIL2.jpg (Sonido Móvil & Monitores)', path: '/SONIDOSMOVIL2.jpg' },
  { label: 'VIDEOONFERENCIAS.jpg (Videoconferencias & Salas Híbridas)', path: '/VIDEOONFERENCIAS.jpg' },
  { label: 'PANTALLA.jpg (Pantallas Gigantes LED)', path: '/PANTALLA.jpg' },
  { label: 'PLANTAELECTRICA.jpg (Planta Eléctrica Insonorizada)', path: '/PLANTAELECTRICA.jpg' },
  { label: 'ROBOTLED.jpg (Cabezales Móviles & Robot LED)', path: '/ROBOTLED.jpg' },
  { label: 'EfectosEspeciales.jpg (Efectos Especiales Confeti / Humo)', path: '/EfectosEspeciales.jpg' },
  { label: 'MAQUINADEESPUMA2.jpg (Máquinas de Espuma)', path: '/MAQUINADEESPUMA2.jpg' },
];
