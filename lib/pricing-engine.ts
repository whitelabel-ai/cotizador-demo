import { getPriceForList, getVolumePriceForList } from "@/data/pricingRules";
import type { Product } from "@/data/products";
import type { PriceList } from "@/data/customers";

export function resolveUnitPrice(
  product: Product,
  priceList: PriceList,
  qty: number
): number {
  const volPrice = getVolumePriceForList(product, priceList, qty);
  const listPrice = getPriceForList(product, priceList);
  // Return the better of the two (volume price is always <= list price)
  return Math.min(volPrice, listPrice);
}

export function getApplicableVolumeTier(
  product: Product,
  qty: number
): { label: string; price: number } | null {
  const sorted = [...product.volumePrices].sort((a, b) => b.minQty - a.minQty);
  const tier = sorted.find((t) => qty >= t.minQty);
  return tier ? { label: tier.label, price: tier.price } : null;
}

export function getNextVolumeTier(
  product: Product,
  qty: number
): { minQty: number; price: number; label: string } | null {
  const sorted = [...product.volumePrices].sort((a, b) => a.minQty - b.minQty);
  return sorted.find((t) => t.minQty > qty) ?? null;
}
