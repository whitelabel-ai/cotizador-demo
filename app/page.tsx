"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  CheckCircle2,
  FileText,
  MessageSquare,
  ShieldCheck,
  Tag,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const journeys = [
  {
    href: "/continue/sess-wa-7f3k2m",
    eyebrow: "Flujo principal",
    title: "Continuar una conversacion desde WhatsApp",
    description:
      "Muestra como recuperamos contexto, cliente y oportunidad sin pedirle al comprador que reinicie el proceso en la web.",
    proof: "Demuestra continuidad omnicanal y arranque con contexto comercial.",
    buttonLabel: "Ver flujo WhatsApp a web",
    icon: MessageSquare,
    primary: true,
  },
  {
    href: "/workspace",
    eyebrow: "Experiencia core",
    title: "Abrir el workspace de cotizacion",
    description:
      "Entra al producto central: chat comercial, contexto del cliente, sugerencias de productos y cotizacion visible en un mismo espacio.",
    proof: "Demuestra chat-first quoting y trabajo asistido por IA.",
    buttonLabel: "Abrir workspace",
    icon: Tag,
  },
  {
    href: "/sales",
    eyebrow: "Operacion comercial",
    title: "Revisar el dashboard del vendedor",
    description:
      "Expone pipeline, estados de cotizacion, seguimientos y solicitudes que requieren revision del equipo comercial.",
    proof: "Demuestra visibilidad operativa despues de la conversacion.",
    buttonLabel: "Ver dashboard comercial",
    icon: BarChart3,
  },
] satisfies Array<{
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  proof: string;
  buttonLabel: string;
  icon: LucideIcon;
  primary?: boolean;
}>;

const proofPoints = [
  {
    icon: Bot,
    title: "La IA no es un chatbot generico",
    description:
      "Entiende intenciones comerciales, propone referencias, compara opciones y mueve la cotizacion hacia una accion concreta.",
  },
  {
    icon: Building2,
    title: "La cotizacion vive dentro del contexto",
    description:
      "Cliente, restricciones, precios, historial y quote builder conviven con la conversacion para evitar saltos de pantalla.",
  },
  {
    icon: ShieldCheck,
    title: "El canal no se rompe",
    description:
      "La oportunidad puede empezar en WhatsApp, continuar en web y terminar en revision, envio o confirmacion comercial.",
  },
] satisfies Array<{
  icon: LucideIcon;
  title: string;
  description: string;
}>;

const flowHighlights = [
  {
    icon: MessageSquare,
    label: "Conversacion",
    text: "La entrada al producto es una intencion comercial, no un catalogo plano.",
  },
  {
    icon: Tag,
    label: "Cotizacion activa",
    text: "El quote builder siempre esta visible mientras se agregan productos y descuentos.",
  },
  {
    icon: TrendingUp,
    label: "Operacion",
    text: "La experiencia termina en accion comercial, no en una conversacion sin salida.",
  },
] satisfies Array<{
  icon: LucideIcon;
  label: string;
  text: string;
}>;

export default function HomePage() {
  return (
    <div className="min-h-screen py-6 sm:py-8">
      <main className="ui-page-shell flex min-h-[calc(100vh-3rem)] flex-col justify-center gap-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_24rem]">
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="overflow-hidden rounded-[var(--radius-32)] border border-[color:var(--border-default)] bg-[var(--surface-inverse)] text-[var(--text-inverse)] shadow-[var(--shadow-floating)]"
          >
            <div className="border-b border-[color:var(--border-inverse-soft)] px-6 py-5 sm:px-8">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-16)] bg-[var(--color-brand-500)] text-[var(--text-inverse)] shadow-[var(--shadow-subtle)]">
                  <Bot className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <Badge variant="ai" className="w-fit">
                    Prototipo funcional
                  </Badge>
                  <p className="ui-body-sm ui-text-inverse-muted">
                    QuoteAI - cotizacion B2B conversacional
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8 px-6 py-8 sm:px-8 sm:py-10">
              <div className="max-w-3xl space-y-5">
                <p className="ui-eyebrow text-[var(--color-brand-200)]">
                  La propuesta en una frase
                </p>
                <h1 className="ui-display text-[var(--text-inverse)]">
                  Cotiza conversando,
                  <span className="block text-[var(--color-brand-200)]">
                    no navegando un catalogo.
                  </span>
                </h1>
                <p className="ui-body ui-text-inverse-muted max-w-2xl">
                  QuoteAI convierte una conversacion comercial en una experiencia clara:
                  entiende la necesidad, propone referencias, compara alternativas,
                  sugiere complementarios y arma la cotizacion sin sacar al usuario del contexto.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                {flowHighlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 * (index + 1) }}
                      className="ui-surface-inverse-panel rounded-[var(--radius-24)] p-4"
                    >
                      <div className="ui-surface-inverse-icon mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-16)] text-[var(--color-brand-100)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="ui-title text-[var(--text-inverse)]">{item.label}</p>
                      <p className="ui-body-sm ui-text-inverse-subtle mt-2">
                        {item.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              <div className="ui-surface-inverse-panel rounded-[var(--radius-24)] p-5">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="brand">Que demuestra este home</Badge>
                  <span className="ui-body-sm ui-text-inverse-subtle">
                    Cada boton abre un recorrido distinto del prototipo.
                  </span>
                </div>
                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <DemoSignal
                    icon={CheckCircle2}
                    title="Continuidad"
                    description="Desde WhatsApp hasta la web, sin perder la oportunidad."
                  />
                  <DemoSignal
                    icon={FileText}
                    title="Cotizacion visible"
                    description="Chat, productos y quote builder trabajando juntos."
                  />
                  <DemoSignal
                    icon={Zap}
                    title="Accion comercial"
                    description="Seguimiento, descuentos y estados listos para operar."
                  />
                </div>
              </div>
            </div>
          </motion.section>

          <motion.aside
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            <Card variant="raised">
              <CardHeader className="space-y-3 pb-0">
                <Badge variant="outline" className="w-fit">
                  Entradas del demo
                </Badge>
                <CardTitle className="ui-h3">
                  Elige que parte de la propuesta quieres mostrar
                </CardTitle>
                <p className="ui-body-sm">
                  No todos los botones hacen lo mismo. Cada uno abre un recorrido distinto para explicar la plataforma.
                </p>
              </CardHeader>

              <CardContent className="space-y-3 pt-4">
                {journeys.map((journey) => (
                  <JourneyCard key={journey.href} {...journey} />
                ))}
              </CardContent>
            </Card>

            <Card variant="subtle">
              <CardContent className="grid gap-3 p-5">
                <p className="ui-title">
                  Si estas presentando el producto, este es el orden recomendado:
                </p>
                <ol className="space-y-2">
                  {[
                    "Empieza por WhatsApp para mostrar continuidad y contexto recuperado.",
                    "Luego abre el workspace para ensenar la experiencia central de cotizacion.",
                    "Cierra con dashboard para mostrar impacto y operacion comercial.",
                  ].map((text, index) => (
                    <li key={text} className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--status-info-surface)] text-xs font-bold text-[var(--status-info-text)]">
                        {index + 1}
                      </span>
                      <span className="ui-body-sm">{text}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </motion.aside>
        </div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="grid gap-4 lg:grid-cols-3"
        >
          {proofPoints.map((point) => {
            const Icon = point.icon;
            return (
              <Card key={point.title} variant="raised">
                <CardContent className="p-5">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-[var(--radius-16)] bg-[var(--surface-inverse)] text-[var(--text-inverse)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="ui-h3 text-[1.15rem]">{point.title}</h2>
                  <p className="ui-body-sm mt-2">{point.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </motion.section>

        <p className="ui-body-sm text-center text-[var(--text-muted)]">
          Prototipo local con datos mock - Next.js 16 - TypeScript - Tailwind - App Router
        </p>
      </main>
    </div>
  );
}

function JourneyCard({
  href,
  eyebrow,
  title,
  description,
  proof,
  buttonLabel,
  icon: Icon,
  primary = false,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  proof: string;
  buttonLabel: string;
  icon: LucideIcon;
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-24)] border p-4 ${
        primary
          ? "border-[color:var(--border-accent)] bg-[var(--surface-accent)]"
          : "border-[color:var(--border-default)] bg-[var(--surface-subtle)]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-16)] ${
            primary
              ? "bg-[var(--color-brand-500)] text-[var(--text-inverse)]"
              : "bg-[var(--surface-raised)] text-[var(--text-secondary)]"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="ui-label">{eyebrow}</p>
          <h3 className="ui-title mt-2">{title}</h3>
        </div>
      </div>

      <p className="ui-body-sm mt-4">{description}</p>
      <p className="ui-body-sm mt-3 rounded-[var(--radius-16)] bg-[rgba(255,255,255,0.78)] px-3 py-2 text-[var(--text-secondary)]">
        {proof}
      </p>

      <Button
        asChild
        size="lg"
        variant={primary ? "primary" : "outline"}
        className="mt-4 w-full justify-between"
      >
        <Link href={href}>
          {buttonLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

function DemoSignal({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="ui-surface-inverse-panel rounded-[var(--radius-16)] p-4">
      <div className="ui-surface-inverse-icon mb-3 flex h-9 w-9 items-center justify-center rounded-[var(--radius-12)] text-[var(--text-inverse)]">
        <Icon className="h-4 w-4" />
      </div>
      <p className="ui-title text-[var(--text-inverse)]">{title}</p>
      <p className="ui-body-sm ui-text-inverse-subtle mt-2">{description}</p>
    </div>
  );
}
