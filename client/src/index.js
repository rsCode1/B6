import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.js";
import "tailwindcss/tailwind.css";

/**
 * Creates a root React element and renders it into the DOM.
 *
 * @param {HTMLElement} rootElement - The root element in the HTML where the React element will be rendered.
 * @returns {ReactDOM.Root} - The root React element.
 */
export const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
