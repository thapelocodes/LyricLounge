import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { PrivateRoute } from "./routes/protectedRoutes";

export function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" Component={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute />}></Route>
        </Routes>
      </Router>
    </Provider>
  );
}
