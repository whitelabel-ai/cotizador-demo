import type { QuoteLineItem } from "@/data/quotes";
import { TAX_RATE } from "@/data/pricingRules";

export interface QuoteTotals {
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  tax: number;
  total: number;
  itemCount: number;
  requiresReview: boolean;
}

export function calculateLineTotal(item: QuoteLineItem): number {
  const discounted = item.unitPrice * (1 - item.discountPercent / 100);
  return Math.round(discounted * item.qty);
}

export function calculateLinePriceAfterDiscount(item: QuoteLineItem): number {
  return Math.round(item.unitPrice * (1 - item.discountPercent / 100));
}

export function calculateTotals(items: QuoteLineItem[]): QuoteTotals {
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);
  const discountAmount = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.qty * (item.discountPercent / 100);
  }, 0);
  const subtotalAfterDiscount = subtotal - discountAmount;
  const tax = Math.round(subtotalAfterDiscount * TAX_RATE);
  const total = subtotalAfterDiscount + tax;
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
  const requiresReview = items.some((item) => item.discountPercent > 10);

  return {
    subtotal: Math.round(subtotal),
    discountAmount: Math.round(discountAmount),
    subtotalAfterDiscount: Math.round(subtotalAfterDiscount),
    tax,
    total,
    itemCount,
    requiresReview,
  };
}
