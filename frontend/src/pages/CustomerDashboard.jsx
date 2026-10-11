import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { customerApi } from '../services/api';
import TokenCard from '../components/TokenCard';
import StatCard from '../components/StatCard';
import { Ticket, Clock, MapPin, Users, PlusCircle, AlertCircle, Building2, CreditCard } from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = async () => {
    try {
      setError('');
      const res = await customerApi.getDashboard();
      setDashboard(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load customer dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Loading your queue dashboard...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>
            {dashboard?.welcomeMessage || 'Customer Dashboard'}
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
            {user?.bankName && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                <Building2 size={13} />
                {user.bankName}
              </span>
            )}
            {user?.branch && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', background: '#f3e8ff', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                <MapPin size={13} />
                {user.branch} Branch
              </span>
            )}
            {user?.accountNumber ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 700, color: '#059669', background: '#dcfce7', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                <CreditCard size={13} />
                A/C: {user.accountNumber}
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', fontWeight: 600, color: '#d97706', background: '#fef3c7', padding: '0.2rem 0.6rem', borderRadius: '6px' }}>
                New Customer (No Account Yet)
              </span>
            )}
          </div>
        </div>

        <Link to="/request-token" className="btn-primary">
          <PlusCircle size={18} />
          <span>Request New Token</span>
        </Link>
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
          title="Total Tokens"
          value={dashboard?.totalRequested || 0}
          subtitle="Lifetime service requests"
          icon={Ticket}
          colorTheme="navy"
        />
        <StatCard
          title="Active Token"
          value={dashboard?.activeToken?.tokenNumber || 'None'}
          subtitle={`Status: ${dashboard?.currentTokenStatus || 'None'}`}
          icon={Clock}
          colorTheme="teal"
        />
        <StatCard
          title="Queue Position"
          value={dashboard?.queuePosition ? `#${dashboard.queuePosition}` : 'N/A'}
          subtitle={dashboard?.peopleAhead ? `${dashboard.peopleAhead} people ahead` : 'No wait'}
          icon={Users}
          colorTheme="emerald"
        />
        <StatCard
          title="Assigned Counter"
          value={dashboard?.assignedCounter || 'None'}
          subtitle={`Now serving: ${dashboard?.currentlyServingToken || 'None'}`}
          icon={MapPin}
          colorTheme="amber"
        />
      </div>

      {/* Hero Active Token Display */}
      {dashboard?.activeToken ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f2744' }}>Current Active Token</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Live Queue Information</span>
          </div>
          <TokenCard token={dashboard.activeToken} onRefresh={fetchDashboard} />
        </div>
      ) : (
        <div className="table-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <Ticket size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f2744' }}>No Active Token in Queue</h3>
          <p style={{ color: '#64748b', maxWidth: '420px', margin: '0.5rem auto 1.5rem', fontSize: '0.9rem' }}>
            You do not currently have any active tokens waiting or being served. Select a banking service to join the queue.
          </p>
          <Link to="/request-token" className="btn-primary">
            <PlusCircle size={18} />
            <span>Generate Token Now</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
