"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Boxes,
  CheckCircle,
  ShieldCheck,
  Star,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { getPriceForList } from "@/data/pricingRules";
import type { PriceList } from "@/data/customers";
import type { Product } from "@/data/products";

interface ProductComparatorProps {
  products: Product[];
  priceList: PriceList;
  baseProductId: string;
  onSelect?: (product: Product, unitPrice: number) => void;
}

const gradients: Record<string, string> = {
  impresoras_etiquetas: "linear-gradient(180deg, #eff6ff 0%, #ffffff 100%)",
  impresoras_termicas: "linear-gradient(180deg, #eef2ff 0%, #ffffff 100%)",
  cintas_ribbon: "linear-gradient(180deg, #fff8eb 0%, #ffffff 100%)",
  etiquetas: "linear-gradient(180deg, #effaf4 0%, #ffffff 100%)",
  lectores_codigo: "linear-gradient(180deg, #f6f2ff 0%, #ffffff 100%)",
  cajones_monedero: "linear-gradient(180deg, #f6f8fb 0%, #ffffff 100%)",
  accesorios: "linear-gradient(180deg, #edfdfa 0%, #ffffff 100%)",
};

export function ProductComparator({
  products,
  priceList,
  baseProductId,
  onSelect,
}: ProductComparatorProps) {
  const router = useRouter();
  const specKeys = Array.from(new Set(products.flatMap((product) => product.specs.map((spec) => spec.label))));
  const prices = products.map((product) => getPriceForList(product, priceList));
  const minPrice = Math.min(...prices);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-[color:var(--border-default)]" />
        <span className="ui-label">Comparar alternativas</span>
        <div className="h-px flex-1 bg-[color:var(--border-default)]" />
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        {products.map((product, index) => {
          const price = prices[index];
          const isBase = product.id === baseProductId;
          const isBest = product.isRecommended;
          const isCheapest = price === minPrice;
          const savings = Math.round(((product.distributorPlusPrice - price) / product.distributorPlusPrice) * 100);

          return (
            <div
              key={product.id}
              className={cn(
                "overflow-hidden rounded-[var(--radius-24)] border bg-[var(--surface-raised)] shadow-[var(--shadow-raised)]",
                isBest
                  ? "border-[color:var(--status-ai-border)]"
                  : isBase
                  ? "border-[color:var(--border-accent)]"
                  : "border-[color:var(--border-default)]"
              )}
            >
              <div
                className="border-b border-[color:var(--border-default)] px-4 pb-4 pt-5"
                style={{ background: gradients[product.category] ?? gradients.accesorios }}
              >
                <div className="mb-3 flex justify-end">
                  {isBest ? (
                    <Badge variant="ai">
                      <Star className="h-3 w-3 fill-current" />
                      Recomendado
                    </Badge>
                  ) : isBase ? (
                    <Badge variant="outline">Solicitado</Badge>
                  ) : null}
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] text-3xl">
                    {product.imagePlaceholder}
                  </div>
                  <p className="ui-mono mt-3">{product.sku}</p>
                  <h5 className="ui-h3 mt-2 text-[1.05rem]">{product.name}</h5>
                  <p className="ui-body-sm mt-1">{product.brand}</p>
                </div>
              </div>

              <div className="space-y-3 border-b border-[color:var(--border-default)] px-4 py-4">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="ui-label">Precio unitario</p>
                    <p className={cn("ui-h2 mt-2 text-[1.5rem]", isBest && "text-[var(--text-ai)]")}>
                      {formatCurrency(price)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isCheapest && (
                      <Badge variant="success">
                        <TrendingDown className="h-3 w-3" />
                        Mejor precio
                      </Badge>
                    )}
                    {savings > 0 && (
                      <span className="ui-body-sm">-{savings}% vs base</span>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <InfoRow
                    icon={<Boxes className="h-3.5 w-3.5" />}
                    label="Stock"
                    value={product.visibleStock === 0 ? "Sin stock" : `${product.visibleStock} uds.`}
                    tone={
                      product.visibleStock === 0
                        ? "danger"
                        : product.visibleStock <= 10
                        ? "warning"
                        : "success"
                    }
                  />
                  <InfoRow
                    icon={<ShieldCheck className="h-3.5 w-3.5" />}
                    label="Garantia"
                    value={product.warranty}
                  />
                </div>
              </div>

              <div className="space-y-2 bg-[var(--surface-subtle)] px-4 py-4">
                {specKeys.slice(0, 4).map((key) => {
                  const spec = product.specs.find((entry) => entry.label === key);
                  return (
                    <div key={key} className="flex items-center justify-between gap-3">
                      <span className="ui-body-sm">{key}</span>
                      {spec ? (
                        <span className="rounded-full border border-[color:var(--border-default)] bg-[var(--surface-raised)] px-2.5 py-1 text-xs font-medium text-[var(--text-secondary)]">
                          {spec.value}
                        </span>
                      ) : (
                        <span className="ui-body-sm">-</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-2 px-4 py-4">
                <Button
                  variant={isBest ? "ai" : isBase ? "primary" : "outline"}
                  size="sm"
                  className="w-full gap-1.5"
                  onClick={() => onSelect?.(product, price)}
                >
                  <CheckCircle className="h-3.5 w-3.5" />
                  {isBest ? "Elegir recomendado" : isBase ? "Agregar este" : "Seleccionar"}
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  className="w-full gap-1 text-[var(--text-muted)]"
                  onClick={() => router.push(`/product/${product.sku}`)}
                >
                  Ver ficha completa
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone?: "success" | "warning" | "danger";
}) {
  const toneClass =
    tone === "danger"
      ? "text-[var(--status-critical-text)]"
      : tone === "warning"
      ? "text-[var(--status-warning-text)]"
      : tone === "success"
      ? "text-[var(--status-success-text)]"
      : "text-[var(--text-primary)]";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="inline-flex items-center gap-2 ui-body-sm">
        <span className="text-[var(--text-muted)]">{icon}</span>
        {label}
      </div>
      <span className={cn("ui-body-sm text-[var(--text-primary)]", toneClass)}>{value}</span>
    </div>
  );
}
