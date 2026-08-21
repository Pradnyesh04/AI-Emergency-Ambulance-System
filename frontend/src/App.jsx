import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

import { Dashboard } from './pages/Dashboard';
import { EmergencyRequestPage } from './pages/EmergencyRequestPage';
import { AmbulancesPage } from './pages/AmbulancesPage';
import { AssignmentsPage } from './pages/AssignmentsPage';
import { EmergencyDetailsPage } from './pages/EmergencyDetailsPage';
import { AboutPage } from './pages/AboutPage';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar />
          <main className="content-body">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/emergency" element={<EmergencyRequestPage />} />
              <Route path="/emergency/:id" element={<EmergencyDetailsPage />} />
              <Route path="/ambulances" element={<AmbulancesPage />} />
              <Route path="/assignments" element={<AssignmentsPage />} />
              <Route path="/about" element={<AboutPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
