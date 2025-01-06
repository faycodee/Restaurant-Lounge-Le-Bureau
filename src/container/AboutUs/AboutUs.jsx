import React, { Suspense } from "react";

import { images } from "../../constants";
import "./AboutUs.css";
import { Canvas } from "@react-three/fiber";
import  {Model} from "../../assets/3D/Scene"
const AboutUs = () => (
  <div className="relative app__bg flex__center section__padding" id="about">
    <div className="dasMesser">
      <Canvas>
        <Suspense> 
          <Model />
        </Suspense>
      </Canvas>
    </div>
    <div className="w-full z-2 flex__center flex-col lg:flex-row">
      <div className=" flex-one flex justify-end items-end flex-col text-left">
        <h1 className="headtext__cormorant">About Us</h1>
        <img src={images.spoon} alt="about_spoon" className="spoon__img" />
        <p className="p__opensans mx-0 my-6 text-primary-gray">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra
          adipiscing ultrices vulputate posuere tristique. In sed odio nec
          aliquet eu proin mauris et.
        </p>
        <button type="button" className="custom__button">
          Know More
        </button>
      </div>
    </div>
  </div>
);

export default AboutUs;
