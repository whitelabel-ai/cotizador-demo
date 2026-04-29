"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle,
  Download,
  FileText,
  Package,
  Send,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { defaultCustomer } from "@/data/customers";
import { initialQuote, salesDashboardQuotes } from "@/data/quotes";
import { calculateTotals } from "@/lib/quote-calculations";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Quote } from "@/data/quotes";

const statusConfig: Record<
  Quote["status"],
  { label: string; variant: "brand" | "neutral" | "ai" | "success" | "warning" | "danger" | "review" | "outline"; icon: React.ReactNode; description: string }
> = {
  draft: { label: "Borrador", variant: "neutral", icon: <FileText className="h-4 w-4" />, description: "Cotizacion en preparacion" },
  pending_review: { label: "Pendiente revision", variant: "warning", icon: <AlertCircle className="h-4 w-4" />, description: "Esperando confirmacion del cliente" },
  commercial_review: { label: "Revision comercial", variant: "review", icon: <AlertCircle className="h-4 w-4" />, description: "En revision por el equipo comercial" },
  confirmed: { label: "Confirmada", variant: "success", icon: <CheckCircle className="h-4 w-4" />, description: "Cotizacion aceptada por el cliente" },
  sent: { label: "Enviada", variant: "ai", icon: <Send className="h-4 w-4" />, description: "Enviada al cliente" },
  expired: { label: "Expirada", variant: "danger", icon: <AlertCircle className="h-4 w-4" />, description: "Vigencia vencida" },
};

export default function QuotePage({ params }: { params: Promise<{ quoteId: string }> }) {
  const router = useRouter();
  const { quoteId } = React.use(params);
  const found = salesDashboardQuotes.find((quote) => quote.id === quoteId);
  const quote = found ?? { ...initialQuote, status: "confirmed" as const };
  const customer = defaultCustomer;
  const totals = calculateTotals(quote.items);
  const status = statusConfig[quote.status];

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
              <p className="ui-eyebrow">Documento comercial</p>
              <h1 className="ui-h1 text-[2.3rem]">{quote.number}</h1>
              <p className="ui-body max-w-2xl">{status.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-4 w-4" />
              Descargar PDF
            </Button>
            <Button variant="primary" size="sm" className="gap-1.5">
              <Send className="h-4 w-4" />
              Enviar por WhatsApp
            </Button>
          </div>
        </div>

        <Card variant="raised">
          <CardContent className="space-y-5 p-6">
            <div className="ui-page-header">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={status.variant}>
                    {status.icon}
                    {status.label}
                  </Badge>
                  <Badge variant="outline">{quote.origin === "whatsapp" ? "WhatsApp" : "Web"}</Badge>
                </div>
                <p className="ui-body-sm">{status.description}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="ui-label">Total</p>
                <p className="ui-h1 mt-2 text-[2.25rem]">{formatCurrency(totals.total)}</p>
                <p className="ui-body-sm mt-1">IVA incluido</p>
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-4">
              <FactItem label="Creada" value={formatDate(quote.createdAt)} />
              <FactItem label="Vence" value={formatDate(quote.expiresAt)} />
              <FactItem label="Canal" value={quote.origin === "whatsapp" ? "WhatsApp" : "Web"} />
              <FactItem label="Productos" value={`${quote.items.length} refs · ${totals.itemCount} uds.`} />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="space-y-6">
            <Card variant="raised">
              <CardHeader className="pb-0">
                <Badge variant="outline" className="w-fit">
                  Cliente
                </Badge>
                <CardTitle className="ui-h3">Informacion comercial del cliente</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 pt-4 md:grid-cols-3">
                <FactItem label="Empresa" value={customer.company} />
                <FactItem label="Contacto" value={customer.contact} />
                <FactItem label="NIT" value={customer.taxId} />
                <div>
                  <p className="ui-label">Tipo de cliente</p>
                  <div className="mt-2">
                    <Badge variant="brand">Distribuidor Plus</Badge>
                  </div>
                </div>
                <FactItem label="Ciudad" value={`${customer.city}, ${customer.country}`} />
                <div>
                  <p className="ui-label">Vendedor asignado</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px]">{customer.assignedRepAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="ui-body-sm text-[var(--text-primary)]">{customer.assignedRep}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card variant="raised">
              <CardHeader className="pb-0">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-[var(--color-brand-600)]" />
                  <CardTitle className="ui-h3">Productos cotizados</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                {quote.items.length === 0 ? (
                  <div className="rounded-[var(--radius-24)] border border-dashed border-[color:var(--border-default)] px-4 py-10 text-center">
                    <p className="ui-title">Sin productos en esta cotizacion</p>
                    <p className="ui-body-sm mt-1">Agrega referencias desde el workspace para construir el documento.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-[color:var(--border-default)]">
                          <th className="py-2 pr-4 ui-label">Producto</th>
                          <th className="py-2 text-center ui-label">Cant.</th>
                          <th className="py-2 text-right ui-label">Precio unit.</th>
                          <th className="py-2 text-right ui-label">Desc.</th>
                          <th className="py-2 text-right ui-label">Stock</th>
                          <th className="py-2 text-right ui-label">Subtotal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quote.items.map((item) => {
                          const lineTotal = item.unitPrice * item.qty * (1 - item.discountPercent / 100);

                          return (
                            <tr key={item.id} className="border-b border-[color:var(--border-default)] last:border-0">
                              <td className="py-3 pr-4">
                                <p className="ui-title">{item.name}</p>
                                <p className="ui-body-sm mt-1">{item.sku} · {item.brand}</p>
                              </td>
                              <td className="py-3 text-center ui-body-sm text-[var(--text-primary)]">{item.qty}</td>
                              <td className="py-3 text-right ui-body-sm text-[var(--text-primary)]">{formatCurrency(item.unitPrice)}</td>
                              <td className="py-3 text-right">
                                {item.discountPercent > 0 ? (
                                  <Badge variant="success">-{item.discountPercent}%</Badge>
                                ) : (
                                  <span className="ui-body-sm">-</span>
                                )}
                              </td>
                              <td className="py-3 text-right ui-body-sm">{item.stock}</td>
                              <td className="py-3 text-right ui-title">{formatCurrency(Math.round(lineTotal))}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {quote.items.length > 0 && (
                  <>
                    <Separator className="mt-5" />
                    <div className="ml-auto mt-5 max-w-xs space-y-2">
                      <div className="flex justify-between ui-body-sm">
                        <span>Subtotal</span>
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
                        <span className="ui-h3 text-[1.25rem]">{formatCurrency(totals.total)}</span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {quote.notes && (
              <Card variant="subtle">
                <CardHeader className="pb-0">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[var(--color-brand-600)]" />
                    <CardTitle className="ui-h3">Notas</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="ui-body">{quote.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            <Card variant="highlighted">
              <CardContent className="space-y-4 p-5">
                <div className="space-y-2">
                  <p className="ui-label">Acciones</p>
                  <h2 className="ui-h3">Siguiente paso comercial</h2>
                </div>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-between gap-2" onClick={() => router.push("/workspace")}>
                    Editar cotizacion
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="justify-between gap-2">
                    Descargar PDF
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="primary" className="justify-between gap-2">
                    Enviar por WhatsApp
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="subtle">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-16)] bg-[var(--status-info-surface)] text-[var(--status-info-text)]">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="ui-title">Origen y vigencia</p>
                    <p className="ui-body-sm mt-1">
                      Cotizacion originada por {quote.origin} con vencimiento el {formatDate(quote.expiresAt)}.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function FactItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="ui-label">{label}</p>
      <p className="ui-body-sm mt-2 text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
