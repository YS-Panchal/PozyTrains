import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PackageBooking from './User/Components/PackageBooking';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/PackageBooking" element={<PackageBooking />} />
        <Route path="/PackageBooking/:id" element={<PackageBooking />} />
      </Routes>
    </Router>
  );
}

export default App; 