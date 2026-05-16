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
      id: "msg-000",
      role: "ai",
      type: "text",
      content: "¡Hola! Soy tu asistente comercial. Puedo ayudarte a cotizar productos, comparar alternativas, ver precios por volumen o conectarte con Laura Mendez. ¿Qué producto necesitas cotizar hoy?",
      timestamp: "2024-04-29T14:35:00Z",
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
