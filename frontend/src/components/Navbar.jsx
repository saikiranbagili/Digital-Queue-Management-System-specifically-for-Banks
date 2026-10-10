import React from 'react';
import { Menu, RefreshCw, Radio } from 'lucide-react';

const Navbar = ({ title, onMenuToggle, onRefresh, refreshing }) => {
  return (
    <header className="top-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="mobile-menu-btn" onClick={onMenuToggle} aria-label="Toggle navigation">
          <Menu size={22} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="top-actions">
        <div className="system-status-indicator" title="Connected to BankQ REST API">
          <div className="pulse-dot" />
          <span>System Online</span>
        </div>

        {onRefresh && (
          <button
            className="btn-outline"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
            onClick={onRefresh}
            disabled={refreshing}
            title="Refresh current data"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Updating...' : 'Sync'}</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
