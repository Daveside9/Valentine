// src/components/WelcomeMessage.js
import React, { useEffect, useState } from "react";

export default function WelcomeMessage() {
  const [msg, setMsg] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/welcome")
      .then(res => res.json())
      .then(data => {
        if (data.message && data.timestamp) {
          const lastRead = localStorage.getItem("lastReadMessageTimestamp");
          if (lastRead !== data.timestamp) {
            setMsg(data.message);
            setTimestamp(data.timestamp);
            setShowMessage(true);
          }
        }
      })
      .catch((err) => console.error("Failed to fetch message", err));
  }, []);

  const handleMarkAsRead = () => {
    localStorage.setItem("lastReadMessageTimestamp", timestamp);
    setShowMessage(false);
  };

  if (!showMessage || !msg) return null;

  return (
    <div style={{
      background: "#f0f8ff",
      padding: "1rem",
      margin: "1rem 0",
      borderRadius: "8px",
      border: "1px solid #a0c4ff",
      position: "relative"
    }}>
      <strong>📩 New Message from Admin:</strong>
      <p>{msg}</p>
      <button
        onClick={handleMarkAsRead}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "#007bff",
          color: "white",
          border: "none",
          padding: "5px 10px",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Mark as Read
      </button>
    </div>
  );
}
