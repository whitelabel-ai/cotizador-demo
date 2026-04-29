export type QuoteStatus =
  | "draft"
  | "pending_review"
  | "commercial_review"
  | "confirmed"
  | "sent"
  | "expired";

export interface QuoteLineItem {
  id: string;
  productId: string;
  sku: string;
  name: string;
  brand: string;
  qty: number;
  unitPrice: number;
  discountPercent: number;
  stock: number;
}

export interface Quote {
  id: string;
  number: string;
  customerId: string;
  status: QuoteStatus;
  createdAt: string;
  expiresAt: string;
  items: QuoteLineItem[];
  notes: string;
  repName: string;
  origin: "whatsapp" | "web" | "email";
  lastIntent?: string;
}

export const initialQuote: Quote = {
  id: "quote-001",
  number: "Q-2024-0924",
  customerId: "cust-001",
  status: "draft",
  createdAt: new Date().toISOString(),
  expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
  items: [],
  notes: "",
  repName: "Laura Méndez",
  origin: "whatsapp",
};

export const salesDashboardQuotes: Quote[] = [
  {
    id: "quote-sd-001",
    number: "Q-2024-0924",
    customerId: "cust-001",
    status: "draft",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "li-1",
        productId: "prod-001",
        sku: "LD101",
        name: "Impresora de Etiquetas LD101",
        brand: "LabelDirect",
        qty: 5,
        unitPrice: 690000,
        discountPercent: 0,
        stock: 35,
      },
    ],
    notes: "Cliente pidió cotización desde WhatsApp.",
    repName: "Laura Méndez",
    origin: "whatsapp",
    lastIntent: "Cotización inicial — producto LD101",
  },
  {
    id: "quote-sd-002",
    number: "Q-2024-0921",
    customerId: "cust-002",
    status: "commercial_review",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "li-2",
        productId: "prod-002",
        sku: "ZD220",
        name: "Impresora Térmica Zebra ZD220",
        brand: "Zebra",
        qty: 10,
        unitPrice: 745000,
        discountPercent: 12,
        stock: 18,
      },
    ],
    notes: "Cliente solicitó descuento adicional del 12%.",
    repName: "Miguel Torres",
    origin: "web",
    lastIntent: "Solicitud de mejor precio — supera umbral automático",
  },
  {
    id: "quote-sd-003",
    number: "Q-2024-0918",
    customerId: "cust-003",
    status: "pending_review",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "li-3",
        productId: "prod-003",
        sku: "SLP-300",
        name: "Impresora Saly Label Pro 300",
        brand: "Saly",
        qty: 3,
        unitPrice: 1050000,
        discountPercent: 0,
        stock: 8,
      },
      {
        id: "li-4",
        productId: "prod-004",
        sku: "RIB-110-74",
        name: "Cinta Ribbon Cera 110mm × 74m",
        brand: "GenericPro",
        qty: 10,
        unitPrice: 98000,
        discountPercent: 0,
        stock: 150,
      },
    ],
    notes: "Retail Masters requiere orden de compra.",
    repName: "Laura Méndez",
    origin: "email",
    lastIntent: "Envío de cotización — pendiente confirmación cliente",
  },
  {
    id: "quote-sd-004",
    number: "Q-2024-0910",
    customerId: "cust-001",
    status: "confirmed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    items: [
      {
        id: "li-5",
        productId: "prod-005",
        sku: "ETQ-100-50",
        name: "Etiquetas Adhesivas 100×50mm",
        brand: "LabelPro",
        qty: 50,
        unitPrice: 43000,
        discountPercent: 0,
        stock: 400,
      },
      {
        id: "li-6",
        productId: "prod-007",
        sku: "LEC-2D-USB",
        name: "Lector Código de Barras 2D USB",
        brand: "ScanTech",
        qty: 5,
        unitPrice: 138000,
        discountPercent: 0,
        stock: 50,
      },
    ],
    notes: "Confirmado — pendiente despacho.",
    repName: "Laura Méndez",
    origin: "whatsapp",
    lastIntent: "Cotización confirmada — en proceso de despacho",
  },
];
