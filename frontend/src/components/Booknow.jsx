import { useEffect, useState } from "react";

import axios from "axios";

function ReservationCalendar() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date()); // Initialize the selected date state

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/reservations");
      setData(res.data); // Assuming res.data is the list of reservations
    };
    fetchData();
  }, []);

  console.log(data);

  return (
    <>
      <h1>Hello to Reservation</h1>
    </>
  );
}

export default ReservationCalendar;
