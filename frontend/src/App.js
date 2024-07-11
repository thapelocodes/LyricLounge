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
import { Navbar } from "./components/Navbar";
import { Logout } from "./components/Logout";
import { ChatRoomPage } from "./pages/ChatRoomPage";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
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
          <Route path="/chatroom/:chatRoomId" element={<PrivateRoute />}>
            <Route index element={<ChatRoomPage />} />
          </Route>
          <Route path="/logout" element={<PrivateRoute />}>
            <Route index element={<Logout />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
