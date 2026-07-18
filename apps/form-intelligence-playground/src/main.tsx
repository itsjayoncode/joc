import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/App.js";

import "./styles/global.css";

const rootElement = globalThis.document.getElementById("root");

if (!rootElement) {
  throw new Error("Form Intelligence Playground root element was not found.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
