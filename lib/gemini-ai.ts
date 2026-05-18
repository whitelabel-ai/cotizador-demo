import type { Message } from "@/data/conversations";
import type { Product } from "@/data/products";
import { generateId } from "@/lib/utils";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent";

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

function extractProductFromText(text: string, products: Product[]): Product | null {
  const lower = text.toLowerCase();
  
  // 1. Buscar por SKU (más preciso)
  const skuMatch = products.find(p => lower.includes(p.sku.toLowerCase()));
  if (skuMatch) {
    console.log("[Gemini] SKU match encontrado:", skuMatch.sku);
    return skuMatch;
  }
  
  // 2. Buscar por nombre completo del producto
  const nameMatch = products.find(p => lower.includes(p.name.toLowerCase()));
  if (nameMatch) {
    console.log("[Gemini] Nombre match encontrado:", nameMatch.name);
    return nameMatch;
  }
  
  // 3. Buscar por marca + modelo
  const brandModelMatch = products.find(p => 
    lower.includes(p.brand.toLowerCase()) && 
    lower.includes(p.model.toLowerCase())
  );
  if (brandModelMatch) {
    console.log("[Gemini] Marca+Modelo match:", brandModelMatch.brand, brandModelMatch.model);
    return brandModelMatch;
  }
  
  // 4. Buscar solo por marca (si hay un solo producto de esa marca)
  const brandMatches = products.filter(p => lower.includes(p.brand.toLowerCase()));
  if (brandMatches.length === 1) {
    console.log("[Gemini] Solo marca match:", brandMatches[0].brand);
    return brandMatches[0];
  }
  
  return null;
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
    .map(
      (p) =>
        `ID: ${p.id} | SKU: ${p.sku} | Nombre: ${p.name} | Marca: ${p.brand} | Precio: $${p.distributorPlusPrice.toLocaleString()} | Tags: ${p.tags.join(", ")}`
    )
    .join("\n");

  const prompt = `Asistente comercial IZC Mayorista.

PRODUCTOS DISPONIBLES:
${productsContext}

HISTORIAL: ${conversationHistory}

USUARIO DICE: "${userText}"

REGLAS CRÍTICAS:
1. Si das PRECIO, STOCK, o DETALLES de un producto → showProductCard: true
2. Si solo saludas o hablas general → showProductCard: false
3. SIEMPRE incluye productId si mencionas un producto específico

JSON OBLIGATORIO:
{
  "intent": "find_product" | "show_alternatives" | "show_complementary" | "request_discount" | "greeting" | "unknown",
  "responseText": "tu respuesta en español",
  "productId": "prod-izc-XXX" o null,
  "showProductCard": true o false
}

EJEMPLOS:
- "el ZEBRA DS2208 cuesta $355,000" → {"productId": "prod-izc-004", "showProductCard": true}
- "tienes impresoras BIXOLON?" → {"productId": "prod-izc-001", "showProductCard": true}
- "hola, qué tal?" → {"intent": "greeting", "showProductCard": false}

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

    console.log("[Gemini] Raw response:", candidate.content.parts[0].text);
    
    const geminiResponse = JSON.parse(candidate.content.parts[0].text);
    console.log("[Gemini] Parsed response:", geminiResponse);

    const aiMessage = makeAIMsg(geminiResponse.responseText);

    const additionalMessages: Message[] = [];

    // Matching automático: si Gemini no envió productId pero mencionó un producto
    if (!geminiResponse.productId) {
      const mentionedProduct = extractProductFromText(geminiResponse.responseText, products);
      if (mentionedProduct) {
        console.log("[Gemini] Auto-match producto:", mentionedProduct.id, mentionedProduct.name);
        geminiResponse.productId = mentionedProduct.id;
        geminiResponse.showProductCard = true;
      }
    }

    // Si hay productId y showProductCard es true (o no está definido pero hay producto)
    if (geminiResponse.productId && (geminiResponse.showProductCard || geminiResponse.showProductCard === undefined)) {
      console.log("[Gemini] Creando product_card para:", geminiResponse.productId);
      additionalMessages.push(
        makeAIMsg(`Producto: ${products.find((p) => p.id === geminiResponse.productId)?.name || ""}`, "product_card", {
          productId: geminiResponse.productId,
        })
      );
    }
    
    if (geminiResponse.intent === "show_alternatives" && geminiResponse.productIds) {
      console.log("[Gemini] Creando product_comparison");
      additionalMessages.push(
        makeAIMsg("Comparador de alternativas", "product_comparison", {
          productIds: geminiResponse.productIds,
        })
      );
    } else if (geminiResponse.intent === "show_complementary" && geminiResponse.productIds) {
      console.log("[Gemini] Creando complementary_products");
      additionalMessages.push(
        makeAIMsg("Complementarios sugeridos", "complementary_products", {
          productIds: geminiResponse.productIds,
        })
      );
    } else if (geminiResponse.intent === "request_discount") {
      console.log("[Gemini] Creando commercial_review");
      additionalMessages.push(makeAIMsg("Solicitud de descuento registrada", "commercial_review"));
    }

    console.log("[Gemini] Messages finales:", [aiMessage, ...additionalMessages]);

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
