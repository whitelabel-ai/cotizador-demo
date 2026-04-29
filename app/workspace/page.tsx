"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  ChevronLeft,
  LayoutGrid,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { CustomerPanel } from "@/components/customer/CustomerPanel";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { QuotePanel } from "@/components/quote/QuotePanel";
import { defaultCustomer } from "@/data/customers";
import { initialConversation } from "@/data/conversations";
import { initialQuote } from "@/data/quotes";
import { getProductById } from "@/data/products";
import { resolveUnitPrice } from "@/lib/pricing-engine";
import { generateId } from "@/lib/utils";
import type { Message } from "@/data/conversations";
import type { Product } from "@/data/products";
import type { Quote, QuoteLineItem } from "@/data/quotes";

export default function WorkspacePage() {
  const router = useRouter();
  const customer = defaultCustomer;

  const [messages, setMessages] = useState<Message[]>(initialConversation.messages);
  const [quote, setQuote] = useState<Quote>({
    ...initialQuote,
    items: [],
  });
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState("chat");

  const addedProductIds = quote.items.map((item) => item.productId);

  const handleAddToQuote = useCallback((product: Product, qty: number, unitPrice: number) => {
    setQuote((prev) => {
      const existing = prev.items.find((item) => item.productId === product.id);
      if (existing) {
        return {
          ...prev,
          items: prev.items.map((item) =>
            item.productId === product.id ? { ...item, qty: item.qty + qty } : item
          ),
        };
      }

      const newItem: QuoteLineItem = {
        id: `li-${generateId()}`,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        brand: product.brand,
        qty,
        unitPrice,
        discountPercent: 0,
        stock: product.visibleStock,
      };

      return { ...prev, items: [...prev.items, newItem] };
    });
    setMobileView("quote");
  }, []);

  const handleQtyChange = useCallback((id: string, qty: number) => {
    setQuote((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.id !== id) return item;
        const product = getProductById(item.productId);
        if (!product) return { ...item, qty };

        const newPrice = resolveUnitPrice(product, customer.priceList, qty);
        return { ...item, qty, unitPrice: newPrice };
      });

      return { ...prev, items: updatedItems };
    });
  }, [customer.priceList]);

  const handleRemoveItem = useCallback((id: string) => {
    setQuote((prev) => ({ ...prev, items: prev.items.filter((item) => item.id !== id) }));
  }, []);

  const handleDiscountChange = useCallback((id: string, discount: number) => {
    setQuote((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, discountPercent: Math.min(30, Math.max(0, discount)) } : item
      ),
    }));
  }, []);

  const handleRequestReview = useCallback(() => {
    setQuote((prev) => ({ ...prev, status: "commercial_review" }));
  }, []);

  const handleConfirm = useCallback(() => {
    setQuote((prev) => ({ ...prev, status: "confirmed" }));
    router.push(`/quote/${quote.id}`);
  }, [quote.id, router]);

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="ui-page-shell flex min-h-[calc(100vh-2rem)] flex-col gap-4">
        <header className="ui-surface-raised flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-24)] px-4 py-4 sm:px-5">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <button
              onClick={() => router.push("/continue/sess-wa-7f3k2m")}
              className="inline-flex items-center gap-1.5 rounded-xl px-2 py-1 text-sm text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            >
              <ChevronLeft className="h-4 w-4" />
              Volver
            </button>
            <Separator orientation="vertical" className="hidden h-5 sm:block" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-12)] bg-[var(--color-brand-500)] text-[var(--text-inverse)]">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <h1 className="ui-h3 text-[1.35rem]">Espacio de cotizacion</h1>
                <Badge variant="outline">{quote.number}</Badge>
                {quote.status === "commercial_review" && (
                  <Badge variant="review">Revision comercial</Badge>
                )}
                {quote.status === "confirmed" && (
                  <Badge variant="success">Confirmada</Badge>
                )}
              </div>
              <p className="ui-body-sm">
                Chat, contexto del cliente y cotizacion activa en un solo workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/sales")}>
              <BarChart3 className="h-3.5 w-3.5" />
              Dashboard
            </Button>
            <Button
              variant="tertiary"
              size="icon"
              className="hidden h-9 w-9 lg:inline-flex"
              onClick={() => setLeftCollapsed((state) => !state)}
            >
              <Users className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] px-2.5 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-500)] text-xs font-semibold text-[var(--text-inverse)]">
                LM
              </div>
              <div className="hidden sm:block">
                <p className="ui-body-sm text-[var(--text-primary)]">Laura Mendez</p>
                <p className="ui-body-sm text-[var(--text-muted)]">Vendedora senior</p>
              </div>
            </div>
          </div>
        </header>

        <div className="hidden min-h-0 flex-1 gap-4 lg:flex">
          {!leftCollapsed && (
            <PanelShell
              title="Contexto del cliente"
              badge="Cliente"
              className="w-[18.5rem] shrink-0"
            >
              <CustomerPanel customer={customer} />
            </PanelShell>
          )}

          <PanelShell
            title="Asistente comercial IA"
            badge="Conversacion"
            badgeTone="ai"
            className="min-w-0 flex-1"
            actions={
              <div className="flex items-center gap-2 text-[var(--text-muted)]">
                <Sparkles className="h-4 w-4 text-[var(--status-ai-solid)]" />
                <span className="ui-body-sm">Activo</span>
              </div>
            }
          >
            <ChatWorkspace
              messages={messages}
              priceList={customer.priceList}
              addedProductIds={addedProductIds}
              onAddToQuote={handleAddToQuote}
              onMessagesChange={setMessages}
              onRequestReview={handleRequestReview}
            />
          </PanelShell>

          <PanelShell
            title="Cotizacion activa"
            badge="Quote"
            className="w-[22rem] shrink-0"
          >
            <QuotePanel
              quote={quote}
              onQtyChange={handleQtyChange}
              onRemoveItem={handleRemoveItem}
              onDiscountChange={handleDiscountChange}
              onRequestReview={handleRequestReview}
              onConfirm={handleConfirm}
            />
          </PanelShell>
        </div>

        <div className="flex min-h-0 flex-1 lg:hidden">
          <div className="ui-surface-raised flex min-h-0 flex-1 flex-col rounded-[var(--radius-24)] p-3">
            <Tabs value={mobileView} onValueChange={setMobileView} className="flex min-h-0 flex-1 flex-col">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="customer">Cliente</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="quote">Cotizacion</TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="min-h-0 flex-1 overflow-hidden">
                <PanelShell title="Contexto del cliente" badge="Cliente" compact>
                  <CustomerPanel customer={customer} />
                </PanelShell>
              </TabsContent>

              <TabsContent value="chat" className="min-h-0 flex-1 overflow-hidden">
                <PanelShell
                  title="Asistente comercial IA"
                  badge="Conversacion"
                  badgeTone="ai"
                  compact
                  actions={
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Sparkles className="h-4 w-4 text-[var(--status-ai-solid)]" />
                      <span className="ui-body-sm">Activo</span>
                    </div>
                  }
                >
                  <ChatWorkspace
                    messages={messages}
                    priceList={customer.priceList}
                    addedProductIds={addedProductIds}
                    onAddToQuote={handleAddToQuote}
                    onMessagesChange={setMessages}
                    onRequestReview={handleRequestReview}
                  />
                </PanelShell>
              </TabsContent>

              <TabsContent value="quote" className="min-h-0 flex-1 overflow-hidden">
                <PanelShell title="Cotizacion activa" badge="Quote" compact>
                  <QuotePanel
                    quote={quote}
                    onQtyChange={handleQtyChange}
                    onRemoveItem={handleRemoveItem}
                    onDiscountChange={handleDiscountChange}
                    onRequestReview={handleRequestReview}
                    onConfirm={handleConfirm}
                  />
                </PanelShell>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}

function PanelShell({
  title,
  badge,
  badgeTone = "outline",
  actions,
  compact = false,
  className,
  children,
}: {
  title: string;
  badge: string;
  badgeTone?: "brand" | "neutral" | "ai" | "success" | "warning" | "danger" | "review" | "outline";
  actions?: React.ReactNode;
  compact?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`ui-surface-raised flex min-h-0 flex-col rounded-[var(--radius-24)] ${className ?? ""}`}>
      <div className={`ui-panel-header ${compact ? "px-4 py-3" : ""}`}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={badgeTone}>{badge}</Badge>
            <p className="ui-title">{title}</p>
          </div>
        </div>
        {actions}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}
