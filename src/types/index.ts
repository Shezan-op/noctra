export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type Category = 'all' | 'hoodies' | 'shirts' | 'pants' | 'tees';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  category: 'hoodies' | 'shirts' | 'pants' | 'tees';
  image: string;
  gallery: string[];
  tags: string[];
  description: string;
  longDescription: string;
  specs: ProductSpec[];
  fabric: {
    material: string;
    weight: string;
    origin: string;
    finish: string;
  };
  fit: string;
  sizes: Size[];
  inStock: boolean;
  stockCount: number;
  featured?: boolean;
  badge?: string;
  color: string;
}

export interface CartItem {
  id: string; // unique combo of product.id + size
  product: Product;
  size: Size;
  quantity: number;
}

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name-asc';

export interface ToastMessage {
  id: string;
  type: 'cart' | 'wishlist' | 'info' | 'success';
  title: string;
  message: string;
  image?: string;
}
