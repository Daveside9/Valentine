import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/home'; // ✅ fixed import
import Reservations from './components/Reservation';
import Tour from './components/Tour';
import NotificationPopup from './components/NotificationPopup';
import AuthPage from './components/AuthPage';

function App() {
  const [userContact, setUserContact] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('whatsapp_contact');
    if (stored) setUserContact(stored);

    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) setUsername(loggedInUser);
  }, []);

  return (
    <div className="App">
      <NotificationPopup />
      <Routes>
        <Route path="/" element={<Home username={username} />} /> {/* ✅ correct usage */}
        <Route path="/reservation" element={<Reservations setUserContact={setUserContact} />} />
        <Route path="/tour" element={<Tour />} />
        <Route path="/auth" element={<AuthPage setUsername={setUsername} />} />
      </Routes>
    </div>
  );
}

export default App;
