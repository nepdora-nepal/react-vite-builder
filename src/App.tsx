// App.tsx
import "./App.css";
import { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { fetchProducts, fetchProduct } from "./services/api";

/* --- Subcomponents --- */
function Header() {
  return <header className="page-header">Demo Store</header>;
}

function State({ title, message }) {
  return (
    <div className="state state-error">
      <p>{title}</p>
      {message && <p className="state-meta">{message}</p>}
    </div>
  );
}

function ProductsPage({ initialProducts, initialError }) {
  const [items, setItems] = useState(initialProducts);
  const [message, setMessage] = useState(initialError);

  useEffect(() => {
    if (items?.length || message) return;

    let cancelled = false;
    async function load() {
      try {
        const data = await fetchProducts();
        if (!cancelled) setItems(data);
      } catch (err) {
        if (!cancelled) setMessage("Could not load products on client.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [items, message]);

  if (message) return <State title="Products failed" message={message} />;
  return <div>{items?.map((p) => <div key={p.id}>{p.title}</div>)}</div>;
}

function ProductPage({ initialProduct, initialError }) {
  const [item, setItem] = useState(initialProduct);
  const [message, setMessage] = useState(initialError);

  if (message) return <State title="Product failed" message={message} />;
  return <div>{item?.title}</div>;
}

/* --- App Component --- */
function App({ initialData }) {
  return (
    <main className="page">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route
          path="/products"
          element={
            <ProductsPage
              initialP
