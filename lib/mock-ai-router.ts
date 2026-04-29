import { getAlternativeProducts, getComplementaryProducts, products } from "@/data/products";
import type { Message } from "@/data/conversations";
import { generateId } from "@/lib/utils";

export type AIIntent =
  | "find_product"
  | "show_alternatives"
  | "show_complementary"
  | "request_discount"
  | "show_volume_pricing"
  | "show_quote"
  | "greeting"
  | "unknown";

export interface AIResponse {
  intent: AIIntent;
  messages: Message[];
  productId?: string;
  productIds?: string[];
}

function detectIntent(text: string): AIIntent {
  const lower = text.toLowerCase();

  if (/alternativ|cambio de marca|otra marca|opcion/.test(lower)) return "show_alternatives";
  if (/complement|etiqueta|ribbon|cinta|accesorio/.test(lower)) return "show_complementary";
  if (/descuento|mejor precio|rebaja|precio especial|oferta/.test(lower)) return "request_discount";
  if (/volumen|escala|cantidad|precio por/.test(lower)) return "show_volume_pricing";
  if (/cotizaci|resumen|ver cot/.test(lower)) return "show_quote";
  if (/hola|buenos|buenas|saludos/.test(lower)) return "greeting";

  const skuMatch = text.match(/[A-Z]{2,}\d{2,}[-\w]*/i);
  if (skuMatch) return "find_product";

  if (/impresora|impresion|printer|zebra|ld101|zd220|slp/.test(lower)) return "find_product";
  if (/lector|scanner|cajon|monedero/.test(lower)) return "find_product";

  return "unknown";
}

function findProductFromText(text: string) {
  const lower = text.toLowerCase();

  return products.find(
    (product) =>
      product.tags.some((tag) => lower.includes(tag.toLowerCase())) ||
      lower.includes(product.sku.toLowerCase()) ||
      lower.includes(product.model.toLowerCase())
  );
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

export function routeMessage(userText: string, lastProductId?: string): AIResponse {
  const intent = detectIntent(userText);

  switch (intent) {
    case "find_product": {
      const product = findProductFromText(userText);

      if (!product) {
        return {
          intent,
          messages: [
            makeAIMsg(
              "No encontre una referencia exacta con esa descripcion. Puedes indicarme el SKU o el nombre del producto. Tambien puedo buscar por categoria."
            ),
          ],
        };
      }

      return {
        intent,
        productId: product.id,
        messages: [
          makeAIMsg(
            `Encontre la referencia **${product.sku}** - ${product.name}. Aqui tienes la ficha tecnica con precio para tu lista Distribuidor Plus:`
          ),
          makeAIMsg(`Producto cargado: ${product.name}`, "product_card", { productId: product.id }),
        ],
      };
    }

    case "show_alternatives": {
      const referenceId = lastProductId ?? "prod-001";
      const alternatives = getAlternativeProducts(referenceId);

      if (!alternatives.length) {
        return {
          intent,
          messages: [makeAIMsg("No encontre alternativas directas para este producto en este momento.")],
        };
      }

      return {
        intent,
        productId: referenceId,
        productIds: [referenceId, ...alternatives.map((product) => product.id)],
        messages: [
          makeAIMsg(
            `Tengo ${alternatives.length} alternativas disponibles para comparar. Te muestro las diferencias clave en precio, especificaciones y garantia:`
          ),
          makeAIMsg("Comparador de alternativas", "product_comparison", {
            productIds: [referenceId, ...alternatives.map((product) => product.id)],
          }),
        ],
      };
    }

    case "show_complementary": {
      const referenceId = lastProductId ?? "prod-001";
      const complementaries = getComplementaryProducts(referenceId);

      if (!complementaries.length) {
        return {
          intent,
          messages: [
            makeAIMsg("No tengo productos complementarios sugeridos para esta referencia en este momento."),
          ],
        };
      }

      return {
        intent,
        productId: referenceId,
        productIds: complementaries.map((product) => product.id),
        messages: [
          makeAIMsg(
            "Para la impresora que seleccionaste, estos son los productos complementarios mas solicitados por clientes similares:"
          ),
          makeAIMsg("Complementarios sugeridos", "complementary_products", {
            productIds: complementaries.map((product) => product.id),
          }),
        ],
      };
    }

    case "request_discount": {
      return {
        intent,
        messages: [
          makeAIMsg(
            "Entendido. He registrado tu solicitud de revision de precio. **Laura Mendez** recibira una notificacion y te respondera a la brevedad. La cotizacion quedara en estado *Revision comercial requerida*.",
            "commercial_review"
          ),
        ],
      };
    }

    case "show_volume_pricing": {
      return {
        intent,
        messages: [
          makeAIMsg(
            "Los precios por volumen para tu lista Distribuidor Plus se aplican automaticamente al cambiar la cantidad en la cotizacion. A partir de **5 unidades** y **10 unidades** hay escalas de precio adicionales. Puedes ver el precio actualizado en el panel de cotizacion."
          ),
        ],
      };
    }

    case "show_quote": {
      return {
        intent,
        messages: [
          makeAIMsg(
            "Puedes ver el resumen completo de la cotizacion en el panel derecho. Cuando estes listo, puedes **descargar**, **enviar al vendedor** o **confirmar** desde ahi."
          ),
        ],
      };
    }

    case "greeting": {
      return {
        intent,
        messages: [
          makeAIMsg(
            "Hola. Soy tu asistente comercial. Puedo ayudarte a cotizar productos, comparar alternativas, ver precios por volumen o conectarte con Laura Mendez. Que necesitas?"
          ),
        ],
      };
    }

    default: {
      return {
        intent,
        messages: [
          makeAIMsg(
            "Entendido. Puedo ayudarte a buscar productos por SKU o nombre, comparar alternativas, ver productos complementarios o gestionar tu cotizacion. Que necesitas?"
          ),
        ],
      };
    }
  }
}
