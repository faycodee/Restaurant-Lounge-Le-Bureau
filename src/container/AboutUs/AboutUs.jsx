import React, { Suspense } from "react";

import { images } from "../../constants";
import "./AboutUs.css";

// import Model from "../../assets/3D/Cleaver";

// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';

const AboutUs = () => (
  <div className="relative app__bg flex__center section__padding" id="about">
    {/* <div className="dasMesser">
    <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
        
       
        <Model />

   <OrbitControls />
      </Canvas>
    </div> */}
    <div className="w-full z-2  flex-row lg:flex-row">
      <div className="">
        <h1 className="headtext__cormorant">About Us</h1>
      
        <p className="p__opensans mx-0 my-6 text-primary-gray">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis pharetra
          adipiscing ultrices vulputate posuere tristique. In sed odio nec
          aliquet eu proin mauris et.
        </p>
        <button type="button" className="custom__button">
          Know More
        </button>
      </div>
      <div className="app__wrapper_img">
          <img src={images.findus} alt="finus_img" className="md:w-5/6" />
        </div>
    </div>
  </div>
);

export default AboutUs;
