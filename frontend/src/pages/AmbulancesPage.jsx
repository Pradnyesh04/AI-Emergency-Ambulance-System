import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { StatusBadge } from '../components/StatusBadge';
import { Plus, Search, Navigation } from 'lucide-react';

export function AmbulancesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAmbulance, setNewAmbulance] = useState({
    ambulanceNumber: '',
    driverName: '',
    driverPhone: '',
    ambulanceType: 'ICU / ALS',
    status: 'AVAILABLE',
    latitude: '18.5204',
    longitude: '73.8567',
  });

  const [showNearestModal, setShowNearestModal] = useState(false);
  const [searchCoords, setSearchCoords] = useState({ latitude: '18.5204', longitude: '73.8567' });
  const [nearestResult, setNearestResult] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const fetchAmbulances = async () => {
    setLoading(true);
    try {
      const data = await api.getAmbulances();
      setAmbulances(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmbulances();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...newAmbulance,
        latitude: parseFloat(newAmbulance.latitude) || 0.0,
        longitude: parseFloat(newAmbulance.longitude) || 0.0,
      };
      await api.createAmbulance(payload);
      setShowAddForm(false);
      setNewAmbulance({
        ambulanceNumber: '',
        driverName: '',
        driverPhone: '',
        ambulanceType: 'ICU / ALS',
        status: 'AVAILABLE',
        latitude: '18.5204',
        longitude: '73.8567',
      });
      fetchAmbulances();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFindNearest = async (e) => {
    e.preventDefault();
    setSearchLoading(true);
    setNearestResult(null);
    setError(null);
    try {
      const result = await api.getNearestAmbulance(searchCoords.latitude, searchCoords.longitude);
      setNearestResult(result);
    } catch (err) {
      setError(err.message || 'No available ambulance found near these coordinates.');
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Ambulance Fleet Management</h1>
          <p className="page-subtitle">Real-time status monitoring, GPS coordinates, and vehicle fleet configuration</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setShowNearestModal(!showNearestModal)} className="btn btn-accent">
            <Search size={16} /> Find Nearest Available
          </button>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            <Plus size={16} /> Add Vehicle
          </button>
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      {/* Find Nearest Modal / Card */}
      {showNearestModal && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #06b6d4', backgroundColor: '#0f172a' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={18} style={{ color: '#06b6d4' }} /> Search Nearest Available Vehicle (Haversine Distance)
          </h3>
          <form onSubmit={handleFindNearest} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label className="form-label">Target Latitude (°N)</label>
              <input type="number" step="any" className="form-input" value={searchCoords.latitude} onChange={(e) => setSearchCoords({ ...searchCoords, latitude: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Target Longitude (°E)</label>
              <input type="number" step="any" className="form-input" value={searchCoords.longitude} onChange={(e) => setSearchCoords({ ...searchCoords, longitude: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-accent" disabled={searchLoading}>
              {searchLoading ? 'Searching...' : 'Locate Nearest'}
            </button>
          </form>

          {nearestResult && (
            <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'rgba(6, 182, 212, 0.1)', borderRadius: '8px', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>✓ Nearest Available Ambulance Found</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', fontSize: '0.9rem' }}>
                <div><span style={{ color: '#94a3b8' }}>Vehicle #:</span> <strong style={{ color: 'white' }}>{nearestResult.ambulanceNumber}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Type:</span> <strong style={{ color: 'white' }}>{nearestResult.ambulanceType}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Driver:</span> <strong style={{ color: 'white' }}>{nearestResult.driverName}</strong></div>
                <div><span style={{ color: '#94a3b8' }}>Phone:</span> <strong style={{ color: 'white' }}>{nearestResult.driverPhone}</strong></div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add Ambulance Form Card */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>Register New Ambulance Vehicle</h3>
          <form onSubmit={handleAddSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Ambulance Number</label>
              <input type="text" className="form-input" placeholder="e.g. MH-12-AB-9999" value={newAmbulance.ambulanceNumber} onChange={(e) => setNewAmbulance({ ...newAmbulance, ambulanceNumber: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Driver Name</label>
              <input type="text" className="form-input" placeholder="e.g. Rajesh Patil" value={newAmbulance.driverName} onChange={(e) => setNewAmbulance({ ...newAmbulance, driverName: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Driver Phone</label>
              <input type="tel" className="form-input" placeholder="e.g. +91 9800000000" value={newAmbulance.driverPhone} onChange={(e) => setNewAmbulance({ ...newAmbulance, driverPhone: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Ambulance Type</label>
              <select className="form-select" value={newAmbulance.ambulanceType} onChange={(e) => setNewAmbulance({ ...newAmbulance, ambulanceType: e.target.value })}>
                <option value="ICU / ALS">ICU / ALS (Advanced Life Support)</option>
                <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                <option value="Patient Transport Vehicle (PTV)">Patient Transport Vehicle (PTV)</option>
              </select>
            </div>
            <div>
              <label className="form-label">Latitude (°N)</label>
              <input type="number" step="any" className="form-input" value={newAmbulance.latitude} onChange={(e) => setNewAmbulance({ ...newAmbulance, latitude: e.target.value })} required />
            </div>
            <div>
              <label className="form-label">Longitude (°E)</label>
              <input type="number" step="any" className="form-input" value={newAmbulance.longitude} onChange={(e) => setNewAmbulance({ ...newAmbulance, longitude: e.target.value })} required />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Save Ambulance</button>
            </div>
          </form>
        </div>
      )}

      {/* Fleet Table Card */}
      <div className="card">
        {loading ? (
          <LoadingSpinner message="Fetching fleet database..." />
        ) : ambulances.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2rem 0' }}>No ambulances configured in the system.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Vehicle Number</th>
                  <th>Ambulance Type</th>
                  <th>Driver Name</th>
                  <th>Driver Phone</th>
                  <th>Location (Lat, Lon)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {ambulances.map((amb) => (
                  <tr key={amb.id}>
                    <td style={{ fontWeight: 600 }}>#{amb.id}</td>
                    <td style={{ fontWeight: 700, color: '#38bdf8' }}>{amb.ambulanceNumber}</td>
                    <td>{amb.ambulanceType}</td>
                    <td>{amb.driverName}</td>
                    <td style={{ color: '#cbd5e1' }}>{amb.driverPhone}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#94a3b8' }}>
                      {amb.latitude?.toFixed(4)}, {amb.longitude?.toFixed(4)}
                    </td>
                    <td><StatusBadge status={amb.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
