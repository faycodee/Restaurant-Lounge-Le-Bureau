import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
// import './i18n';
import "./App.css";
import { Home, Navbar, About } from "./components";
import DarkLightToggle from "./components/darkLight";
import MarqueeComponent from "./components/Marquee";
import CustomCursor from "./components/cursor";
import GalleryWelcome from "./components/GalleryWelcome";
import LuxuryGallery from "./components/Gallery";
import RestaurantGallery from "./components/moreGallery";

const App = () => (
  <BrowserRouter>
    <Navbar />
    <div>
      <div className=" ">
        <DarkLightToggle />
        <CustomCursor />
        <Home />
        <MarqueeComponent r={"-2deg"} />
        <About />
        <GalleryWelcome />
       
        {/* <RestaurantGallery /> */}

        {/* <Route path="#home" component={} /> */}
        {/* <Route path="#section2" component={Section2} />
        <Route path="#section3" component={Section3} /> */}
      </div>
    </div>
  </BrowserRouter>
);

export default App;
