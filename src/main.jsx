import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { store } from "./store/store";
import { router } from "./router/routes";
import "./index.css";
import { ToastProvider } from "./context/ToastContext";

// import your chatbot
import ChatWidget from "./components/chatbot/ChatWidget";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {/* MAIN ROUTER UI */}
          <RouterProvider router={router} />

          {/* GLOBAL CHATBOT */}
          <ChatWidget />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
