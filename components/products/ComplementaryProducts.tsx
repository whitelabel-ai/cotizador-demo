"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, CheckCircle, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { getPriceForList } from "@/data/pricingRules";
import type { PriceList } from "@/data/customers";
import type { Product } from "@/data/products";

interface ComplementaryProductsProps {
  products: Product[];
  priceList: PriceList;
  addedIds: string[];
  onAdd: (product: Product, unitPrice: number) => void;
}

const accentMap: Record<string, { bg: string; border: string; text: string }> = {
  cintas_ribbon: { bg: "var(--status-warning-surface)", border: "var(--status-warning-border)", text: "var(--status-warning-text)" },
  etiquetas: { bg: "var(--status-success-surface)", border: "var(--status-success-border)", text: "var(--status-success-text)" },
  lectores_codigo: { bg: "var(--status-review-surface)", border: "var(--status-review-border)", text: "var(--status-review-text)" },
  cajones_monedero: { bg: "var(--surface-subtle)", border: "var(--border-default)", text: "var(--text-secondary)" },
  accesorios: { bg: "var(--status-ai-surface)", border: "var(--status-ai-border)", text: "var(--status-ai-text)" },
};

export function ComplementaryProducts({
  products,
  priceList,
  addedIds,
  onAdd,
}: ComplementaryProductsProps) {
  const router = useRouter();
  if (!products.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--status-ai-solid)] text-[var(--text-inverse)]">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <p className="ui-title">Productos complementarios</p>
          <Badge variant="ai">Sugeridos para esta referencia</Badge>
        </div>
      </div>

      <div className="grid gap-2">
        {products.map((product) => {
          const price = getPriceForList(product, priceList);
          const isAdded = addedIds.includes(product.id);
          const accent = accentMap[product.category] ?? accentMap.accesorios;

          return (
            <div
              key={product.id}
              className={cn(
                "rounded-[var(--radius-20)] border p-3 transition-colors",
                isAdded
                  ? "border-[color:var(--status-success-border)] bg-[var(--status-success-surface)]"
                  : "border-[color:var(--border-default)] bg-[var(--surface-raised)]"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-16)] border text-2xl"
                  style={{
                    background: accent.bg,
                    borderColor: accent.border,
                    color: accent.text,
                  }}
                >
                  {product.imagePlaceholder}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="ui-mono">{product.sku}</span>
                    {product.badge && <Badge variant="outline">{product.badge}</Badge>}
                  </div>
                  <p className="ui-title mt-2">{product.name}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3">
                    <span className="ui-body-sm">{product.brand}</span>
                    <span className="inline-flex items-center gap-1 ui-body-sm">
                      <ShieldCheck className="h-3 w-3 text-[var(--text-muted)]" />
                      {product.warranty}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="ui-title">{formatCurrency(price)}</p>
                    <p className="ui-body-sm mt-1">por unidad</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="tertiary"
                      size="sm"
                      className="h-8 gap-1 text-[var(--text-muted)]"
                      onClick={() => router.push(`/product/${product.sku}`)}
                    >
                      Detalle
                      <ArrowUpRight className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant={isAdded ? "success" : "primary"}
                      onClick={() => onAdd(product, price)}
                      disabled={isAdded}
                    >
                      {isAdded ? (
                        <>
                          <CheckCircle className="h-3.5 w-3.5" />
                          Agregado
                        </>
                      ) : (
                        <>
                          <Plus className="h-3.5 w-3.5" />
                          Agregar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
