import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import images from "../constants/images";
import { useSelector } from "react-redux";
gsap.registerPlugin(ScrollTrigger);

export default function OverviewSection() {
  const introRef = useRef(null);
  const cardRefs = useRef([]);
  const para = useRef(null);
  const [t, i18n] = useTranslation();
  const isDarkMode = useSelector((state) => state.lightdark.mode);

  useEffect(() => {
    if (isDarkMode === "light") {
      document.documentElement.classList.remove("dark");
    }
    if (isDarkMode === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    gsap.fromTo(
      introRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        delay: 1,
        scrollTrigger: {
          trigger: para.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
          // toggleActions: "play none none reverse",
        },
        ease: "power1.out",
      }
    );
    gsap.fromTo(
      para.current,
      { opacity: 0, y: -5 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: para.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
          // toggleActions: "play none none reverse",
        },
      }
    );

    cardRefs.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          delay: index * 0.4, // Delay for staggered effect
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  return (
    <section className="py-16 px-8 bg-background dark:bg-darkBackground y  h-[100vh]">
      <div
        ref={introRef}
        className="text-center mb-12 text-primary dark:text-darkPrimary"
      >
        <h1 className="text-[90px] font-bold mb-[80px]"> {t("about.1")}</h1>
        <p
          ref={para}
          className="text-sm text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
        >
          {t("about.2")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: t("about.3"), icon: images.icon1 },
          { title: t("about.4"), icon: images.icon2 },
          { title: t("about.5"), icon: images.icon3 },
        ].map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardRefs.current[index] = el)}
            className="p-6 bg-darkBackground  dark:bg-backgroundCard text-white rounded-2xl shadow-lg flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-102"
          >
            <div className="text-4xl mb-4">
              <img src={item.icon} />
            </div>
            <p className="font-thin text-[9px] text-paragraph dark:text-darkBackground">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
