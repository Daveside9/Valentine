import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import WelcomeNotification from "../components/WelcomeNotification";
import Notification from "../components/Notification";
import "../styles/home.css";

// Set up Socket.IO client globally
const socket = io("http://localhost:5000", {
  withCredentials: true,
});

function Home({ username }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (username) {
      socket.emit("join", { username });

      socket.on("new_message", (data) => {
        // Optional fallback alert if Notification component is not enough
        console.log("📨 New message received:", data.message);
      });
    }

    return () => {
      socket.off("new_message");
    };
  }, [username]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:5000/api/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("username");
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="home-container">
      <nav>
        <Link to="/reservation" className="reservation-btn">
          Reservations
        </Link>
        {username && (
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        )}
      </nav>

      <div className="text-container">
        <h1>Living Spring Loveworld</h1>
        <p>A Valentine to remember!</p>

        {username && (
          <>
            <p
              style={{
                fontWeight: "bold",
                fontSize: "1.2rem",
                marginTop: "10px",
              }}
            >
              Welcome, {username} ❤️
            </p>

            {/* 👇 Global welcome message */}
            <WelcomeNotification username={username} />

            {/* 👇 Real-time targeted message */}
            <Notification username={username} />
          </>
        )}

        <Link to="/tour">
          <button className="tour-btn">Take a Tour</button>
        </Link>
      </div>

      <div className="romantic-story">
        <p>
          In a crowded café, their eyes met, a fleeting glance that felt like
          eternity...
        </p>
      </div>

      <div className="contact-us">
        <button className="contact-btn">
          <a href="tel:08108546368" target="_blank" rel="noopener noreferrer">
            Contact Us on WhatsApp
          </a>
        </button>
        <button className="contact-btn">
          <a
            href="mailto:daveside00468@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us via Email
          </a>
        </button>
      </div>
    </div>
  );
}

export default Home;
