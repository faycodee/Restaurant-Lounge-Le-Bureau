import React, { useState } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import NavAdmin from "./NavAdmin";

function CheackQR() {
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);
  const [showScanner, setShowScanner] = useState(true);
  const navigate = useNavigate();

  const handleScan = async (result) => {
    if (result && showScanner) {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          "http://localhost:5000/api/coupons/redeem",
          {
            code: result?.text,
          }
        );

        // Turn off scanner after successful scan
        setShowScanner(false);
        setCouponDetails({
          message: response.data.message,
          discount: response.data.discount,
          isValid: true,
        });
        setScanResult(result.text);

        // Show success notification
        playSuccessSound();
      } catch (error) {
        setError(error.response?.data?.message || "Failed to validate coupon");
        setCouponDetails({
          isValid: false,
          message: error.response?.data?.message,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
    setError("Failed to access camera");
  };

  const playSuccessSound = () => {
    const audio = new Audio("/success.mp3"); // Add a success sound file to your public folder
    audio.play().catch(console.error);
  };

  const resetScanner = () => {
    setShowScanner(true);
    setScanResult(null);
    setCouponDetails(null);
    setError("");
  };
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-8"
    >
      <NavAdmin isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <motion.div
        layout
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
      >
        <div className="p-6">
          <motion.h2
            layout
            className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center"
          >
            {couponDetails?.isValid ? "Coupon Validated!" : "Scan QR Coupon"}
          </motion.h2>

          <AnimatePresence mode="wait">
            {showScanner && !couponDetails?.isValid && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-6"
              >
                <div className="relative rounded-xl overflow-hidden shadow-inner">
                  <QrReader
                    onResult={handleScan}
                    onError={handleError}
                    constraints={{ facingMode: "environment" }}
                    className="w-full"
                    videoStyle={{ borderRadius: "0.75rem" }}
                  />
                  {loading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="loading-spinner"></div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Success Message */}
          <AnimatePresence>
            {couponDetails?.isValid && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center"
              >
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 mx-auto text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-600 mb-2">
                  Coupon Successfully Validated!
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {couponDetails.message}
                </p>
                {couponDetails.discount && (
                  <p className="text-2xl font-bold text-green-500 mb-6">
                    {couponDetails.discount}% Discount Applied
                  </p>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetScanner}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shadow-md"
                >
                  Scan Another Coupon
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 mb-4 text-red-700 bg-red-100 rounded-lg shadow-md"
              >
                <p className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default CheackQR;
