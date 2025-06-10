import React, { useState, useEffect } from "react";
import axios from "axios";
import Alert from "./Alert";
import { FaMedal, FaTrophy, FaCrown } from "react-icons/fa";

const Getcoupon = () => {
  const [userPoints, setUserPoints] = useState(0);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [userCoupons, setUserCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    discountPercentage: "",
    expiryDate: "",
  });

  useEffect(() => {
    const fetchUserPoints = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
          setAlert({
            show: true,
            message: "Please login to view your points",
            type: "error",
          });
          return;
        }
        // Use loyaltyPoints directly from localStorage user object
        setUserPoints(user.loyaltyPoints);
      } catch (error) {
        setAlert({
          show: true,
          message: "Failed to fetch loyalty points",
          type: "error",
        });
      }
    };

    fetchUserPoints();
  }, []);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return;

        const response = await axios.get(
          `http://localhost:5000/api/coupons?userId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserCoupons(response.data);
      } catch (error) {
        console.error("Error fetching coupons:", error);
        setUserCoupons([]);
        setAlert({
          show: true,
          message: "Failed to fetch coupons. Please try again later.",
          type: "error",
        });
      }
    };
    fetchCoupons();
  }, []);

  const convertToCoupon = async (pointsRequired, discountPercentage) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user) {
        setAlert({
          show: true,
          message: "Please login to convert points",
          type: "error",
        });
        return;
      }

      if (userPoints < pointsRequired) {
        setAlert({
          show: true,
          message: "Not enough points for this conversion",
          type: "error",
        });
        return;
      }

      // Generate a random coupon code
      const couponCode = `${user.id.substr(0, 4)}-${Math.random()
        .toString(36)
        .substr(2, 6)
        .toUpperCase()}`;

      // Set expiry date to 30 days from now
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      // Create new coupon with error handling
      try {
        const response = await axios.post(
          "http://localhost:5000/api/coupons/convert",
          {
            code: couponCode,
            discountPercentage,
            expiryDate: expiryDate.toISOString(),
            userId: user.id,
            pointsRequired,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // Update user points in localStorage
        const updatedPoints = userPoints - pointsRequired;
        user.loyaltyPoints = updatedPoints;
        localStorage.setItem("user", JSON.stringify(user));

        // Update state
        setUserPoints(updatedPoints);
        setAlert({
          show: true,
          message: "Points successfully converted to coupon!",
          type: "success",
        });

        // Refresh coupons list with updated port
        const couponsResponse = await axios.get(
          `http://localhost:5000/api/coupons?userId=${user.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setUserCoupons(couponsResponse.data);
      } catch (error) {
        if (error.response) {
          // Server responded with error
          setAlert({
            show: true,
            message: error.response.data.message || "Failed to convert points",
            type: "error",
          });
        } else if (error.request) {
          // No response received
          setAlert({
            show: true,
            message: "Server not responding. Please try again later.",
            type: "error",
          });
        } else {
          // Error in request setup
          setAlert({
            show: true,
            message: "Error setting up request. Please try again.",
            type: "error",
          });
        }
      }
    } catch (error) {
      console.error("Conversion error:", error);
      setAlert({
        show: true,
        message: "An unexpected error occurred",
        type: "error",
      });
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/coupons", {
        code: newCoupon.code,
        discountPercentage: newCoupon.discountPercentage,
        expiryDate: newCoupon.expiryDate,
      });
      setAlert({
        show: true,
        message: "Coupon added successfully!",
        type: "success",
      });
      setNewCoupon({ code: "", discountPercentage: "", expiryDate: "" });
      // Refresh coupons
      const response = await axios.get("http://localhost:8000/api/coupons");
      setUserCoupons(response.data);
    } catch (error) {
      setAlert({
        show: true,
        message: "Failed to add coupon",
        type: "error",
      });
    }
  };

  return (
    <section className="py-16 px-8 bg-background dark:bg-darkBackground min-h-screen">
      {alert.show && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert({ show: false, message: "", type: "" })}
        />
      )}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 text-primary dark:text-darkPrimary">
          <h1
            className="text-[90px] text-center text-primary dark:text-darkPrimary font-bold mb-[40px]"
            style={{ fontFamily: "Impact, Haettenschweiler" }}
          >
            Loyalty Program
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-5">
            Your Points:{" "}
            <span className="font-bold text-primary">{userPoints}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Bronze Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-4">
              <FaMedal className="text-5xl text-bronze" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Bronze</h3>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-primary">
                300 points
              </span>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 mb-6">
              <li className="flex items-center mb-2">
                <span className="mr-2">•</span>
                20 points offered
              </li>
              <li className="flex items-center mb-2">
                <span className="mr-2">•</span>
                Special offer on next order
              </li>
            </ul>
            <button
              onClick={() => convertToCoupon(300, 2)}
              disabled={userPoints < 300}
              className={`w-full py-2 rounded-lg ${
                userPoints >= 300
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Convert to 2% Discount
            </button>
          </div>

          {/* Silver Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-4">
              <FaTrophy className="text-5xl text-silver" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Silver</h3>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-primary">
                500 points
              </span>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 mb-6">
              <li className="flex items-center mb-2">
                <span className="mr-2">•</span>
                50 points offered
              </li>
              <li className="flex items-center mb-2">
                <span className="mr-2">•</span>
                Free shipping over $30
              </li>
            </ul>
            <button
              onClick={() => convertToCoupon(500, 5)}
              disabled={userPoints < 500}
              className={`w-full py-2 rounded-lg ${
                userPoints >= 500
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Convert to 5% Discount
            </button>
          </div>

          {/* Gold Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-center mb-4">
              <FaCrown className="text-5xl text-gold" />
            </div>
            <h3 className="text-xl font-bold text-center mb-4">Gold</h3>
            <div className="text-center mb-4">
              <span className="text-2xl font-bold text-primary">
                1000 points
              </span>
            </div>
            <ul className="text-gray-600 dark:text-gray-300 mb-6">
              <li className="flex items-center mb-2">
                <span className="mr-2">•</span>
                100 points offered
              </li>
              <li className="flex items-center mb-2">
                <span className="mr-2">•</span>
                10% off all year
              </li>
            </ul>
            <button
              onClick={() => convertToCoupon(1000, 10)}
              disabled={userPoints < 1000}
              className={`w-full py-2 rounded-lg ${
                userPoints >= 1000
                  ? "bg-primary text-white hover:bg-primary/90"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              Convert to 10% Discount
            </button>
          </div>
        </div>

        {/* Coupons List Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Your Coupons
          </h2>
          {userCoupons.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-300 text-center py-8">
              No coupons available. Convert your points to get discounts!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCoupons.map((coupon, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="px-3 py-1 bg-primary text-white text-sm rounded-full">
                      {coupon.discount_percentage}% OFF
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Created:{" "}
                      {new Date(coupon.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded p-3 mb-3 text-center">
                    <span className="font-mono text-lg font-bold text-primary break-all">
                      {coupon.code}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-300">
                      Expires:
                    </span>
                    <span className="text-red-500 font-medium">
                      {new Date(coupon.expiry_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Getcoupon;
