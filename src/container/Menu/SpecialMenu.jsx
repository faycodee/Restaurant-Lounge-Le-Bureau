import React, { useState } from "react";

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
        pinSpacing: true,
      },
    });
    clipAnimation.to(".mask-clip-path", {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
    });
  }, []);
  const [data, setData] = useState({
    menuItems: [
      // Steak Category
      {
        name: "Ribeye Steak",
        category: "Steak",
        description:
          "Tender ribeye steak grilled to perfection, served with mashed potatoes and vegetables.",
        image: "ribeye-steak.jpg",
        price: 24.99,
        available: true,
      },
      {
        name: "Filet Mignon",
        category: "Steak",
        description:
          "A juicy, buttery filet mignon served with a side of garlic butter and roasted vegetables.",
        image: "filet-mignon.jpg",
        price: 29.99,
        available: true,
      },
      {
        name: "T-bone Steak",
        category: "Steak",
        description:
          "A classic T-bone steak with a perfect balance of tenderloin and strip steak, grilled to your liking.",
        image: "t-bone-steak.jpg",
        price: 27.99,
        available: true,
      },
      {
        name: "New York Strip",
        category: "Steak",
        description:
          "A flavorful New York strip steak, seasoned and grilled to perfection, served with sautéed spinach.",
        image: "new-york-strip.jpg",
        price: 23.99,
        available: true,
      },
      {
        name: "Sirloin Steak",
        category: "Steak",
        description:
          "A lean, flavorful sirloin steak grilled to your desired temperature, served with garlic mashed potatoes.",
        image: "sirloin-steak.jpg",
        price: 21.99,
        available: true,
      },
      {
        name: "Steak Frites",
        category: "Steak",
        description:
          "Grilled steak served with crispy French fries and a side of garlic butter sauce.",
        image: "steak-frites.jpg",
        price: 22.99,
        available: true,
      },

      // Pizza Category
      {
        name: "Pepperoni Pizza",
        category: "Pizza",
        description:
          "Classic pizza topped with savory pepperoni and melted mozzarella cheese.",
        image: "pepperoni-pizza.jpg",
        price: 11.99,
        available: true,
      },
      {
        name: "Hawaiian Pizza",
        category: "Pizza",
        description:
          "A delicious blend of ham, pineapple, and mozzarella cheese on a tangy tomato sauce base.",
        image: "hawaiian-pizza.jpg",
        price: 12.99,
        available: true,
      },
      {
        name: "Vegetarian Pizza",
        category: "Pizza",
        description:
          "A medley of fresh vegetables like bell peppers, onions, mushrooms, and olives on a thin crust.",
        image: "vegetarian-pizza.jpg",
        price: 13.99,
        available: true,
      },
      {
        name: "BBQ Chicken Pizza",
        category: "Pizza",
        description:
          "Grilled chicken, red onions, and mozzarella cheese topped with smoky BBQ sauce.",
        image: "bbq-chicken-pizza.jpg",
        price: 14.99,
        available: true,
      },
      {
        name: "Margarita Pizza",
        category: "Pizza",
        description:
          "A classic pizza with fresh mozzarella, tomato sauce, and fresh basil leaves.",
        image: "margarita-pizza.jpg",
        price: 12.49,
        available: true,
      },
      {
        name: "Meat Lovers Pizza",
        category: "Pizza",
        description:
          "A hearty pizza topped with pepperoni, sausage, bacon, and ham on a cheesy base.",
        image: "meat-lovers-pizza.jpg",
        price: 15.99,
        available: true,
      },

      // Salad Category
      {
        name: "Greek Salad",
        category: "Salad",
        description:
          "Crisp lettuce, cucumbers, tomatoes, olives, and feta cheese, dressed in olive oil and lemon.",
        image: "greek-salad.jpg",
        price: 9.99,
        available: true,
      },
      {
        name: "Caprese Salad",
        category: "Salad",
        description:
          "Fresh mozzarella, ripe tomatoes, basil leaves, and balsamic glaze.",
        image: "caprese-salad.jpg",
        price: 11.49,
        available: true,
      },
      {
        name: "Chicken Caesar Salad",
        category: "Salad",
        description:
          "Grilled chicken on a bed of romaine lettuce, with Caesar dressing, croutons, and parmesan.",
        image: "chicken-caesar-salad.jpg",
        price: 12.99,
        available: true,
      },
      {
        name: "Cobb Salad",
        category: "Salad",
        description:
          "Mixed greens with grilled chicken, bacon, avocado, blue cheese, and a boiled egg.",
        image: "cobb-salad.jpg",
        price: 13.49,
        available: true,
      },
      {
        name: "Spinach and Strawberry Salad",
        category: "Salad",
        description:
          "Fresh spinach leaves, strawberries, almonds, and feta cheese, served with balsamic vinaigrette.",
        image: "spinach-strawberry-salad.jpg",
        price: 10.99,
        available: true,
      },
      {
        name: "Asian Sesame Chicken Salad",
        category: "Salad",
        description:
          "Grilled chicken with mixed greens, carrots, sesame seeds, and Asian sesame dressing.",
        image: "asian-sesame-chicken-salad.jpg",
        price: 12.49,
        available: true,
      },
    ],
  });
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
      </div>
      <div className="h-[150vh] bg-slate-400 ">
        {" "}
        <section className="flex justify-center">
          <div class="wrapper">
            <div class="card">Steak</div>
            <div class="card">Pizza</div>
            <div class="card">Salad</div>
          </div>
        </section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
          {data.menuItems.map((item, index) => (
            <Menu key={index} item={item} />
          ))}
        </div>
      </div>
    </>
  );
};

const Menu = ({ item }) => {
  return (
    <div className="group relative bg-white shadow-lg rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
      {/* Image */}
      <img
        src={item.image}
        alt={item.name}
        className="w-full h-48 object-cover"
      />
      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
        <p className="text-sm text-gray-600 mt-2">{item.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-lg font-semibold text-green-600">
            ${item.price.toFixed(2)}
          </span>
          <button className="py-1 px-4 bg-green-500 text-white rounded-full text-sm font-medium transition hover:bg-green-600">
            Order Now
          </button>
        </div>
      </div>
      {/* Availability Badge */}
      {item.available && (
        <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          Available
        </span>
      )}
    </div>
  );
};
{
  /* <div className="mt-4">
        <button type="button" className="custom__button">
          View More
        </button>
      </div> */
}
export default SpecialMenu;
