import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/api';
import type { Product } from '../types/types';
import './Products.css';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        setProducts(data.results);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading) {
    return (
      <div className="products-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="products-container">
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Products</h1>
        <p>Discover our premium skincare collection</p>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-wrapper">
              <img
                src={product.thumbnail_image}
                alt={product.thumbnail_alt_description || product.name}
                className="product-image"
              />
              {product.is_featured && (
                <span className="badge featured-badge">Featured</span>
              )}
              {product.is_popular && (
                <span className="badge popular-badge">Popular</span>
              )}
            </div>

            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              
              {product.category && (
                <p className="product-category">{product.category.name}</p>
              )}

              <div className="product-pricing">
                <span className="product-price">NPR {product.price}</span>
                {product.market_price && (
                  <span className="product-market-price">
                    NPR {product.market_price}
                  </span>
                )}
              </div>

              <div className="product-meta">
                <span className="stock-info">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
                {product.average_rating > 0 && (
                  <span className="rating">
                    ⭐ {product.average_rating} ({product.reviews_count})
                  </span>
                )}
              </div>

              <button className="add-to-cart-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-products">
          <p>No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}
