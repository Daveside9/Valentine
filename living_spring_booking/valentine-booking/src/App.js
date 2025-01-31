import { Routes, Route } from "react-router-dom"; // ✅ Only import what you need
import Home from "./components/home"; // ✅ Adjust paths based on your project structure
import Reservations from "./components/Reservation";
import Tour from "./components/Tour";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/reservation" element={<Reservations />} />
      <Route path="/tour" element={<Tour />} />
    </Routes>
  );
}

export default App;
