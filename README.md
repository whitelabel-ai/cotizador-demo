# QuoteAI Prototype

Functional prototype for a B2B conversational quoting experience aimed at distributors and commercial teams. This is not a classic ecommerce storefront. The main interaction is a chat-driven workspace where an AI assistant helps a seller or buyer discover products, compare alternatives, request better pricing, and assemble a quote.

## What this repo currently is

- Frontend-only Next.js prototype
- Local mock data only
- No backend, auth, database, or persistence
- No real AI integration
- No checkout or payment flow

The app is optimized to demonstrate product and commercial flows, not production infrastructure.

## Core product idea

The experience is built around five ideas:

1. Chat-first quoting instead of category browsing
2. AI acts as the commercial brain, not as a generic support bot
3. Quote builder stays visible while the conversation evolves
4. Product discovery can branch into alternatives and complementary items
5. WhatsApp-to-web continuity is part of the story, not an afterthought

## Main routes

- `/`
  Landing page with entry points into the demo
- `/continue/[sessionId]`
  Simulates resuming a WhatsApp conversation inside the web app
- `/workspace`
  Main three-column quoting workspace
- `/product/[sku]`
  Rich product detail page with price tiers, related items, and navigation back to the workspace
- `/quote/[quoteId]`
  Quote detail and summary view
- `/sales`
  Seller dashboard with quote pipeline states

## Main user flow

1. User lands on the homepage
2. User resumes a WhatsApp-originated session or jumps directly into the workspace
3. The center chat shows recovered context and mock AI responses
4. Product cards, comparisons, and complementary suggestions appear inline in chat
5. Products are added into the quote panel on the right
6. The quote can move into commercial review or confirmation
7. Seller dashboard shows sample pipeline states across quotes

## Stack

- Next.js 16.2.4
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- shadcn-style UI primitives in `components/ui`
- Radix UI primitives
- Framer Motion
- Lucide React

## Architecture map

### App routes

- `app/page.tsx`
  Landing page
- `app/continue/[sessionId]/page.tsx`
  WhatsApp continuity entry screen
- `app/workspace/page.tsx`
  Main quote workspace and top-level client state
- `app/product/[sku]/page.tsx`
  Product details, price tiers, alternatives, and complementary items
- `app/quote/[quoteId]/page.tsx`
  Quote detail view
- `app/sales/page.tsx`
  Seller pipeline dashboard

### Domain components

- `components/chat/*`
  Chat surface, typing indicator, message rendering
- `components/customer/*`
  Customer context sidebar
- `components/products/*`
  Product cards, comparison UI, complementary product UI
- `components/quote/*`
  Quote panel and line items

### Mock data

- `data/customers.ts`
  Customer profiles, price lists, restrictions, quote history
- `data/conversations.ts`
  Seed conversation and quick actions
- `data/products.ts`
  Catalog, specs, complementary links, alternative links, volume tiers
- `data/pricingRules.ts`
  Price list helpers, review thresholds, tax constant
- `data/quotes.ts`
  Initial quote and dashboard sample quotes

### Business logic

- `lib/mock-ai-router.ts`
  Regex-based intent detection and mock AI responses
- `lib/pricing-engine.ts`
  Price resolution and volume tier helpers
- `lib/quote-calculations.ts`
  Totals, tax, discount math, review flag
- `lib/utils.ts`
  Formatting and generic helpers

## How the mock AI works

There is no LLM call in this repo. The chat assistant is simulated by `lib/mock-ai-router.ts`.

It currently supports intents for:

- finding a product by SKU, tag, or model keyword
- showing alternatives
- showing complementary products
- asking for better pricing
- explaining volume pricing
- pointing the user back to the current quote
- greeting and fallback replies

Responses can produce different message types:

- `text`
- `product_card`
- `product_comparison`
- `complementary_products`
- `commercial_review`

The workspace interprets those message types and mounts the corresponding UI blocks under the message bubble.

## Important implementation notes

### State ownership

`app/workspace/page.tsx` owns:

- `messages`
- `quote`
- sidebar collapse state

The chat and quote components are controlled children. If you add new interactions, wire them through the workspace first.

### Pricing model

Pricing depends on:

- customer price list
- product volume tiers
- manual line-item discount

Quantity changes in the quote panel recompute unit price with `resolveUnitPrice()`.

### Design direction

The app is intentionally not using a marketplace layout. It should feel like premium B2B sales software:

- dense but readable
- blue, teal, slate palette
- rounded cards
- soft shadows
- strong product and commercial context
- motion used to support narrative transitions

## Current constraints and caveats

These are useful to know before editing:

- Everything is mock data. Refreshing loses in-memory workspace state.
- `app/continue/[sessionId]/page.tsx` does not actually use the route param to load a different session yet.
- `app/quote/[quoteId]/page.tsx` falls back to a default quote if the id is not found.
- Quote detail currently uses `defaultCustomer` instead of resolving the customer from `quote.customerId`.
- Commercial review logic is not fully centralized yet:
  - `lib/quote-calculations.ts` flags review when any line discount is greater than 10%
  - `data/pricingRules.ts` defines per-price-list auto-discount limits plus a `COMMERCIAL_REVIEW_THRESHOLD` of 15
  - customer-facing copy in mock data also references approval thresholds
- User-facing copy is mostly Spanish, while structural docs are in English.
- Some existing source strings may render with broken accent characters in this terminal environment. Avoid mass copy rewrites unless you are intentionally normalizing encoding.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful scripts:

```bash
npm run lint
npm run build
```

## Editing guidance for future contributors and agents

- Keep business rules in `lib`
- Keep mock fixtures in `data`
- Prefer reusable UI building blocks over route-local duplication
- Preserve the chat-first quoting concept
- Preserve the three-column workspace unless the task explicitly changes the product direction
- If you touch discount approval behavior, reconcile all threshold sources together
- If you introduce real data loading, document what remains mocked and what becomes authoritative
