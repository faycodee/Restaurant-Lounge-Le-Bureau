import React from "react";

import { SubHeading, MenuItem } from "../../components";
import { data, images } from "../../constants";
import "./SpecialMenu.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
const SpecialMenu = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: "#clip",
        start: "center center",
        end: "+=800 center ",
        scrub: 0.5,
        pin: true,
        // pinSpacing: true,
      },
    });
    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  }, []);
  return (
    <>
      <div
        className="flex-col bg-black flex__center pt-8 px-9  min-h-screen w-screen"
        id="menu"
      >
        <div className="mb-8 m-auto flex flex-col justify-center items-center">
          <SubHeading title="Menu that fits your palatte" />
          <h1 className="headtext__cormorant">
            Menu tailored to your taste.&apos;
          </h1>
        </div>
        <div id="clip" className="h-dvh w-screen">
          <div className="mask-clip-path about-video ">
            <video
              src="./videos/a1.mp4"
              muted
              autoPlay
              loop
              className="absolute left-0 top-0 z-50 size-full object-cover"
              alt="Video"
            ></video>
          </div>
        </div>
        <div
          className="h-[80vh] bg-balck w-full flex justify-center  items-start"
          // style={{ backgroundImage: `url()`,  }}
        >
          <div className="w-[300px]">
            <img src={images.MenuWelco} alt="" />
          </div>
        </div>

        {/* <div className="mt-4">
        <button type="button" className="custom__button">
          View More
        </button>
      </div> */}
      </div>
      <div className="h-[150vh] bg-black ">
        -----------------------
        {/* <div className="mt-4">
        <button type="button" className="custom__button">
          View More
        </button>
      </div> */}
      </div>
    </>
  );
};

export default SpecialMenu;
{
  /* <div className="app__specialMenu-menu w-full mt-8 mx-0 flex justify-center items-center flex-col lg:items-start lg:flex-row">
      <div className="app__specialMenu-menu_food  flex__center flex-one w-full flex-col">
        <p className="app__specialMenu-menu_heading font-CormorantUpright font-semibold text-4xl leading-9 tracking-wider text-primary-white md:text-5xl">
          Meals
        </p>
        <div className="app__specialMenu_menu_items flex flex-col mx-0 my-8 w-full">
          {data.food.map((food, index) => (
            <MenuItem
              key={food.title + index}
              title={food.title}
              price={food.price}
              tags={food.tags}
            />
          ))}
        </div>
      </div>

      <div className="app__specialMenu-menu_img w-full mt-4 mb-12 mx-0 lg:w-[410px] lg:mx-8 lg:my-0 2xl:w-[650px]">
        <img
          src={images.menu2}
          alt="menu__img"
          className="m-auto w-5/6 h-auto 2xl:h-[920px]"
        />
      </div>

      <div className="app__specialMenu-menu_drinks  flex__center flex-one w-full flex-col">
        <p className="app__specialMenu-menu_heading font-CormorantUpright font-semibold text-4xl leading-9 tracking-wider text-primary-white md:text-5xl">
          Drinks
        </p>
        <div className="app__specialMenu_menu_items flex flex-col mx-0 my-8 w-full">
          {data.drinks.map((cocktail, index) => (
            <MenuItem
              key={cocktail.title + index}
              title={cocktail.title}
              price={cocktail.price}
              tags={cocktail.tags}
            />
          ))}
        </div>
      </div>
    </div> */
}
