import React, { useState, useEffect, useRef, useCallback } from "react";
import { SubHeading } from "../../components";
import { images } from "../../constants";
import "./Header.css";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);
const totalVideos = 4;

const Header = () => {
  const [curIndex, setCurIndex] = useState(1);
  const [curHeaderText, setHeaderText] = useState("Fresh flavors, every bite.");
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);

  const nextVidRef = useRef(null);
  const nextIndex = (curIndex % totalVideos) + 1;

  const getSrc = (i) => `./videos/${i}.mp4`;
  useEffect(() => {
    if (loadedVideos == totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos]);
  useGSAP(
    () => {
      if (hasClicked) {
        gsap.fromTo(
          "#textt",
          { opacity: 0, y: 20 },
          { duration: 2.5, ease: "power1.inOut", opacity: 1, y: 0 }
        );
        gsap.set("#next-video", { visibility: "visible" });
        gsap.to("#next-video", {
          transformOrigin: "center center",
          scale: 1,
          width: "100%",
          height: "100%",
          duration: 1,
          ease: "power1.inOut",
          onStart: () => nextVidRef.current.play(),
        });
        gsap.from("#current-video", {
          transformOrigin: "center center",
          scale: 0,
          duration: 1.5,
          ease: "power1.inOut",
        });
        gsap.to("#next-video-bg", {
          
          opacity: 0,
          duration: 11.5,
          ease: "power1.inOut",
        });
        gsap.from(".text", {
          y: 100,
          stagger: {
            each: 0.09,
          },
        });
      }
    },
    { dependencies: [curIndex], revertOnUpdate: true }
  );
  useGSAP(() => {
    gsap.set("#video-frame", {
      clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)",
      borderRadius: "0 0 20% 20%",
    });
    gsap.from("#video-frame", {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      borderRadius: "0 0 0 0",
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: "#video-frame",
        start: "center center",
        end: "bottom center",
        scrub: true,
      },
    });
  });
  const handelVidLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };
  const handleMiniVdClick = useCallback(() => {
    setHasClicked(true);
    setCurIndex(nextIndex);
    setHeaderText(getHeaderText(nextIndex));
  }, [nextIndex]);

  const getHeaderText = (index) => {
    const texts = [
      "Fresh flavors, every bite.",
      "Where taste meets tradition.",
      "Your table, our passion.",
      "Savor the extraordinary.",
    ];
    return texts[index - 1] || texts[0];
  };

  return (
    <>
      {isLoading && (
        <div
          style={{ backgroundColor: "#DCCA87" }}
          className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden "
        >
          {/* <div className="three-body"> */}
          <img src="./food2.gif" alt="" className="w-[260px]" />
          {/* </div> */}
        </div>
      )}
      <div style={{backgroundImage:"url(./wel2.jpg)"}} className="relative  h-[100vh] w-[100vw] overflow-hidden">
         <div
        id="video-frame"
        className="relative z-10 h-[100vh] w-[100vw] overflow-hidden bg-black"
      >
        <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-auto rounded-lg">
          <div
            onClick={handleMiniVdClick}
            className="origin-center scale-50 opacity-0 overflow-hidden transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
          >
            <video
              ref={nextVidRef}
              src={getSrc(nextIndex)}
              loop
              muted
              id="current-video"
              onLoadedData={handelVidLoad}
              className="size-64 origin-center scale-150 object-cover object-center"
            />
          </div>
        </div>
        <video
          ref={nextVidRef}
          src={getSrc(curIndex)}
          loop
          muted
          onLoadedData={handelVidLoad}
          id="next-video"
          className="absolute-center invisible absolute size-64 z-20 object-cover object-center"
        />
        <video
          src={getSrc(curIndex === totalVideos ? 1 : curIndex)}
          loop
          autoPlay
          muted
          id="next-video-bg"
          onLoadedData={handelVidLoad}
          className="absolute left-0 top-0 size-full object-cover object-center"
        />
        <h1
          id="textt"
          className="headtext__cormorant_header font-bold sticky z-40 top-[180px] left-7 max-md:text-[100px]"
        >
          FAYREST
        </h1>
        <div className="wrapper ">
          <div className="words mb-4 absolute top-[330px] h-[60px] w-full overflow-hidden left-7 z-40 flex">
            {curHeaderText.split("").map((letter, index) => (
              <Letter key={index} letter={letter} />
            ))}
          </div>
        </div>
      </div>
      </div>
     
    </>
  );
};

const Letter = React.memo(({ letter }) => {
  return (
    <div
      className="text"
      style={{ color: "rgb(255, 254, 240)", fontSize: 20, fontWeight: "bold" }}
    >
      {letter === " " ? "\u00A0" : letter}
    </div>
  );
});

export default Header;
