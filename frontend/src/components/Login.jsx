import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const randUrl = Math.random().toString(36).substr(2, 9);
  const navigate = useNavigate();

  // Refs for GSAP animations
  const formRef = useRef(null);
  const titleRef = useRef(null);
  const errorRef = useRef(null);

  // Initialize animations on component mount
  useEffect(() => {
    // Fade in and slide up the form
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    });

    // Animate title with a slight bounce
    gsap.from(titleRef.current, {
      y: -30,
      opacity: 0,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)",
      delay: 0.3,
    });

    // Stagger the form fields appearance
    gsap.from(".form-field", {
      opacity: 0,
      y: 20,
      stagger: 0.2,
      duration: 0.8,
      delay: 0.5,
      ease: "power2.out",
    });
  }, []);

  // Animation for error message
  useEffect(() => {
    if (error && errorRef.current) {
      gsap.fromTo(
        errorRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { email, password }
      );

      const userData = response.data.user; // ✅ Get user data from response

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", response.data.token);

      // Animate form on successful login
      gsap.to(formRef.current, {
        scale: 0.95,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          // Check role instead of isAdmin
          if (userData.role === "admin") {
            // ✅
            navigate("/");
          } else {
            navigate("/");
          }
        },
      });
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
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
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="form-field">
            <label className="block text-[#B0B0B0] text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-all duration-300"
              placeholder="admin@email.com"
            />
          </div>

          <div className="form-field">
            <label className="block pla text-[#B0B0B0] text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:border-transparent transition-all duration-300"
              placeholder="admin"
            />
          </div>

          {error && (
            <p ref={errorRef} className="text-red-500 text-center font-medium">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="form-field w-full py-3 px-4 bg-[#FF4500] text-white font-medium rounded-md hover:bg-[#E03E00] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF4500] focus:ring-opacity-50 transform hover:scale-105 active:scale-95"
          >
            Sign In
          </button>
          <p className="text-center text-gray-600">
            you dont have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="text-[#FF4500] hover:underline"
            >
              Sign Up
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
