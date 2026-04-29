"use client";

import React from "react";
import { AlertCircle, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { calculateLineTotal } from "@/lib/quote-calculations";
import { formatCurrency } from "@/lib/utils";
import type { QuoteLineItem as QuoteLineItemType } from "@/data/quotes";

interface QuoteLineItemProps {
  item: QuoteLineItemType;
  onQtyChange: (id: string, qty: number) => void;
  onRemove: (id: string) => void;
  onDiscountChange?: (id: string, discount: number) => void;
}

export function QuoteLineItem({
  item,
  onQtyChange,
  onRemove,
  onDiscountChange,
}: QuoteLineItemProps) {
  const lineTotal = calculateLineTotal(item);
  const hasDiscount = item.discountPercent > 0;

  return (
    <div className="border-b border-[color:var(--border-default)] py-3 last:border-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-mono">{item.sku}</span>
            {item.discountPercent >= 15 && (
              <Badge variant="warning">
                <AlertCircle className="h-3 w-3" />
                Revision
              </Badge>
            )}
          </div>
          <p className="ui-title leading-6">{item.name}</p>
          <p className="ui-body-sm">{item.brand}</p>
        </div>
        <Button
          variant="tertiary"
          size="icon"
          className="h-8 w-8 shrink-0 text-[var(--text-muted)] hover:text-[var(--status-critical-text)]"
          onClick={() => onRemove(item.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center overflow-hidden rounded-[var(--radius-12)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)]">
          <button
            onClick={() => onQtyChange(item.id, Math.max(1, item.qty - 1))}
            className="flex h-7 w-7 items-center justify-center text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
          >
            -
          </button>
          <span className="w-8 text-center text-sm font-semibold text-[var(--text-primary)]">
            {item.qty}
          </span>
          <button
            onClick={() => onQtyChange(item.id, item.qty + 1)}
            className="flex h-7 w-7 items-center justify-center text-sm font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
          >
            +
          </button>
        </div>

        <div className="min-w-0 flex-1">
          <p className="ui-body-sm">
            {formatCurrency(item.unitPrice)} c/u
            {hasDiscount && (
              <span className="ml-1 font-semibold text-[var(--status-success-text)]">
                -{item.discountPercent}%
              </span>
            )}
          </p>
        </div>

        <div className="ui-title shrink-0">{formatCurrency(lineTotal)}</div>
      </div>

      {onDiscountChange && (
        <div className="mt-3 flex items-center gap-2">
          <span className="ui-label">Descuento %</span>
          <input
            type="number"
            min={0}
            max={30}
            value={item.discountPercent}
            onChange={(event) => onDiscountChange(item.id, Number(event.target.value))}
            className="h-7 w-16 rounded-[var(--radius-12)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] text-center text-xs text-[var(--text-primary)] shadow-[var(--shadow-subtle)] focus:outline-none focus:ring-[3px] focus:ring-[color:var(--ring-brand)]"
          />
        </div>
      )}
    </div>
  );
}
