export type CustomerType = "distribuidor_plus" | "distribuidor" | "minorista" | "corporativo";
export type PriceList = "distribuidor_plus" | "distribuidor" | "lista_general" | "corporativo";

export interface CommercialRestriction {
  label: string;
  type: "info" | "warning" | "blocked";
}

export interface QuoteHistoryItem {
  id: string;
  date: string;
  total: number;
  status: "confirmed" | "pending" | "expired";
  items: number;
}

export interface Customer {
  id: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  type: CustomerType;
  priceList: PriceList;
  assignedRep: string;
  assignedRepEmail: string;
  assignedRepAvatar: string;
  origin: "whatsapp" | "web" | "email" | "phone";
  creditLimit: number;
  paymentTerms: string;
  restrictions: CommercialRestriction[];
  quoteHistory: QuoteHistoryItem[];
  city: string;
  country: string;
  taxId: string;
}

export const customers: Customer[] = [
  {
    id: "cust-001",
    company: "Distribuciones Andina S.A.S.",
    contact: "Carlos Moreno",
    email: "compras@andina.com.co",
    phone: "+57 312 456 7890",
    type: "distribuidor_plus",
    priceList: "distribuidor_plus",
    assignedRep: "Laura Méndez",
    assignedRepEmail: "laura.mendez@quoteai.co",
    assignedRepAvatar: "LM",
    origin: "whatsapp",
    creditLimit: 50000000,
    paymentTerms: "30 días",
    city: "Bogotá",
    country: "Colombia",
    taxId: "900.123.456-7",
    restrictions: [
      { label: "Descuentos >15% requieren aprobación comercial", type: "warning" },
      { label: "Crédito activo — sin bloqueos", type: "info" },
      { label: "Mínimo 3 unidades por referencia", type: "info" },
    ],
    quoteHistory: [
      { id: "Q-2024-0891", date: "2024-03-15", total: 8450000, status: "confirmed", items: 4 },
      { id: "Q-2024-0754", date: "2024-02-28", total: 12300000, status: "confirmed", items: 6 },
      { id: "Q-2024-0612", date: "2024-01-20", total: 5200000, status: "expired", items: 3 },
    ],
  },
  {
    id: "cust-002",
    company: "TechPOS Soluciones Ltda.",
    contact: "Andrés Vargas",
    email: "av@techpos.co",
    phone: "+57 300 987 6543",
    type: "distribuidor",
    priceList: "distribuidor",
    assignedRep: "Miguel Torres",
    assignedRepEmail: "miguel.torres@quoteai.co",
    assignedRepAvatar: "MT",
    origin: "web",
    creditLimit: 20000000,
    paymentTerms: "15 días",
    city: "Medellín",
    country: "Colombia",
    taxId: "800.456.789-1",
    restrictions: [
      { label: "Descuentos >10% requieren aprobación", type: "warning" },
      { label: "Solo productos de la categoría POS y periféricos", type: "info" },
    ],
    quoteHistory: [
      { id: "Q-2024-0820", date: "2024-03-10", total: 4100000, status: "pending", items: 2 },
    ],
  },
  {
    id: "cust-003",
    company: "Retail Masters S.A.",
    contact: "Paola Jiménez",
    email: "paola@retailmasters.com",
    phone: "+57 315 234 5678",
    type: "corporativo",
    priceList: "corporativo",
    assignedRep: "Laura Méndez",
    assignedRepEmail: "laura.mendez@quoteai.co",
    assignedRepAvatar: "LM",
    origin: "email",
    creditLimit: 100000000,
    paymentTerms: "45 días",
    city: "Cali",
    country: "Colombia",
    taxId: "900.789.012-3",
    restrictions: [
      { label: "Cuenta corporativa — tarifas especiales activas", type: "info" },
      { label: "Requiere orden de compra para confirmar", type: "warning" },
    ],
    quoteHistory: [
      { id: "Q-2024-0900", date: "2024-03-18", total: 28000000, status: "pending", items: 12 },
      { id: "Q-2024-0788", date: "2024-03-01", total: 15600000, status: "confirmed", items: 8 },
    ],
  },
];

export const getCustomerById = (id: string): Customer | undefined =>
  customers.find((c) => c.id === id);

export const defaultCustomer = customers[0];
