import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reservation.css";

function ReservationForm({ setUserContact }) {
  const [reservationType, setReservationType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    whatsapp_contact: "",
    kaduna_location: "",
  });

  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleTypeChange = (e) => {
    setReservationType(e.target.value);
    setFormData({ name: "", whatsapp_contact: "", kaduna_location: "" }); // Reset form
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      reservationType,
    };

    setResponseMessage("Loading...");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseMessage(data.message);

        // ✅ Save user contact to localStorage
        localStorage.setItem("whatsapp_contact", formData.whatsapp_contact);

        // ✅ Notify App component of user's contact
        if (setUserContact) {
          setUserContact(formData.whatsapp_contact);
        }
      } else {
        setResponseMessage(data.message || "Reservation failed");
      }
    } catch (error) {
      console.error("Error sending data:", error);
      setResponseMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="reservation-form">
      {/* ✅ Back to Home Button */}
      <button onClick={() => navigate("/")} className="back-button">
        ⬅️ Back to Home
      </button>

      <label>
        Select Reservation Type:
        <select value={reservationType} onChange={handleTypeChange}>
          <option value="">-- Select --</option>
          <option value="Wedding proposal">Wedding proposal</option>
          <option value="Couples Night Out">Couples Night Out</option>
        </select>
      </label>

      {reservationType && (
        <div className="package-details">
          {reservationType === "Wedding proposal" ? (
            <>
              <h3>Engagement Package - 78,000 Naira</h3>
              <ul>
                <li>Decorated space</li>
                <li>Live acoustic guitar player</li>
                <li>Basket of meal (Appetizer, Meal, Dessert)</li>
                <li>Reserved space</li>
                <li>Gift for the lady</li>
                <li>String of red roses</li>
              </ul>
            </>
          ) : (
            <>
              <h3>Couples Night Out</h3>
              <ul>
                <li>Delicious meal (Appetizer, Main Course, Dessert)</li>
                <li>Beautiful picnic ground</li>
                <li>Background music</li>
                <li>Gift for the lady</li>
                <li>String of roses</li>
              </ul>
            </>
          )}

          <form onSubmit={handleSubmit}>
            <label>
              Your Name:
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              WhatsApp Contact:
              <input
                type="text"
                name="whatsapp_contact"
                value={formData.whatsapp_contact}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Kaduna Location:
              <input
                type="text"
                name="kaduna_location"
                value={formData.kaduna_location}
                onChange={handleInputChange}
                required
              />
            </label>

            <button type="submit">Book {reservationType}</button>
          </form>
        </div>
      )}

      {/* Display the response message */}
      <div className="response-message">
        {responseMessage && <p>{responseMessage}</p>}
      </div>
    </div>
  );
}

export default ReservationForm;
