import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import './i18n';
import "./App.css";
import { Home, Navbar ,About } from "./components";
import DarkLightToggle from "./components/darkLight";

const App = () => (
  <BrowserRouter>
      <Navbar />
    <div>
      <div>
      <DarkLightToggle />
        <Home/>
        <About/>
        {/* <Route path="#home" component={} /> */}
        {/* <Route path="#section2" component={Section2} />
        <Route path="#section3" component={Section3} /> */}
      </div>
    </div>
  </BrowserRouter>
);

export default App;
