import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Siren, Ambulance, ClipboardList, Info, Activity } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Activity size={24} />
        </div>
        <div className="sidebar-logo-text">
          AI Emergency<span>System</span>
        </div>
      </NavLink>

      <ul className="nav-list">
        <li>
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} end>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/emergency" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Siren size={20} />
            Emergency Request
          </NavLink>
        </li>
        <li>
          <NavLink to="/ambulances" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Ambulance size={20} />
            Ambulances Fleet
          </NavLink>
        </li>
        <li>
          <NavLink to="/assignments" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <ClipboardList size={20} />
            Dispatch Assignments
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Info size={20} />
            About / System
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}
