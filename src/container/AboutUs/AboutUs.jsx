import React, { Suspense } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { images } from "../../constants";
import "./AboutUs.css";
import { ScrollTrigger } from "gsap/all";
import RestaurantChat from "../chat";

// import Model from "../../assets/3D/Cleaver";

// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
gsap.registerPlugin(ScrollTrigger);
const AboutUs = () => {
  useGSAP(() => {
    gsap.from("#aboutBild", {
      opacity: 0,
      y: 20,
      duration: 2,
      ease: "back.inOut",
      scrollTrigger: {
        trigger: "#aboutBild",
        start: "center 70%",
        // end: "top 10%",
        // markers: true,
      },
    });
    gsap.from("#aboutText", {
      ease: "power1.inOut",
      opacity: 0,
      y: 10,
      duration: 1.5,
      scrollTrigger: {
        trigger: "#aboutBild",
        start: "center 70%",
        // end: "top 10%",
        // markers: true,
      },
    });
    gsap.fromTo(
      ".para",
      { opacity: 0, y: 20 },
      {
        ease: "power1.inOut",
        opacity: 1,
        y: 0,
        duration: 3,
        stagger: 0.1,
        scrollTrigger: {
          trigger: "#aboutBild",
          start: "center 70%",
          // end: "top 10%",
          // markers: true,
        },
      }
    );
    gsap.fromTo(
      ".aboutBtn",
      { opacity: 0, scale: 0.9 },
      {
        ease: "power1.inOut",
        opacity: 1,
        scale: 1,
        duration: 3,

        scrollTrigger: {
          trigger: "#aboutBild",
          start: "center 70%",
          // end: "top 10%",
          // markers: true,
        },
      }
    );
  });
  return (
    <div className="relative app__bg flex__center section__padding" id="about">
      {/* <div className="dasMesser">
    <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        
       
        <Model />

   <OrbitControls />
      </Canvas>
    </div> */}
      <div className="w-full z-2  flex max-md:flex-col items-around">
        <div className="">
          <h1 className="headtext__cormorant" id="aboutText">
            About Us
          </h1>

          <p className="p__opensans mx-0 my-6 text-primary-gray para">
            Welcome to <span className=" font-extrabold">FAYREST</span> !
            Experience the art of grilling with our juicy steaks, flavorful
            burgers, and perfectly grilled dishes. Made with the finest
            ingredients and cooked to perfection, every bite is a celebration of
            taste. Join us for a meal you’ll savor and remember!
          </p>
          <button type="button" className="custom__button aboutBtn">
            Know More
          </button>
        </div>
        <div className="ml-11 max-md:ml-0 max-md:mt-20" id="aboutBild">
          <img src={images.aboutBild} alt="finus_img" className="md:w-5/6" />
        </div>
      </div>{" "}
      {/* <RestaurantChat /> */}
    </div>
  );
};

export default AboutUs;
