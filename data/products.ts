import izcProductsData from "./izc-products.json";

export type ProductCategory =
  | "impresoras_pos"
  | "impresoras_etiquetas"
  | "impresoras_termicas"
  | "cintas_ribbon"
  | "papel_termico"
  | "etiquetas"
  | "lectores_codigo"
  | "cajones_monedero"
  | "accesorios";

export type ProductVisibility = "all" | "distribuidor_plus" | "distribuidor" | "corporativo";

export interface VolumePrice {
  minQty: number;
  price: number;
  label: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brand: string;
  model: string;
  category: ProductCategory;
  description: string;
  specs: ProductSpec[];
  imageUrl: string;
  imagePlaceholder?: string;
  basePrice: number;
  distributorPlusPrice: number;
  distributorPrice: number;
  corporatePrice: number;
  stock: number;
  visibleStock: number;
  warranty: string;
  visibility: ProductVisibility;
  complementaryIds: string[];
  alternativeIds: string[];
  volumePrices: VolumePrice[];
  tags: string[];
  isRecommended?: boolean;
  badge?: string;
}

export const products: Product[] = izcProductsData.products.map((p) => ({
  ...p,
  category: p.category as ProductCategory,
  visibility: p.visibility as ProductVisibility,
  imagePlaceholder: p.imageUrl ? undefined : "🖨️",
}));

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductBySku = (sku: string): Product | undefined =>
  products.find((p) => p.sku.toLowerCase() === sku.toLowerCase());

export const getComplementaryProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  return product.complementaryIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p);
};

export const getAlternativeProducts = (productId: string): Product[] => {
  const product = getProductById(productId);
  if (!product) return [];
  return product.alternativeIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => !!p);
};

export const searchProducts = (query: string): Product[] => {
  const lower = query.toLowerCase();
  return products.filter(
    (p) =>
      p.tags.some((tag) => tag.toLowerCase().includes(lower)) ||
      p.sku.toLowerCase().includes(lower) ||
      p.name.toLowerCase().includes(lower) ||
      p.brand.toLowerCase().includes(lower) ||
      p.model.toLowerCase().includes(lower) ||
      p.description.toLowerCase().includes(lower)
  );
};
