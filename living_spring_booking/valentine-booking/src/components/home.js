import React from "react";
import { Link } from "react-router-dom";
import "../styles/home.css"; // Use home-specific styles

function Home() {
  return (
    <div className="home-container">
      <nav>
        <Link to="/reservation" className="reservation-btn">Reservations</Link>
      </nav>

      {/* Text container positioned at the top */}
      <div className="text-container">
        <h1>Living Spring Loveworld</h1>
        <p>A Valentine to remember!</p>
        
        {/* ✅ Take a Tour Button that navigates to Tour Page */}
        <Link to="/tour">
          <button className="tour-btn">Take a Tour</button>
        </Link>
      </div>

      {/* Romantic Story Added to the lower right corner */}
      <div className="romantic-story">
        <p>
          In a crowded café, their eyes met, a fleeting glance that felt like eternity...
        </p>
      </div>

      {/* Contact Us Buttons */}
      <div className="contact-us">
        <button className="contact-btn">
          <a href="tel:08108546368" target="_blank" rel="noopener noreferrer">
            Contact Us on WhatsApp
          </a>
        </button>
        <button className="contact-btn">
          <a href="mailto:daveside00468@gmail.com" target="_blank" rel="noopener noreferrer">
            Contact Us via Email
          </a>
        </button>
      </div>
    </div>
  );
}

export default Home;

