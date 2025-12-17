import "./index.css";
import { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

declare global {
  interface Window {
    __INITIAL_DATA__?: any;
  }
}

const initialData = window.__INITIAL_DATA__ ?? {
  page: "list",
  products: [],
  product: null,
  error: null,
};

hydrateRoot(
  document.getElementById("root")!,
  <StrictMode>
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  </StrictMode>
);
