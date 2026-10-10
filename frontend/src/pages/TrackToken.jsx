import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerApi } from '../services/api';
import TokenCard from '../components/TokenCard';
import StatusBadge from '../components/StatusBadge';
import { ArrowLeft, RefreshCw, AlertCircle, CheckCircle, Bell, Clock } from 'lucide-react';

const TrackToken = () => {
  const { id } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchTokenStatus = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      setError('');
      const res = await customerApi.getTokenStatus(id);
      setToken(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch token status');
    } finally {
      setLoading(false);
      if (isManual) setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTokenStatus();

    // Auto-polling every 5 seconds per requirement
    const interval = setInterval(() => {
      fetchTokenStatus();
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/my-tokens" className="btn-outline" style={{ padding: '0.45rem 0.85rem' }}>
          <ArrowLeft size={16} />
          <span>Back to My Tokens</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Auto-refreshing every 5s • Last: {lastUpdated.toLocaleTimeString()}
          </span>
          <button className="btn-outline" onClick={() => fetchTokenStatus(true)} disabled={refreshing}>
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          Loading real-time token tracking data...
        </div>
      ) : token ? (
        <div>
          {/* Visual Queue Stepper */}
          <div className="table-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f2744', marginBottom: '1.25rem' }}>
              Live Journey Progress
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                background: token.status === 'WAITING' || token.status === 'CALLED' || token.status === 'COMPLETED' ? '#f0fdf4' : '#f8fafc',
                border: '1px solid #dcfce7'
              }}>
                <Clock size={24} color="#059669" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f2744' }}>1. In Queue</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ticket Generated</div>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                background: token.status === 'CALLED' || token.status === 'COMPLETED' ? '#e0f2fe' : '#f8fafc',
                border: token.status === 'CALLED' ? '2px solid #0284c7' : '1px solid #e2e8f0'
              }}>
                <Bell size={24} color="#0284c7" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f2744' }}>2. Called to Counter</div>
                <div style={{ fontSize: '0.75rem', color: '#0284c7', fontWeight: 600 }}>
                  {token.status === 'CALLED' ? 'Proceed to ' + (token.counterName || 'Counter') : 'Counter Called'}
                </div>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '8px',
                background: token.status === 'COMPLETED' ? '#f1f5f9' : '#f8fafc',
                border: '1px solid #e2e8f0'
              }}>
                <CheckCircle size={24} color={token.status === 'COMPLETED' ? '#059669' : '#94a3b8'} style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f2744' }}>3. Service Done</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Finished</div>
              </div>
            </div>
          </div>

          <TokenCard token={token} onRefresh={() => fetchTokenStatus(true)} showTrackLink={false} />
        </div>
      ) : (
        <div className="empty-state">
          <AlertCircle className="empty-state-icon" />
          <h3>Token not found</h3>
          <p>We could not find a token with ID #{id}.</p>
        </div>
      )}
    </div>
  );
};

export default TrackToken;
