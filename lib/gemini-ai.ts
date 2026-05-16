import type { Message } from "@/data/conversations";
import type { Product } from "@/data/products";
import { generateId } from "@/lib/utils";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite-preview:generateContent";

export interface GeminiAIResponse {
  intent: string;
  messages: Message[];
  productId?: string;
  productIds?: string[];
}

function makeAIMsg(
  content: string,
  type: Message["type"] = "text",
  extra?: Partial<Message>
): Message {
  return {
    id: `msg-${generateId()}`,
    role: "ai",
    type,
    content,
    timestamp: new Date().toISOString(),
    ...extra,
  };
}

export async function callGeminiAPI(
  userText: string,
  messages: Message[],
  products: Product[],
  lastProductId?: string
): Promise<GeminiAIResponse> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY no configurada. Agregue NEXT_PUBLIC_GEMINI_API_KEY a su .env.local");
  }

  const conversationHistory = messages
    .slice(-10)
    .map((m) => `${m.role === "customer" ? "Usuario" : "Asistente"}: ${m.content}`)
    .join("\n");

  const productsContext = products
    .slice(0, 10)
    .map(
      (p) =>
        `SKU: ${p.sku} | Nombre: ${p.name} | Marca: ${p.brand} | Precio: $${p.distributorPlusPrice.toLocaleString()} | Tags: ${p.tags.join(", ")}`
    )
    .join("\n");

  const prompt = `Eres un asistente comercial B2B especializado en productos de tecnología para punto de venta (POS), identificación y marcación, y seguridad electrónica de IZC Mayorista.

Contexto de productos disponibles:
${productsContext}

Historial de conversación reciente:
${conversationHistory}

Último mensaje del usuario: "${userText}"

Tu tarea:
1. Analiza la intención del usuario (buscar producto, pedir descuento, ver alternativas, complementarios, etc.)
2. Si el usuario menciona un producto específico (por SKU, nombre, marca o categoría), identifica el producto exacto
3. Responde de forma natural y comercial en español
4. Si es apropiado, sugiere productos relevantes

Responde EXCLUSIVAMENTE en formato JSON con esta estructura:
{
  "intent": "find_product" | "show_alternatives" | "show_complementary" | "request_discount" | "show_volume_pricing" | "show_quote" | "greeting" | "unknown",
  "responseText": "Tu respuesta natural en español",
  "productId": "id del producto si aplica",
  "productIds": ["array de ids si es comparativa o complementarios"]
}

Reglas:
- Si el usuario busca un producto, usa intent "find_product" y proporciona el productId
- Si pide alternativas, usa "show_alternatives" y proporciona productIds con el producto base + alternativas
- Si pide complementarios, usa "show_complementary" y proporciona productIds
- Si pide descuento, usa "request_discount"
- Sé conciso pero útil
- Usa el contexto de la conversación`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.5,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error de Gemini API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    
    if (!candidate?.content?.parts?.[0]?.text) {
      throw new Error("Respuesta vacía de Gemini API");
    }

    const geminiResponse = JSON.parse(candidate.content.parts[0].text);

    const aiMessage = makeAIMsg(geminiResponse.responseText);

    let additionalMessages: Message[] = [];

    if (geminiResponse.intent === "find_product" && geminiResponse.productId) {
      additionalMessages.push(
        makeAIMsg(`Producto cargado: ${products.find((p) => p.id === geminiResponse.productId)?.name || ""}`, "product_card", {
          productId: geminiResponse.productId,
        })
      );
    } else if (geminiResponse.intent === "show_alternatives" && geminiResponse.productIds) {
      additionalMessages.push(
        makeAIMsg("Comparador de alternativas", "product_comparison", {
          productIds: geminiResponse.productIds,
        })
      );
    } else if (geminiResponse.intent === "show_complementary" && geminiResponse.productIds) {
      additionalMessages.push(
        makeAIMsg("Complementarios sugeridos", "complementary_products", {
          productIds: geminiResponse.productIds,
        })
      );
    } else if (geminiResponse.intent === "request_discount") {
      additionalMessages.push(makeAIMsg("Solicitud de descuento registrada", "commercial_review"));
    }

    return {
      intent: geminiResponse.intent,
      messages: [aiMessage, ...additionalMessages],
      productId: geminiResponse.productId,
      productIds: geminiResponse.productIds,
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    
    // Fallback a respuesta genérica
    return {
      intent: "unknown",
      messages: [
        makeAIMsg(
          "Entendido. Puedo ayudarte a buscar productos por SKU o nombre, comparar alternativas, ver productos complementarios o gestionar tu cotización. ¿Qué necesitas?"
        ),
      ],
    };
  }
}
