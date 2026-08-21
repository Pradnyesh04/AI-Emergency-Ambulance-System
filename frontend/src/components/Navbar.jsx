import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

export function Navbar() {
  const [healthStatus, setHealthStatus] = useState('Checking...');
  const [isHealthy, setIsHealthy] = useState(false);

  useEffect(() => {
    api.getHealth()
      .then((data) => {
        setHealthStatus(typeof data === 'string' ? data : 'Backend Online');
        setIsHealthy(true);
      })
      .catch(() => {
        setHealthStatus('Backend Offline');
        setIsHealthy(false);
      });
  }, []);

  return (
    <header className="top-navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>
          Emergency Operations Control Center
        </h3>
      </div>
      <div className="system-status-indicator" style={{
        backgroundColor: isHealthy ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
        borderColor: isHealthy ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
        color: isHealthy ? '#34d399' : '#f87171'
      }}>
        {isHealthy ? <ShieldCheck size={16} /> : <AlertTriangle size={16} />}
        <span>{healthStatus}</span>
      </div>
    </header>
  );
}
