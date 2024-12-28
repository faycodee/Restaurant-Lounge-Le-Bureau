import React from "react";

import { SubHeading } from "../../components";
import { images } from "../../constants";
import "./Header.css";
import { useState, useEffect, useRef } from "react";
const Header = () => {
  const [curIndex, setCurIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  // had ghatkon flawl ela ma y telecharja lvideo
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const totalVideos = 4;
  const nextVidRef = useRef(null);
  const getSrc = (i) => `../public/videos/${i}.mp4`;
  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurIndex((preInd) => preInd + 1);
  };
  const handelVidLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };
  return (
    <div
      className="relative h-dvh w-screen overflow-x-hidden bg-black 
      app__wrapper section__padding font-CormorantUpright text-primary-golden"
      id="home"
    >
      <div
        id="video-frame"
        className="relative z-10 h-dvh w-screen overflow-hidden rounded-xl "
      ></div>
      <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-auto rounded-lg">
        <div
          onClick={handleMiniVdClick}
          className="origin-center  scale-50 opacity-0 
        transition-all duration-500 ease-in hover:scale-100 hover:opacity-100 "
        >
          <video
            ref={nextVidRef}
            src={getSrc(curIndex +1)}
            loop
            muted
            id="current-video"
            className="size-64 origin-center scale-150 object-cover object-center overflow-hidden"
            onLoadedData={handelVidLoad}
          ></video>
        </div>
      </div>
      {/* <div className="flex-1 w-full flex items-start justify-center flex-col">
      <SubHeading title="Chase the new flavour" />
      <h1 className="headtext__cormorant font-bold mb-4">The Key To Fine Dining</h1>
      <p className="p__opensans mb-4">Sit tellus lobortis sed senectus vivamus molestie. Condimentum volutpat morbi facilisis quam scelerisque sapien. Et, penatibus aliquam amet tellus </p>
      <button type="button" className="custom__button">Explore Menu</button>
    </div> */}
    </div>
  );
};

export default Header;
