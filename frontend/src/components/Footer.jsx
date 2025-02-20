import React, { useState } from "react";
import {
  Facebook,
  Instagram,
  Phone,
  PhoneCall,
  Clock,
  MapPin,
  Mail,
} from "lucide-react";
import images from "../constants/images";

const Footer = () => {
  const currentYear = new Date().getFullYear();
 const [src,setSrc]=useState(images.ta1)
  return (
    <footer id="contact" className="bg-black text-white py-12 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Contact Info & Map Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Contact Information */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">CONTACTEZ-NOUS</h2>

            {/* Hours */}
            <div className="flex items-start gap-3">
              <Clock className="mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold mb-2">HEURES D'OUVERTURE</h3>
                <p>Ouvert 7/7</p>
                <p>12h:00 - 02h:00</p>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold mb-2">ADRESSE</h3>
                <p>13 Rue Abdelkrim Benjelloun</p>
                <p>Fez, 30050</p>
                <p>Morocco</p>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={20} />
                <p>+(212) 06 19 93 91 64</p>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall size={20} />
                <p>+(212) 05 35 65 19 62</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={20} />
                <p>Restaurant.Lounge.Lebureau@gmail.com</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                onMouseEnter={()=>setSrc(images.ta2)}
                onMouseLeave={()=>setSrc(images.ta1)}
                className="group w-10 h-10 rounded-full border border-white flex items-center justify-center hover:bg-white transition-colors"
              >
                <span className="  group-hover:text-black">
                  <img src={src} alt="" srcset="" />
                </span>
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] w-full">
            
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.182245684868!2d-5.007993423837126!3d34.039195918418336!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8be363eca2ab%3A0x8d04c0dab79191ce!2sRestaurant%20Lounge%20Le%20Bureau!5e0!3m2!1sen!2sus!4v1739923877886!5m2!1sen!2sus"
               className="w-full h-full border-0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="space-y-2">
            <h4 className="font-bold mb-4">À PROPOS</h4>
            <p>
              <a href="#about" className="hover:underline">
                Notre Histoire
              </a>
            </p>
            <p>
              <a href="#menu" className="hover:underline">
                Menu
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold mb-4">DÉCOUVRIR</h4>
            <p>
              <a href="#" className="hover:underline">
                Évènements
              </a>
            </p>
            <p>
              <a href="#gallery" className="hover:underline">
                Galerie
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold mb-4">INFORMATION</h4>
            <p>
              <a href="#book" className="hover:underline">
                Réservations
              </a>
            </p>
            <p>
              <a href="#contact" className="hover:underline">
                Contact
              </a>
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="text-sm border-t border-gray-800 pt-8 flex flex-wrap gap-4 justify-center">
          <a href="#" className="hover:underline">
            MENTIONS LÉGALES
          </a>
          <span>|</span>
          <a href="#" className="hover:underline">
            POLITIQUE DE CONFIDENTIALITÉ
          </a>
          <span>|</span>
          <a href="#" className="hover:underline">
            GESTION DES COOKIES
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
