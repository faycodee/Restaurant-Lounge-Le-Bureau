import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
        const response = await axios.get('http://localhost:5000/api/admin/reservations', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <div>
      <h1>Reservations Dashboard</h1>
      <table>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Customer Name</th>
            <th>Customer Phone</th>
            <th>Email</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Guests</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <tr key={reservation._id}>
              <td>{reservation.user_id}</td>
              <td>{reservation.customer_name}</td>
              <td>{reservation.customer_phone}</td>
              <td>{reservation.email}</td>
              <td>{reservation.reservation_date}</td>
              <td>{reservation.reservation_time}</td>
              <td>{reservation.guests}</td>
              <td>{reservation.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;