<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may differ from older Next.js knowledge. Read the relevant guide in `node_modules/next/dist/docs/` before writing app code, and pay attention to deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Identity

This repo is a frontend-only prototype for a B2B conversational quoting platform called QuoteAI.

It is not:

- a traditional ecommerce storefront
- a generic chatbot widget
- a production-integrated sales system

It is:

- a chat-first quoting experience
- a commercial workflow demo with rich product context
- a mock environment for exploring AI-assisted sales UX

# Shared Source Of Truth

`CLAUDE.md` imports this file, so treat `AGENTS.md` as the shared context file for any assistant working in the repo.

If you update product assumptions, route descriptions, or implementation caveats, update this file first and keep `README.md` aligned.

# Stack

- Next.js 16.2.4
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- Radix UI
- shadcn-style primitives in `components/ui`
- Framer Motion
- Local mock data only

# Product Principles

- Chat-first experience
- AI is the commercial brain
- Quote builder stays visible while the conversation evolves
- Dynamic UI adapts to message intent
- WhatsApp-to-web continuity is a core story
- Product comparison and cross-sell are first-class actions

# Route Map

- `/`
  Demo landing page
- `/continue/[sessionId]`
  WhatsApp continuity screen
- `/workspace`
  Main three-column quoting workspace
- `/product/[sku]`
  Product detail page with pricing tiers and related products
- `/quote/[quoteId]`
  Quote detail page
- `/sales`
  Seller dashboard

# Code Ownership By Folder

- `app/*`
  Route composition and page-level state
- `components/chat/*`
  Chat rendering and intent-driven UI blocks
- `components/customer/*`
  Customer context sidebar
- `components/products/*`
  Product discovery, comparison, and complementary surfaces
- `components/quote/*`
  Quote builder and line item controls
- `components/ui/*`
  Shared UI primitives and variants
- `data/*`
  Mock domain fixtures and lookup helpers
- `lib/*`
  Business logic, calculations, formatting, and mock AI routing

# Current Runtime Model

Everything important in the workspace is client-side and in-memory.

`app/workspace/page.tsx` owns:

- `messages`
- `quote`
- the left sidebar collapse state

Child components are controlled from there. When adding new chat interactions, pricing behavior, or quote actions, wire them through the workspace instead of creating disconnected local state.

# Mock AI Behavior

There is no real LLM call here. `lib/mock-ai-router.ts` uses regex-style intent detection and returns UI-friendly message objects.

Current message-driven surfaces include:

- product cards
- product comparison blocks
- complementary product blocks
- commercial review confirmation

If you add a new message type, update both:

1. the `MessageType` union in `data/conversations.ts`
2. the renderer branches in `components/chat/ChatWorkspace.tsx`

# Pricing And Quote Rules

Pricing depends on:

- customer price list
- product volume tiers
- manual line discounts

Key helpers:

- `data/pricingRules.ts`
  Base list pricing, volume-price scaling, visibility, tax
- `lib/pricing-engine.ts`
  Resolve price for quantity and volume tiers
- `lib/quote-calculations.ts`
  Totals, tax, discount amount, review flag

If you change discount approval logic, reconcile all threshold definitions together. They are not fully unified today.

# Known Mismatches And Caveats

These are intentional or current prototype shortcuts that future agents should know before refactoring:

- `app/continue/[sessionId]/page.tsx` does not load by actual `sessionId` yet.
- `app/quote/[quoteId]/page.tsx` falls back to a default quote if the id is missing.
- Quote detail uses `defaultCustomer` instead of resolving by `quote.customerId`.
- Review-threshold logic is split across `lib/quote-calculations.ts`, `data/pricingRules.ts`, and customer-facing copy.
- The workspace starts with recovered messages but an empty active quote.
- The repo is a demo, so some CTA buttons are presentational and do not trigger a backend action.

# UX And Copy Guidance

- Preserve the premium B2B SaaS feel
- Favor dense-but-readable layouts over sparse marketing patterns
- Keep user-facing copy in Spanish unless the task explicitly changes locale
- Avoid turning the product into a catalog-first or cart-first experience
- Keep quote context visible during discovery flows

Important note on text encoding:

- Some existing source strings may appear with broken accent characters in this Windows terminal environment.
- Do not perform broad copy cleanups unless the task is specifically about text normalization or encoding.

# UI Conventions

Shared variants already exist in `components/ui`.

Common button variants:

- `default`
- `secondary`
- `outline`
- `ghost`
- `teal`
- `success`
- `warning`

Common badge variants:

- `default`
- `secondary`
- `success`
- `warning`
- `destructive`
- `teal`
- `violet`
- `outline`

Prefer reusing these before adding new visual variants.

# Validation

After code changes, run:

- `npm run lint`
- `npm run build`

For documentation-only changes, a diff review is enough unless the user asks for runtime verification.
