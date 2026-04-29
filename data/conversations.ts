export type MessageRole = "customer" | "ai" | "system";
export type MessageType =
  | "text"
  | "product_card"
  | "product_comparison"
  | "complementary_products"
  | "quote_update"
  | "commercial_review"
  | "typing";

export interface Message {
  id: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  timestamp: string;
  productId?: string;
  productIds?: string[];
  metadata?: Record<string, unknown>;
}

export interface Conversation {
  id: string;
  customerId: string;
  sessionId: string;
  origin: "whatsapp" | "web";
  startedAt: string;
  messages: Message[];
}

export const initialConversation: Conversation = {
  id: "conv-001",
  customerId: "cust-001",
  sessionId: "sess-wa-7f3k2m",
  origin: "whatsapp",
  startedAt: "2024-04-29T14:35:00Z",
  messages: [
    {
      id: "msg-001",
      role: "customer",
      type: "text",
      content: "Hola, necesito cotizar 5 unidades de la referencia LD101.",
      timestamp: "2024-04-29T14:35:12Z",
    },
    {
      id: "msg-002",
      role: "ai",
      type: "text",
      content:
        "Hola Carlos 👋 Claro, estoy validando disponibilidad y precio para Distribuciones Andina con tu lista Distribuidor Plus. Dame un momento.",
      timestamp: "2024-04-29T14:35:18Z",
    },
    {
      id: "msg-003",
      role: "ai",
      type: "product_card",
      content: "Encontré la referencia LD101. Aquí tienes la información:",
      timestamp: "2024-04-29T14:35:22Z",
      productId: "prod-001",
      metadata: { qty: 5 },
    },
    {
      id: "msg-004",
      role: "system",
      type: "text",
      content: "Conversación recuperada desde WhatsApp. Continuando en plataforma web.",
      timestamp: "2024-04-29T14:38:00Z",
    },
    {
      id: "msg-005",
      role: "ai",
      type: "text",
      content:
        "Carlos, ya tienes el espacio de cotización activo. Puedes agregar la LD101 a tu cotización, explorar alternativas o pedir productos complementarios. ¿Cómo seguimos?",
      timestamp: "2024-04-29T14:38:05Z",
    },
  ],
};

export const quickActions = [
  { id: "qa-1", label: "Ver alternativas", intent: "alternativa" },
  { id: "qa-2", label: "Productos complementarios", intent: "complementarios" },
  { id: "qa-3", label: "Precio por volumen", intent: "volumen" },
  { id: "qa-4", label: "Solicitar mejor precio", intent: "descuento" },
  { id: "qa-5", label: "Ver cotización", intent: "cotización" },
];
