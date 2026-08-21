import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';
import { StatusBadge } from '../components/StatusBadge';
import { Link } from 'react-router-dom';
import { Filter } from 'lucide-react';

export function AssignmentsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const data = await api.getAssignments();
      setAssignments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    setError(null);
    try {
      await api.updateAssignmentStatus(id, newStatus);
      fetchAssignments();
    } catch (err) {
      setError(err.message || 'Failed to update assignment status.');
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (filterStatus === 'ALL') return true;
    return (a.status || '').toUpperCase() === filterStatus;
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Dispatch Assignments Log</h1>
          <p className="page-subtitle">Track active emergency dispatch assignments, status timeline, and vehicle allocation</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <Filter size={16} style={{ color: '#94a3b8' }} />
          {['ALL', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`btn btn-sm ${filterStatus === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem' }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorAlert message={error} />}

      <div className="card">
        {loading ? (
          <LoadingSpinner message="Loading dispatch records..." />
        ) : filteredAssignments.length === 0 ? (
          <p style={{ color: '#94a3b8', textAlign: 'center', padding: '2.5rem 0' }}>No dispatch assignments found matching filter.</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Assignment ID</th>
                  <th>Emergency Request</th>
                  <th>Assigned Ambulance</th>
                  <th>Status</th>
                  <th>Assigned At</th>
                  <th>Completed At</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.slice().reverse().map((asg) => (
                  <tr key={asg.id}>
                    <td style={{ fontWeight: 700 }}>#{asg.id}</td>
                    <td>
                      <Link to={`/emergency/${asg.emergencyRequestId}`} style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
                        Emergency Call #{asg.emergencyRequestId}
                      </Link>
                    </td>
                    <td>
                      {asg.ambulance ? (
                        <div>
                          <div style={{ fontWeight: 600, color: 'white' }}>{asg.ambulance.ambulanceNumber}</div>
                          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{asg.ambulance.driverName} ({asg.ambulance.driverPhone})</div>
                        </div>
                      ) : (
                        <span style={{ color: '#cbd5e1' }}>Ambulance #{asg.ambulanceId}</span>
                      )}
                    </td>
                    <td><StatusBadge status={asg.status} /></td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {asg.assignedAt ? new Date(asg.assignedAt).toLocaleString() : 'N/A'}
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      {asg.completedAt ? new Date(asg.completedAt).toLocaleString() : '—'}
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={asg.status || 'ASSIGNED'}
                        onChange={(e) => handleStatusUpdate(asg.id, e.target.value)}
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                      >
                        <option value="ASSIGNED">ASSIGNED</option>
                        <option value="IN_PROGRESS">IN_PROGRESS</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
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
