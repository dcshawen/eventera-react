import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import PurchaseTicket from './pages/PurchaseTicket';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="event/:id" element={<EventDetails />} />
          <Route path="purchase/:eventId" element={<PurchaseTicket />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
