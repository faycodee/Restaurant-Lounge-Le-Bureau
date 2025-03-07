import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { FaBars, FaTimes } from 'react-icons/fa';

const NavAdmin = ({ isOpen, toggleSidebar }) => {
  useEffect(() => {
    gsap.from('.nav-item', {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [isOpen]);

  return (
    <>
      <div className="bg-primary text-white h-screen p-4 fixed top-0 left-0 w-64 transform transition-transform duration-300 ease-in-out" style={{ transform: isOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="container mx-auto flex flex-col justify-between h-full">
          <div>
        
            <div className="flex flex-col space-y-4 mt-[100px]">
              <Link to="/login/dashboard/" className="nav-item hover:text-gray-300">
                Dashboard
              </Link>
              <Link to="/login/dashboard/add" className="nav-item hover:text-gray-300">
                Add Reservation
              </Link>
              <Link to="/login/dashboard/manag" className="nav-item hover:text-gray-300">
              Manage
              </Link>
            </div>
          </div>
         
        </div>
      </div>
      <button className="fixed top-4 left-4 z-50 text-black" onClick={toggleSidebar}>
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>
    </>
  );
};

export default NavAdmin;