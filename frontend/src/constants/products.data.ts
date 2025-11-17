/**
 * Datos mock de productos
 * En producción esto debería venir del backend: GET /api/products
 */

import type { Product } from '../types';
import excavadoraCat from '../assets/excavadora-cat.png';
import cargadorKomatsu from '../assets/cargador-komatsu.png';
import gruaLiebherr from '../assets/grua-liebherr.png';

export const products: Product[] = [
  {
    id: '1',
    name: 'Excavadora CAT 320D',
    price: 120000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Potente y versátil, ideal para grandes movimientos de tierra y proyectos de construcción.',
    description: 'Excavadora para obras pesadas con alto rendimiento y bajo consumo.'
  },
  {
    id: '2',
    name: 'Cargador Komatsu WA470',
    price: 150000,
    pricePerDay: 800,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Cargador de ruedas de alta capacidad para un manejo eficiente de materiales y operaciones de carga.',
    description: 'Cargador potente para movimiento de materiales.'
  },
  {
    id: '3',
    name: 'Grúa Liebherr LTM 1090',
    price: 80000,
    pricePerDay: 600,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Grúa móvil versátil con excelentes capacidades de elevación para una amplia gama de trabajos.',
    description: 'Grúa móvil versátil para trabajos de elevación.'
  },
  {
    id: '4',
    name: 'Excavadora Komatsu PC200',
    price: 95000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Excavadora de tamaño medio ideal para proyectos de construcción y demolición.',
    description: 'Excavadora robusta con excelente relación potencia-eficiencia.'
  },
  {
    id: '5',
    name: 'Cargador CAT 950M',
    price: 135000,
    type: 'sale',
    images: [cargadorKomatsu],
    badge: 'EN VENTA',
    short: 'Cargador frontal de alto rendimiento para operaciones exigentes.',
    description: 'Cargador frontal con gran capacidad de carga y maniobrabilidad.'
  },
  {
    id: '6',
    name: 'Grúa Móvil Tadano',
    price: 72000,
    pricePerDay: 500,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Grúa móvil compacta perfecta para proyectos en espacios reducidos.',
    description: 'Grúa móvil con excelente capacidad de elevación y alcance.'
  },
  {
    id: '7',
    name: 'Excavadora Hitachi ZX210',
    price: 110000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Excavadora hidráulica de alto rendimiento con cabina ergonómica.',
    description: 'Excavadora con tecnología avanzada para mayor productividad.'
  },
  {
    id: '8',
    name: 'Cargador Volvo L90H',
    price: 128000,
    pricePerDay: 750,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Cargador de ruedas eficiente con bajo consumo de combustible.',
    description: 'Cargador robusto ideal para canteras y construcción.'
  },
  {
    id: '9',
    name: 'Grúa Torre Liebherr',
    price: 165000,
    type: 'sale',
    images: [gruaLiebherr],
    badge: 'EN VENTA',
    short: 'Grúa torre de gran alcance para proyectos de gran envergadura.',
    description: 'Grúa torre con capacidad de elevación superior.'
  },
  {
    id: '10',
    name: 'Bulldozer CAT D6T',
    price: 145000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Bulldozer potente para trabajos de nivelación y movimiento de tierras.',
    description: 'Bulldozer con sistemas hidráulicos avanzados.'
  },
  {
    id: '11',
    name: 'Retroexcavadora JCB 3CX',
    price: 68000,
    pricePerDay: 800,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Retroexcavadora versátil para excavación y carga de materiales.',
    description: 'Retroexcavadora con gran versatilidad y eficiencia.'
  },
  {
    id: '12',
    name: 'Compactador Bomag BW211',
    price: 52000,
    pricePerDay: 500,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Compactador de suelos para trabajos de pavimentación y compactación.',
    description: 'Compactador vibratorio de alto rendimiento.'
  },
  {
    id: '13',
    name: 'Motoniveladora CAT 140M',
    price: 185000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Motoniveladora de precisión para acabados perfectos en carreteras y superficies.',
    description: 'Motoniveladora con sistema de control de precisión y gran estabilidad.'
  },
  {
    id: '14',
    name: 'Rodillo Compactador Dynapac',
    price: 45000,
    pricePerDay: 450,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Rodillo compactador ideal para asfalto y suelos en proyectos viales.',
    description: 'Rodillo vibratorio de alta eficiencia para compactación uniforme.'
  },
  {
    id: '15',
    name: 'Minicargadora Bobcat S650',
    price: 58000,
    pricePerDay: 380,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Minicargadora compacta perfecta para espacios reducidos y múltiples tareas.',
    description: 'Máquina versátil con diversos implementos disponibles.'
  },
  {
    id: '16',
    name: 'Excavadora Volvo EC380',
    price: 225000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Excavadora pesada de última generación con tecnología Eco Mode.',
    description: 'Excavadora de gran tonelaje con máximo rendimiento y mínimo consumo.'
  },
  {
    id: '17',
    name: 'Manipulador Telescópico JCB 540',
    price: 95000,
    pricePerDay: 650,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Manipulador telescópico versátil para elevación y carga de materiales.',
    description: 'Equipo multifuncional con gran alcance vertical y horizontal.'
  },
  {
    id: '18',
    name: 'Pala Cargadora Komatsu WA500',
    price: 195000,
    type: 'sale',
    images: [gruaLiebherr],
    badge: 'EN VENTA',
    short: 'Pala cargadora de gran capacidad para movimiento masivo de materiales.',
    description: 'Cargador robusto con sistema hidráulico de alta presión.'
  },
  {
    id: '19',
    name: 'Fresadora de Asfalto Wirtgen',
    price: 78000,
    pricePerDay: 850,
    type: 'rent',
    images: [excavadoraCat],
    badge: 'EN ALQUILER',
    short: 'Fresadora de pavimento para remoción precisa de asfalto en proyectos viales.',
    description: 'Máquina especializada con control de profundidad automático.'
  },
  {
    id: '20',
    name: 'Pavimentadora Vogele Super 1800',
    price: 165000,
    pricePerDay: 900,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Pavimentadora de alta tecnología para extendido perfecto de asfalto.',
    description: 'Sistema de nivelación automática y control de temperatura.'
  },
  {
    id: '21',
    name: 'Camión Volquete Volvo FMX',
    price: 145000,
    type: 'sale',
    images: [gruaLiebherr],
    badge: 'EN VENTA',
    short: 'Camión volquete resistente para transporte de materiales pesados.',
    description: 'Volquete con caja basculante de gran capacidad y resistencia.'
  },
  {
    id: '22',
    name: 'Plataforma Elevadora Genie',
    price: 42000,
    pricePerDay: 320,
    type: 'rent',
    images: [excavadoraCat],
    badge: 'EN ALQUILER',
    short: 'Plataforma elevadora tijera para trabajos en altura con gran estabilidad.',
    description: 'Plataforma eléctrica silenciosa ideal para interiores y exteriores.'
  },
  {
    id: '23',
    name: 'Excavadora de Ruedas CAT M316',
    price: 135000,
    type: 'sale',
    images: [cargadorKomatsu],
    badge: 'EN VENTA',
    short: 'Excavadora de ruedas móvil ideal para trabajo urbano y áreas pavimentadas.',
    description: 'Máquina versátil con excelente movilidad y estabilizadores.'
  },
  {
    id: '24',
    name: 'Martillo Hidráulico Atlas Copco',
    price: 28000,
    pricePerDay: 280,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Martillo hidráulico de demolición para trabajos de ruptura de concreto y roca.',
    description: 'Implemento de alto impacto compatible con excavadoras medianas.'
  },
  {
    id: '25',
    name: 'Mixer de Concreto Liebherr',
    price: 155000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Camión mixer para transporte y mezclado de concreto en obra.',
    description: 'Mixer con tambor de 8m³ y sistema de descarga automático.'
  },
  {
    id: '26',
    name: 'Montacargas Toyota 8FD25',
    price: 45000,
    pricePerDay: 350,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Montacargas diésel de 2.5 toneladas para manejo de materiales.',
    description: 'Montacargas robusto con mástil triple y capacidad de elevación 4.5m.'
  },
  {
    id: '27',
    name: 'Zanjadora Ditch Witch RT80',
    price: 68000,
    pricePerDay: 520,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Zanjadora para excavación de zanjas en instalaciones de servicios.',
    description: 'Máquina especializada con cadena de corte y profundidad hasta 2.5m.'
  },
  {
    id: '28',
    name: 'Camión Cisterna Mercedes Actros',
    price: 125000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Camión cisterna para transporte de agua y control de polvo.',
    description: 'Cisterna de 15,000 litros con sistema de riego y bomba de alta presión.'
  },
  {
    id: '29',
    name: 'Compresor Atlas Copco XAS 185',
    price: 38000,
    pricePerDay: 280,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Compresor de aire portátil para herramientas neumáticas.',
    description: 'Compresor de 185 CFM con motor diésel y panel de control digital.'
  },
  {
    id: '30',
    name: 'Bomba de Concreto Putzmeister',
    price: 195000,
    pricePerDay: 950,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Bomba estacionaria de concreto para edificaciones de altura.',
    description: 'Bomba con brazo de 32m y capacidad de bombeo 90m³/h.'
  },
  {
    id: '31',
    name: 'Excavadora de Cadenas Doosan DX225',
    price: 115000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Excavadora de cadenas versátil para trabajos pesados.',
    description: 'Excavadora con motor de bajo consumo y cabina presurizada.'
  },
  {
    id: '32',
    name: 'Barredora Vial Johnston',
    price: 85000,
    pricePerDay: 480,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Barredora mecánica para limpieza de calles y carreteras.',
    description: 'Barredora con sistema de aspiración y tolva de 4m³.'
  },
  {
    id: '33',
    name: 'Grúa Autocargante Palfinger',
    price: 98000,
    type: 'sale',
    images: [gruaLiebherr],
    badge: 'EN VENTA',
    short: 'Grúa hidráulica autocargante montada en camión.',
    description: 'Grúa articulada con alcance 12m y capacidad 8 toneladas.'
  },
  {
    id: '34',
    name: 'Vibro Compactador Wacker Neuson',
    price: 15000,
    pricePerDay: 180,
    type: 'rent',
    images: [excavadoraCat],
    badge: 'EN ALQUILER',
    short: 'Plancha compactadora para trabajos de compactación de suelos.',
    description: 'Compactador manual reversible con motor a gasolina.'
  },
  {
    id: '35',
    name: 'Camión Grúa Hiab',
    price: 165000,
    type: 'sale',
    images: [cargadorKomatsu],
    badge: 'EN VENTA',
    short: 'Camión con grúa incorporada para carga y descarga.',
    description: 'Camión 6x4 con grúa telescópica de 15 toneladas-metro.'
  },
  {
    id: '36',
    name: 'Jumbo de Perforación Atlas Copco',
    price: 285000,
    pricePerDay: 1200,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Jumbo para perforación en túneles y minería subterránea.',
    description: 'Equipo de perforación con dos brazos y sistema de posicionamiento GPS.'
  },
  {
    id: '37',
    name: 'Tractor de Oruga CAT D8T',
    price: 295000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Tractor de orugas de alta potencia para movimientos de tierra masivos.',
    description: 'Bulldozer pesado con hoja U y sistema de control de pendientes.'
  },
  {
    id: '38',
    name: 'Perforadora Hidráulica Furukawa',
    price: 72000,
    pricePerDay: 580,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Perforadora sobre orugas para trabajos de anclaje y pilotaje.',
    description: 'Perforadora con profundidad hasta 30m y diámetros variables.'
  },
  {
    id: '39',
    name: 'Camión Pluma Telescópica Manitou',
    price: 145000,
    type: 'sale',
    images: [gruaLiebherr],
    badge: 'EN VENTA',
    short: 'Manipulador telescópico giratorio de gran alcance.',
    description: 'Pluma telescópica con alcance 18m y capacidad 4 toneladas.'
  },
  {
    id: '40',
    name: 'Extendedora de Asfalto Vogele',
    price: 175000,
    pricePerDay: 850,
    type: 'rent',
    images: [excavadoraCat],
    badge: 'EN ALQUILER',
    short: 'Pavimentadora autopropulsada para extendido de mezclas asfálticas.',
    description: 'Extendedora con ancho variable 3-8m y sistema de calefacción.'
  },
  {
    id: '41',
    name: 'Grúa Todo Terreno Grove RT540E',
    price: 265000,
    type: 'sale',
    images: [cargadorKomatsu],
    badge: 'EN VENTA',
    short: 'Grúa todo terreno compacta con gran capacidad de elevación.',
    description: 'Grúa de 35 toneladas con pluma de 23m y extensión a 31m.'
  },
  {
    id: '42',
    name: 'Minipala Bobcat S70',
    price: 35000,
    pricePerDay: 250,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Minipala compacta ideal para trabajos en espacios muy reducidos.',
    description: 'Máquina ultracompacta con ancho 90cm y múltiples accesorios.'
  },
  {
    id: '43',
    name: 'Excavadora Giratoria Sany SY215',
    price: 105000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Excavadora mediana con cabina amplia y controles ergonómicos.',
    description: 'Excavadora con sistema de ahorro de combustible y bajo mantenimiento.'
  },
  {
    id: '44',
    name: 'Generador Eléctrico Caterpillar',
    price: 55000,
    pricePerDay: 420,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Generador diésel insonorizado de 250 KVA para obra.',
    description: 'Generador con tablero automático y autonomía de 12 horas.'
  },
  {
    id: '45',
    name: 'Recicladora de Asfalto Wirtgen',
    price: 485000,
    type: 'sale',
    images: [gruaLiebherr],
    badge: 'EN VENTA',
    short: 'Recicladora en frío para rehabilitación de pavimentos.',
    description: 'Máquina de reciclado con ancho 2.4m y profundidad hasta 30cm.'
  },
  {
    id: '46',
    name: 'Cargador Compacto Case SR250',
    price: 62000,
    pricePerDay: 400,
    type: 'rent',
    images: [excavadoraCat],
    badge: 'EN ALQUILER',
    short: 'Cargador compacto de alto rendimiento con brazos radiales.',
    description: 'Minicargador con capacidad de elevación 1,135 kg.'
  },
  {
    id: '47',
    name: 'Retroexcavadora Komatsu WB93R',
    price: 78000,
    type: 'sale',
    images: [cargadorKomatsu],
    badge: 'EN VENTA',
    short: 'Retroexcavadora con cargador frontal y excavadora trasera.',
    description: 'Máquina 2 en 1 con profundidad de excavación 4.3m.'
  },
  {
    id: '48',
    name: 'Plataforma Articulada JLG',
    price: 58000,
    pricePerDay: 380,
    type: 'rent',
    images: [gruaLiebherr],
    badge: 'EN ALQUILER',
    short: 'Plataforma elevadora articulada para acceso a zonas difíciles.',
    description: 'Plataforma diésel 4x4 con altura de trabajo 16m.'
  },
  {
    id: '49',
    name: 'Excavadora Anfibio Wilco',
    price: 185000,
    type: 'sale',
    images: [excavadoraCat],
    badge: 'EN VENTA',
    short: 'Excavadora especializada para trabajos en pantanos y agua.',
    description: 'Excavadora con pontones flotantes y brazo extensible.'
  },
  {
    id: '50',
    name: 'Cortadora de Concreto Husqvarna',
    price: 12000,
    pricePerDay: 150,
    type: 'rent',
    images: [cargadorKomatsu],
    badge: 'EN ALQUILER',
    short: 'Cortadora de piso para concreto y asfalto con disco de 24".',
    description: 'Máquina profesional con motor Honda y profundidad de corte 12cm.'
  }
];
