import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

// Layout Components
import { Navbar, Footer, Home, About } from "./components";
import DarkLightToggle from "./components/darkLight";
import CustomCursor from "./components/cursor";

// Page Components
import MarqueeComponent from "./components/Marquee";
import GalleryWelcome from "./components/GalleryWelcome";
import LuxuryGallery from "./components/Gallery";
import MoreGallery from "./components/moreGallery";
import RestaurantMenu from "./components/Menu";
import ReservationCalendar from "./components/Booknow";

// Auth Components
import Login from "./components/Login";
import Signup from "./components/Signup";

// Admin Components
import Dashboard from "./admin/dashboard";
import Edit from "./admin/Edit";
import Add from "./admin/Add";
import Manag from "./admin/Manag";
import Chatbot from "./components/chatbot";
import Getcoupon from "./components/Getcoupon";

const App = () => {
  return (
    <BrowserRouter>
      <CustomCursor />
      <DarkLightToggle />
      <Chatbot />

      <div className="bg-background dark:bg-darkBackground">
        <Routes>
          {/* Main Layout Route */}
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

          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Gallery Route */}
          <Route path="/gallery/moreGallery" element={<MoreGallery />} />

          {/* Admin Dashboard Routes */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/getcoupon" element={ <Getcoupon />} />
          <Route path="/dashboard/add" element={<Add />} />
          <Route path="/dashboard/manage" element={<Manag />} />
          <Route path="/dashboard/manage/edit/:id" element={<Edit />} />

          {/* Profile Route */}


          {/* 404 Route - Add this last */}
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-2xl text-red-500">404 - Page Not Found</h1>
              </div>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
