import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { FaEdit, FaTrash, FaSort } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import NavAdmin from './NavAdmin';

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

const Manage = () => {
  const [reservations, setReservations] = useState([]);
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  const [isOpen, setIsOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [reservationsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservations, setSelectedReservations] = useState([]);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [filterStatus, setFilterStatus] = useState('all');
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/admin/reservations', {
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

  const handleSort = (field) => {
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    const sortedReservations = [...reservations].sort((a, b) => {
      if (a[field] < b[field]) return order === 'asc' ? -1 : 1;
      if (a[field] > b[field]) return order === 'asc' ? 1 : -1;
      return 0;
    });
    setReservations(sortedReservations);
  };

  const handleEdit = (id) => {
    navigate(`edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reservation?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/admin/reservations/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReservations(reservations.filter((reservation) => reservation._id !== id));
        setAlert({ message: 'Reservation deleted successfully', type: 'success' });
      } catch (error) {
        console.error('Error deleting reservation:', error);
        setAlert({ message: 'Error deleting reservation', type: 'error' });
      }
    }
  };

  const handleDeleteSelected = async () => {
    if (window.confirm('Are you sure you want to delete the selected reservations?')) {
      try {
        const token = localStorage.getItem('token');
        await Promise.all(
          selectedReservations.map((id) =>
            axios.delete(`http://localhost:5000/api/admin/reservations/${id}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
          )
        );
        setReservations(reservations.filter((reservation) => !selectedReservations.includes(reservation._id)));
        setSelectedReservations([]);
        setAlert({ message: 'Selected reservations deleted successfully', type: 'success' });
      } catch (error) {
        console.error('Error deleting reservations:', error);
        setAlert({ message: 'Error deleting reservations', type: 'error' });
      }
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReservations(reservations.map((reservation) => reservation._id));
    } else {
      setSelectedReservations([]);
    }
  };

  const handleSelect = (e, id) => {
    if (e.target.checked) {
      setSelectedReservations([...selectedReservations, id]);
    } else {
      setSelectedReservations(selectedReservations.filter((reservationId) => reservationId !== id));
    }
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  // Get current reservations
  const indexOfLastReservation = currentPage * reservationsPerPage;
  const indexOfFirstReservation = indexOfLastReservation - reservationsPerPage;
  const filteredReservations = reservations.filter((reservation) => {
    if (filterStatus === 'all') return true;
    return reservation.status === filterStatus;
  });
  const currentReservations = filteredReservations
    .filter((reservation) =>
      reservation.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(indexOfFirstReservation, indexOfLastReservation);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen bg-background text-gray-900 flex">
      <NavAdmin isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className={`p-4 w-full transition-all duration-300 ${isOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="container mx-auto bg-white shadow-md rounded-lg p-6">
          <h1 className="text-3xl font-bold text-primary text-center mb-20
          ">Manage Reservations</h1>
          {alert.message && (
            <Alert message={alert.message} type={alert.type} onClose={() => setAlert({ message: '', type: '' })} />
          )}
          <div className="flex justify-between mb-4">
            <input
              type="text"
              placeholder="Search by customer name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            />
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
              disabled={selectedReservations.length === 0}
            >
              Delete Selected
            </button>
          </div>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-700 bg-primary-light">
                <th className="py-2 px-4">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedReservations.length === reservations.length}
                  />
                </th>
                <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('customer_name')}>
                  Customer Name <FaSort className="inline" />
                </th>
                <th className="py-2 px-4 cursor-pointer">Phone</th>
                <th className="py-2 px-4 cursor-pointer">Email</th>
                <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('reservation_date')}>
                  Date <FaSort className="inline" />
                </th>
                <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('reservation_time')}>
                  Time <FaSort className="inline" />
                </th>
                <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('guests')}>
                  Guests <FaSort className="inline" />
                </th>
                <th className="py-2 px-4 cursor-pointer" onClick={() => handleSort('status')}>
                  Status <FaSort className="inline" />
                </th>
                <th className="py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map((reservation) => (
                <tr key={reservation._id} className="reservation-row border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <input
                      type="checkbox"
                      checked={selectedReservations.includes(reservation._id)}
                      onChange={(e) => handleSelect(e, reservation._id)}
                    />
                  </td>
                  <td className="py-2 px-4">{reservation.customer_name}</td>
                  <td className="py-2 px-4">{reservation.customer_phone}</td>
                  <td className="py-2 px-4">{reservation.email || 'N/A'}</td>
                  <td className="py-2 px-4">{reservation.reservation_date}</td>
                  <td className="py-2 px-4">{reservation.reservation_time}</td>
                  <td className="py-2 px-4">{reservation.guests}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-white ${
                        reservation.status === 'confirmed'
                          ? 'bg-green-500'
                          : reservation.status === 'cancelled'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    >
                      {reservation.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 flex gap-2">
                    <button className="text-blue-500 hover:text-blue-700" onClick={() => handleEdit(reservation._id)}>
                      <FaEdit />
                    </button>
                    <button className="text-red-500 hover:text-red-700" onClick={() => handleDelete(reservation._id)}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <nav>
              <ul className="flex list-none">
                {Array.from({ length: Math.ceil(filteredReservations.length / reservationsPerPage) }, (_, i) => (
                  <li key={i} className="mx-1">
                    <button
                      onClick={() => paginate(i + 1)}
                      className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manage;