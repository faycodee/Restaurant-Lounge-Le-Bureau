import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
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
import CheackQR from "./admin/CheackQR";
import Chatbot from "./components/chatbot";
import Getcoupon from "./components/Getcoupon";

// Add a protected route component
const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "admin") {
      navigate("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  return isAuthenticated ? children : null;
};

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
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/getcoupon" element={<Getcoupon />} />
          <Route path="/dashboard/add" element={<Add />} />
          <Route path="/dashboard/cheackQR" element={<CheackQR />} />
          <Route path="/dashboard/manag" element={<Manag />} />
          <Route path="/dashboard/manag/edit/:id" element={<Edit />} />

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
