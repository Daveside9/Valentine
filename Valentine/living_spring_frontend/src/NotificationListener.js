// src/components/NotificationListener.js
import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Use your backend URL

function NotificationListener() {
  useEffect(() => {
    const contact = localStorage.getItem("whatsapp_contact");

    if (contact) {
      socket.emit("register", contact); // 👉 tell backend who you are
      console.log("📲 Registered contact:", contact);
    }

    socket.on("direct_notification", (data) => {
      alert(`🔔 ${data.message}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}

export default NotificationListener;
