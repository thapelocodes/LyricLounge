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
import { ChatRooms } from "./pages/ChatRooms";

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<PrivateRoute />}>
            <Route index element={<Profile />} />
          </Route>
          <Route path="/chatrooms" element={<PrivateRoute />}>
            <Route index element={<ChatRooms />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}
