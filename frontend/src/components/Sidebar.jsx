import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Ticket, 
  Layers, 
  Users, 
  Sliders, 
  LogOut, 
  Activity,
  ShieldCheck
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="brand-logo-icon">Q</div>
        <div className="brand-text">
          <h1>BankQ</h1>
          <p>Digital Queue System</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {user.role === 'CUSTOMER' && (
          <>
            <NavLink 
              to="/customer/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink 
              to="/request-token" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <PlusCircle size={18} />
              <span>Request Token</span>
            </NavLink>
            <NavLink 
              to="/my-tokens" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Ticket size={18} />
              <span>My Tokens</span>
            </NavLink>
          </>
        )}

        {(user.role === 'STAFF' || user.role === 'ADMIN') && (
          <>
            <NavLink 
              to="/staff/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <LayoutDashboard size={18} />
              <span>Staff Overview</span>
            </NavLink>
            <NavLink 
              to="/staff/queue" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <Layers size={18} />
              <span>Counter Desk</span>
            </NavLink>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <div style={{ padding: '0.75rem 1rem 0.25rem', fontSize: '0.7rem', textTransform: 'uppercase', color: '#64748b', fontWeight: 700 }}>
              Administration
            </div>
            <NavLink 
              to="/admin/dashboard" 
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={onClose}
            >
              <ShieldCheck size={18} />
              <span>Admin Center</span>
            </NavLink>
          </>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="user-snippet">
          <div className="avatar">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="user-info">
            <span className="user-name">{user.name}</span>
            <span className="user-role-badge">{user.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Log Out">
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
