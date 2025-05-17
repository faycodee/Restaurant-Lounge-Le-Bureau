import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const errorRef = useRef(null);

  useEffect(() => {
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });

    gsap.from(titleRef.current, {
      y: -30,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      delay: 0.3
    });

    gsap.from(".form-field", {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.out"
    });
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: "customer"
        }
      );

      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("token", response.data.token);

      gsap.to(formRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          navigate("/");
        }
      });
    } catch (error) {
      setError(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5] p-4">
      <div 
        ref={formRef}
        className="w-full max-w-md p-8 rounded-lg shadow-lg bg-white"
      >
        <h1 
          ref={titleRef}
          className="text-3xl font-bold text-center mb-8 text-[#FF4500]"
        >
          Create Account
        </h1>
        
        <form onSubmit={handleSignup} className="space-y-6">
          <div className="form-field">
            <label className="block text-[#B0B0B0] text-sm font-medium mb-2">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent"
              placeholder="Your Name"
            />
          </div>

          <div className="form-field">
            <label className="block text-[#B0B0B0] text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div className="form-field">
            <label className="block text-[#B0B0B0] text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <div className="form-field">
            <label className="block text-[#B0B0B0] text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p ref={errorRef} className="text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <button 
            type="submit"
            className="form-field w-full py-3 px-4 bg-[#FF4500] text-white font-medium rounded-md hover:bg-[#E03E00] transition-colors duration-300"
          >
            Sign Up
          </button>

          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-[#FF4500] hover:underline"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;