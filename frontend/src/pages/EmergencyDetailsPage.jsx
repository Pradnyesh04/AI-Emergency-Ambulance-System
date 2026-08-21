import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ArrowLeft, Siren, Zap, MapPin, User, Phone, Ambulance as AmbulanceIcon } from 'lucide-react';

export function EmergencyDetailsPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const emgData = await api.getEmergencyRequestById(id);
      setEmergency(emgData);

      const allAssignments = await api.getAssignments().catch(() => []);
      const matched = Array.isArray(allAssignments)
        ? allAssignments.find((a) => String(a.emergencyRequestId) === String(id))
        : null;
      setAssignment(matched);
    } catch (err) {
      setError(err.message || `Emergency Request #${id} not found.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSmartDispatch = async () => {
    setDispatchLoading(true);
    setError(null);
    try {
      const result = await api.smartDispatch(id);
      setDispatchResult(result);
      fetchDetails();
    } catch (err) {
      setError(err.message || 'Smart dispatch failed.');
    } finally {
      setDispatchLoading(false);
    }
  };

  if (loading) return <LoadingSpinner message={`Fetching Emergency Call #${id}...`} />;
  if (error && !emergency) return <ErrorAlert message={error} />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <Link to="/emergency" className="btn btn-secondary btn-sm" style={{ marginBottom: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ArrowLeft size={14} /> Back to Requests
          </Link>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Siren style={{ color: '#ef4444' }} /> Emergency Call #{id}
          </h1>
        </div>

        <button onClick={handleSmartDispatch} className="btn btn-accent" disabled={dispatchLoading}>
          <Zap size={18} />
          {dispatchLoading ? 'Dispatching...' : 'Trigger Smart Dispatch'}
        </button>
      </div>

      {error && <ErrorAlert message={error} />}

      {dispatchResult && (
        <div className="card" style={{ marginBottom: '1.5rem', borderLeft: '4px solid #06b6d4', backgroundColor: 'rgba(6, 182, 212, 0.1)' }}>
          <div style={{ fontWeight: 700, color: '#38bdf8', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
            ✓ Dispatch Processed Successfully
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
            Ambulance <strong>{dispatchResult.ambulanceNumber}</strong> assigned ({dispatchResult.distanceKm} km away).
          </p>
        </div>
      )}

      {emergency && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {/* Patient & Incident Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              Patient & Emergency Incident Info
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <User size={18} style={{ color: '#06b6d4' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Patient Name</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{emergency.patientName || 'Anonymous'}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Phone size={18} style={{ color: '#06b6d4' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Contact Number</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{emergency.phoneNumber}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Siren size={18} style={{ color: '#ef4444' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Emergency Condition</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#f87171' }}>{emergency.emergencyType}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <MapPin size={18} style={{ color: '#10b981' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Incident Location & GPS</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'white' }}>{emergency.location}</div>
                  <div style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#38bdf8' }}>
                    ({emergency.latitude}, {emergency.longitude})
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Priority Level</div>
                  <PriorityBadge priority={emergency.priority || 'MEDIUM'} />
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Request Status</div>
                  <StatusBadge status={emergency.status} />
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Ambulance Card */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AmbulanceIcon style={{ color: '#38bdf8' }} /> Assigned Dispatch Vehicle
            </h2>

            {assignment ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assignment ID</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>#{assignment.id}</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Vehicle Number</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
                    {assignment.ambulance?.ambulanceNumber || `Ambulance #${assignment.ambulanceId}`}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                    {assignment.ambulance?.ambulanceType}
                  </div>
                </div>

                {assignment.ambulance && (
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Assigned Driver</div>
                    <div style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{assignment.ambulance.driverName}</div>
                    <div style={{ fontSize: '0.85rem', color: '#10b981' }}>{assignment.ambulance.driverPhone}</div>
                  </div>
                )}

                <div style={{ paddingTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.25rem' }}>Dispatch Status</div>
                  <StatusBadge status={assignment.status} />
                </div>
              </div>
            ) : (
              <div style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8' }}>
                <AmbulanceIcon size={40} style={{ opacity: 0.3, marginBottom: '0.75rem' }} />
                <p>No ambulance assigned to this emergency request yet.</p>
                <button onClick={handleSmartDispatch} className="btn btn-accent btn-sm" style={{ marginTop: '1rem' }} disabled={dispatchLoading}>
                  <Zap size={14} /> Dispatch Nearest Ambulance
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
