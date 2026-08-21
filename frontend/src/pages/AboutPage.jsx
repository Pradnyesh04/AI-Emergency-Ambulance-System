import React from 'react';
import { Zap, Navigation, Server, Cpu } from 'lucide-react';

export function AboutPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">AI Emergency Ambulance System</h1>
        <p className="page-subtitle">Intelligent emergency triage, spatial Haversine dispatch, and fleet management platform</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#ef4444' }}>
            <Zap size={24} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Faster Response Time</h2>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Automates the immediate triage and allocation of available ambulances based on geographic proximity, reducing critical dispatch delays during life-threatening medical emergencies.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#06b6d4' }}>
            <Navigation size={24} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Smart Spatial Dispatch</h2>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Utilizes spherical Haversine distance calculations to locate the exact nearest available vehicle across latitude and longitude coordinates.
          </p>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#10b981' }}>
            <Cpu size={24} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>AI Priority Triage</h2>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Rule-based intelligence engine classifies incoming emergency descriptions into CRITICAL, HIGH, MEDIUM, or LOW severity, giving preference to Advanced Life Support (ALS) ambulances for severe cases.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Server size={20} style={{ color: '#8b5cf6' }} /> System Architecture & Technology Stack
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Backend Framework</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.25rem' }}>Spring Boot 4 & Java 25</div>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.25rem' }}>PostgreSQL & Spring Data JPA</div>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Frontend SPA</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.25rem' }}>React, Vite, React Router</div>
          </div>

          <div style={{ backgroundColor: '#0f172a', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Future ML Roadmap</div>
            <div style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginTop: '0.25rem' }}>Predictive Demand Triage Models</div>
          </div>
        </div>
      </div>
    </div>
  );
}
