import type { Message } from "@/data/conversations";
import type { Product } from "@/data/products";
import { generateId } from "@/lib/utils";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1alpha/models/gemini-3.1-flash-lite:generateContent";

export interface GeminiAIResponse {
  intent: string;
  messages: Message[];
  productId?: string;
  productIds?: string[];
  showProductCard?: boolean;
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

  const prompt = `Eres un asistente comercial B2B especializado en productos de IZC Mayorista.

PRODUCTOS DISPONIBLES:
${productsContext}

HISTORIAL:
${conversationHistory}

USUARIO DICE: "${userText}"

INSTRUCCIONES:
1. Responde en español de forma natural y comercial
2. SI el usuario pregunta por un producto específico o quiere ver detalles → DEBES usar showProductCard: true
3. Si solo es saludo o pregunta general → showProductCard: false

FORMATO DE RESPUESTA OBLIGATORIO (JSON):
{
  "intent": "find_product" | "show_alternatives" | "show_complementary" | "request_discount" | "greeting" | "unknown",
  "responseText": "tu respuesta en español",
  "productId": "id del producto o null",
  "showProductCard": true | false
}

REGLAS CRÍTICAS:
- Si mencionas un producto POR NOMBRE o SKU → showProductCard: true
- Si el usuario dice "muéstrame", "quiero ver", "dame información" de un producto → showProductCard: true
- Si el usuario pregunta "tienes X?" o "qué hay de X?" → showProductCard: true
- Solo showProductCard: false para saludos o preguntas muy generales

EJEMPLOS:
- "dame info de la portátil" → {"intent": "find_product", "responseText": "La impresora portátil es...", "productId": "prod-izc-003", "showProductCard": true}
- "tienes lectores zebra?" → {"intent": "find_product", "responseText": "Sí, tenemos...", "productId": "prod-izc-004", "showProductCard": true}
- "hola, qué tal?" → {"intent": "greeting", "responseText": "¡Hola! ¿En qué puedo ayudarte?", "showProductCard": false}

RESPONDE SOLO JSON:`;

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
          temperature: 0.3,
          topK: 32,
          topP: 0.95,
          maxOutputTokens: 4096,
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

    // Si Gemini quiere mostrar una tarjeta de producto
    if (geminiResponse.showProductCard && geminiResponse.productId) {
      additionalMessages.push(
        makeAIMsg(`Producto: ${products.find((p) => p.id === geminiResponse.productId)?.name || ""}`, "product_card", {
          productId: geminiResponse.productId,
        })
      );
    } else if (geminiResponse.intent === "find_product" && geminiResponse.productId) {
      // Fallback para find_product sin showProductCard explícito
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
      showProductCard: geminiResponse.showProductCard,
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
