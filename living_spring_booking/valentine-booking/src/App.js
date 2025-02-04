import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import necessary routing components
import Home from './components/home'; // Ensure these component paths are correct
import Reservations from './components/Reservation';
import Tour from './components/Tour';

function App() {
  return (
    <div className="App">
      {/* Define Routes for navigation */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Home Page */}
        <Route path="/reservation" element={<Reservations />} /> {/* Reservation Page */}
        <Route path="/tour" element={<Tour />} /> {/* Tour Page */}
      </Routes>
    </div>
  );
}

export default App;
