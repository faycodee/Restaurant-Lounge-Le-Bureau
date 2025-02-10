import React, { useState, useRef } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdOutlineRestaurantMenu } from "react-icons/md";
import { gsap } from "gsap";
import images from "../constants/images";
import AudioPlayer from "./audio";

import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  const [t, i18n] = useTranslation();
  const buttonRef = useRef(null);
  const [toggleMenu, setToggleMenu] = useState(false);

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
      className="z-nav fixed w-full flex justify-between my-3 items-center text-white h-[50px] bg-transparent backdrop-blur-2xl sm:px-8 sm:py-4 p-4"
    >
      <div className="flex justify-start items-center">
        <img
          src={images.logo}
          alt="app logo"
          className="h-auto w-[50px] max-md:w-[50px] 2xl:w-52"
        />
      </div>
      <ul className="lg:flex hidden justify-center items-center flex-1 duration-300 gap-2">
        <li className="">
          <NavLink
            className="text-gray-300 my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  outline-slate-700"
            to="#about"
          >
            {t("nav.1")}
          </NavLink>
        </li>
        <li className="">
          <NavLink
            className="text-gray-300 my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  outline-slate-700"
            to="#menu"
          >
            {t("nav.2")}
          </NavLink>
        </li>
        <li className="">
          <NavLink
            className="text-gray-300 my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  outline-slate-700"
            to="#dinnershow"
          >
            {t("nav.3")}
          </NavLink>
        </li>
        <li className="">
          <NavLink
            className="text-gray-300 my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  outline-slate-700"
            to="#gallery"
          >
            {t("nav.4")}
          </NavLink>
        </li>
        <li className="">
          <NavLink
            className="text-gray-300 my-0 mx-1 duration-150 cursor-pointer p-1 font-mono hover:outline-dashed  outline-slate-700"
            to="#contact"
          >
            {t("nav.5")}
          </NavLink>
        </li>
      </ul>
      <div className="sm:flex hidden justify-end items-center">
        <AudioPlayer />
        <LanguageSwitcher />
     
      </div>

      <div className="flex lg:hidden">
        <GiHamburgerMenu
          color="#fff"
          fontSize={27}
          onClick={() => setToggleMenu(true)}
        />
        {toggleMenu && (
          <div className="slide-bottom fixed top-0 left-0 w-full h-[400px] bg-black duration-500 flex flex-col z-10">
            <MdOutlineRestaurantMenu
              className="text-2xl text-golden absolute top-5 right-5 cursor-pointer p-1"
              color="#fff"
              fontSize={27}
              onClick={() => setToggleMenu(false)}
            />
            <ul className="list-none mt-4 p-6">
              <li className="font-CormorantUpright m-4 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <NavLink to="/about" onClick={() => setToggleMenu(false)}>
                  About
                </NavLink>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-CormorantUpright m-4 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <NavLink to="/menu" onClick={() => setToggleMenu(false)}>
                  Menu
                </NavLink>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-CormorantUpright m-4 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <NavLink to="/dinnershow" onClick={() => setToggleMenu(false)}>
                  Dinner Show
                </NavLink>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-CormorantUpright m-4 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <NavLink to="/gallery" onClick={() => setToggleMenu(false)}>
                  Gallery
                </NavLink>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
              <li className="font-CormorantUpright m-4 cursor-pointer p-1 text-golden text-4xl text-center hover:text-white">
                <NavLink to="/contact" onClick={() => setToggleMenu(false)}>
                  Contact
                </NavLink>
                <img
                  src={images.spoon}
                  alt="spoon underline"
                  className="h-[10px] w-24 mx-auto"
                />
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
