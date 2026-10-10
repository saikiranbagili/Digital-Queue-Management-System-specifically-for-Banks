import React from 'react';
import { Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const TokenCard = ({ token, onRefresh, showTrackLink = true }) => {
  if (!token) return null;

  return (
    <div className="active-token-hero">
      <div className="token-hero-header">
        <div>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Token
          </span>
          <div className="token-badge-large">{token.tokenNumber}</div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginTop: '0.25rem' }}>{token.serviceName}</h2>
        </div>
        <div>
          <StatusBadge status={token.status} />
        </div>
      </div>

      <div className="token-hero-metrics">
        <div className="metric-item">
          <div className="metric-label">Assigned Counter</div>
          <div className="metric-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={18} color="#38bdf8" />
            {token.counterName || 'Counter 1'}
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Queue Position</div>
          <div className="metric-val">
            {token.status === 'WAITING' ? `#${token.queuePosition}` : 'Now'}
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label">People Ahead</div>
          <div className="metric-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Users size={18} color="#38bdf8" />
            {token.peopleAhead}
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Estimated Wait</div>
          <div className="metric-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={18} color="#38bdf8" />
            {token.estimatedWaitMinutes} mins
          </div>
        </div>

        <div className="metric-item">
          <div className="metric-label">Currently Serving</div>
          <div className="metric-val" style={{ color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
            {token.currentlyServingToken || 'None'}
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
        {onRefresh && (
          <button className="btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={onRefresh}>
            Refresh Status
          </button>
        )}
        {showTrackLink && (
          <Link to={`/track/${token.id}`} className="btn-primary">
            Track Live <ArrowRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
};

export default TokenCard;
