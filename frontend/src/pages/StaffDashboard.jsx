import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { staffApi } from '../services/api';
import StatCard from '../components/StatCard';
import { Clock, Bell, CheckCircle2, Layers, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const StaffDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setError('');
      const res = await staffApi.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load staff dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>Staff Control Center</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Live overview of branch traffic, queue lengths, and active counter service.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-outline" onClick={fetchDashboard}>
            <RefreshCw size={16} />
            <span>Sync Stats</span>
          </button>
          <Link to="/staff/queue" className="btn-primary">
            <Layers size={18} />
            <span>Open Counter Desk</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="stats-grid">
        <StatCard
          title="Waiting Tokens"
          value={dashboard?.waitingCount ?? 0}
          subtitle="Awaiting call at counter"
          icon={Clock}
          colorTheme="amber"
        />
        <StatCard
          title="Currently Called"
          value={dashboard?.calledCount ?? 0}
          subtitle="Now serving at desks"
          icon={Bell}
          colorTheme="teal"
        />
        <StatCard
          title="Completed Today"
          value={dashboard?.completedTodayCount ?? 0}
          subtitle="Served successfully today"
          icon={CheckCircle2}
          colorTheme="emerald"
        />
        <StatCard
          title="Active Services"
          value={dashboard?.countsByService ? Object.keys(dashboard.countsByService).length : 0}
          subtitle="Configured counters"
          icon={Layers}
          colorTheme="navy"
        />
      </div>

      {/* Current Active Serving Card */}
      {dashboard?.currentlyServingToken && (
        <div className="active-token-hero" style={{ marginBottom: '2rem' }}>
          <div className="token-hero-header">
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                Counter Now Serving
              </span>
              <div className="token-badge-large">{dashboard.currentlyServingToken.tokenNumber}</div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {dashboard.currentlyServingToken.serviceName}
              </h2>
            </div>
            <div>
              <span className="badge badge-called">In Service</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
              Customer: <strong>{dashboard.currentlyServingToken.customerName}</strong> ({dashboard.currentlyServingToken.customerEmail})
            </div>
            <Link to="/staff/queue" className="btn-primary">
              Manage at Counter Desk <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* Service Breakdown Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>Queue Distribution by Banking Service</h3>
        </div>
        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Banking Service</th>
                <th>Waiting In Queue</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard?.countsByService &&
                Object.entries(dashboard.countsByService).map(([srvName, count]) => (
                  <tr key={srvName}>
                    <td>
                      <strong>{srvName}</strong>
                    </td>
                    <td>
                      <span style={{ fontWeight: 800, fontSize: '1rem', color: count > 0 ? '#d97706' : '#64748b' }}>
                        {count} tokens
                      </span>
                    </td>
                    <td>
                      {count > 0 ? (
                        <span className="badge badge-waiting">Active Queue</span>
                      ) : (
                        <span className="badge badge-completed">Queue Clear</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={`/staff/queue?service=${encodeURIComponent(srvName)}`}
                        className="btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Operate Desk <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;
