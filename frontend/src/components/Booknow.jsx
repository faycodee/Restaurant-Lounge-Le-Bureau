import React, { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { v4 as uuidv4 } from "uuid";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

const Alert = React.memo(({ message, type, onClose }) => {
  const alertColors = {
    success: "bg-green-100 border-green-400 text-green-700",
    error: "bg-red-100 border-red-400 text-red-700",
    info: "bg-blue-100 border-blue-400 text-blue-700",
  };

  return (
    <div className="fixed top-20 z-50 left-1/2 transform -translate-x-1/2 ">
      <div
        className={`border-l-4 p-4 ${alertColors[type]} rounded-lg shadow-lg min-w-64`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex justify-between items-center">
          <span className="text-sm">{message}</span>
          <button
            onClick={onClose}
            className="text-2xl leading-none"
            aria-label="Close alert"
          >
            &times;
          </button>
        </div>
      </div>
    </div>
  );
});

const ConfirmationModal = React.memo(({ onConfirm, onCancel, message }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
    <div
      className="bg-white p-6 rounded-lg w-96"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <h3 id="confirm-title" className="text-lg font-bold mb-4">
        Confirm Action
      </h3>
      <p className="mb-6">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
));

const ReservationCalendar = () => {
  const api = import.meta.env.VITE_API;
  const introRef = useRef(null);
  const [reservations, setReservations] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    email: "",
    guests: 1,
    time: "12:00",
  });
  const [formErrors, setFormErrors] = useState({});
  const [alert, setAlert] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [user, setUser] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const localizer = momentLocalizer(moment);
  const [t] = useTranslation();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
    fetchReservations();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get(api);
      const formattedData = response.data
        .filter((res) => res.status === "confirmed")
        .map((reservation) => ({
          title:
            user && reservation.user_id === user.id
              ? `Your Reservation (${reservation.guests} people)`
              : `Reserved (${reservation.guests} people)`,
          start: new Date(
            `${reservation.reservation_date}T${reservation.reservation_time}`
          ),
          end: new Date(
            `${reservation.reservation_date}T${reservation.reservation_time}`
          ),
          allDay: false,
          resource: reservation,
        }));
      setReservations(formattedData);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      showAlert("Failed to load reservations", "error");
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.customer_name.trim())
      errors.customer_name = "Name is required";
    if (!formData.customer_phone.trim()) {
      errors.customer_phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.customer_phone)) {
      errors.customer_phone = "Phone must be 10 digits";
    }
    if (!formData.guests || formData.guests < 1)
      errors.guests = "At least 1 guest required";
    if (!formData.time) errors.time = "Time required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelectSlot = ({ start }) => {
    if (!user) {
      showAlert("Please login to make a reservation", "info");
      navigate("/login");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(start);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showAlert("Cannot reserve past dates", "error");
      return;
    }

    setSelectedSlot(start);
    setFormData({
      customer_name: user.name || "",
      customer_phone: "",
      email: user.email || "",
      guests: 1,
      time: "12:00",
    });
    setShowModal(true);
  };

  const handleSelectEvent = (event) => {
    if (!user) {
      showAlert("Please login to manage reservations", "info");
      return;
    }

    if (event.resource.user_id !== user.id) {
      showAlert("You can only manage your own reservations", "info");
      return;
    }

    // Set form data when selecting an event
    setFormData({
      customer_name: event.resource.customer_name,
      customer_phone: event.resource.customer_phone,
      email: event.resource.email,
      guests: event.resource.guests,
      time: moment(event.start).format("HH:mm"),
    });

    setSelectedEvent(event);
    setSelectedSlot(event.start);
    setShowModal(true);
  };

  const handleFormSubmit = async () => {
    if (!user) {
      showAlert("Please login to make a reservation", "info");
      navigate("/login");
      return;
    }

    if (!validateForm()) return;

    try {
      const reservationData = {
        user_id: user.id,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        email: formData.email,
        reservation_date: moment(selectedSlot).format("YYYY-MM-DD"),
        reservation_time: formData.time,
        guests: parseInt(formData.guests),
        status: "confirmed",
      };

      const token = localStorage.getItem("token");
      await axios.post(`${api}`, reservationData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showAlert("Reservation created successfully!", "success");
      fetchReservations();
      setShowModal(false);
    } catch (error) {
      console.error("Reservation error:", error);
      showAlert(
        error.response?.data?.message || "Failed to create reservation",
        "error"
      );
    }
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;

    setIsUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        email: formData.email,
        reservation_date: moment(selectedEvent.start).format("YYYY-MM-DD"),
        reservation_time: formData.time,
        guests: parseInt(formData.guests),
        user_id: user.id,
      };

      await axios.put(`${api}/${selectedEvent.resource._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showAlert("Reservation updated successfully!", "success");
      fetchReservations();
      setShowModal(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error("Update error:", error);
      showAlert(
        error.response?.data?.message || "Failed to update reservation",
        "error"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${api}/${selectedEvent.resource._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { user_id: user.id },
      });
      showAlert("Reservation deleted successfully!", "success");
      fetchReservations();
      setShowModal(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Delete error:", error);
      showAlert("Failed to delete reservation", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const eventStyleGetter = (event) => {
    const isUserEvent = user && event.resource.user_id === user.id;
    return {
      style: {
        backgroundColor: isUserEvent ? "#4CAF50" : "#607D8B",
        color: "#ffffff",
        borderRadius: "5px",
        padding: "8px",
        cursor: isUserEvent ? "pointer" : "default",
        border: isUserEvent ? "2px solid #388E3C" : "none",
        opacity: user ? 1 : 0.7,
      },
    };
  };

  return (
    <main>
      <div
        id="book"
        className="p-4 flex justify-center flex-col items-center mb-10"
      >
        {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

        <h1
          ref={introRef}
          className="text-[90px] max-md:text-[60px] text-center text-primary dark:text-darkPrimary mt-[80px] font-bold mb-[80px]"
        >
          {t("book.1")}
        </h1>

        <div id="calendar" className="w-[80vw] bg-gray-100 p-5 rounded-2xl">
          <Calendar
            localizer={localizer}
            events={reservations}
            startAccessor="start"
            endAccessor="end"
            titleAccessor="title"
            eventPropGetter={eventStyleGetter}
            style={{ height: 450 }}
            selectable
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
          />

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-bold mb-4">
                  {selectedEvent ? "Reservation Details" : "New Reservation"}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {moment(selectedSlot).format("MMMM D, YYYY")}
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      name="customer_name"
                      value={formData.customer_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_name: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={
                        selectedEvent &&
                        selectedEvent.resource.user_id !== user?.id
                      }
                      aria-required="true"
                    />
                    {formErrors.customer_name && (
                      <p className="text-red-500 text-sm">
                        {formErrors.customer_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="customer_phone"
                      value={formData.customer_phone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          customer_phone: e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={
                        selectedEvent &&
                        selectedEvent.resource.user_id !== user?.id
                      }
                      aria-required="true"
                    />
                    {formErrors.customer_phone && (
                      <p className="text-red-500 text-sm">
                        {formErrors.customer_phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email (optional)
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={
                        selectedEvent &&
                        selectedEvent.resource.user_id !== user?.id
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="time"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={
                        selectedEvent &&
                        selectedEvent.resource.user_id !== user?.id
                      }
                      aria-required="true"
                    />
                    {formErrors.time && (
                      <p className="text-red-500 text-sm">{formErrors.time}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Guests
                    </label>
                    <input
                      type="number"
                      min="1"
                      name="guests"
                      value={formData.guests}
                      onChange={(e) =>
                        setFormData({ ...formData, guests: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={
                        selectedEvent &&
                        selectedEvent.resource.user_id !== user?.id
                      }
                      aria-required="true"
                    />
                    {formErrors.guests && (
                      <p className="text-red-500 text-sm">
                        {formErrors.guests}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setSelectedEvent(null);
                      }}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Close
                    </button>

                    {user &&
                      selectedEvent &&
                      selectedEvent.resource.user_id === user.id && (
                        <>
                          <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Deleting...
                              </span>
                            ) : (
                              "Delete"
                            )}
                          </button>
                          <button
                            onClick={handleUpdate}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  ></path>
                                </svg>
                                Updating...
                              </span>
                            ) : (
                              "Update"
                            )}
                          </button>
                        </>
                      )}

                    {!selectedEvent && user && (
                      <button
                        onClick={handleFormSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Confirm
                      </button>
                    )}

                    {!user && (
                      <button
                        onClick={() => navigate("/login")}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Login to Reserve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {showDeleteConfirm && (
            <ConfirmationModal
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
              message="Are you sure you want to delete this reservation?"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default ReservationCalendar;
