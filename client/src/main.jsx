import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import UserContext from "./context/UserContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 1000,
            style: {
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </BrowserRouter>
    </UserContext>
  </StrictMode>
);
