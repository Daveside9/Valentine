// src/components/Notification.js
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5000", { withCredentials: true });

const Notification = ({ username }) => {
  const [message, setMessage] = useState(null);
  const [timestamp, setTimestamp] = useState(null);

  useEffect(() => {
    // Fetch latest unread message on load
    fetch("http://localhost:5000/api/user-message", {
      method: "GET",
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (data.message) {
          setMessage(data.message);
          setTimestamp(data.timestamp);
        }
      });

    // Listen for real-time messages
    socket.on("private_message", (data) => {
      if (data.username === username) {
        setMessage(data.message);
        setTimestamp(new Date().toISOString());
      }
    });

    return () => socket.off("private_message");
  }, [username]);

  if (!message) return null;

  return (
    <div style={{ background: "#ffe0e0", padding: "1rem", borderRadius: "8px", margin: "1rem" }}>
      <h4>📩 New Message</h4>
      <p>{message}</p>
      {timestamp && <small>Received: {new Date(timestamp).toLocaleString()}</small>}
    </div>
  );
};

export default Notification;
