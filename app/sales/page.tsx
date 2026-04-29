"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  ChevronRight,
  Clock,
  Eye,
  Filter,
  MessageSquare,
  Tag,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTotals } from "@/lib/quote-calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import { customers } from "@/data/customers";
import { salesDashboardQuotes } from "@/data/quotes";
import type { Quote } from "@/data/quotes";

const statusConfig: Record<
  Quote["status"],
  { label: string; variant: "brand" | "neutral" | "ai" | "success" | "warning" | "danger" | "review" | "outline"; icon: React.ReactNode }
> = {
  draft: { label: "Borrador", variant: "neutral", icon: <Tag className="h-3 w-3" /> },
  pending_review: { label: "Pendiente", variant: "warning", icon: <Clock className="h-3 w-3" /> },
  commercial_review: { label: "Revision comercial", variant: "review", icon: <AlertCircle className="h-3 w-3" /> },
  confirmed: { label: "Confirmada", variant: "success", icon: <CheckCircle className="h-3 w-3" /> },
  sent: { label: "Enviada", variant: "ai", icon: <MessageSquare className="h-3 w-3" /> },
  expired: { label: "Expirada", variant: "danger", icon: <AlertCircle className="h-3 w-3" /> },
};

const nextActionMap: Record<Quote["status"], string> = {
  draft: "Completar y enviar cotizacion",
  pending_review: "Hacer seguimiento con cliente",
  commercial_review: "Aprobar o rechazar descuento",
  confirmed: "Coordinar despacho",
  sent: "Esperar respuesta del cliente",
  expired: "Renovar cotizacion",
};

export default function SalesDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");

  const filtered = salesDashboardQuotes.filter((quote) => {
    if (activeTab === "all") return true;
    if (activeTab === "review") return quote.status === "commercial_review";
    if (activeTab === "active") return ["draft", "pending_review", "sent"].includes(quote.status);
    if (activeTab === "confirmed") return quote.status === "confirmed";
    return true;
  });

  const totalValue = salesDashboardQuotes.reduce((sum, quote) => sum + calculateTotals(quote.items).total, 0);
  const reviewCount = salesDashboardQuotes.filter((quote) => quote.status === "commercial_review").length;
  const pendingCount = salesDashboardQuotes.filter((quote) => quote.status === "pending_review").length;
  const confirmedValue = salesDashboardQuotes
    .filter((quote) => quote.status === "confirmed")
    .reduce((sum, quote) => sum + calculateTotals(quote.items).total, 0);

  return (
    <div className="min-h-screen py-6">
      <div className="ui-page-shell space-y-6">
        <div className="ui-page-header">
          <div className="space-y-3">
            <Button variant="tertiary" size="sm" className="gap-1.5" onClick={() => router.push("/workspace")}>
              <ArrowLeft className="h-4 w-4" />
              Volver al workspace
            </Button>
            <div className="ui-section-heading">
              <p className="ui-eyebrow">Operacion comercial</p>
              <h1 className="ui-h1 text-[2.4rem]">Dashboard del vendedor</h1>
              <p className="ui-body max-w-2xl">
                Pipeline, revision comercial, seguimiento y valor confirmado desde un mismo espacio operativo.
              </p>
            </div>
          </div>

          <div className="ui-surface-raised rounded-[var(--radius-24)] px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>LM</AvatarFallback>
              </Avatar>
              <div>
                <p className="ui-title">Laura Mendez</p>
                <p className="ui-body-sm">Vendedora senior</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Pipeline total"
            value={formatCurrency(totalValue)}
            tone="brand"
            icon={<TrendingUp className="h-4 w-4" />}
          />
          <MetricCard
            label="Revision comercial"
            value={String(reviewCount)}
            tone="review"
            icon={<AlertCircle className="h-4 w-4" />}
            suffix="cotizaciones"
          />
          <MetricCard
            label="Seguimiento pendiente"
            value={String(pendingCount)}
            tone="warning"
            icon={<Clock className="h-4 w-4" />}
            suffix="cotizaciones"
          />
          <MetricCard
            label="Valor confirmado"
            value={formatCurrency(confirmedValue)}
            tone="success"
            icon={<CheckCircle className="h-4 w-4" />}
          />
        </div>

        <Card variant="raised">
          <CardHeader className="gap-4 pb-0">
            <div className="ui-page-header">
              <div className="space-y-2">
                <Badge variant="outline">Cotizaciones activas</Badge>
                <CardTitle className="ui-h3">Seguimiento del pipeline comercial</CardTitle>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Filter className="h-3.5 w-3.5" />
                Filtrar
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">Todas ({salesDashboardQuotes.length})</TabsTrigger>
                <TabsTrigger value="active">Activas</TabsTrigger>
                <TabsTrigger value="review">Revision ({reviewCount})</TabsTrigger>
                <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>

          <CardContent className="pt-4">
            {filtered.length === 0 ? (
              <div className="rounded-[var(--radius-24)] border border-dashed border-[color:var(--border-default)] px-4 py-12 text-center">
                <p className="ui-title">Sin cotizaciones en esta categoria</p>
                <p className="ui-body-sm mt-1">Ajusta el filtro o vuelve al workspace para iniciar una nueva oportunidad.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04 }}
                  >
                    <QuoteRow quote={quote} onView={(id) => router.push(`/quote/${id}`)} />
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button className="gap-2" onClick={() => router.push("/workspace")}>
            <MessageSquare className="h-4 w-4" />
            Nueva cotizacion
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => router.push("/continue/sess-wa-7f3k2m")}>
            <Eye className="h-4 w-4" />
            Ver sesion activa
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuoteRow({ quote, onView }: { quote: Quote; onView: (id: string) => void }) {
  const customer = customers.find((entry) => entry.id === quote.customerId);
  const totals = calculateTotals(quote.items);
  const status = statusConfig[quote.status];
  const nextAction = nextActionMap[quote.status];

  return (
    <button
      onClick={() => onView(quote.id)}
      className="ui-surface-default grid w-full gap-4 rounded-[var(--radius-24)] p-4 text-left hover:border-[color:var(--border-strong)] sm:grid-cols-[minmax(0,1fr)_13rem] xl:grid-cols-[minmax(0,1fr)_16rem_8rem_11rem_auto]"
    >
      <div className="min-w-0">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="ui-title">{quote.number}</span>
          <Badge variant={status.variant}>
            {status.icon}
            {status.label}
          </Badge>
          {quote.origin === "whatsapp" && <Badge variant="ai">WA</Badge>}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-[var(--radius-12)] bg-[var(--status-info-surface)] text-[var(--status-info-text)]">
            <Building2 className="h-3 w-3" />
          </div>
          <span className="ui-body-sm truncate">{customer?.company ?? "-"}</span>
          <span className="ui-body-sm">·</span>
          <span className="ui-body-sm">{formatDate(quote.createdAt)}</span>
        </div>
      </div>

      <div className="hidden xl:block">
        <p className="ui-label">Ultima intencion</p>
        <p className="ui-body-sm mt-2 line-clamp-2">{quote.lastIntent ?? "-"}</p>
      </div>

      <div className="text-left xl:text-right">
        <p className="ui-title">{formatCurrency(totals.total)}</p>
        <p className="ui-body-sm mt-1">
          {quote.items.length} refs · {totals.itemCount} uds.
        </p>
      </div>

      <div className="hidden xl:block">
        <p className="ui-label">Proxima accion</p>
        <p className="ui-body-sm mt-2 text-[var(--color-brand-600)]">{nextAction}</p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <Avatar className="h-8 w-8">
          <AvatarFallback>{customer?.assignedRepAvatar ?? "--"}</AvatarFallback>
        </Avatar>
        <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
      </div>
    </button>
  );
}

function MetricCard({
  label,
  value,
  icon,
  tone,
  suffix,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  tone: "brand" | "review" | "warning" | "success";
  suffix?: string;
}) {
  const toneClass =
    tone === "review"
      ? "bg-[var(--status-review-surface)] text-[var(--status-review-text)]"
      : tone === "warning"
      ? "bg-[var(--status-warning-surface)] text-[var(--status-warning-text)]"
      : tone === "success"
      ? "bg-[var(--status-success-surface)] text-[var(--status-success-text)]"
      : "bg-[var(--status-info-surface)] text-[var(--status-info-text)]";

  return (
    <Card variant="raised" className="ui-metric-card">
      <CardContent className="p-5">
        <div className={`mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-16)] ${toneClass}`}>
          {icon}
        </div>
        <p className="ui-label">{label}</p>
        <p className="ui-h2 mt-3 text-[1.7rem]">{value}</p>
        {suffix && <p className="ui-body-sm mt-1">{suffix}</p>}
      </CardContent>
    </Card>
  );
}
