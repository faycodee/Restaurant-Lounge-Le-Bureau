import React, { useEffect, useState, useRef } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useTranslation } from "react-i18next";
import gsap from "gsap";

const ReservationCalendar = ({ currentUserId, currentUserName }) => {
  const introRef = useRef(null);
  const [reservations, setReservations] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_phone: "",
    guests: 1,
    time: "12:00",
    table: {
      table_number: "",
      capacity: "",
    },
  });
  const [formErrors, setFormErrors] = useState({});
  const localizer = momentLocalizer(moment);
  const [t, i18n] = useTranslation();
  
  // هذه الدالة تُنفَّذ عند تحميل الكومبوننت، تقوم بجلب البيانات من الخادم (API) وتطبيق تأثير جافا سكربت باستخدام GSAP
  useEffect(() => {
    fetchReservations();
    gsap.fromTo(
      introRef.current,
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        delay: 1,
        scrollTrigger: {
          trigger: introRef.current,
          start: "top 80%",
          end: "bottom 30%",
          scrub: true,
          toggleActions: "play none none reverse",
        },
        ease: "power1.out",
      }
    );
  }, []);

  // هذه الدالة تُستخدم لجلب البيانات الخاصة بالحجوزات من الخادم
  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/reservations");
      const formattedData = response.data.map((reservation) => ({
        title: formatEventTitle(reservation),
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
    }
  };

  // دالة لتنسيق عنوان الحدث بناءً على بيانات الحجز
  const formatEventTitle = (reservation) => {
    if (reservation.user_id === currentUserId) {
      return `Reserved`;
    }
    return `Reserved - Table ${reservation.table.table_number}`;
  };

  // دالة للتحقق من صحة البيانات المدخلة في النموذج
  const validateForm = () => {
    const errors = {};
    if (!formData.customer_name) errors.customer_name = "Name is required";
    if (!formData.customer_phone) {
      errors.customer_phone = "Phone is required";
    } else if (!/^\d{10}$/.test(formData.customer_phone)) {
      errors.customer_phone = "Phone must be 10 digits";
    }
    if (!formData.guests || formData.guests < 1) {
      errors.guests = "Number of guests must be at least 1";
    }
    if (!formData.table.table_number) {
      errors.table_number = "Table number is required";
    }
    if (!formData.table.capacity) {
      errors.capacity = "Table capacity is required";
    }
    if (!formData.time) {
      errors.time = "Time is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // دالة لاختيار الوقت/الموعد من التقويم
  const handleSelectSlot = ({ start }) => {
    const now = new Date();
    if (start < now) {
      alert("Cannot make reservations for past dates");
      return;
    }

    setSelectedSlot(start);
    setModalMode("add");
    setFormData({
      customer_name: currentUserName || "",
      customer_phone: "",
      guests: 1,
      time: "12:00",
      table: {
        table_number: "",
        capacity: "",
      },
    });
    setShowModal(true);
  };

  // دالة لاختيار حدث من التقويم لعرض تفاصيله أو تعديله
  const handleSelectEvent = (event) => {
    if (event.resource.user_id !== currentUserId) {
      return; // عدم السماح بتعديل حجوزات المستخدمين الآخرين
    }

    const eventTime = moment(event.start).format("HH:mm");
    setSelectedEvent(event);
    setModalMode("edit");
    setFormData({
      customer_name: event.resource.customer_name,
      customer_phone: event.resource.customer_phone,
      guests: event.resource.guests,
      time: eventTime,
      table: {
        table_number: event.resource.table.table_number,
        capacity: event.resource.table.capacity,
      },
    });
    setShowModal(true);
  };

  // دالة لمعالجة تغييرات المدخلات في النموذج
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("table.")) {
      const tableField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        table: {
          ...prev.table,
          [tableField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // دالة لإضافة حجز جديد
  const handleAddReservation = async () => {
    if (!validateForm()) return;

    try {
      const reservationData = {
        user_id: currentUserId,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        reservation_date: moment(selectedSlot).format("YYYY-MM-DD"),
        reservation_time: formData.time,
        guests: parseInt(formData.guests),
        status: "pending",
        table: {
          table_number: parseInt(formData.table.table_number),
          capacity: parseInt(formData.table.capacity),
        },
      };

      await axios.post("http://localhost:5000/api/reservations", reservationData);
      fetchReservations();
      setShowModal(false);
    } catch (error) {
      console.error("Error adding reservation:", error);
      alert("Failed to add reservation");
    }
  };

  // دالة لتحديث الحجز الموجود
  const handleUpdateReservation = async () => {
    if (!validateForm()) return;

    try {
      const reservationData = {
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        guests: parseInt(formData.guests),
        reservation_time: formData.time,
        table: {
          table_number: parseInt(formData.table.table_number),
          capacity: parseInt(formData.table.capacity),
        },
      };

      await axios.put(
        `http://localhost:5000/api/reservations/${selectedEvent.resource.id}`,
        reservationData
      );
      fetchReservations();
      setShowModal(false);
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation");
    }
  };

  // دالة لحذف الحجز
  const handleDeleteReservation = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/reservations/${selectedEvent.resource.id}`
      );
      fetchReservations();
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete reservation");
    }
  };

  // دالة لتخصيص نمط الحدث بناءً على حالة الحجز
  const eventStyleGetter = (event) => {
    let backgroundColor = "#6c757d"; // اللون الافتراضي

    if (event.resource.user_id === currentUserId) {
      if (event.resource.status === "confirmed") backgroundColor = "#28a745";
      if (event.resource.status === "cancelled") backgroundColor = "#dc3545";
      if (event.resource.status === "pending") backgroundColor = "#ffc107";
    }

    return {
      style: {
        backgroundColor,
        color: backgroundColor === "#ffc107" ? "#000" : "#fff",
        fontSize: "13px",
        borderRadius: "5px",
        padding: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      },
    };
  };

  return (
    <div id="book" className="p-4 flex justify-center flex-col items-center">
      <h1
        ref={introRef}
        className="text-[90px] text-center  text-primary dark:text-darkPrimary mt-[80px] font-bold mb-[80px]"
        style={{ fontFamily: "Impact, Haettenschweiler" }}
      >
        {" "}
        {t("book.1")}
      </h1>
      <div className="w-[80vw] ">
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
          <div className="fixed inset-0 bg-black  z-20 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">
                {modalMode === "add"
                  ? "Add Reservation"
                  : "Manage Your Reservation"}
              </h2>

              <p className="text-sm text-gray-600 mb-4">
                Date: {moment(selectedSlot).format("MMMM D, YYYY")}
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
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.customer_name && (
                    <p className="text-red-500 text-sm">
                      {formErrors.customer_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="customer_phone"
                    value={formData.customer_phone}
                    onChange={handleInputChange}
                    placeholder="1234567890"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.customer_phone && (
                    <p className="text-red-500 text-sm">
                      {formErrors.customer_phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.time && (
                    <p className="text-red-500 text-sm">{formErrors.time}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    name="guests"
                    value={formData.guests}
                    onChange={handleInputChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.guests && (
                    <p className="text-red-500 text-sm">{formErrors.guests}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Table Number
                  </label>
                  <input
                    type="number"
                    name="table.table_number"
                    value={formData.table.table_number}
                    onChange={handleInputChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.table_number && (
                    <p className="text-red-500 text-sm">
                      {formErrors.table_number}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Table Capacity
                  </label>
                  <input
                    type="number"
                    name="table.capacity"
                    value={formData.table.capacity}
                    onChange={handleInputChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                  {formErrors.capacity && (
                    <p className="text-red-500 text-sm">
                      {formErrors.capacity}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 mt-6">
                  {modalMode === "add" ? (
                    <button
                      onClick={handleAddReservation}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Confirm Reservation
                    </button>
                  ) : selectedEvent?.resource?.user_id === currentUserId ? (
                    <>
                      <button
                        onClick={handleUpdateReservation}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                      <button
                        onClick={handleDeleteReservation}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : null}
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCalendar;
