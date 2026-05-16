"use client";

import React from "react";
import {
  Building2,
  ChevronDown,
  ChevronRight,
  Clock,
  MessageSquare,
  Plus,
  Shield,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Customer } from "@/data/customers";
import type { Quote } from "@/data/quotes";

interface ConversationSidebarProps {
  customer: Customer;
  quotes: Quote[];
  activeQuoteId: string;
  onSelectQuote: (quoteId: string) => void;
  onNewConversation: () => void;
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

export function ConversationSidebar({
  customer,
  quotes,
  activeQuoteId,
  onSelectQuote,
  onNewConversation,
}: ConversationSidebarProps) {
  const [contextOpen, setContextOpen] = React.useState(true);
  const origin = originConfig[customer.origin];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-[color:var(--border-default)] px-4 py-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-[var(--text-muted)]" />
          <span className="ui-label">Conversaciones</span>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNewConversation}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {quotes.map((quote) => {
            const isActive = quote.id === activeQuoteId;
            const lastMessage = quote.lastIntent || "Sin actividad reciente";
            const timeAgo = formatDate(quote.createdAt);

            return (
              <button
                key={quote.id}
                onClick={() => onSelectQuote(quote.id)}
                className={`w-full rounded-[var(--radius-16)] border px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)]"
                    : "border-[color:var(--border-default)] bg-[var(--surface-subtle)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="ui-title truncate">{quote.number}</span>
                      {quote.status === "commercial_review" && (
                        <Badge variant="review" className="shrink-0 text-[10px]">
                          Revision
                        </Badge>
                      )}
                      {quote.status === "confirmed" && (
                        <Badge variant="success" className="shrink-0 text-[10px]">
                          Confirmada
                        </Badge>
                      )}
                    </div>
                    <p className="ui-body-sm mt-1 truncate text-[var(--text-muted)]">{lastMessage}</p>
                    <p className="ui-body-sm mt-1 text-[var(--text-muted)]">{timeAgo}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {contextOpen && (
          <div className="border-t border-[color:var(--border-default)] px-2 py-3">
            <div className="space-y-3 p-2">
              <div className="flex items-start gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-16)] bg-[var(--color-brand-500)] text-[var(--text-inverse)]">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="space-y-0.5">
                    <h3 className="ui-title text-sm">{customer.company}</h3>
                    <p className="ui-body-sm">{customer.taxId}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant="brand" className="text-[10px]">
                      {typeLabels[customer.type]}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {customer.city}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <SectionBlock title="Contacto" icon={<User className="h-3.5 w-3.5" />}>
                <div className="space-y-1">
                  <p className="ui-body-sm text-[var(--text-primary)]">{customer.contact}</p>
                  <p className="ui-body-sm">{customer.email}</p>
                  <p className="ui-body-sm">{customer.phone}</p>
                </div>
              </SectionBlock>

              <Separator />

              <SectionBlock title="Condiciones comerciales">
                <div className="grid grid-cols-2 gap-2">
                  <InfoItem label="Lista" value={typeLabels[customer.type]} />
                  <InfoItem label="Plazo" value={customer.paymentTerms} />
                  <div>
                    <p className="ui-label text-[10px]">Canal</p>
                    <div className="mt-1">
                      <Badge variant={origin.tone} className="text-[10px]">
                        {origin.label}
                      </Badge>
                    </div>
                  </div>
                  <InfoItem label="Credito" value={formatCurrency(customer.creditLimit)} />
                </div>
              </SectionBlock>

              <Separator />

              <div className="rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[var(--surface-subtle)] p-2.5">
                <p className="ui-label text-[10px]">Vendedor</p>
                <div className="mt-2 flex items-center gap-2">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">{customer.assignedRepAvatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="ui-body-sm text-[var(--text-primary)]">{customer.assignedRep}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <SectionBlock title="Restricciones" icon={<Shield className="h-3.5 w-3.5" />}>
                <div className="space-y-1.5">
                  {customer.restrictions.map((restriction, index) => (
                    <div
                      key={`${restriction.label}-${index}`}
                      className={`rounded-[var(--radius-12)] border px-2 py-1.5 ${
                        restriction.type === "warning"
                          ? "border-[color:var(--status-warning-border)] bg-[var(--status-warning-surface)] text-[var(--status-warning-text)]"
                          : restriction.type === "blocked"
                          ? "border-[color:var(--status-critical-border)] bg-[var(--status-critical-surface)] text-[var(--status-critical-text)]"
                          : "border-[color:var(--border-default)] bg-[var(--surface-subtle)] text-[var(--text-secondary)]"
                      }`}
                    >
                      <p className="ui-body-sm text-[10px] text-inherit">{restriction.label}</p>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            </div>
          </div>
        )}
      </ScrollArea>

      {!contextOpen && (
        <div className="border-t border-[color:var(--border-default)] p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => setContextOpen(true)}
          >
            <Building2 className="h-4 w-4" />
            Ver contexto
          </Button>
        </div>
      )}
    </div>
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
    <div className="space-y-2">
      <div className="inline-flex items-center gap-1.5 ui-label text-[10px]">
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
      <p className="ui-label text-[10px]">{label}</p>
      <p className="ui-body-sm mt-1 text-[var(--text-primary)]">{value}</p>
    </div>
  );
}
