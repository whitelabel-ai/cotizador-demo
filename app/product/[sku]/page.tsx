"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  Boxes,
  CheckCircle,
  ChevronRight,
  Layers,
  MessageSquare,
  Package,
  RefreshCw,
  ShieldCheck,
  Tag,
  TrendingDown,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { defaultCustomer } from "@/data/customers";
import {
  getAlternativeProducts,
  getComplementaryProducts,
  getProductBySku,
  products,
  type Product,
} from "@/data/products";
import { getPriceForList } from "@/data/pricingRules";
import { getNextVolumeTier } from "@/lib/pricing-engine";
import { cn, formatCurrency } from "@/lib/utils";

const categoryThemes: Record<string, { from: string; to: string; accent: string; surface: string; border: string; text: string }> = {
  impresoras_etiquetas: { from: "#eff6ff", to: "#ffffff", accent: "#2563eb", surface: "#eff6ff", border: "#cfe0ff", text: "#1d4ed8" },
  impresoras_termicas: { from: "#eef2ff", to: "#ffffff", accent: "#4f46e5", surface: "#eef2ff", border: "#d7dbff", text: "#4338ca" },
  cintas_ribbon: { from: "#fff8eb", to: "#ffffff", accent: "#d97706", surface: "#fff8eb", border: "#f5ddb0", text: "#b45309" },
  etiquetas: { from: "#effaf4", to: "#ffffff", accent: "#16a34a", surface: "#effaf4", border: "#c2ead1", text: "#15803d" },
  lectores_codigo: { from: "#f6f2ff", to: "#ffffff", accent: "#7c3aed", surface: "#f6f2ff", border: "#ddd1ff", text: "#6d28d9" },
  cajones_monedero: { from: "#f6f8fb", to: "#ffffff", accent: "#475569", surface: "#f6f8fb", border: "#dbe4ee", text: "#334155" },
  accesorios: { from: "#edfdfa", to: "#ffffff", accent: "#14b8a6", surface: "#edfdfa", border: "#bae8e0", text: "#0f766e" },
};

const priceListLabels: Record<string, string> = {
  distribuidor_plus: "Distribuidor Plus",
  distribuidor: "Distribuidor",
  corporativo: "Corporativo",
  lista_general: "Lista general",
};

export default function ProductDetailPage({ params }: { params: Promise<{ sku: string }> }) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [addedToQuote, setAddedToQuote] = useState(false);

  const { sku } = React.use(params);
  const product = getProductBySku(sku);
  const customer = defaultCustomer;
  const priceList = customer.priceList;

  if (!product) {
    return (
      <div className="min-h-screen py-6">
        <div className="ui-page-shell flex min-h-[70vh] items-center justify-center">
          <Card variant="raised" className="max-w-md">
            <CardContent className="space-y-4 p-8 text-center">
              <div className="text-5xl">?</div>
              <h1 className="ui-h3">Producto no encontrado</h1>
              <p className="ui-body-sm">SKU: {sku}</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const unitPrice = getPriceForList(product, priceList);
  const savings = product.basePrice - unitPrice;
  const savingsPct = Math.round((savings / product.basePrice) * 100);
  const nextTier = getNextVolumeTier(product, qty);
  const lowStock = product.visibleStock <= 10;
  const complementary = getComplementaryProducts(product.id);
  const alternatives = getAlternativeProducts(product.id);
  const theme = categoryThemes[product.category] ?? categoryThemes.accesorios;

  const allPriceLists = [
    { key: "lista_general", price: product.basePrice },
    { key: "distribuidor", price: product.distributorPrice },
    { key: "corporativo", price: product.corporatePrice },
    { key: "distribuidor_plus", price: product.distributorPlusPrice },
  ] as const;

  return (
    <div className="min-h-screen py-4 sm:py-6">
      <div className="ui-page-shell space-y-6">
        <header className="ui-surface-raised flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-24)] px-4 py-4">
          <Button variant="tertiary" size="sm" className="gap-1.5" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>

          <div className="flex flex-wrap items-center gap-2 ui-body-sm">
            <button onClick={() => router.push("/")} className="hover:text-[var(--text-primary)]">
              Inicio
            </button>
            <ChevronRight className="h-3 w-3" />
            <button onClick={() => router.push("/workspace")} className="hover:text-[var(--text-primary)]">
              Workspace
            </button>
            <ChevronRight className="h-3 w-3" />
            <span className="ui-mono text-[var(--text-primary)]">{product.sku}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/workspace")}>
              <MessageSquare className="h-3.5 w-3.5" />
              Cotizar en chat
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => router.push("/sales")}>
              <BarChart3 className="h-3.5 w-3.5" />
              Dashboard
            </Button>
          </div>
        </header>

        <section
          className="ui-surface-raised overflow-hidden rounded-[var(--radius-32)]"
          style={{ background: `linear-gradient(180deg, ${theme.from}, ${theme.to})` }}
        >
          <div className="grid gap-8 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_25rem] lg:px-8 lg:py-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-2">
                {product.badge && (
                  <Badge variant={product.isRecommended ? "ai" : "brand"}>
                    {product.badge}
                  </Badge>
                )}
                {savingsPct > 0 && (
                  <Badge variant="success">
                    <TrendingDown className="h-3 w-3" />
                    {savingsPct}% de ahorro vs lista
                  </Badge>
                )}
              </div>

              <div className="flex items-start gap-5">
                <div
                  className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[var(--radius-24)] border text-5xl shadow-[var(--shadow-raised)]"
                  style={{
                    background: "var(--surface-raised)",
                    borderColor: theme.border,
                    boxShadow: `0 18px 34px ${theme.border}`,
                  }}
                >
                  {product.imagePlaceholder}
                </div>
                <div className="space-y-3">
                  <p className="ui-mono">{product.sku}</p>
                  <h1 className="ui-h1">{product.name}</h1>
                  <p className="ui-body">{product.brand} · {product.model}</p>
                </div>
              </div>

              <p className="ui-body max-w-2xl">{product.description}</p>

              <div className="flex flex-wrap gap-2">
                <Pill icon={ShieldCheck} label={`Garantia ${product.warranty}`} />
                <Pill
                  icon={Boxes}
                  label={lowStock ? `Solo ${product.visibleStock} disponibles` : `${product.visibleStock} en stock`}
                  tone={lowStock ? "warning" : "success"}
                />
                <Pill icon={Tag} label={priceListLabels[priceList]} tone="brand" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card variant="raised" className="overflow-hidden">
                <div className="border-b border-[color:var(--border-default)] px-6 py-5" style={{ background: theme.surface }}>
                  <p className="ui-label">Lista activa</p>
                  <p className="ui-body-sm mt-2 text-[var(--text-primary)]">{priceListLabels[priceList]}</p>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <div>
                      <span className="ui-h1 text-[2.2rem]">{formatCurrency(unitPrice)}</span>
                      <p className="ui-body-sm mt-1">precio por unidad · + IVA 19%</p>
                    </div>
                    {savingsPct > 0 && (
                      <div className="text-right">
                        <p className="ui-body-sm line-through">{formatCurrency(product.basePrice)}</p>
                        <p className="ui-body-sm mt-1 text-[var(--status-success-text)]">
                          Ahorras {formatCurrency(savings)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="space-y-4 p-6">
                  {nextTier && (
                    <div className="rounded-[var(--radius-16)] border border-[color:var(--status-info-border)] bg-[var(--status-info-surface)] px-4 py-3">
                      <div className="flex items-start gap-2">
                        <Zap className="mt-0.5 h-4 w-4 text-[var(--status-info-text)]" />
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
                        className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-base font-semibold text-[var(--text-primary)]">
                        {qty}
                      </span>
                      <button
                        onClick={() => setQty((value) => value + 1)}
                        className="flex h-11 w-11 items-center justify-center text-lg font-semibold text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
                      >
                        +
                      </button>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="ui-label">Subtotal estimado</p>
                      <p className="ui-title mt-2">{formatCurrency(unitPrice * qty)}</p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {addedToQuote ? (
                      <motion.div
                        key="added"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="rounded-[var(--radius-16)] border border-[color:var(--status-success-border)] bg-[var(--status-success-surface)] px-4 py-3 text-[var(--status-success-text)]"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          <span className="ui-title text-[var(--status-success-text)]">
                            Producto en tu cotizacion
                          </span>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Button
                          size="lg"
                          className="w-full gap-2"
                          onClick={() => setAddedToQuote(true)}
                        >
                          <Package className="h-4 w-4" />
                          Agregar a cotizacion
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full gap-2"
                    onClick={() => router.push("/workspace")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Cotizar en el asistente
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <Tabs defaultValue="specs">
          <TabsList className="w-full flex-wrap justify-start">
            <TabsTrigger value="specs" className="gap-1.5">
              <Package className="h-3.5 w-3.5" />
              Especificaciones
            </TabsTrigger>
            <TabsTrigger value="pricing" className="gap-1.5">
              <BarChart3 className="h-3.5 w-3.5" />
              Precios y volumen
            </TabsTrigger>
            {complementary.length > 0 && (
              <TabsTrigger value="complementary" className="gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Complementarios
              </TabsTrigger>
            )}
            {alternatives.length > 0 && (
              <TabsTrigger value="alternatives" className="gap-1.5">
                <RefreshCw className="h-3.5 w-3.5" />
                Alternativas
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="specs">
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <Card variant="raised">
                <CardContent className="p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--color-brand-600)]" />
                    <h3 className="ui-h3 text-[1.15rem]">Especificaciones tecnicas</h3>
                  </div>
                  <div className="divide-y divide-[color:var(--border-default)] rounded-[var(--radius-20)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)]">
                    {product.specs.map((spec) => (
                      <div key={spec.label} className="flex items-center justify-between gap-4 px-4 py-3">
                        <span className="ui-body-sm">{spec.label}</span>
                        <span className="ui-body-sm text-[var(--text-primary)]">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card variant="raised">
                  <CardContent className="p-5">
                    <h3 className="ui-h3 text-[1.15rem]">Descripcion del producto</h3>
                    <p className="ui-body mt-3">{product.description}</p>
                  </CardContent>
                </Card>

                <Card variant="subtle">
                  <CardContent className="grid gap-3 p-5 sm:grid-cols-2">
                    {[
                      { label: "Marca", value: product.brand },
                      { label: "Modelo", value: product.model },
                      { label: "SKU", value: product.sku },
                      { label: "Categoria", value: product.category.replace(/_/g, " ") },
                      { label: "Garantia", value: product.warranty },
                      { label: "Stock visible", value: `${product.visibleStock} uds.` },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-raised)] px-3 py-2.5"
                      >
                        <p className="ui-label">{item.label}</p>
                        <p className="ui-body-sm mt-2 text-[var(--text-primary)] capitalize">{item.value}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pricing">
            <div className="mt-4 grid gap-6 lg:grid-cols-2">
              <Card variant="raised">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-[var(--color-brand-600)]" />
                    <h3 className="ui-h3 text-[1.15rem]">Escalas de precio por volumen</h3>
                  </div>
                  {product.volumePrices.map((tier, index) => (
                    <VolumeTierRow
                      key={tier.minQty}
                      tier={tier}
                      isActive={qty >= tier.minQty && (index === product.volumePrices.length - 1 || qty < product.volumePrices[index + 1].minQty)}
                      isBest={index === product.volumePrices.length - 1}
                    />
                  ))}
                  <p className="ui-body-sm">Precios calculados para la lista Distribuidor Plus.</p>
                </CardContent>
              </Card>

              <Card variant="raised">
                <CardContent className="space-y-3 p-5">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[var(--color-brand-600)]" />
                    <h3 className="ui-h3 text-[1.15rem]">Precios por lista</h3>
                  </div>
                  <div className="divide-y divide-[color:var(--border-default)] rounded-[var(--radius-20)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)]">
                    {allPriceLists.map(({ key, price }) => {
                      const isActive = key === priceList;
                      return (
                        <div
                          key={key}
                          className={cn(
                            "flex items-center justify-between gap-4 px-4 py-4",
                            isActive && "bg-[var(--status-info-surface)]"
                          )}
                        >
                          <div>
                            <p className={cn("ui-title", isActive && "text-[var(--status-info-text)]")}>
                              {priceListLabels[key]}
                            </p>
                            {isActive && (
                              <p className="ui-body-sm mt-1 text-[var(--status-info-text)]">
                                Tu lista activa
                              </p>
                            )}
                          </div>
                          <p className={cn("ui-h3 text-[1.2rem]", isActive && "text-[var(--status-info-text)]")}>
                            {formatCurrency(price)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {complementary.length > 0 && (
            <TabsContent value="complementary">
              <Card variant="raised" className="mt-4">
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <h3 className="ui-h3 text-[1.15rem]">Productos complementarios</h3>
                    <p className="ui-body">
                      Referencias que suelen acompanar esta compra dentro del mismo flujo comercial.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {complementary.map((item) => (
                      <MiniProductCard
                        key={item.id}
                        product={item}
                        priceList={priceList}
                        onNavigate={(value) => router.push(`/product/${value}`)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {alternatives.length > 0 && (
            <TabsContent value="alternatives">
              <Card variant="raised" className="mt-4">
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <h3 className="ui-h3 text-[1.15rem]">Alternativas comparables</h3>
                    <p className="ui-body">
                      Opciones equivalentes para abrir una conversacion comercial de sustitucion o upsell.
                    </p>
                  </div>
                  <div className="grid gap-3 md:grid-cols-2">
                    {alternatives.map((item) => (
                      <MiniProductCard
                        key={item.id}
                        product={item}
                        priceList={priceList}
                        label="Alternativa"
                        onNavigate={(value) => router.push(`/product/${value}`)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => router.push("/workspace")}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Comparar en el asistente
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        <section className="space-y-4">
          <Separator />
          <div className="ui-section-heading">
            <p className="ui-eyebrow">Catalogo relacionado</p>
            <h3 className="ui-h3">Otros productos del catalogo</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {products
              .filter((item) => item.id !== product.id)
              .slice(0, 4)
              .map((item) => {
                const price = getPriceForList(item, priceList);

                return (
                  <button
                    key={item.id}
                    onClick={() => router.push(`/product/${item.sku}`)}
                    className="ui-surface-default rounded-[var(--radius-24)] p-4 text-center hover:border-[color:var(--border-strong)]"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-16)] bg-[var(--surface-raised)] text-3xl mx-auto">
                      {item.imagePlaceholder}
                    </div>
                    <p className="ui-mono mt-3">{item.sku}</p>
                    <p className="ui-title mt-2 line-clamp-2">{item.name}</p>
                    <p className="ui-body-sm mt-2 text-[var(--color-brand-600)]">{formatCurrency(price)}</p>
                  </button>
                );
              })}
          </div>
        </section>
      </div>
    </div>
  );
}

function VolumeTierRow({
  tier,
  isActive,
  isBest,
}: {
  tier: Product["volumePrices"][0];
  isActive: boolean;
  isBest: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 rounded-[var(--radius-20)] border px-4 py-3",
        isActive
          ? "border-[color:var(--status-info-border)] bg-[var(--status-info-surface)]"
          : isBest
          ? "border-[color:var(--status-success-border)] bg-[var(--status-success-surface)]"
          : "border-[color:var(--border-default)] bg-[var(--surface-subtle)]"
      )}
    >
      <div>
        <p className="ui-title">{tier.label}</p>
        {isActive && <p className="ui-body-sm mt-1 text-[var(--status-info-text)]">Nivel actual</p>}
        {isBest && !isActive && <p className="ui-body-sm mt-1 text-[var(--status-success-text)]">Mejor precio disponible</p>}
      </div>
      <div className="text-right">
        <p className="ui-h3 text-[1.2rem]">{formatCurrency(tier.price)}</p>
        <p className="ui-body-sm mt-1">por unidad</p>
      </div>
    </div>
  );
}

function MiniProductCard({
  product,
  priceList,
  label,
  onNavigate,
}: {
  product: Product;
  priceList: string;
  label?: string;
  onNavigate: (sku: string) => void;
}) {
  const price = getPriceForList(product, priceList as Parameters<typeof getPriceForList>[1]);

  return (
    <button
      onClick={() => onNavigate(product.sku)}
      className="ui-surface-default flex w-full items-center gap-3 rounded-[var(--radius-20)] p-3 text-left hover:border-[color:var(--border-strong)]"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-16)] bg-[var(--surface-raised)] text-2xl">
        {product.imagePlaceholder}
      </div>
      <div className="min-w-0 flex-1">
        {label && <p className="ui-label">{label}</p>}
        <p className="ui-title mt-2 truncate">{product.name}</p>
        <p className="ui-body-sm mt-1">{product.brand} · {product.sku}</p>
      </div>
      <div className="text-right">
        <p className="ui-title">{formatCurrency(price)}</p>
        <div className="mt-2 inline-flex items-center gap-1 ui-body-sm text-[var(--color-brand-600)]">
          Ver
          <ArrowUpRight className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
}

function Pill({
  icon: Icon,
  label,
  tone = "neutral",
}: {
  icon: LucideIcon;
  label: string;
  tone?: "brand" | "success" | "warning" | "neutral";
}) {
  const toneClass =
    tone === "brand"
      ? "border-[color:var(--status-info-border)] bg-[var(--status-info-surface)] text-[var(--status-info-text)]"
      : tone === "success"
      ? "border-[color:var(--status-success-border)] bg-[var(--status-success-surface)] text-[var(--status-success-text)]"
      : tone === "warning"
      ? "border-[color:var(--status-warning-border)] bg-[var(--status-warning-surface)] text-[var(--status-warning-text)]"
      : "border-[color:var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]";

  return (
    <div className={cn("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", toneClass)}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}
