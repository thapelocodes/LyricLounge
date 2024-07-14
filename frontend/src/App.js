import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { PrivateRoute } from "./routes/protectedRoutes";
import { Profile } from "./pages/Profile";
import { Navbar } from "./components/Navbar";
import { Chatrooms } from "./pages/Chatrooms";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route path="" element={<Profile />} />
          </Route>
          <Route path="/chat" element={<PrivateRoute />}>
            <Route path="" element={<Chatrooms />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}
