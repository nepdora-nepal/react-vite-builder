import type { ProductsApiResponse } from '../types/types';

const API_BASE_URL = 'https://glow.nepdora.baliyoventures.com/api';

export async function fetchProducts(): Promise<ProductsApiResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/product/`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data: ProductsApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}
