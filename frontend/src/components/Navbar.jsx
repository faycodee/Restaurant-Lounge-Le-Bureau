import React, { useState, useRef, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { gsap } from "gsap";
import images from "../constants/images";
import AudioPlayer from "./audio";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [t, i18n] = useTranslation();
  const buttonRef = useRef(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      backgroundColor: "#000",
      color: "#fff",
      scale: 0.9,
      rotationX: 3,
      skewX: 5,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(buttonRef.current, {
      backgroundColor: "#fff",
      color: "#333",
      scale: 1,
      rotation: 0,
      skewX: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <nav
      style={{ position: "fixed", zIndex: 100 }}
      className="z-nav fixed w-full flex justify-between my-3 items-center
       text-white h-[50px] bg-transparent backdrop-blur-2xl sm:px-8 sm:py-4 p-4"
    >
      <div className="flex justify-start items-center">
        <img
          src={images.logo}
          onClick={() => (window.location.href = "#home")}
          alt="app logo"
          className="h-auto w-[50px] max-md:w-[50px] "
        />
      </div>
      <ul className="lg:flex hidden justify-center items-center flex-1 duration-300 gap-2">
        <li>
          <a
            className="text-darkBackground dark:text-background my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  
            hover:text-slate-700"
            href="#about"
          >
            {t("nav.1")}
          </a>
        </li>
        <li>
          <a
            className="text-darkBackground dark:text-background my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  
            hover:text-slate-700"
            href="#gallery"
          >
            {t("nav.4")}
          </a>
        </li>
        <li>
          <a
            className="text-darkBackground dark:text-background my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  
            hover:text-slate-700"
            href="#menu"
          >
            {t("nav.2")}
          </a>
        </li>
        <li>
          <a
            className="text-darkBackground dark:text-background my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  
            hover:text-slate-700"
            href="#book"
          >
            {t("nav.6")}
          </a>
        </li>
        <li>
          <a
            className="text-darkBackground dark:text-background my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  
            hover:text-slate-700"
            href="#contact"
          >
            {t("nav.5")}
          </a>
        </li>
      </ul>
      <div className="sm:flex hidden justify-end items-center">
        <AudioPlayer />
        <LanguageSwitcher />
        {user ? (
          <div className="relative ml-4" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              <FaUserCircle className="text-2xl text-darkBackground dark:text-background" />
              <span className="text-darkBackground dark:text-background font-mono">
                {user.name}
              </span>
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b dark:border-gray-700">
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("nav.points")}: {user.loyaltyPoints || 0}
                  </p>
                </div>

                <a
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("nav.profile")}
                </a>

                <a
                  href="/getcoupon"
                  className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {t("nav.getcoupon")}
                </a>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium"
                >
                  <div className="flex items-center gap-2">
                    <FaSignOutAlt />
                    {t("nav.logout")}
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => navigate("/login")}
              className="sm:flex hidden justify-end items-center  px-4 py-2  text-darkBackground bg-slate-400 rounded-full
     hover:bg-slate-400/5 hover:text-white transition-all duration-200 dark:text-darkBackground dark:bg-background 
     dark:hover:bg-background/50 font-mono"
            >
        
              {t("nav.login")}
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="sm:flex hidden justify-end items-center  px-4 py-2  text-darkBackground bg-background rounded-full
     hover:bg-background/5 hover:text-white transition-all duration-200 dark:text-darkBackground dark:bg-background 
     dark:hover:bg-background/50 font-mono"
            >
        
              {t("nav.signup")}
            </button>
          </div>
        )}
      </div>

      <div className="flex lg:hidden">
        <GiHamburgerMenu
          className="text-background"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />
        {toggleMenu && (
          <div
            className="sm:flex hidden justify-end items-center  px-4 py-2  text-background bg-darkBackground rounded-full
     hover:bg-darkBackground/50 transition-all duration-200 dark:text-darkBackground dark:bg-background 
     dark:hover:bg-background/50"
          >
            <MdOutlineRestaurantMenu
              className="text-2xl  text-background
              dark:text-darkBackground
              absolute top-5 right-5 cursor-pointer p-1"
              fontSize={27}
              onClick={() => setToggleMenu(false)}
            />
            <ul className="list-none mt-4 p-6">
              <li className="font-mono m-4 hover:text-background/30 dark:hover:text-darkBackground/30 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <a href="#about" onClick={() => setToggleMenu(false)}>
                  {t("nav.1")}
                </a>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-mono m-4 hover:text-background/30 dark:hover:text-darkBackground/30 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <a href="#gallery" onClick={() => setToggleMenu(false)}>
                  {t("nav.4")}
                </a>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-mono m-4 hover:text-background/30 dark:hover:text-darkBackground/30 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <a href="#menu" onClick={() => setToggleMenu(false)}>
                  {t("nav.2")}
                </a>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-mono m-4 hover:text-background/30 dark:hover:text-darkBackground/30 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <a href="#book" onClick={() => setToggleMenu(false)}>
                  {t("nav.6")}
                </a>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-mono m-4 hover:text-background/30 dark:hover:text-darkBackground/30 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <a href="#contact" onClick={() => setToggleMenu(false)}>
                  {t("nav.5")}
                </a>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
            </ul>
            <div className="flex justify-center">
              <LanguageSwitcher />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
