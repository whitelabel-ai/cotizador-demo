export type ProductCategory =
  | "impresoras_etiquetas"
  | "impresoras_termicas"
  | "cintas_ribbon"
  | "etiquetas"
  | "lectores_codigo"
  | "cajones_monedero"
  | "accesorios";

export type ProductVisibility = "all" | "distribuidor_plus" | "distribuidor" | "corporativo";

export interface VolumePrice {
  minQty: number;
  price: number;
  label: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  description: string;
  specs: ProductSpec[];
  imageUrl: string;
  imagePlaceholder: string;
  basePrice: number;
  distributorPlusPrice: number;
  distributorPrice: number;
  corporatePrice: number;
  stock: number;
  visibleStock: number;
  warranty: string;
  visibility: ProductVisibility;
  complementaryIds: string[];
  alternativeIds: string[];
  volumePrices: VolumePrice[];
  tags: string[];
  isRecommended?: boolean;
  badge?: string;
}

export const products: Product[] = [
  {
    id: "prod-001",
    sku: "LD101",
    name: "Impresora de Etiquetas LD101",
    brand: "LabelDirect",
    model: "LD101",
    category: "impresoras_etiquetas",
    description:
      "Impresora de etiquetas de escritorio de alta velocidad, ideal para distribuidores con volumen medio-alto. Impresión térmica directa y por transferencia.",
    specs: [
      { label: "Resolución", value: "203 dpi" },
      { label: "Velocidad", value: "127 mm/seg" },
      { label: "Ancho máx.", value: "108 mm" },
      { label: "Conectividad", value: "USB + Ethernet" },
      { label: "Lenguaje", value: "ZPL / EPL" },
      { label: "Peso", value: "1.4 kg" },
    ],
    imageUrl: "",
    imagePlaceholder: "🖨️",
    basePrice: 890000,
    distributorPlusPrice: 720000,
    distributorPrice: 780000,
    corporatePrice: 810000,
    stock: 48,
    visibleStock: 35,
    warranty: "12 meses",
    visibility: "all",
    complementaryIds: ["prod-004", "prod-005", "prod-007"],
    alternativeIds: ["prod-002", "prod-003"],
    volumePrices: [
      { minQty: 1, price: 720000, label: "1–4 unidades" },
      { minQty: 5, price: 690000, label: "5–9 unidades" },
      { minQty: 10, price: 660000, label: "10+ unidades" },
    ],
    tags: ["LD101", "etiqueta", "impresora", "label"],
    badge: "Más vendido",
  },
  {
    id: "prod-002",
    sku: "ZD220",
    name: "Impresora Térmica Zebra ZD220",
    brand: "Zebra",
    model: "ZD220",
    category: "impresoras_termicas",
    description:
      "Impresora de escritorio Zebra ZD220, robustez industrial con facilidad de uso. Compatible con ZPL y EPL. Ideal para sustitución de modelos LP2824.",
    specs: [
      { label: "Resolución", value: "203 dpi" },
      { label: "Velocidad", value: "102 mm/seg" },
      { label: "Ancho máx.", value: "104 mm" },
      { label: "Conectividad", value: "USB" },
      { label: "Lenguaje", value: "ZPL / EPL" },
      { label: "Peso", value: "0.96 kg" },
    ],
    imageUrl: "",
    imagePlaceholder: "🖨️",
    basePrice: 980000,
    distributorPlusPrice: 810000,
    distributorPrice: 860000,
    corporatePrice: 900000,
    stock: 22,
    visibleStock: 18,
    warranty: "12 meses",
    visibility: "all",
    complementaryIds: ["prod-004", "prod-005", "prod-007"],
    alternativeIds: ["prod-001", "prod-003"],
    volumePrices: [
      { minQty: 1, price: 810000, label: "1–4 unidades" },
      { minQty: 5, price: 780000, label: "5–9 unidades" },
      { minQty: 10, price: 745000, label: "10+ unidades" },
    ],
    tags: ["ZD220", "zebra", "impresora", "termica"],
    isRecommended: true,
    badge: "Recomendado",
  },
  {
    id: "prod-003",
    sku: "SLP-300",
    name: "Impresora Saly Label Pro 300",
    brand: "Saly",
    model: "Label Pro 300",
    category: "impresoras_etiquetas",
    description:
      "Impresora de etiquetas con pantalla táctil a color, resolución 300 dpi para etiquetas de alta precisión. Conectividad WiFi incluida.",
    specs: [
      { label: "Resolución", value: "300 dpi" },
      { label: "Velocidad", value: "150 mm/seg" },
      { label: "Ancho máx.", value: "118 mm" },
      { label: "Conectividad", value: "USB + WiFi + Ethernet" },
      { label: "Pantalla", value: "2.3\" táctil color" },
      { label: "Peso", value: "1.8 kg" },
    ],
    imageUrl: "",
    imagePlaceholder: "🖨️",
    basePrice: 1250000,
    distributorPlusPrice: 1050000,
    distributorPrice: 1120000,
    corporatePrice: 1150000,
    stock: 10,
    visibleStock: 8,
    warranty: "18 meses",
    visibility: "distribuidor_plus",
    complementaryIds: ["prod-004", "prod-005"],
    alternativeIds: ["prod-001", "prod-002"],
    volumePrices: [
      { minQty: 1, price: 1050000, label: "1–4 unidades" },
      { minQty: 5, price: 1010000, label: "5+ unidades" },
    ],
    tags: ["SLP300", "saly", "impresora", "300dpi", "wifi"],
    badge: "Premium",
  },
  {
    id: "prod-004",
    sku: "RIB-110-74",
    name: "Cinta Ribbon Cera 110mm × 74m",
    brand: "GenericPro",
    model: "Wax Ribbon 110/74",
    category: "cintas_ribbon",
    description:
      "Cinta de cera (wax) 110mm × 74m. Compatible con impresoras LD101, ZD220 y la mayoría de impresoras de transferencia térmica. Caja de 12 unidades.",
    specs: [
      { label: "Ancho", value: "110 mm" },
      { label: "Longitud", value: "74 m" },
      { label: "Tipo", value: "Cera (Wax)" },
      { label: "Contenido", value: "Caja × 12 rollos" },
      { label: "Compatible con", value: "LD101, ZD220, mayoría TT" },
    ],
    imageUrl: "",
    imagePlaceholder: "🎞️",
    basePrice: 145000,
    distributorPlusPrice: 112000,
    distributorPrice: 125000,
    corporatePrice: 130000,
    stock: 200,
    visibleStock: 150,
    warranty: "N/A",
    visibility: "all",
    complementaryIds: [],
    alternativeIds: [],
    volumePrices: [
      { minQty: 1, price: 112000, label: "1–4 cajas" },
      { minQty: 5, price: 105000, label: "5–19 cajas" },
      { minQty: 20, price: 98000, label: "20+ cajas" },
    ],
    tags: ["ribbon", "cinta", "cera", "wax", "110", "74"],
  },
  {
    id: "prod-005",
    sku: "ETQ-100-50",
    name: "Etiquetas Adhesivas 100×50mm",
    brand: "LabelPro",
    model: "Adhesive 100x50",
    category: "etiquetas",
    description:
      "Rollo de etiquetas adhesivas blancas 100×50mm. 1000 etiquetas por rollo. Papel termosensible directo. Ideal para logística y almacén.",
    specs: [
      { label: "Medidas", value: "100 × 50 mm" },
      { label: "Cantidad", value: "1000 etiquetas/rollo" },
      { label: "Material", value: "Papel térmico directo" },
      { label: "Adhesivo", value: "Permanent" },
      { label: "Core", value: "25 mm" },
    ],
    imageUrl: "",
    imagePlaceholder: "🏷️",
    basePrice: 68000,
    distributorPlusPrice: 52000,
    distributorPrice: 58000,
    corporatePrice: 60000,
    stock: 500,
    visibleStock: 400,
    warranty: "N/A",
    visibility: "all",
    complementaryIds: [],
    alternativeIds: [],
    volumePrices: [
      { minQty: 1, price: 52000, label: "1–9 rollos" },
      { minQty: 10, price: 47000, label: "10–49 rollos" },
      { minQty: 50, price: 43000, label: "50+ rollos" },
    ],
    tags: ["etiqueta", "etiquetas", "100x50", "rollo", "adhesiva"],
  },
  {
    id: "prod-006",
    sku: "CD-RJ11",
    name: "Cajón Monedero RJ11",
    brand: "CashDraw",
    model: "CD-410 RJ11",
    category: "cajones_monedero",
    description:
      "Cajón monedero de 410mm, conexión RJ11 para impresoras de punto de venta. 5 billetes + 8 monedas. Teclado incluido.",
    specs: [
      { label: "Medidas", value: "410 × 415 × 100 mm" },
      { label: "Conexión", value: "RJ11" },
      { label: "Billetes", value: "5 posiciones" },
      { label: "Monedas", value: "8 divisiones" },
      { label: "Material", value: "Acero + plástico ABS" },
    ],
    imageUrl: "",
    imagePlaceholder: "🗃️",
    basePrice: 320000,
    distributorPlusPrice: 255000,
    distributorPrice: 275000,
    corporatePrice: 285000,
    stock: 30,
    visibleStock: 25,
    warranty: "6 meses",
    visibility: "all",
    complementaryIds: [],
    alternativeIds: [],
    volumePrices: [
      { minQty: 1, price: 255000, label: "1–4 unidades" },
      { minQty: 5, price: 240000, label: "5+ unidades" },
    ],
    tags: ["cajon", "cajón", "monedero", "rj11", "caja"],
  },
  {
    id: "prod-007",
    sku: "LEC-2D-USB",
    name: "Lector Código de Barras 2D USB",
    brand: "ScanTech",
    model: "ST-950 2D",
    category: "lectores_codigo",
    description:
      "Lector de código de barras 2D (QR + todos los 1D) con base USB. Plug & play, sin configuración. Ideal para mostrador y almacén.",
    specs: [
      { label: "Tipo", value: "1D + 2D (QR)" },
      { label: "Interfaz", value: "USB HID" },
      { label: "Lectura", value: "Omnidireccional" },
      { label: "Velocidad", value: "100 scans/seg" },
      { label: "Cable", value: "1.5 m" },
    ],
    imageUrl: "",
    imagePlaceholder: "📷",
    basePrice: 185000,
    distributorPlusPrice: 148000,
    distributorPrice: 160000,
    corporatePrice: 168000,
    stock: 65,
    visibleStock: 50,
    warranty: "12 meses",
    visibility: "all",
    complementaryIds: [],
    alternativeIds: [],
    volumePrices: [
      { minQty: 1, price: 148000, label: "1–9 unidades" },
      { minQty: 10, price: 138000, label: "10+ unidades" },
    ],
    tags: ["lector", "scanner", "2d", "qr", "codigo", "barras"],
  },
];

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductBySku = (sku: string): Product | undefined =>
  products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());

export const getComplementaryProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  return product.complementaryIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p);
};

export const getAlternativeProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  return product.alternativeIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p);
};
