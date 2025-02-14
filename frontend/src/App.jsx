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
import MoreGallery from "./components/moreGallery";
import RestaurantMenu from "./components/Menu";
// import RestaurantBooking from "./components/Booknow";

const App = () => (
  <BrowserRouter>
    <CustomCursor />
    <DarkLightToggle />
    <div className="bg-background dark:bg-darkBackground">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <MarqueeComponent r={"-2deg"}  />
              <About />
              <GalleryWelcome />
              <LuxuryGallery />
              <RestaurantMenu />
              {/* <RestaurantBooking /> */}
            </>
          }
        />
        <Route path="/gallery/moreGallery" element={<MoreGallery />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
