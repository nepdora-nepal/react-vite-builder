function App({ initialData = {} }: { initialData?: any }) {
  const {
    page,
    products = [],
    product = null,
    error = null,
  } = initialData;

  return (
    <main className="page">
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route
          path="/products"
          element={
            <ProductsPage
              initialProducts={products}
              initialError={page === "list" ? error : null}
            />
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProductPage
              initialProduct={page === "detail" ? product : null}
              initialError={page === "detail" ? error : null}
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
