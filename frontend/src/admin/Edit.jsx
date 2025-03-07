import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import NavAdmin from "./NavAdmin";

const Alert = ({ message, type, onClose }) => {
  const alertColors = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div className="fixed top-20 z-50 left-1/2 transform -translate-x-1/2">
      <div
        className={`border-l-4 p-4 ${alertColors[type]} rounded-lg shadow-lg min-w-64`}
      >
        <div className="flex justify-between items-center">
          <span className="text-sm">{message}</span>
          <button onClick={onClose} className="text-2xl leading-none">
            &times;
          </button>
        </div>
      </div>
    </div>
  );
};

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState({
    customer_name: "",
    customer_phone: "",
    email: "",
    reservation_date: "",
    reservation_time: "",
    guests: "",
    status: "pending",
  });
  const [error, setError] = useState("");
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/api/admin/reservations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setReservation(response.data);
      } catch (error) {
        console.error("Error fetching reservation:", error);
      }
    };
    fetchReservation();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/reservations/${id}`,
        reservation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAlert({ message: "Reservation updated successfully", type: "success" });
      setTimeout(() => {
        navigate("/login/dashboard/manag");
      }, 2000);
    } catch (error) {
      setError("Error updating reservation");
      setAlert({ message: "Error updating reservation", type: "error" });
      console.error("Error updating reservation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 flex">
      <NavAdmin isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`p-4 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-primary text-center mb-6">
            Edit Reservation
          </h1>
          {alert.message && (
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: "", type: "" })} />
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700">Customer Name</label>
              <input
                type="text"
                name="customer_name"
                value={reservation.customer_name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Customer Phone</label>
              <input
                type="text"
                name="customer_phone"
                value={reservation.customer_phone}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={reservation.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-gray-700">Reservation Date</label>
              <input
                type="date"
                name="reservation_date"
                value={reservation.reservation_date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Reservation Time</label>
              <input
                type="time"
                name="reservation_time"
                value={reservation.reservation_time}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Guests</label>
              <input
                type="number"
                name="guests"
                value={reservation.guests}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Status</label>
              <select
                name="status"
                value={reservation.status}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-gray-600 text-gray-900 focus:outline-none focus:border-blue-500 transition-colors"
                required
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-300"
            >
              Update Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;