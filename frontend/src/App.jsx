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
import ReservationCalendar from "./components/Booknow";
import Footer from "./components/Footer";
import Login from "./admin/Login";
import Dashboard from "./admin/dashboard";

const App = () => (
  <BrowserRouter>
    <CustomCursor />
    <DarkLightToggle />
    <div className="bg-background dark:bg-darkBackground ">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <MarqueeComponent r={"-2deg"} />
              <About />
              <GalleryWelcome />
              <LuxuryGallery />
              <RestaurantMenu />
              <ReservationCalendar />
              <Footer />
            </>
          }
        />
        <Route path="/gallery/moreGallery" element={<MoreGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="login/dashboard/:iduser" element={<Dashboard />} />
      </Routes>
    </div>
  </BrowserRouter>
);

export default App;
