import React from 'react';

export function StatusBadge({ status }) {
  if (!status) return null;
  const s = status.toUpperCase();

  let badgeClass = 'badge-low';
  if (s === 'AVAILABLE') badgeClass = 'badge-available';
  else if (s === 'ASSIGNED' || s === 'BUSY') badgeClass = 'badge-assigned';
  else if (s === 'COMPLETED') badgeClass = 'badge-completed';
  else if (s === 'PENDING') badgeClass = 'badge-pending';
  else if (s === 'CRITICAL' || s === 'CANCELLED' || s === 'OFFLINE') badgeClass = 'badge-critical';

  return <span className={`badge ${badgeClass}`}>{s}</span>;
}
