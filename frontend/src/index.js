import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { WebSocketProvider } from "./context/WebSocketContext";
import { Provider } from "react-redux";
import { store } from "./store/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <WebSocketProvider>
      <App />
    </WebSocketProvider>
  </Provider>
);
