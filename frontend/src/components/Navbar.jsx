import React, { useState, useRef, useEffect } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { gsap } from "gsap";
import images from "../constants/images";
import AudioPlayer from "./audio";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [t, i18n] = useTranslation();
  const buttonRef = useRef(null);
  const [toggleMenu, setToggleMenu] = useState(false);
  const [user, setUser] = useState(null); // State to store user info

  useEffect(() => {
    // Check if the user is logged in by checking localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    // Clear user data from localStorage and state
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
          <div className="flex items-center gap-4">
            <span className="text-darkBackground dark:text-background font-mono">
              {t("nav.welcome")}, {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              {t("nav.logout")}
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={() => (window.location.href = "/login")}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              {t("nav.login")}
            </button>
            <button
              onClick={() => (window.location.href = "/signup")}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
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
            className="slide-bottom fixed top-0 left-0 w-full h-[600px]
           duration-500 flex flex-col z-10 text-background 
            dark:text-darkBackground 
            bg-darkBackground dark:bg-background backdrop-blur-2xl"
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
