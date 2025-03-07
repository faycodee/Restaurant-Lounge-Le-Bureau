import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavAdmin from './NavAdmin';

const Add = () => {
  const navigate = useNavigate();
  const [reservation, setReservation] = useState({
    customer_name: '',
    customer_phone: '',
    email: '',
    reservation_date: '',
    reservation_time: '',
    guests: '',
    status: 'pending',
  });
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReservation((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/admin/reservations', reservation, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/dashboard');
    } catch (error) {
      setError('Error adding reservation');
      console.error('Error adding reservation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 flex">
      <NavAdmin isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`p-4 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-primary text-center mb-6">Add Reservation</h1>
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
              Add Reservation
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Add;