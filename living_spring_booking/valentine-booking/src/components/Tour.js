import React from "react";
import "../styles/tour.css"; // Your custom styles

function Tour() {
  return (
    <div className="tour-container">
      <h1>Welcome to the Valentine's Day gift packs!</h1>
      <p></p>

<section className="tour-content">
<h2></h2>
<p>
family pack for 12k.
</p>
{/* First Image */}
<img
src="https://i.imgur.com/tEmkOkV.jpeg"
alt="Picnic Spot 1"
className="tour-image"
/>

        <h2>Picnic Packages</h2>
        <p>
          Choose from our various picnic packages, ranging from intimate, cozy
          setups to grand, luxurious experiences. Each package is designed to
          cater to your unique preferences.
        </p>
        {/* Second Image */}
        <img
          src="https://i.imgur.com/MBqtybu.jpeg"
          alt="Picnic Package"
          className="tour-image"
        />

        <h2>Customization Options</h2>
        <p>
          Personalize your picnic with thoughtful touches like custom floral
          arrangements, gourmet meals, and special keepsakes to remember your
          special day.
        </p>
        {/* Third Image */}
        <img
          src="https://i.imgur.com/eLc3cHR.jpeg"
          alt="Customized Picnic"
          className="tour-image"
        />

        <h2>Special Event Packages</h2>
        <p>
          Celebrate a special occasion with one of our exclusive event packages,
          designed to make your day unforgettable.
        </p>
        {/* Fourth Image */}
        <img
          src="https://i.imgur.com/EwRVVOh.jpeg"
          alt="Event Package"
          className="tour-image"
        />
      </section>
    </div>
  );
}

export default Tour;
