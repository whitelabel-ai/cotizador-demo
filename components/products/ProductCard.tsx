"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  CheckCircle,
  Plus,
  ShieldCheck,
  TrendingDown,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getApplicableVolumeTier, getNextVolumeTier } from "@/lib/pricing-engine";
import { cn, formatCurrency } from "@/lib/utils";
import { getPriceForList } from "@/data/pricingRules";
import type { PriceList } from "@/data/customers";
import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  priceList: PriceList;
  initialQty?: number;
  onAddToQuote?: (product: Product, qty: number, unitPrice: number) => void;
  isAdded?: boolean;
}

const categoryGradients: Record<string, { from: string; to: string; ring: string }> = {
  impresoras_etiquetas: { from: "#eff6ff", to: "#ffffff", ring: "rgba(37,99,235,0.22)" },
  impresoras_termicas: { from: "#eef2ff", to: "#ffffff", ring: "rgba(79,70,229,0.2)" },
  cintas_ribbon: { from: "#fff8eb", to: "#ffffff", ring: "rgba(217,119,6,0.2)" },
  etiquetas: { from: "#effaf4", to: "#ffffff", ring: "rgba(22,163,74,0.18)" },
  lectores_codigo: { from: "#f6f2ff", to: "#ffffff", ring: "rgba(124,58,237,0.18)" },
  cajones_monedero: { from: "#f6f8fb", to: "#ffffff", ring: "rgba(71,85,105,0.18)" },
  accesorios: { from: "#edfdfa", to: "#ffffff", ring: "rgba(20,184,166,0.18)" },
};

export function ProductCard({
  product,
  priceList,
  initialQty = 1,
  onAddToQuote,
  isAdded,
}: ProductCardProps) {
  const router = useRouter();
  const [qty, setQty] = React.useState(initialQty);

  const unitPrice = getPriceForList(product, priceList);
  const nextTier = getNextVolumeTier(product, qty);
  const activeTier = getApplicableVolumeTier(product, qty);
  const savings = product.basePrice - unitPrice;
  const savingsPct = Math.round((savings / product.basePrice) * 100);
  const lowStock = product.visibleStock <= 10;
  const gradient = categoryGradients[product.category] ?? categoryGradients.accesorios;

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-24)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]"
      style={{ boxShadow: `0 18px 36px ${gradient.ring}` }}
    >
      <div
        className="border-b border-[color:var(--border-default)] px-5 pb-4 pt-5"
        style={{ background: `linear-gradient(180deg, ${gradient.from}, ${gradient.to})` }}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {product.badge && (
              <Badge variant={product.isRecommended ? "ai" : "brand"}>
                {product.isRecommended ? "Recomendado" : product.badge}
              </Badge>
            )}
            {savingsPct > 0 && (
              <Badge variant="success">
                <TrendingDown className="h-3 w-3" />
                -{savingsPct}% vs lista
              </Badge>
            )}
          </div>
          <Button
            variant="tertiary"
            size="sm"
            className="h-8 gap-1 text-[var(--text-muted)]"
            onClick={() => router.push(`/product/${product.sku}`)}
          >
            Ver detalle
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>

        <div className="flex items-end gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] text-4xl">
            {product.imagePlaceholder}
          </div>
          <div className="min-w-0 flex-1">
            <p className="ui-mono">{product.sku}</p>
            <h4 className="ui-h3 mt-2 text-[1.15rem] leading-6">{product.name}</h4>
            <p className="ui-body-sm mt-1">{product.brand} · {product.model}</p>
          </div>
          <div className="text-right">
            <div className="ui-h2 text-[1.6rem]">{formatCurrency(unitPrice)}</div>
            <p className="ui-body-sm mt-1">por unidad</p>
            {activeTier && (
              <p className="ui-body-sm mt-1 text-[var(--color-brand-600)]">{activeTier.label}</p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
              lowStock
                ? "border-[color:var(--status-warning-border)] bg-[var(--status-warning-surface)] text-[var(--status-warning-text)]"
                : "border-[color:var(--status-success-border)] bg-[var(--status-success-surface)] text-[var(--status-success-text)]"
            )}
          >
            {lowStock ? <AlertTriangle className="h-3 w-3" /> : <Boxes className="h-3 w-3" />}
            {lowStock ? `Solo ${product.visibleStock} disponibles` : `${product.visibleStock} en stock`}
          </div>
          <div className="inline-flex items-center gap-1.5 ui-body-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            {product.warranty}
          </div>
        </div>

        {nextTier && (
          <div className="rounded-[var(--radius-16)] border border-[color:var(--status-info-border)] bg-[var(--status-info-surface)] px-3 py-3">
            <div className="flex items-start gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-brand-500)] text-[var(--text-inverse)]">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <p className="ui-body-sm text-[var(--status-info-text)]">
                Agrega <strong>{nextTier.minQty - qty}</strong> mas y el precio baja a{" "}
                <strong>{formatCurrency(nextTier.price)}</strong> por unidad.
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex items-center overflow-hidden rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)]">
            <button
              onClick={() => setQty((value) => Math.max(1, value - 1))}
              className="flex h-10 w-10 items-center justify-center text-base font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            >
              -
            </button>
            <span className="w-12 text-center text-sm font-semibold text-[var(--text-primary)]">
              {qty}
            </span>
            <button
              onClick={() => setQty((value) => value + 1)}
              className="flex h-10 w-10 items-center justify-center text-base font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            >
              +
            </button>
          </div>

          <div className="min-w-0 flex-1">
            <p className="ui-label">Subtotal</p>
            <p className="ui-title mt-2">{formatCurrency(unitPrice * qty)}</p>
          </div>

          <Button
            variant={isAdded ? "success" : "primary"}
            className="min-w-[11rem]"
            onClick={() => onAddToQuote?.(product, qty, unitPrice)}
            disabled={isAdded}
          >
            {isAdded ? (
              <>
                <CheckCircle className="h-4 w-4" />
                Agregado
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Agregar
              </>
            )}
          </Button>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-[color:var(--border-default)] pt-3">
          {product.specs.slice(0, 4).map((spec) => (
            <div
              key={spec.label}
              className="rounded-[var(--radius-12)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)] px-2.5 py-1.5"
            >
              <span className="ui-body-sm text-[var(--text-muted)]">{spec.label}: </span>
              <span className="ui-body-sm text-[var(--text-primary)]">{spec.value}</span>
            </div>
          ))}
          {product.specs.length > 4 && (
            <Button
              variant="tertiary"
              size="sm"
              className="h-8 px-2.5 text-[var(--text-muted)]"
              onClick={() => router.push(`/product/${product.sku}`)}
            >
              +{product.specs.length - 4} mas
              <ArrowUpRight className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
