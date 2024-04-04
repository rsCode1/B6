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

function toggleTheme() {
  const mainBody = document.getElementById("mainBody");
  mainBody.classList.toggle("light-theme");
}

root.render(
  <React.StrictMode>
    <div>
      <App />
      <button className="theme-toggle-button" onClick={toggleTheme}>Toggle Theme</button>
    </div>
  </React.StrictMode>
);