import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { FaEdit, FaTrash, FaPlus, FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Pie, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement } from 'chart.js';
import NavAdmin from './NavAdmin';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title, BarElement);

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/reservations', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };
    fetchReservations();
  }, []);

  useEffect(() => {
    gsap.from('.reservation-row', {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.5,
    });
  }, [reservations]);

  const getChartData = () => {
    const statusCounts = reservations.reduce(
      (acc, reservation) => {
        acc[reservation.status] = (acc[reservation.status] || 0) + 1;
        return acc;
      },
      { pending: 0, confirmed: 0, cancelled: 0 }
    );

    return {
      labels: ['Pending', 'Confirmed', 'Cancelled'],
      datasets: [
        {
          label: 'Reservations',
          data: [statusCounts.pending, statusCounts.confirmed, statusCounts.cancelled],
          backgroundColor: ['#fbbf24', '#10b981', '#ef4444'],
        },
      ],
    };
  };

  const getReservationsPerDayData = () => {
    const today = new Date();
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const reservationsPerDay = last30Days.map((date) => {
      return reservations.filter((reservation) => reservation.reservation_date === date).length;
    });

    return {
      labels: last30Days,
      datasets: [
        {
          label: 'Reservations per Day',
          data: reservationsPerDay,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
        },
      ],
    };
  };

  const getPopularTimesData = () => {
    const timeCounts = reservations.reduce((acc, reservation) => {
      const hour = parseInt(reservation.reservation_time.split(':')[0], 10);
      acc[hour] = (acc[hour] || 0) + 1;
      return acc;
    }, {});

    const hours = [13, 15, 17, 19, 20, 21];
    const data = hours.map((hour) => timeCounts[hour] || 0);

    return {
      labels: ['1 PM', '3 PM', '5 PM', '7 PM', '8 PM', '9 PM'],
      datasets: [
        {
          label: 'Reservations',
          data: data,
          backgroundColor: ['#2563eb', '#f43f5e', '#22c55e', '#3b82f6', '#06b6d4', '#6366f1'],
          borderRadius: 5,
        },
      ],
    };
  };

  const getGuestCountDistribution = () => {
    const guestRanges = {'1-2': 0, '3-4': 0, '5-6': 0, '7+': 0};

    reservations.forEach(({ guests }) => {
      if (guests <= 2) guestRanges['1-2']++;
      else if (guests <= 4) guestRanges['3-4']++;
      else if (guests <= 6) guestRanges['5-6']++;
      else guestRanges['7+']++;
    });

    return {
      labels: Object.keys(guestRanges),
      datasets: [
        {
          label: 'Guest Count Distribution',
          data: Object.values(guestRanges),
          backgroundColor: ['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf'],
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-background text-gray-900 flex">
      <NavAdmin isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`p-4 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <h1 className="text-[40px] font-bold text-primary text-center col-span-1 md:col-span-2 mb-20">Reservations Dashboard</h1>
          
          <div className="w-full h-96">
            <Pie data={getChartData()} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Reservation Status' } } }} />
          </div>

         

          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Most Popular Time</h2>
            <Bar data={getPopularTimesData()} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div className="w-full">
            <Line data={getReservationsPerDayData()} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Reservations per Day (Last 30 Days)' } } }} />
          </div>
          <div className="w-full">
            <h2 className="text-lg font-semibold mb-2">Guest Count Distribution</h2>
            <Bar data={getGuestCountDistribution()} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;