import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import './i18n';
import "./App.css";
import { Home, Navbar } from "./components";

const App = () => (
  <BrowserRouter>
    <div>
      <Navbar />
      <Home />

    </div>
  </BrowserRouter>
);

export default App;
