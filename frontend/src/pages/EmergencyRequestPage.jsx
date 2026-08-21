import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Link } from 'react-router-dom';
import { Siren, Send, Zap, CheckCircle2 } from 'lucide-react';

export function EmergencyRequestPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [successResult, setSuccessResult] = useState(null);
  const [dispatchResult, setDispatchResult] = useState(null);

  const [emergencies, setEmergencies] = useState([]);

  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    emergencyType: 'Cardiac Arrest Emergency',
    location: 'FC Road, Shivajinagar, Pune',
    latitude: '18.5204',
    longitude: '73.8567',
  });

  const fetchEmergencies = async () => {
    setFetching(true);
    try {
      const data = await api.getEmergencyRequests();
      setEmergencies(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessResult(null);
    setDispatchResult(null);

    const payload = {
      patientName: formData.patientName,
      phoneNumber: formData.phoneNumber,
      emergencyType: formData.emergencyType,
      location: formData.location,
      latitude: parseFloat(formData.latitude) || 0.0,
      longitude: parseFloat(formData.longitude) || 0.0,
    };

    try {
      const response = await api.createEmergencyRequest(payload);
      setSuccessResult(response);
      fetchEmergencies();
    } catch (err) {
      setError(err.message || 'Failed to submit emergency request.');
    } finally {
      setLoading(false);
    }
  };

  const handleSmartDispatch = async (emergencyId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.smartDispatch(emergencyId);
      setDispatchResult(result);
      fetchEmergencies();
    } catch (err) {
      setError(err.message || 'Smart dispatch failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Emergency Call Registration</h1>
        <p className="page-subtitle">Register new emergency request and trigger AI-assisted smart ambulance dispatch</p>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Success Notification Banner */}
      {successResult && (
        <div className="card" style={{ borderLeft: '4px solid #10b981', marginBottom: '2rem', backgroundColor: 'rgba(16, 185, 129, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                <CheckCircle2 size={22} />
                Emergency Request Logged Successfully!
              </div>
              <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                Request ID: <strong style={{ color: 'white' }}>#{successResult.id}</strong> | Patient: <strong style={{ color: 'white' }}>{successResult.patientName}</strong>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.75rem' }}>
                <span>Status: <StatusBadge status={successResult.status} /></span>
                <span>AI Priority: <PriorityBadge priority={successResult.priority || 'CRITICAL'} /></span>
              </div>
            </div>

            <button
              onClick={() => handleSmartDispatch(successResult.id)}
              className="btn btn-accent"
              disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <Zap size={18} />
              {loading ? 'Dispatching...' : 'Trigger Smart Dispatch'}
            </button>
          </div>
        </div>
      )}

      {/* Dispatch Result Card */}
      {dispatchResult && (
        <div className="card" style={{ borderLeft: '4px solid #06b6d4', marginBottom: '2rem', backgroundColor: 'rgba(6, 182, 212, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
            <Zap size={22} />
            Smart Dispatch Executed!
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem' }}>
            <div><span style={{ color: '#94a3b8' }}>Assignment ID:</span> <strong style={{ color: 'white' }}>#{dispatchResult.assignmentId}</strong></div>
            <div><span style={{ color: '#94a3b8' }}>Ambulance Vehicle:</span> <strong style={{ color: '#38bdf8' }}>{dispatchResult.ambulanceNumber}</strong> ({dispatchResult.ambulanceType})</div>
            <div><span style={{ color: '#94a3b8' }}>Driver:</span> <strong style={{ color: 'white' }}>{dispatchResult.driverName}</strong> ({dispatchResult.driverPhone})</div>
            <div><span style={{ color: '#94a3b8' }}>Est. Distance:</span> <strong style={{ color: '#34d399' }}>{dispatchResult.distanceKm} km</strong></div>
          </div>
        </div>
      )}

      {/* Grid Layout Form & Table */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        {/* Form Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Siren size={20} style={{ color: '#ef4444' }} /> Emergency Details Form
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Patient Name</label>
              <input
                type="text"
                name="patientName"
                className="form-input"
                placeholder="e.g. Ramesh Kumar"
                value={formData.patientName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className="form-input"
                placeholder="e.g. +91 9876543210"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Type / Description</label>
              <select name="emergencyType" className="form-select" value={formData.emergencyType} onChange={handleChange}>
                <option value="Cardiac Arrest Emergency">Cardiac Arrest (Critical)</option>
                <option value="Unconscious Patient at Home">Unconscious Patient (Critical)</option>
                <option value="Severe Accident & Major Trauma">Severe Accident / Trauma (Critical)</option>
                <option value="Severe Bleeding & Fracture">Severe Bleeding & Fracture (High)</option>
                <option value="Breathing Difficulty & Chest Pain">Breathing Difficulty (High)</option>
                <option value="Moderate Fever & Abdominal Pain">Moderate Fever / Pain (Medium)</option>
                <option value="Routine Medical Checkup Transfer">Routine Checkup Transfer (Low)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location Address</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. FC Road, Shivajinagar, Pune"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Latitude (°N)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  className="form-input"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Longitude (°E)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  className="form-input"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              <Send size={18} />
              {loading ? 'Submitting Call...' : 'REQUEST AMBULANCE'}
            </button>
          </form>
        </div>

        {/* Existing Requests Table Card */}
        <div className="card">
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem' }}>
            Registered Emergencies ({emergencies.length})
          </h2>

          <div className="table-container">
            {fetching ? (
              <LoadingSpinner message="Fetching requests..." />
            ) : emergencies.length === 0 ? (
              <p style={{ color: '#94a3b8', padding: '2rem 0', textAlign: 'center' }}>No emergencies registered yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencies.slice().reverse().map((emg) => (
                    <tr key={emg.id}>
                      <td style={{ fontWeight: 700 }}>#{emg.id}</td>
                      <td>{emg.patientName}</td>
                      <td><PriorityBadge priority={emg.priority || 'MEDIUM'} /></td>
                      <td><StatusBadge status={emg.status} /></td>
                      <td>
                        <Link to={`/emergency/${emg.id}`} className="btn btn-secondary btn-sm" style={{ fontSize: '0.75rem' }}>
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
