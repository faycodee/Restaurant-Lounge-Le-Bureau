import React, { useEffect } from "react";
import { gsap } from "gsap";



const TopBar = () => {
  useEffect(() => {
    // Animation für das Erscheinen des Topbars
    gsap.from("#topbar", {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power2.out",
    });
  }, []);

  return (
    <div
      id="topbar"
      className="flex items-center fixed top-0 w-full bg-white shadow-lg z-50"
    >
      <div className="container mx-auto flex justify-center md:justify-between py-2">
        {/* Kontaktinformationen */}
        <div className="contact-info flex items-center text-sm text-gray-600">
          <div className="flex items-center">
            <i className="bi bi-phone mr-2 text-gray-500"></i>
            <span>+1 5589 55488 55</span>
          </div>
          <div className="flex items-center ml-6">
            <i className="bi bi-clock mr-2 text-gray-500"></i>
            <span>Mon-Sat: 11AM - 23PM</span>
          </div>
        </div>

        {/* Sprachoptionen */}
        <div className="languages hidden md:flex items-center">
          <ul className="flex space-x-4 text-sm text-gray-600">
            <li>En</li>
            <li>
              <a href="#" className="hover:underline">
                De
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
