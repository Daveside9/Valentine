import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import "../styles/tour.css"; // Your custom styles

function Tour() {
  return (
    <div className="tour-container">
      <h1>Welcome to the Valentine's Day gift packs!</h1>

      {/* Your Google Form embedded here */}
      <section className="tour-content">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfWA9C17DjdeYqppQuYgivL3B3R0eFdHgsdXFdPLb8n6hH5pA/viewform?embedded=true"
          width="200"
          height="1116"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          title="Valentine's Day Gift Packs Form"
        >
          Loading…
        </iframe>
      </section>

      {/* Home button to navigate back to the homepage */}
      <div className="home-button-container">
        <Link to="/" className="home-button">
          Go Home
        </Link>
      </div>
    </div>
  );
}

export default Tour;
