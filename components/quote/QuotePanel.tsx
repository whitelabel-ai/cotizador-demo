"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Send,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { QuoteLineItem } from "./QuoteLineItem";
import { calculateTotals } from "@/lib/quote-calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Quote } from "@/data/quotes";

interface QuotePanelProps {
  quote: Quote;
  onQtyChange: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onDiscountChange: (id: string, discount: number) => void;
  onRequestReview: () => void;
  onConfirm: () => void;
}

const statusConfig: Record<
  Quote["status"],
  { label: string; variant: "brand" | "neutral" | "ai" | "success" | "warning" | "danger" | "review" | "outline"; icon: React.ReactNode }
> = {
  draft: { label: "Borrador", variant: "neutral", icon: <FileText className="h-3 w-3" /> },
  pending_review: { label: "Pendiente revision", variant: "warning", icon: <Clock className="h-3 w-3" /> },
  commercial_review: { label: "Revision comercial", variant: "review", icon: <AlertCircle className="h-3 w-3" /> },
  confirmed: { label: "Confirmada", variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
  sent: { label: "Enviada", variant: "ai", icon: <Send className="h-3 w-3" /> },
  expired: { label: "Expirada", variant: "danger", icon: <AlertCircle className="h-3 w-3" /> },
};

export function QuotePanel({
  quote,
  onQtyChange,
  onRemoveItem,
  onDiscountChange,
  onRequestReview,
  onConfirm,
}: QuotePanelProps) {
  const router = useRouter();
  const totals = calculateTotals(quote.items);
  const status = statusConfig[quote.status];
  const isEmpty = quote.items.length === 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="ui-title">{quote.number}</h2>
            <Badge variant={status.variant}>
              {status.icon}
              {status.label}
            </Badge>
          </div>
          <p className="ui-body-sm">
            Vence: {formatDate(quote.expiresAt)} · {quote.origin === "whatsapp" ? "WhatsApp" : "Web"}
          </p>
        </div>

        <Button
          variant="outline"
          size="icon"
          className="h-9 w-9"
          onClick={() => router.push(`/quote/${quote.id}`)}
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>

      <Card variant="subtle" className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <CardContent className="flex h-full flex-col p-0">
            {isEmpty ? (
              <div className="flex h-full flex-col items-center justify-center px-4 py-12 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--bg-subtle)] text-[var(--text-muted)]">
                  <Tag className="h-5 w-5" />
                </div>
                <p className="ui-title">Sin productos</p>
                <p className="ui-body-sm mt-1">
                  Agrega productos desde el chat para comenzar la cotizacion.
                </p>
              </div>
            ) : (
              <div className="flex-1 space-y-2 overflow-y-auto px-4 py-2">
                {quote.items.map((item) => (
                  <QuoteLineItem
                    key={item.id}
                    item={item}
                    onQtyChange={onQtyChange}
                    onRemove={onRemoveItem}
                    onDiscountChange={onDiscountChange}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </ScrollArea>
      </Card>

      {!isEmpty && (
        <Card variant="raised">
          <CardContent className="space-y-2 p-4">
            <div className="flex justify-between ui-body-sm">
              <span>Subtotal ({totals.itemCount} uds.)</span>
              <span>{formatCurrency(totals.subtotal)}</span>
            </div>
            {totals.discountAmount > 0 && (
              <div className="flex justify-between ui-body-sm text-[var(--status-success-text)]">
                <span>Descuentos</span>
                <span>- {formatCurrency(totals.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between ui-body-sm">
              <span>IVA 19%</span>
              <span>{formatCurrency(totals.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between">
              <span className="ui-title">Total</span>
              <span className="ui-h3 text-[1.2rem]">{formatCurrency(totals.total)}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-2">
        {totals.requiresReview && quote.status !== "commercial_review" && (
          <div className="ui-status-note rounded-[var(--radius-16)] border border-[color:var(--status-review-border)] bg-[var(--status-review-surface)] text-[var(--status-review-text)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="ui-title text-[var(--status-review-text)]">
                Se requiere aprobacion comercial
              </p>
              <p className="ui-body-sm mt-1 text-[var(--status-review-text)]">
                Un descuento supera el umbral automatico permitido.
              </p>
            </div>
          </div>
        )}

        {quote.status === "commercial_review" && (
          <div className="ui-status-note rounded-[var(--radius-16)] border border-[color:var(--status-review-border)] bg-[var(--status-review-surface)] text-[var(--status-review-text)]">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="ui-title text-[var(--status-review-text)]">
                En revision por Laura Mendez
              </p>
              <p className="ui-body-sm mt-1 text-[var(--status-review-text)]">
                El equipo comercial respondera pronto con el ajuste de precio.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push(`/quote/${quote.id}`)}>
            <Download className="h-3.5 w-3.5" />
            Descargar
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Send className="h-3.5 w-3.5" />
            Enviar
          </Button>
        </div>

        <Button
          variant={quote.status === "commercial_review" ? "secondary" : "warning"}
          size="sm"
          className="gap-1.5"
          onClick={onRequestReview}
          disabled={quote.status === "commercial_review"}
        >
          <Tag className="h-3.5 w-3.5" />
          Solicitar mejor precio
        </Button>

        <Button
          variant="primary"
          size="sm"
          className="gap-1.5"
          onClick={onConfirm}
          disabled={isEmpty || quote.status === "confirmed"}
        >
          <CheckCircle className="h-3.5 w-3.5" />
          Confirmar cotizacion
        </Button>
      </div>
    </div>
  );
}
