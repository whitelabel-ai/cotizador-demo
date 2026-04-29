"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { defaultCustomer } from "@/data/customers";
import { initialConversation } from "@/data/conversations";
import { getProductById } from "@/data/products";
import { getPriceForList } from "@/data/pricingRules";

export default function ContinuePage() {
  const customer = defaultCustomer;
  const previewProduct = getProductById("prod-001");
  const previewPrice = previewProduct ? getPriceForList(previewProduct, customer.priceList) : 0;

  return (
    <div className="min-h-screen py-6 sm:py-8">
      <main className="ui-page-shell flex min-h-[calc(100vh-3rem)] items-center">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.15fr)_22rem]">
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="ui-surface-raised rounded-[var(--radius-32)] overflow-hidden"
          >
            <div className="border-b border-[color:var(--border-default)] bg-[var(--surface-accent)] px-6 py-6 sm:px-8">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-16)] bg-[var(--status-ai-solid)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)]">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <Badge variant="ai">Sesion recuperada desde WhatsApp</Badge>
                  <h1 className="ui-h1 max-w-3xl text-[2.3rem]">
                    Continuamos tu cotizacion
                  </h1>
                  <p className="ui-body max-w-2xl">
                    Recuperamos el contexto comercial, el cliente y la referencia consultada para que la conversacion siga en web sin friccion.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 p-6 sm:p-8 xl:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="space-y-4">
                <Card variant="subtle">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit">
                      Cliente detectado
                    </Badge>
                    <CardTitle className="ui-h3">El contexto comercial ya esta listo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-16)] bg-[var(--color-brand-500)] text-[var(--text-inverse)]">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 space-y-2">
                        <p className="ui-title">{customer.company}</p>
                        <p className="ui-body-sm">
                          {customer.contact} · {customer.city}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="brand">Distribuidor Plus</Badge>
                          <Badge variant="outline">Lista {customer.priceList}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 rounded-[var(--radius-16)] border border-[color:var(--border-default)] bg-[rgba(255,255,255,0.72)] p-4 sm:grid-cols-2">
                      <div>
                        <p className="ui-label">Vendedor asignado</p>
                        <div className="mt-2 flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            <AvatarFallback>{customer.assignedRepAvatar}</AvatarFallback>
                          </Avatar>
                          <span className="ui-body-sm text-[var(--text-primary)]">
                            {customer.assignedRep}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="ui-label">Canal de origen</p>
                        <p className="ui-body-sm mt-2 text-[var(--text-primary)]">
                          WhatsApp con continuidad a web
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="raised">
                  <CardHeader>
                    <Badge variant="outline" className="w-fit">
                      Conversacion recuperada
                    </Badge>
                    <CardTitle className="ui-h3">Los primeros mensajes ya estan interpretados</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {initialConversation.messages.slice(0, 3).map((msg) => {
                      if (msg.type !== "text") return null;
                      const isCustomer = msg.role === "customer";

                      return (
                        <div
                          key={msg.id}
                          className={`flex gap-3 ${isCustomer ? "justify-end" : ""}`}
                        >
                          {!isCustomer && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--status-ai-solid)] text-[var(--text-inverse)]">
                              IA
                            </div>
                          )}
                          <div
                            className={`max-w-[85%] rounded-[var(--radius-16)] px-4 py-3 ${
                              isCustomer
                                ? "bg-[var(--color-brand-500)] text-[var(--text-inverse)]"
                                : "border border-[color:var(--border-default)] bg-[var(--surface-raised)] text-[var(--text-primary)]"
                            }`}
                          >
                            <p className="ui-body-sm text-inherit">{msg.content}</p>
                          </div>
                          {isCustomer && (
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-inverse)] text-[var(--text-inverse)]">
                              C
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <Card variant="highlighted">
                  <CardHeader>
                    <Badge variant="brand" className="w-fit">
                      Oportunidad en progreso
                    </Badge>
                    <CardTitle className="ui-h3">La cotizacion puede continuar sin reinicio</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {previewProduct && (
                      <div className="rounded-[var(--radius-24)] border border-[color:var(--border-accent)] bg-[rgba(255,255,255,0.78)] p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-16)] bg-[var(--surface-raised)] text-2xl">
                            {previewProduct.imagePlaceholder}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="ui-mono">{previewProduct.sku}</p>
                            <p className="ui-title mt-2">{previewProduct.name}</p>
                            <p className="ui-body-sm mt-1">5 unidades detectadas en la intencion inicial</p>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between rounded-[var(--radius-16)] bg-[var(--surface-raised)] px-3 py-2">
                          <span className="ui-body-sm">Valor estimado inicial</span>
                          <span className="ui-title text-[var(--color-brand-600)]">
                            {formatCurrency(previewPrice * 5)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="ui-status-note rounded-[var(--radius-16)] border border-[color:var(--status-success-border)] bg-[var(--status-success-surface)] text-[var(--status-success-text)]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                      <div>
                        <p className="ui-title text-[var(--status-success-text)]">
                          Contexto listo para seguir
                        </p>
                        <p className="ui-body-sm mt-1 text-[var(--status-success-text)]">
                          Cliente, referencia y mensaje inicial ya estan conectados al workspace.
                        </p>
                      </div>
                    </div>

                    <Button asChild size="lg" className="w-full justify-between">
                      <Link href="/workspace">
                        Abrir workspace de cotizacion
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card variant="subtle">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[var(--radius-16)] bg-[var(--status-ai-surface)] text-[var(--status-ai-text)]">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="ui-title">Sesion activa</p>
                        <p className="ui-body-sm mt-1">{initialConversation.sessionId}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="space-y-4"
          >
            <Card variant="raised">
              <CardContent className="grid gap-4 p-5">
                <div className="space-y-2">
                  <p className="ui-label">Que prueba esta pantalla</p>
                  <h2 className="ui-h3">Continuidad omnicanal con contexto real</h2>
                </div>
                <ul className="space-y-3">
                  {[
                    "Recuperacion de la conversacion",
                    "Identificacion del cliente y su lista de precios",
                    "Puente claro hacia el workspace operativo",
                  ].map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-1 h-2 w-2 rounded-full bg-[var(--status-ai-solid)]" />
                      <span className="ui-body-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.aside>
        </div>
      </main>
    </div>
  );
}
