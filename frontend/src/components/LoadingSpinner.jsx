import React from 'react';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: '#94a3b8' }}>
      <Loader2 size={36} style={{ color: '#ef4444', marginBottom: '1rem' }} />
      <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>{message}</p>
    </div>
  );
}
