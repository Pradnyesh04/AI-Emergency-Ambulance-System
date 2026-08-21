import React from 'react';

export function PriorityBadge({ priority }) {
  if (!priority) return null;
  const p = priority.toUpperCase();

  let badgeClass = 'badge-low';
  if (p === 'CRITICAL') badgeClass = 'badge-critical';
  else if (p === 'HIGH') badgeClass = 'badge-high';
  else if (p === 'MEDIUM') badgeClass = 'badge-medium';

  return <span className={`badge ${badgeClass}`}>{p}</span>;
}
