
  import { createRoot } from "react-dom/client";
  import React from "react";
  import App from "./App.tsx";
  import "./index.css";
  import { AuthProvider } from "./context/AuthProvider";

  createRoot(document.getElementById("root")!).render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  