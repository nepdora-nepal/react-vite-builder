import "./App.css";
import { useEffect, useState } from "react";
import { Route, Routes, useLocation, Navigate } from "react-router-dom";
import { fetchProduct, fetchProducts } from "./services/api";

function Header() {
  return (
    <header className="page-header">
      <div>
        <p className="eyebrow">Server-rendered demo</p>
        <h1 className="headline">Demo Storefront</h1>
        <p className="lede">
          All product data is fetched on the server (dummyjson.com) and shipped
          in the initial HTML, so there are no client-side API calls to see the
          page.
        </p>
      </div>

      <nav className="nav">
        <a href="/products" className="nav-link">
          Products
        </a>
        <a href="/products/1" className="nav-link">
          Product detail
        </a>
      </nav>
    </header>
  );
}

function ProductCard({ product }: { product: any }) {
  return (
    <a className="product-card compact" href={`/products/${product.id}`}>
      <div className="product-media">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h2 className="product-title">{product.title}</h2>
        <p className="product-description clamp">{product.description}</p>
        <div className="product-meta">
          <div>
            <p className="product-label">Price</p>
            <p className="product-price">${product.price}</p>
          </div>
          <div>
            <p className="product-label">Rating</p>
            <p className="product-rating">{product.rating} / 5</p>
          </div>
        </div>
      </div>
    </a>
  );
}

function ProductGrid({ products }: { products: any[] }) {
  if (!products?.length) return <p className="muted">No products available.</p>;
  return (
    <div className="grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductDetail({ product }: { product: any }) {
  if (!product) return null;

  return (
    <article className="product-card">
      <div className="product-media">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-content">
        <p className="product-category">{product.category}</p>
        <h1 className="product-title">{product.title}</h1>
        <p className="product-description">{product.description}</p>
        <div className="product-meta">
          <div>
            <p className="product-label">Price</p>
            <p className="product-price">${product.price}</p>
          </div>
          <div>
            <p className="product-label">Rating</p>
            <p className="product-rating">{product.rating} / 5</p>
          </div>
          <div>
            <p className="product-label">Stock</p>
            <p className="product-stock">{product.stock} available</p>
          </div>
        </div>
        <div className="product-tags">
          {product.tags?.map((tag: string) => (
            <span key={tag} className="product-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

function State({ title, message }: { title: string; message?: string }) {
  return (
    <div className="state state-error">
      <p>{title}</p>
      {message ? <p className="state-meta">{message}</p> : null}
    </div>
  );
}

function ProductsPage({ initialProducts, initialError }: { initialProducts: any[]; initialError: string | null }) {
  const [items, setItems] = useState(initialProducts);
  const [message, setMessage] = useState(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (items?.length || message) return;

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProducts();
        if (!cancelled) setItems(data ?? []);
      } catch (err) {
        if (!cancelled) {
          setMessage("Content could not be loaded on the client.");
          console.error("[Client] list fetch failed", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [items, message]);

  if (message)
    return <State title="We could not load products." message={message} />;

  return (
    <>
      {loading ? <p className="muted">Loading products…</p> : null}
      <ProductGrid products={items} />
    </>
  );
}

function ProductPage({ initialProduct, initialError }: { initialProduct: any; initialError: string | null }) {
  const location = useLocation();
  const [item, setItem] = useState(initialProduct);
  const [message, setMessage] = useState(initialError);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item || message) return;

    const match = location.pathname.match(/^\/products\/(\d+)/);
    const id = match?.[1];
    if (!id) {
      setMessage("Product id missing.");
      return;
    }

    let cancelled = false;
    async function load() {
      try {
        setLoading(true);
        const data = await fetchProduct(id);
        if (!cancelled) setItem(data);
      } catch (err) {
        if (!cancelled) {
          setMessage("Content could not be loaded on the client.");
          console.error("[Client] detail fetch failed", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [item, message, location.pathname]);

  if (message)
    return <State title="We could not load this product." message={message} />;

  return (
    <>
      {loading ? <p className="muted">Loading product…</p> : null}
      <ProductDetail product={item} />
    </>
  );
}

function App({ initialData }: { initialData: any }) {
  return (
    <main className="page">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route
          path="/products"
          element={
            <ProductsPage
              initialProducts={initialData.products}
              initialError={
                initialData.page === "list" ? initialData.error : null
              }
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductPage
              initialProduct={
                initialData.page === "detail" ? initialData.product : null
              }
              initialError={
                initialData.page === "detail" ? initialData.error : null
              }
            />
          }
        />
        <Route
          path="*"
          element={
            <State
              title="Page not found."
              message="Try visiting /products or /products/1 for examples."
            />
          }
        />
      </Routes>
    </main>
  );
}

export default App;