import React from "react";

import { SubHeading } from "../../components";
import { images } from "../../constants";
import "./Header.css";
import { useState, useEffect, useRef } from "react";
const style = {
  wrapper: {
    height: "30vh",
    width: "90vw",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  words: {
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  letter: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
};
const Header = () => {
  useEffect(() => {
    let textAnimation = gsap.timeline();
    textAnimation.from('.text', {
     y: 100,
     stagger: { 
      each: 0.07 
     }
    });
   }, []);
  const [curIndex, setCurIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  // had ghatkon flawl ela ma y telecharja lvideo
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const totalVideos = 4;
  const nextVidRef = useRef(null);
  const nextIndex = (curIndex % totalVideos) + 1;
  const getSrc = (i) => `./videos/${i}.mp4`;
  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurIndex(nextIndex);
  };
  const handelVidLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };
  return (
    <div
      id="video-frame"
      className="relative z-10 h-[100vh] w-[100vw]  overflow-hidden  "
    >
      {" "}
      <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-auto rounded-lg">
        <div
          onClick={handleMiniVdClick}
          className="origin-center   scale-50 opacity-0  overflow-hidden
        transition-all duration-500  ease-in hover:scale-100 hover:opacity-100 "
        >
          <video
            ref={nextVidRef}
            src={getSrc(nextIndex)}
            loop
            muted
            id="current-video"
            className="size-64 origin-center scale-150 object-cover object-center "
            onLoadedData={handelVidLoad}
          ></video>
        </div>
      </div>
      <video
        ref={nextVidRef}
        src={getSrc(curIndex)}
        loop
        muted
        id="next-video"
        className=" absolute absolute-center invisible size-64  object-cover object-center "
        onLoadedData={handelVidLoad}
      ></video>
      <video
        ref={nextVidRef}
        src={getSrc(curIndex == totalVideos - 1 ? 1 : curIndex)}
        loop
        autoPlay
        muted
        className=" absolute left-0 top-0  size-full  object-cover  "
        onLoadedData={handelVidLoad}
        id="next-video"
      ></video>
      <h1
        className="headtext__cormorant font-bold mb-4 absolute z-10 top-[180px] left-7 "
        style={{
          color: "white",
          textShadow: "2px 2px 4px #000000",
        }}
      >
        The Key To Fine Dining
      </h1>
      <div style={style.wrapper}>
        <div style={style.words}>
          {"Hello World!"
            .split("")
            .map((i) =>
              i == " " ? (
                <Letter space={true} letter={i} />
              ) : (
                <Letter space={false} letter={i} />
              )
            )}
        </div>
        <div style={style.words}>
          {"No Worries"
            .split("")
            .map((i) =>
              i == " " ? (
                <Letter space={true} letter={i} />
              ) : (
                <Letter space={false} letter={i} />
              )
            )}
        </div>
      </div>
      {/* <div className="flex-1 w-full flex items-start justify-center flex-col">
      <SubHeading title="Chase the new flavour" />
      
      <p className="p__opensans mb-4">Sit tellus lobortis sed senectus vivamus molestie. Condimentum volutpat morbi facilisis quam scelerisque sapien. Et, penatibus aliquam amet tellus </p>
      <button type="button" className="custom__button">Explore Menu</button>
      </div> */}
    </div>
  );
};

const Letter = ({ space, letter }) => {
  return space == true ? (
    <div className="text">&nbsp;</div>
  ) : (
    <div className="text" style={style.letter}>
      {letter}
    </div>
  );
};

export default Header;
