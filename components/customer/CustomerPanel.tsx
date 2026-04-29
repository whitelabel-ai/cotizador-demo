"use client";

import React from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Clock,
  Shield,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Customer } from "@/data/customers";

interface CustomerPanelProps {
  customer: Customer;
}

const typeLabels: Record<Customer["type"], string> = {
  distribuidor_plus: "Distribuidor Plus",
  distribuidor: "Distribuidor",
  minorista: "Minorista",
  corporativo: "Corporativo",
};

const originConfig: Record<Customer["origin"], { label: string; tone: "ai" | "brand" | "warning" | "neutral" }> = {
  whatsapp: { label: "WhatsApp", tone: "ai" },
  web: { label: "Web", tone: "brand" },
  email: { label: "Email", tone: "warning" },
  phone: { label: "Telefono", tone: "neutral" },
};

export function CustomerPanel({ customer }: CustomerPanelProps) {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const origin = originConfig[customer.origin];

  return (
    <ScrollArea className="h-full">
      <div className="space-y-5 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-16)] bg-[var(--color-brand-500)] text-[var(--text-inverse)]">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="space-y-1">
              <h3 className="ui-title">{customer.company}</h3>
              <p className="ui-body-sm">{customer.taxId}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="brand">{typeLabels[customer.type]}</Badge>
              <Badge variant="outline">{customer.city}</Badge>
            </div>
          </div>
        </div>

        <Separator />

        <SectionBlock title="Contacto" icon={<User className="h-3.5 w-3.5" />}>
          <div className="space-y-2">
            <p className="ui-body-sm text-[var(--text-primary)]">{customer.contact}</p>
            <p className="ui-body-sm">{customer.email}</p>
            <p className="ui-body-sm">{customer.phone}</p>
          </div>
        </SectionBlock>

        <Separator />

        <SectionBlock title="Condiciones comerciales">
          <div className="grid grid-cols-2 gap-3">
            <InfoItem label="Lista de precios" value={typeLabels[customer.type]} />
            <InfoItem label="Plazo" value={customer.paymentTerms} />
            <div>
              <p className="ui-label">Canal origen</p>
              <div className="mt-2">
                <Badge variant={origin.tone}>{origin.label}</Badge>
              </div>
            </div>
            <InfoItem label="Credito" value={formatCurrency(customer.creditLimit)} />
          </div>
        </SectionBlock>

        <Separator />

        <div className="rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)] p-3">
          <p className="ui-label">Vendedor asignado</p>
          <div className="mt-3 flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{customer.assignedRepAvatar}</AvatarFallback>
            </Avatar>
            <div>
              <p className="ui-body-sm text-[var(--text-primary)]">{customer.assignedRep}</p>
              <p className="ui-body-sm">{customer.assignedRepEmail}</p>
            </div>
          </div>
        </div>

        <Separator />

        <SectionBlock title="Restricciones" icon={<Shield className="h-3.5 w-3.5" />}>
          <div className="space-y-2">
            {customer.restrictions.map((restriction, index) => (
              <div
                key={`${restriction.label}-${index}`}
                className={`rounded-[var(--radius-16)] border px-3 py-2.5 ${
                  restriction.type === "warning"
                    ? "border-[color:var(--status-warning-border)] bg-[var(--status-warning-surface)] text-[var(--status-warning-text)]"
                    : restriction.type === "blocked"
                    ? "border-[color:var(--status-critical-border)] bg-[var(--status-critical-surface)] text-[var(--status-critical-text)]"
                    : "border-[color:var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]"
                }`}
              >
                <p className="ui-body-sm text-inherit">{restriction.label}</p>
              </div>
            ))}
          </div>
        </SectionBlock>

        <Separator />

        <div className="space-y-3">
          <button
            onClick={() => setHistoryOpen((state) => !state)}
            className="flex w-full items-center justify-between text-left"
          >
            <span className="inline-flex items-center gap-2 ui-label">
              <Clock className="h-3.5 w-3.5" />
              Historial de cotizaciones
            </span>
            {historyOpen ? (
              <ChevronDown className="h-4 w-4 text-[var(--text-muted)]" />
            ) : (
              <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
            )}
          </button>

          {historyOpen && (
            <div className="space-y-2">
              {customer.quoteHistory.map((quote) => (
                <div
                  key={quote.id}
                  className="rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="ui-title">{quote.id}</p>
                      <p className="ui-body-sm mt-1">
                        {formatDate(quote.date)} · {quote.items} productos
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="ui-body-sm text-[var(--text-primary)]">{formatCurrency(quote.total)}</p>
                      <div className="mt-2">
                        <Badge
                          variant={
                            quote.status === "confirmed"
                              ? "success"
                              : quote.status === "expired"
                              ? "danger"
                              : "warning"
                          }
                        >
                          {quote.status === "confirmed"
                            ? "Confirmada"
                            : quote.status === "expired"
                            ? "Expirada"
                            : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}

function SectionBlock({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="inline-flex items-center gap-2 ui-label">
        {icon}
        {title}
      </div>
      {children}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="ui-label">{label}</p>
      <p className="ui-body-sm mt-2 text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
