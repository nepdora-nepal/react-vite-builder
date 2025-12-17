export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: string;
  market_price: string | null;
  stock: number;
  thumbnail_image: string;
  thumbnail_alt_description: string | null;
  category: Category | null;
  sub_category: Category | null;
  is_popular: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  fast_shipping: boolean;
  warranty: string | null;
  average_rating: number;
  reviews_count: number;
  is_wishlist: boolean;
  variants_read: unknown[];
}

export interface ProductsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}
