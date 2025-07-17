import React, { useState } from 'react';
import './StarRating.css'; // Import the CSS file for styling

const StarRating = () => {
  const [rating, setRating] = useState(0); // State to store the current rating
  const [hovered, setHovered] = useState(0); // State to store the hovered star

  // Handle click on star to set the rating
  const handleClick = (value) => {
    setRating(value);
  };

  // Handle mouse hover to change the hovered star
  const handleMouseEnter = (value) => {
    setHovered(value);
  };

  const handleMouseLeave = () => {
    setHovered(0);
  };

  return (
    <div className="star-rating-container">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= (hovered || rating) ? 'filled' : ''}`}
          onClick={() => handleClick(star)} // Handle star click
          onMouseEnter={() => handleMouseEnter(star)} // Handle mouse enter
          onMouseLeave={handleMouseLeave} // Handle mouse leave
        >
          ★
        </span>
      ))}
      <p>Rating: {rating} / 5</p> {/* Display the rating */}
    </div>
  );
};

export default StarRating;
