import React from "react";
import { SubHeading } from "../../components";
import { images } from "../../constants";
import "./Header.css";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
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
    color: "rgb(255, 254, 240)",
    // textShadow: "2px 2px 4px #000000",
    fontSize: 20,
    fontWeight: "bold",
  },
};
const Header = () => {
  useEffect(() => {
    let textAnimation = gsap.timeline();
    textAnimation.from(".text", {
      y: 100,
      stagger: {
        each: 0.9 * 0.1,
      },
    });
  }, []);
  const [curIndex, setCurIndex] = useState(1);
  const [curHeaderText, setHeaderText] = useState(
    "Savor the flavors of tradition with every bite – where fresh ingredients meet culinary artistry."
  );
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
    handelHeaderText(curIndex)
  };
  const handelVidLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  };
  const handelHeaderText = (curIndex) => {
    switch (curIndex) {
      case 1:
        setHeaderText(
          "Savor the flavors of tradition with every bite – where fresh ingredients meet culinary artistry."
        );
        break;
      case 2:
        setHeaderText(
          "Your ultimate destination for delicious dishes, warm ambiance, and unforgettable dining experiences."
        );
        break;
      case 3:
        setHeaderText(
          "From farm to table, taste the difference in every handcrafted meal we serve."
        );
        break;
      case 4:
        setHeaderText(
          "Craving something special? Let us treat your taste buds to an extraordinary culinary journey."
        );
        break;

      default:
        setHeaderText(
          "Savor the flavors of tradition with every bite – where fresh ingredients meet culinary artistry."
        );
        break;
    }
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
      <h1 className="headtext__cormorant_header font-bold  sticky z-10 top-[180px] left-7 ">
        FAYREST
      </h1>
      <div style={style.wrapper}>
        <div
          style={style.words}
          className="mb-4 absolute z-10 top-[330px] left-7"
        >
          {`${curHeaderText}`
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
    <div className="text " style={style.letter}>
      {letter}
    </div>
  );
};

export default Header;
