import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorAlert({ message, onRetry }) {
  return (
    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#f87171' }}>
        <AlertCircle size={20} />
        <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{message || 'Failed to communicate with backend server.'}</span>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
}
