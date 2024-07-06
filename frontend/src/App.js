import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={Home} />
      </Routes>
    </Router>
  );
}

export default App;
