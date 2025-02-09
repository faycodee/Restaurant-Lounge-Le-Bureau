import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import images from "../constants/images";
gsap.registerPlugin(ScrollTrigger);

export default function OverviewSection() {
  const introRef = useRef(null);
  const cardRefs = useRef([]);
  const para = useRef(null);
  const [t, i18n] = useTranslation();

  useEffect(() => {
    gsap.fromTo(
      introRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 5, ease: "power1.out" }
    );
    gsap.fromTo(
      para.current,
      { opacity: 0, y: -5 },
      { opacity: 1, y: 0, duration: 5, ease: "power1.inOut" }
    );

    gsap.fromTo(
      introRef.current.querySelector("h1"),
      {
        scale: 1,
        opacity: 0,
        color: "white", // initial color
      },
      {
        scale: 1.2,
        opacity: 4,
        color: "#FF4500",
        duration: 5,
        delay: 2,
        ease: "power1.out",
        scrollTrigger: {
          trigger: introRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
          toggleActions: "play none none reverse",
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
    <section className="py-16 px-8 bg-gray-50 h-[100vh]">
      <div ref={introRef} className="text-center mb-12">
        <h1 className="text-[90px] font-bold mb-[80px]"> {t("about.1")}</h1>
        <p ref={para} className="text-sm text-gray-600 max-w-3xl mx-auto">
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
            className="p-6 bg-backgroundDark  text-white rounded-2xl shadow-lg flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-102"
          >
            <div className="text-4xl mb-4">
              <img src={item.icon} />
            </div>
            <p className="font-thin text-[9px] text-paragraph">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
