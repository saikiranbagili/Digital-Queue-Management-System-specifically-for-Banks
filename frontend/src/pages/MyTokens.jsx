import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { Ticket, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const MyTokens = () => {
  const [tokens, setTokens] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTokens = async () => {
    try {
      setError('');
      const res = await customerApi.getMyTokens();
      setTokens(res.data);
    } catch (err) {
      setError(err.message || 'Failed to fetch tokens');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const filteredTokens = tokens.filter((t) => {
    if (filter === 'ACTIVE') return t.status === 'WAITING' || t.status === 'CALLED';
    if (filter === 'COMPLETED') return t.status === 'COMPLETED';
    return true;
  });

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>My Tokens History</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Review your active and completed queue tickets.
          </p>
        </div>

        <button className="btn-outline" onClick={fetchTokens}>
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        <button
          className={`btn-outline ${filter === 'ALL' ? 'active' : ''}`}
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            background: filter === 'ALL' ? '#0f2744' : '#fff',
            color: filter === 'ALL' ? '#fff' : '#0f2744'
          }}
          onClick={() => setFilter('ALL')}
        >
          All Tokens ({tokens.length})
        </button>
        <button
          className={`btn-outline ${filter === 'ACTIVE' ? 'active' : ''}`}
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            background: filter === 'ACTIVE' ? '#0f2744' : '#fff',
            color: filter === 'ACTIVE' ? '#fff' : '#0f2744'
          }}
          onClick={() => setFilter('ACTIVE')}
        >
          Active ({tokens.filter((t) => t.status === 'WAITING' || t.status === 'CALLED').length})
        </button>
        <button
          className={`btn-outline ${filter === 'COMPLETED' ? 'active' : ''}`}
          style={{
            padding: '0.45rem 1rem',
            fontSize: '0.8rem',
            background: filter === 'COMPLETED' ? '#0f2744' : '#fff',
            color: filter === 'COMPLETED' ? '#fff' : '#0f2744'
          }}
          onClick={() => setFilter('COMPLETED')}
        >
          Completed ({tokens.filter((t) => t.status === 'COMPLETED').length})
        </button>
      </div>

      {/* Tokens Table */}
      <div className="table-card">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading your tokens...
          </div>
        ) : filteredTokens.length === 0 ? (
          <div className="empty-state">
            <Ticket className="empty-state-icon" />
            <h3>No tokens found</h3>
            <p>You do not have any {filter.toLowerCase()} tokens.</p>
            <Link to="/request-token" className="btn-primary" style={{ marginTop: '1rem' }}>
              Generate a Token
            </Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Banking Service</th>
                  <th>Request Time</th>
                  <th>Counter</th>
                  <th>Queue Status</th>
                  <th>People Ahead</th>
                  <th>Est. Wait</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTokens.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7' }}>
                        {t.tokenNumber}
                      </span>
                    </td>
                    <td>
                      <strong>{t.serviceName}</strong>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {formatDateTime(t.createdAt)}
                    </td>
                    <td>{t.counterName || 'Counter 1'}</td>
                    <td>
                      <StatusBadge status={t.status} />
                    </td>
                    <td>
                      {t.status === 'WAITING' ? `${t.peopleAhead} people` : '—'}
                    </td>
                    <td>
                      {t.status === 'WAITING' ? `${t.estimatedWaitMinutes} mins` : '—'}
                    </td>
                    <td>
                      <Link
                        to={`/track/${t.id}`}
                        className="btn-outline"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        Track <ArrowRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTokens;
