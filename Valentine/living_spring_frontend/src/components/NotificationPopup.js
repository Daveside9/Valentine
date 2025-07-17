import React, { useEffect, useState } from "react";

function NotificationPopup() {
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [read, setRead] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/global-message");
        const data = await res.json();
        const storedTimestamp = localStorage.getItem("last_read");

        if (
          data.message &&
          (!storedTimestamp || new Date(data.timestamp) > new Date(storedTimestamp))
        ) {
          setMessage(data.message);
          setVisible(true);
        }
      } catch (err) {
        console.error("Failed to fetch message", err);
      }
    };

    fetchMessage();
  }, []);

  const handleRead = () => {
    setRead(true);
    setVisible(false);
    localStorage.setItem("last_read", new Date().toISOString());
  };

  if (!visible || read) return null;

  return (
    <div className="popup">
      <p>📩 1 new message</p>
      <button onClick={handleRead}>Open</button>
      {read && <div className="popup-message">{message}</div>}
    </div>
  );
}

export default NotificationPopup;
