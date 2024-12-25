import React from "react";

import { SubHeading } from "../../components";
import { images } from "../../constants";
import "./Header.css";

const Header = () => (
  <div className="container">
    <section className="hero">
      <h1>Symphonia</h1>
    </section>
    <section className="info">
      <div className="header-rows">
        <div className="header-row">
          <h1>Motion</h1>
        </div>
        <div className="header-row">
          <h1>Skills</h1>
        </div>
      </div>
    </section>
    <section className="header-info">
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto
        veniam optio fugit quisquam, sint similique?
      </p>
      <div className="headers-images">
        <div className="img">
          <img src="./G-white.png" alt="" />
          <img src="./G-white.png" alt="" />
          <img src="./G-white.png" alt="" />
          <img src="./G-white.png" alt="" />
        </div>
      </div>
    </section>
    <section className="whitespace"></section>
    <section className="pinned">
      <div className="revealer">
        <div className="revealer-1"></div>
        <div className="revealer-2"></div>
      </div>
    </section>
    <section className="website-content">
      <h1>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas
        commodi debitis ratione porro harum earum?
      </h1>
    </section>
  </div>

  // <div className="bg-primary-black app__wrapper section__padding font-CormorantUpright text-primary-golden" id="home">
  //   <div className="flex-1 w-full flex items-start justify-center flex-col">
  //     <SubHeading title="Chase the new flavour" />
  //     <h1 className="headtext__cormorant font-bold mb-4">The Key To Fine Dining</h1>
  //     <p className="p__opensans mb-4">Sit tellus lobortis sed senectus vivamus molestie. Condimentum volutpat morbi facilisis quam scelerisque sapien. Et, penatibus aliquam amet tellus </p>
  //     <button type="button" className="custom__button">Explore Menu</button>
  //   </div>

  //   <div className="app__wrapper_img">
  //     <img src={images.welcome} alt="header_img" />
  //   </div>
  // </div>
);

export default Header;
