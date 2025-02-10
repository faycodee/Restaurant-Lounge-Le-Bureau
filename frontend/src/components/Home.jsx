import React, { useState, useEffect, useRef, useCallback } from "react";
import images from "../constants/images";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

gsap.registerPlugin(ScrollTrigger);

const totalVideos = 3;

const Home = () => {
  const Mode = useSelector((state) => state.lightdark.mode);
  const buttonRef = useRef(null);
  const [t, i18n] = useTranslation();
  const nextVidRef = useRef(null);

  // Preloaded videos state
  const [preloadedVideos, setPreloadedVideos] = useState({});
  const [curIndex, setCurIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [curHeaderText, setHeaderText] = useState(t("header.t1"));

  // Refs and calculations
  const nextIndex = (curIndex % totalVideos) + 1;
  
  // Video source helper
  const getSrc = (i) => `./videos/${i}.mp4`;

  // Preload videos on component mount
  useEffect(() => {
    const preloadVideos = async () => {
      const videoPromises = Array.from({ length: totalVideos }, (_, i) => {
        const index = i + 1;
        return new Promise((resolve) => {
          const video = document.createElement('video');
          video.src = getSrc(index);
          video.preload = 'auto';
          video.oncanplaythrough = () => {
            setPreloadedVideos(prev => ({
              ...prev,
              [index]: video
            }));
            resolve();
          };
        });
      });
      await Promise.all(videoPromises);
    };

    preloadVideos();
  }, []);

  // Loading state management
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (Object.keys(preloadedVideos).length >= totalVideos - 1) {
        setIsLoading(false);
        document.body.style.overflow = 'auto';
      }
    }, 2000);

    return () => clearTimeout(loadingTimeout);
  }, [preloadedVideos]);

  // Header text update
  useEffect(() => {
    setHeaderText(t("header.t1"));
  }, [t("header.t1")]);

  // Mouse interaction animations
  const handleMouseEnter = () => {
    gsap.to(buttonRef.current, {
      backgroundColor: "transparent",
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
      backgroundColor: "#FF6347",
      color: "#fff",
      scale: 1,
      rotation: 0,
      skewX: 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // Video change handler
  const handleMiniVdClick = useCallback(() => {
    setHasClicked(true);
    setCurIndex(nextIndex);
    setHeaderText(getHeaderText(nextIndex));
  }, [nextIndex]);

  // Get header text based on index
  const getHeaderText = (index) => {
    const texts = [
      t("header.t1"),
      t("header.t2"),
      t("header.t3"),
      t("header.t4"),
    ];
    return texts[index - 1] || texts[0];
  };

  // GSAP Animations
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
        gsap.fromTo(
          "#btnn",
          { opacity: 0, y: 0 },
          { duration: 3, delay: 1, ease: "power1.inOut", opacity: 1 }
        );
      }
    },
    { dependencies: [curIndex], revertOnUpdate: true }
  );

  // Scroll trigger animation
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

  // Memoized Letter component
  const Letter = React.memo(({ letter }) => (
    <div
      className="text font-mono"
      style={{
        color: "#E0E0E0",
        fontSize: 20,
      }}
    >
      {letter === " " ? "\u00A0" : letter}
    </div>
  ));

  return (
    <>
      {isLoading && (
        <div
          style={{ backgroundColor: "#1B1D21" }}
          className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden"
        >
          <img src={images.loader} alt="" className="w-[360px]" />
        </div>
      )}
      <div
        style={{
          backgroundImage: `url(${
            Mode === "light" ? images.welc : images.darkwelc
          })`,
        }}
        className="relative h-[100vh] w-[100vw] overflow-hidden"
      >
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
                className="size-64 origin-center scale-150 object-cover object-center"
              />
            </div>
          </div>
          <video
            ref={nextVidRef}
            src={getSrc(curIndex)}
            loop
            muted
            id="next-video"
            className="absolute-center invisible absolute size-64 z-20 object-cover object-center"
          />
          <video
            src={getSrc(curIndex === totalVideos ? 1 : curIndex)}
            loop
            autoPlay
            muted
            id="next-video-bg"
            className="absolute left-0 top-0 size-full object-cover object-center"
          />
          <div className="absolute-center absolute " style={{ zIndex: 40 }}>
            <img src={images.mause} width="200px" alt="Mouse" />
          </div>

          <h1
            id="textt"
            className="headtext__cormorant_header font-bold sticky z-40 top-[200px] left-7 max-md:text-[100px]"
          >
            {t("header.6")}
          </h1>

          <div className="wrapper">
            <div className="words mb-4 absolute top-[330px] h-[60px] w-full overflow-hidden left-7 z-40 flex">
              {curHeaderText.split("").map((letter, index) => (
                <Letter key={index} letter={letter} />
              ))}

              <button
                id="btnn"
                ref={buttonRef}
                className="ml-8"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                  backgroundColor: "#FF6347",
                  zIndex: 1000,
                  position: "relative",
                  color: "#fff",
                  height: "30px",
                  border: "2px solid #333",
                  padding: "0px 7px",
                  fontSize: "10px",
                  cursor: "pointer",
                  borderRadius: "5px",
                  fontFamily: "cursive",
                  transition: "all 0.3s ease",
                }}
              >
                {t("header.5")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;