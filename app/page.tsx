"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  LayoutGrid,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversationSidebar } from "@/components/customer/ConversationSidebar";
import { ChatWorkspace } from "@/components/chat/ChatWorkspace";
import { QuotePanel } from "@/components/quote/QuotePanel";
import { defaultCustomer } from "@/data/customers";
import { initialConversation } from "@/data/conversations";
import { initialQuote, salesDashboardQuotes } from "@/data/quotes";
import { getProductById } from "@/data/products";
import { resolveUnitPrice } from "@/lib/pricing-engine";
import { generateId } from "@/lib/utils";
import {
  saveQuotes,
  saveMessages,
  deleteQuote,
  duplicateQuote as duplicateQuoteStorage,
  clearAll,
  loadQuotes,
  loadMessages,
  loadAllMessages,
} from "@/lib/storage";
import type { Message } from "@/data/conversations";
import type { Product } from "@/data/products";
import type { Quote, QuoteLineItem } from "@/data/quotes";

const demoQuotes: Quote[] = [
  {
    ...initialQuote,
    id: "quote-001",
    items: [],
    lastIntent: "Nueva conversación",
  },
  {
    ...salesDashboardQuotes[0],
    id: "quote-002",
    lastIntent: "Cotización inicial — producto LD101",
  },
  {
    ...salesDashboardQuotes[1],
    id: "quote-003",
    lastIntent: "Solicitud de mejor precio",
  },
];

const demoMessages: Record<string, Message[]> = {
  "quote-001": initialConversation.messages,
  "quote-002": salesDashboardQuotes[0].items.length > 0
    ? [
        {
          id: "msg-existing-1",
          role: "ai",
          type: "text",
          content: "Cotización Q-2024-0924 creada con 5 unidades de LD101.",
          timestamp: new Date().toISOString(),
        },
      ]
    : [],
  "quote-003": [
    {
      id: "msg-existing-2",
      role: "ai",
      type: "text",
      content: "Cotización Q-2024-0921 en revisión comercial.",
      timestamp: new Date().toISOString(),
    },
  ],
};

export default function HomePage() {
  const router = useRouter();
  const customer = defaultCustomer;

  const [quotes, setQuotes] = useState<Quote[]>(demoQuotes);
  const [messagesByQuote, setMessagesByQuote] = useState<Record<string, Message[]>>(demoMessages);
  const [activeQuoteId, setActiveQuoteId] = useState<string>("quote-001");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedQuotes = loadQuotes();
    const savedMessages = loadAllMessages();

    if (savedQuotes.length > 0 && Object.keys(savedMessages).length > 0) {
      setQuotes(savedQuotes);
      setMessagesByQuote(savedMessages);
      setActiveQuoteId(savedQuotes[0].id);
    } else {
      saveQuotes(demoQuotes);
      Object.entries(demoMessages).forEach(([quoteId, msgs]) => {
        saveMessages(quoteId, msgs);
      });
    }
    setIsLoaded(true);
  }, []);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [mobileView, setMobileView] = useState("chat");

  const activeQuote = quotes.find((q) => q.id === activeQuoteId) || quotes[0] || demoQuotes[0];
  const activeMessages = messagesByQuote[activeQuoteId] || demoMessages["quote-001"] || [];
  const addedProductIds = activeQuote?.items?.map((item) => item.productId) || [];

  const handleAddToQuote = useCallback((product: Product, qty: number, unitPrice: number) => {
    setQuotes((prev) => prev.map((quote) => {
      if (quote.id !== activeQuoteId) return quote;

      const existing = quote.items.find((item) => item.productId === product.id);
      if (existing) {
        return {
          ...quote,
          items: quote.items.map((item) =>
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

      return { ...quote, items: [...quote.items, newItem] };
    }));
    setMobileView("quote");
  }, [activeQuoteId]);

  const handleQtyChange = useCallback((id: string, qty: number) => {
    setQuotes((prev) => prev.map((quote) => {
      if (quote.id !== activeQuoteId) return quote;

      const updatedItems = quote.items.map((item) => {
        if (item.id !== id) return item;
        const product = getProductById(item.productId);
        if (!product) return { ...item, qty };

        const newPrice = resolveUnitPrice(product, customer.priceList, qty);
        return { ...item, qty, unitPrice: newPrice };
      });

      return { ...quote, items: updatedItems };
    }));
  }, [activeQuoteId, customer.priceList]);

  const handleRemoveItem = useCallback((id: string) => {
    setQuotes((prev) => prev.map((quote) => 
      quote.id === activeQuoteId 
        ? { ...quote, items: quote.items.filter((item) => item.id !== id) }
        : quote
    ));
  }, [activeQuoteId]);

  const handleDiscountChange = useCallback((id: string, discount: number) => {
    setQuotes((prev) => prev.map((quote) =>
      quote.id === activeQuoteId
        ? {
            ...quote,
            items: quote.items.map((item) =>
              item.id === id ? { ...item, discountPercent: Math.min(30, Math.max(0, discount)) } : item
            ),
          }
        : quote
    ));
  }, [activeQuoteId]);

  const handleRequestReview = useCallback(() => {
    setQuotes((prev) => prev.map((quote) =>
      quote.id === activeQuoteId
        ? { ...quote, status: "commercial_review" as const }
        : quote
    ));
  }, [activeQuoteId]);

  const handleConfirm = useCallback(() => {
    setQuotes((prev) => prev.map((quote) =>
      quote.id === activeQuoteId
        ? { ...quote, status: "confirmed" as const }
        : quote
    ));
    router.push(`/quote/${activeQuoteId}`);
  }, [activeQuoteId, router]);

  const handleMessagesChange = useCallback((msgs: Message[]) => {
    setMessagesByQuote((prev) => ({
      ...prev,
      [activeQuoteId]: msgs,
    }));
  }, [activeQuoteId]);

  const handleSelectQuote = useCallback((quoteId: string) => {
    setActiveQuoteId(quoteId);
  }, []);

  const handleDeleteQuote = useCallback((quoteId: string) => {
    deleteQuote(quoteId);
    setQuotes((prev) => {
      const filtered = prev.filter((q) => q.id !== quoteId);
      if (activeQuoteId === quoteId && filtered.length > 0) {
        setActiveQuoteId(filtered[0].id);
      }
      return filtered;
    });
    setMessagesByQuote((prev) => {
      const newMessages: Record<string, Message[]> = {};
      Object.keys(prev).forEach((key) => {
        if (key !== quoteId) {
          newMessages[key] = prev[key];
        }
      });
      return newMessages;
    });
  }, [activeQuoteId]);

  const handleDuplicateQuote = useCallback((quoteId: string) => {
    const newQuote = duplicateQuoteStorage(quoteId);
    if (newQuote) {
      setQuotes((prev) => [newQuote, ...prev]);
      setActiveQuoteId(newQuote.id);
      const originalMessages = loadMessages(quoteId);
      if (originalMessages.length > 0) {
        setMessagesByQuote((prev) => ({
          ...prev,
          [newQuote.id]: [
            {
              id: `msg-${Date.now()}`,
              role: "ai",
              type: "text",
              content: `Cotización duplicada de ${quotes.find((q) => q.id === quoteId)?.number}.`,
              timestamp: new Date().toISOString(),
            },
          ],
        }));
      }
    }
  }, [quotes]);

  const handleClearAll = useCallback(() => {
    if (confirm("¿Estás seguro de que quieres borrar todas las cotizaciones y conversaciones? Esta acción no se puede deshacer.")) {
      clearAll();
      setQuotes(demoQuotes);
      setMessagesByQuote(demoMessages);
      setActiveQuoteId("quote-001");
    }
  }, []);

  const handleNewConversation = useCallback(() => {
    const newQuoteId = `quote-${generateId()}`;
    const newQuote: Quote = {
      ...initialQuote,
      id: newQuoteId,
      number: `Q-2024-${String(quotes.length + 1).padStart(3, "0")}`,
      items: [],
      lastIntent: "Nueva conversación",
    };
    setQuotes((prev) => [newQuote, ...prev]);
    setMessagesByQuote((prev) => ({
      ...prev,
      [newQuoteId]: [
        {
          id: `msg-${generateId()}`,
          role: "ai",
          type: "text",
          content: "¡Hola! Soy tu asistente comercial. ¿Qué producto necesitas cotizar hoy?",
          timestamp: new Date().toISOString(),
        },
      ],
    }));
    setActiveQuoteId(newQuoteId);
  }, [quotes.length]);

  return (
    <div className="flex h-full flex-col">
      <div className="ui-page-shell flex h-full flex-col gap-4 py-4">
        <header className="ui-surface-raised flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-24)] px-4 py-4 sm:px-5">
          <div className="flex min-w-0 flex-wrap items-center gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-12)] bg-[var(--color-brand-500)] text-[var(--text-inverse)]">
                  <LayoutGrid className="h-4 w-4" />
                </div>
                <h1 className="ui-h3 text-[1.35rem]">Espacio de cotizacion</h1>
                <Badge variant="outline">{activeQuote.number}</Badge>
                {activeQuote.status === "commercial_review" && (
                  <Badge variant="review">Revision comercial</Badge>
                )}
                {activeQuote.status === "confirmed" && (
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
            <div className="w-[20rem] shrink-0">
              <ConversationSidebar
                customer={customer}
                quotes={quotes}
                activeQuoteId={activeQuoteId}
                onSelectQuote={handleSelectQuote}
                onNewConversation={handleNewConversation}
                onDeleteQuote={handleDeleteQuote}
                onDuplicateQuote={handleDuplicateQuote}
                onClearAll={handleClearAll}
              />
            </div>
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
              messages={activeMessages}
              priceList={customer.priceList}
              addedProductIds={addedProductIds}
              onAddToQuote={handleAddToQuote}
              onMessagesChange={handleMessagesChange}
              onRequestReview={handleRequestReview}
            />
          </PanelShell>

          <PanelShell
            title="Cotizacion activa"
            badge="Quote"
            className="w-[22rem] shrink-0"
          >
            <QuotePanel
              quote={activeQuote}
              customer={customer}
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
                <TabsTrigger value="conversations">Conversaciones</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="quote">Cotizacion</TabsTrigger>
              </TabsList>

              <TabsContent value="conversations" className="min-h-0 flex-1 overflow-hidden">
                <ConversationSidebar
                  customer={customer}
                  quotes={quotes}
                  activeQuoteId={activeQuoteId}
                  onSelectQuote={handleSelectQuote}
                  onNewConversation={handleNewConversation}
                  onDeleteQuote={handleDeleteQuote}
                  onDuplicateQuote={handleDuplicateQuote}
                  onClearAll={handleClearAll}
                />
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
                    messages={activeMessages}
                    priceList={customer.priceList}
                    addedProductIds={addedProductIds}
                    onAddToQuote={handleAddToQuote}
                    onMessagesChange={handleMessagesChange}
                    onRequestReview={handleRequestReview}
                  />
                </PanelShell>
              </TabsContent>

              <TabsContent value="quote" className="min-h-0 flex-1 overflow-hidden">
                <PanelShell title="Cotizacion activa" badge="Quote" compact>
                  <QuotePanel
                    quote={activeQuote}
                    customer={customer}
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
