import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Link } from 'react-router-dom';
import { Ambulance, Siren, Activity, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [ambulances, setAmbulances] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [assignments, setAssignments] = useState([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ambData, emgData, asgData] = await Promise.all([
        api.getAmbulances().catch(() => []),
        api.getEmergencyRequests().catch(() => []),
        api.getAssignments().catch(() => []),
      ]);
      setAmbulances(Array.isArray(ambData) ? ambData : []);
      setEmergencies(Array.isArray(emgData) ? emgData : []);
      setAssignments(Array.isArray(asgData) ? asgData : []);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Gathering emergency metrics..." />;

  // Calculate statistics
  const totalAmbulances = ambulances.length;
  const availableAmbulances = ambulances.filter(a => (a.status || '').toUpperCase() === 'AVAILABLE').length;
  const busyAmbulances = ambulances.filter(a => ['ASSIGNED', 'BUSY'].includes((a.status || '').toUpperCase())).length;

  const totalEmergencies = emergencies.length;
  const criticalEmergencies = emergencies.filter(e => (e.priority || '').toUpperCase() === 'CRITICAL').length;
  const highEmergencies = emergencies.filter(e => (e.priority || '').toUpperCase() === 'HIGH').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Real-Time Control Dashboard</h1>
        <p className="page-subtitle">Live fleet tracking, AI priority evaluation, and automated dispatch operations</p>
      </div>

      {error && <ErrorAlert message={error} onRetry={fetchData} />}

      {/* Stats Grid */}
      <div className="grid-stats">
        <div className="stat-card">
          <div>
            <div className="stat-value">{totalAmbulances}</div>
            <div className="stat-label">Total Ambulance Fleet</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}>
            <Ambulance size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#34d399' }}>{availableAmbulances}</div>
            <div className="stat-label">Available Ambulances</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>{busyAmbulances}</div>
            <div className="stat-label">Assigned / Busy</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Activity size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value">{totalEmergencies}</div>
            <div className="stat-label">Total Emergency Calls</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}>
            <Siren size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#f87171' }}>{criticalEmergencies}</div>
            <div className="stat-label">Critical Emergencies</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
            <AlertTriangle size={24} />
          </div>
        </div>

        <div className="stat-card">
          <div>
            <div className="stat-value" style={{ color: '#fbbf24' }}>{highEmergencies}</div>
            <div className="stat-label">High Priority</div>
          </div>
          <div className="stat-icon" style={{ backgroundColor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}>
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Emergencies Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Recent Emergency Calls</h2>
            <Link to="/emergency" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              New Call <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-container">
            {emergencies.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No emergency calls registered yet.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Patient</th>
                    <th>Emergency Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {emergencies.slice(-5).reverse().map((emg) => (
                    <tr key={emg.id}>
                      <td style={{ fontWeight: 600 }}>#{emg.id}</td>
                      <td>{emg.patientName || 'Anonymous'}</td>
                      <td style={{ color: '#cbd5e1' }}>{emg.emergencyType}</td>
                      <td><PriorityBadge priority={emg.priority || 'MEDIUM'} /></td>
                      <td><StatusBadge status={emg.status} /></td>
                      <td>
                        <Link to={`/emergency/${emg.id}`} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
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

        {/* Fleet Overview Card */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Ambulance Fleet Status</h2>
            <Link to="/ambulances" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              Manage Fleet <ArrowRight size={14} />
            </Link>
          </div>

          <div className="table-container">
            {ambulances.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>No ambulances in fleet system.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Vehicle #</th>
                    <th>Type</th>
                    <th>Driver</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {ambulances.slice(0, 5).map((amb) => (
                    <tr key={amb.id}>
                      <td style={{ fontWeight: 700, color: '#38bdf8' }}>{amb.ambulanceNumber}</td>
                      <td>{amb.ambulanceType}</td>
                      <td>{amb.driverName}</td>
                      <td><StatusBadge status={amb.status} /></td>
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
