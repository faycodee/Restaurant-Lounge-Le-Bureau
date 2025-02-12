import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import images from "../constants/images";

gsap.registerPlugin(ScrollTrigger);

const LuxuryGallery = () => {
  const containerRef = useRef(null);
  const sectionsRef = useRef([]);

  const content = [
    {
      id: 1,
      title: "BREAKFAST WITH THE",
      subtitle: "AROMAS OF FRESH",
      highlight: "COFFEE",
      description: "Start your day in the heart of Venice",
      src: images.g1,
      type: "side"
    },
    {
      id: 2,
      title: "DINNER IN A",
      subtitle: "ROMANTIC",
      highlight: "SETTING",
      description: "Experience the magic of Venetian nights",
      src: images.g7,
      type: "side"
    },
    {
      id: 3,
      title: "CULINARY",
      subtitle: "EXCELLENCE",
      description: "Discover our world of exquisite flavors",
      src: images.g4,
      type: "center",
      buttonText: "Explore Our Menu"
    }
  ];

  useEffect(() => {
    const sections = sectionsRef.current;

    sections.forEach((section, index) => {
      const imageWrapper = section.querySelector('.image-wrapper');
      const image = section.querySelector('.image-container');
      const textContent = section.querySelector('.text-content');
      const textElements = section.querySelectorAll('.animate-text');
      const button = section.querySelector('.cta-button');
      const overlay = section.querySelector('.overlay');

      // Set initial states
      gsap.set(imageWrapper, {
        x: index === sections.length - 1 ? 0 : '100%',
        opacity: 0,
      });
      
      gsap.set(image, {
        scale: 1,
      });

      gsap.set(textElements, {
        y: 30,
        opacity: 0,
      });

      if (button) {
        gsap.set(button, {
          y: 20,
          opacity: 0,
        });
      }

      gsap.set(overlay, {
        opacity: 0,
      });

      // Create timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top center",
          end: "+=100%",
          pin: true,
          scrub: false,
          toggleActions: "play none none reverse",
        }
      });

      // Exit animation for previous section
      if (index > 0) {
        const prevSection = sections[index - 1];
        const prevImage = prevSection.querySelector('.image-wrapper');
        const prevText = prevSection.querySelector('.text-content');
        
        tl.to(prevImage, {
          x: '-100%',
          opacity: 0,
          duration: 1.2,
          ease: "power2.inOut"
        })
        .to(prevText, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.inOut"
        }, "-=1.2");
      }

      // Entrance animation sequence
      if (index === sections.length - 1) {
        // Final centered section animation
        tl.to(overlay, {
          opacity: 0.4,
          duration: 1.5,
          ease: "power2.inOut"
        })
        .to(image, {
          scale: 1.1,
          duration: 2,
          ease: "power2.inOut"
        }, "-=1.5")
        .to(textElements, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out"
        }, "-=1.5")
        .to(button, {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out"
        }, "-=1");
      } else {
        // Side section animations
        tl.to(imageWrapper, {
          x: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power2.inOut"
        })
        .to(overlay, {
          opacity: 0.4,
          duration: 1.5,
          ease: "power2.inOut"
        }, "-=1")
        .to(image, {
          scale: 1.1,
          duration: 2,
          ease: "power2.inOut"
        }, "-=1.5")
        .to(textElements, {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power2.out"
        }, "-=1.5");
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className=" bg-background dark:bg-darkBackground" ref={containerRef}>
      {content.map((item, index) => (
        <div
          key={item.id}
          ref={el => sectionsRef.current[index] = el}
          className="min-h-screen relative flex items-center overflow-hidden"
        >
          <div className={`flex w-full h-screen relative ${
            item.type === 'center' ? 'flex-col' : ''
          }`}>
            {item.type === 'side' ? (
              <>
                {/* Left side - Image */}
                <div className="image-wrapper w-1/2 h-full relative overflow-hidden">
                  <div className="image-container w-full h-full relative">
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="overlay absolute inset-0 bg-black/30" />
                  </div>
                </div>

                {/* Right side - Text */}
                <div className="w-1/2 flex items-center justify-center px-16">
                  <div className="text-content">
                    <h2 className="animate-text text-2xl font-light t text-darkBackground dark:text-background tracking-[0.3em] mb-4"
                        style={{ fontFamily: 'Didot, serif' }}>
                      {item.title}
                    </h2>
                    
                    <div className="flex flex-col gap-2 mb-8">
                      <h3 className="animate-text text-5xl font-light text-darkBackground dark:text-background tracking-[0.2em]"
                          style={{ fontFamily: 'Didot, serif' }}>
                        {item.subtitle}
                      </h3>
                      {item.highlight && (
                        <span className="animate-text text-5xl font-light text-primary dark:text-darkPrimary tracking-[0.2em]"
                              style={{ fontFamily: 'Didot, serif' }}>
                          {item.highlight}
                        </span>
                      )}
                    </div>
                    
                    <p className="animate-text opacity-40 text-[10px]  text-darkBackground dark:text-background tracking-wide leading-relaxed"
                       style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              // Centered final section
              <div className="relative w-full h-full">
                <div className="image-container absolute inset-0">
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="overlay absolute inset-0 bg-black/30" />
                </div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                  <h2 className="animate-text text-2xl font-light text-white tracking-[0.3em] mb-4"
                      style={{ fontFamily: 'Didot, serif' }}>
                    {item.title}
                  </h2>
                  
                  <h3 className="animate-text text-6xl font-light text-white tracking-[0.2em] mb-8"
                      style={{ fontFamily: 'Didot, serif' }}>
                    {item.subtitle}
                  </h3>
                  
                  <p className="animate-text text-xl text-gray-200 tracking-wide leading-relaxed max-w-2xl mb-12"
                     style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {item.description}
                  </p>

                  <button className="cta-button px-8 py-4 border-2 border-white text-white text-lg tracking-widest hover:bg-white hover:text-black transition-all duration-300"
                          style={{ fontFamily: 'Didot, serif' }}>
                    {item.buttonText}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default LuxuryGallery;