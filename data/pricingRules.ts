import type { PriceList } from "./customers";
import type { Product } from "./products";

export const MAX_AUTO_DISCOUNT: Record<PriceList, number> = {
  distribuidor_plus: 15,
  distribuidor: 10,
  corporativo: 12,
  lista_general: 5,
};

export const COMMERCIAL_REVIEW_THRESHOLD = 15; // % above which requires review

export function getPriceForList(product: Product, priceList: PriceList): number {
  switch (priceList) {
    case "distribuidor_plus":
      return product.distributorPlusPrice;
    case "distribuidor":
      return product.distributorPrice;
    case "corporativo":
      return product.corporatePrice;
    default:
      return product.basePrice;
  }
}

export function getVolumePriceForList(
  product: Product,
  priceList: PriceList,
  qty: number
): number {
  const baseForList = getPriceForList(product, priceList);
  // Apply volume discount on top of list price
  const sorted = [...product.volumePrices].sort((a, b) => b.minQty - a.minQty);
  const tier = sorted.find((t) => qty >= t.minQty);
  if (!tier) return baseForList;

  // Volume price is relative to distribuidor_plus base, scale for other lists
  const ratio = baseForList / product.distributorPlusPrice;
  return Math.round(tier.price * ratio);
}

export function requiresCommercialReview(
  discountPercent: number,
  priceList: PriceList
): boolean {
  return discountPercent > MAX_AUTO_DISCOUNT[priceList];
}

export function isProductVisibleForCustomer(
  product: Product,
  priceList: PriceList
): boolean {
  if (product.visibility === "all") return true;
  if (product.visibility === "distribuidor_plus" && priceList === "distribuidor_plus") return true;
  if (product.visibility === "distribuidor" && (priceList === "distribuidor" || priceList === "distribuidor_plus")) return true;
  if (product.visibility === "corporativo" && priceList === "corporativo") return true;
  return false;
}

export const TAX_RATE = 0.19; // IVA Colombia 19%
export const QUOTE_VALIDITY_DAYS = 15;
