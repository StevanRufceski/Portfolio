import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import "./styles/global.css";
import "./styles/header.css";
import "./styles/form.css";
import "./styles/layout.css";
import "./styles/dashboard.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // Removed React.StrictMode to prevent double API calls during development
  <App />
);
