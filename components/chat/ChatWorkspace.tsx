"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ComplementaryProducts } from "@/components/products/ComplementaryProducts";
import { ProductComparator } from "@/components/products/ProductComparator";
import { ProductCard } from "@/components/products/ProductCard";
import { MessageBubble, TypingIndicator } from "./MessageBubble";
import { quickActions } from "@/data/conversations";
import { getProductById } from "@/data/products";
import { routeMessage } from "@/lib/mock-ai-router";
import { generateId } from "@/lib/utils";
import type { Message } from "@/data/conversations";
import type { PriceList } from "@/data/customers";
import type { Product } from "@/data/products";

interface ChatWorkspaceProps {
  messages: Message[];
  priceList: PriceList;
  addedProductIds: string[];
  onAddToQuote: (product: Product, qty: number, unitPrice: number) => void;
  onMessagesChange: (msgs: Message[]) => void;
  onRequestReview: () => void;
}

export function ChatWorkspace({
  messages,
  priceList,
  addedProductIds,
  onAddToQuote,
  onMessagesChange,
  onRequestReview,
}: ChatWorkspaceProps) {
  const [inputValue, setInputValue] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const lastProductId = React.useMemo(() => {
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      if (messages[index].productId) return messages[index].productId;
    }

    return undefined;
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: `msg-${generateId()}`,
      role: "customer",
      type: "text",
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    onMessagesChange([...messages, userMsg]);
    setInputValue("");
    setIsTyping(true);

    if (/descuento|mejor precio|rebaja/i.test(text)) {
      onRequestReview();
    }

    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 600));

    const response = routeMessage(text, lastProductId);
    setIsTyping(false);
    onMessagesChange([...messages, userMsg, ...response.messages]);
  }, [lastProductId, messages, onMessagesChange, onRequestReview]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <ScrollArea className="flex-1 min-h-0">
        <div className="space-y-4 px-4 py-4">
          {messages.map((msg) => {
            if (msg.type === "product_card" && msg.productId) {
              const product = getProductById(msg.productId);
              if (!product) return null;

              return (
                <div key={msg.id} className="message-in space-y-3">
                  <MessageBubble message={msg} />
                  <div className="ml-11">
                    <ProductCard
                      product={product}
                      priceList={priceList}
                      initialQty={(msg.metadata?.qty as number) || 1}
                      onAddToQuote={onAddToQuote}
                      isAdded={addedProductIds.includes(product.id)}
                    />
                  </div>
                </div>
              );
            }

            if (msg.type === "product_comparison" && msg.productIds) {
              const products = msg.productIds
                .map((id) => getProductById(id))
                .filter((item): item is Product => Boolean(item));
              const baseId = msg.productId ?? msg.productIds[0];

              return (
                <div key={msg.id} className="message-in space-y-3">
                  <MessageBubble message={{ ...msg, type: "text" }} />
                  <div className="ml-11">
                    <ProductComparator
                      products={products}
                      priceList={priceList}
                      baseProductId={baseId}
                      onSelect={(product, unitPrice) => onAddToQuote(product, 1, unitPrice)}
                    />
                  </div>
                </div>
              );
            }

            if (msg.type === "complementary_products" && msg.productIds) {
              const products = msg.productIds
                .map((id) => getProductById(id))
                .filter((item): item is Product => Boolean(item));

              return (
                <div key={msg.id} className="message-in space-y-3">
                  <MessageBubble message={{ ...msg, type: "text" }} />
                  <div className="ml-11">
                    <ComplementaryProducts
                      products={products}
                      priceList={priceList}
                      addedIds={addedProductIds}
                      onAdd={(product, unitPrice) => onAddToQuote(product, 1, unitPrice)}
                    />
                  </div>
                </div>
              );
            }

            if (msg.type === "commercial_review") {
              return (
                <div key={msg.id} className="message-in space-y-3">
                  <MessageBubble message={{ ...msg, type: "text" }} />
                  <div className="ml-11 ui-status-note rounded-[var(--radius-16)] border border-[color:var(--status-review-border)] bg-[var(--status-review-surface)] text-[var(--status-review-text)]">
                    <span className="text-base">#</span>
                    <div>
                      <p className="ui-title text-[var(--status-review-text)]">
                        Revision comercial registrada
                      </p>
                      <p className="ui-body-sm mt-1 text-[var(--status-review-text)]">
                        Laura Mendez ha sido notificada y revisara tu solicitud en breve.
                      </p>
                    </div>
                  </div>
                </div>
              );
            }

            return <MessageBubble key={msg.id} message={msg} />;
          })}

          {isTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t border-[color:var(--border-default)] px-4 pb-2 pt-3">
        <div className="flex flex-wrap gap-1.5">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => sendMessage(action.intent)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--border-default)] bg-[var(--surface-raised)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:border-[color:var(--border-strong)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            >
              <Sparkles className="h-3 w-3 text-[var(--status-ai-solid)]" />
              {action.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-[color:var(--border-default)] bg-[var(--surface-default)] p-4 pt-3">
        <div className="flex items-end gap-2 rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] px-3 py-2 shadow-[var(--shadow-subtle)] focus-within:border-[color:var(--color-brand-500)] focus-within:ring-[3px] focus-within:ring-[color:var(--ring-brand)]">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe una referencia, SKU o pregunta comercial..."
            rows={1}
            className="min-h-8 max-h-32 flex-1 resize-none bg-transparent py-1 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <Button
            size="icon"
            className="h-9 w-9 shrink-0"
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isTyping}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="ui-body-sm mt-2 text-center text-[var(--text-muted)]">
          Enter para enviar · Shift+Enter para nueva linea
        </p>
      </div>
    </div>
  );
}
