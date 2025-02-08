import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import './i18n';
import "./App.css";
import { Home, Navbar } from "./components";

const App = () => (
  <BrowserRouter>
    <div>
      <Navbar />
      <div>
        <Home/>
        {/* <Route path="#home" component={} /> */}
        {/* <Route path="#section2" component={Section2} />
        <Route path="#section3" component={Section3} /> */}
      </div>
    </div>
  </BrowserRouter>
);

export default App;
