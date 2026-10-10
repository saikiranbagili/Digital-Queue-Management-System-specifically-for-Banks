import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { staffApi } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { 
  Bell, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  MapPin, 
  Clock, 
  UserCheck, 
  Layers 
} from 'lucide-react';

const SERVICES = [
  'Cash Deposit',
  'Cash Withdrawal',
  'Account Opening',
  'Passbook Update',
  'Cheque Services',
  'Loan Enquiry'
];

const COUNTERS = ['Counter 1', 'Counter 2', 'Counter 3'];

const StaffQueue = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialService = searchParams.get('service') || 'Cash Deposit';

  const [selectedService, setSelectedService] = useState(initialService);
  const [selectedCounter, setSelectedCounter] = useState('Counter 1');
  const [waitingQueue, setWaitingQueue] = useState([]);
  const [currentlyServing, setCurrentlyServing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [callingNext, setCallingNext] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadQueueData = async () => {
    try {
      setError('');
      // Load waiting queue for selected service
      const resQueue = await staffApi.getQueue(selectedService);
      setWaitingQueue(resQueue.data);

      // Also check staff dashboard for any currently called token
      const resDash = await staffApi.getDashboard();
      if (resDash.data.currentlyServingToken) {
        setCurrentlyServing(resDash.data.currentlyServingToken);
      } else {
        setCurrentlyServing(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch queue data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQueueData();
  }, [selectedService]);

  const handleCallNext = async () => {
    setError('');
    setSuccessMsg('');
    setCallingNext(true);

    try {
      const res = await staffApi.callNext(selectedService, selectedCounter);
      setCurrentlyServing(res.data);
      setSuccessMsg(`Called token ${res.data.tokenNumber} to ${selectedCounter}!`);
      await loadQueueData();
    } catch (err) {
      setError(err.message || 'Failed to call next token');
    } finally {
      setCallingNext(false);
    }
  };

  const handleCompleteToken = async (tokenId) => {
    if (!window.confirm('Are you sure you want to mark this token as COMPLETED?')) {
      return;
    }

    setError('');
    setSuccessMsg('');
    setCompleting(true);

    try {
      const res = await staffApi.completeToken(tokenId);
      setSuccessMsg(`Token ${res.data.tokenNumber} successfully marked as completed.`);
      setCurrentlyServing(null);
      await loadQueueData();
    } catch (err) {
      setError(err.message || 'Failed to complete token');
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>Counter Queue Desk</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Call eligible customers and complete service operations with instant persistence.
          </p>
        </div>

        <button className="btn-outline" onClick={loadQueueData}>
          <RefreshCw size={16} />
          <span>Sync Desk</span>
        </button>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="alert-box alert-success">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Control Bar: Service and Counter Selector */}
      <div className="table-card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f2744', marginBottom: '0.35rem' }}>
              Select Banking Service
            </label>
            <select
              className="form-input"
              value={selectedService}
              onChange={(e) => {
                setSelectedService(e.target.value);
                setSearchParams({ service: e.target.value });
              }}
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#0f2744', marginBottom: '0.35rem' }}>
              Your Operating Counter Desk
            </label>
            <select
              className="form-input"
              value={selectedCounter}
              onChange={(e) => setSelectedCounter(e.target.value)}
            >
              {COUNTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem 1rem', height: '44px' }}
              onClick={handleCallNext}
              disabled={callingNext || waitingQueue.length === 0}
            >
              <Bell size={18} />
              <span>{callingNext ? 'Calling...' : `Call Next (${waitingQueue.length} Waiting)`}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Currently Serving Station Banner */}
      {currentlyServing ? (
        <div className="active-token-hero" style={{ marginBottom: '2rem' }}>
          <div className="token-hero-header">
            <div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase' }}>
                Counter Now Serving
              </span>
              <div className="token-badge-large">{currentlyServing.tokenNumber}</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '0.25rem' }}>
                {currentlyServing.serviceName}
              </h2>
            </div>
            <div>
              <StatusBadge status={currentlyServing.status} />
            </div>
          </div>

          <div className="token-hero-metrics" style={{ marginBottom: '1.5rem' }}>
            <div className="metric-item">
              <div className="metric-label">Customer Name</div>
              <div className="metric-val">{currentlyServing.customerName || 'Walk-in'}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Customer Email</div>
              <div className="metric-val" style={{ fontSize: '0.95rem' }}>
                {currentlyServing.customerEmail || 'N/A'}
              </div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Assigned Desk</div>
              <div className="metric-val">{currentlyServing.counterName || selectedCounter}</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Service Request Time</div>
              <div className="metric-val" style={{ fontSize: '0.95rem' }}>
                {currentlyServing.createdAt ? new Date(currentlyServing.createdAt).toLocaleTimeString() : 'N/A'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              className="btn-success"
              onClick={() => handleCompleteToken(currentlyServing.id)}
              disabled={completing}
            >
              <CheckCircle2 size={18} />
              <span>{completing ? 'Completing...' : 'Mark Service as COMPLETED'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="table-card" style={{ padding: '1.75rem', marginBottom: '2rem', background: '#f8fafc', textAlign: 'center' }}>
          <UserCheck size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
          <h4 style={{ color: '#0f2744', fontSize: '1rem', fontWeight: 700 }}>Desk is Ready</h4>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            No customer is currently called to this counter. Click <strong>Call Next</strong> above to call the next waiting token.
          </p>
        </div>
      )}

      {/* Waiting Queue Table */}
      <div className="table-card">
        <div className="table-header">
          <h3>
            Waiting Queue: {selectedService} ({waitingQueue.length})
          </h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Ordered strictly by arrival time
          </span>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Loading queue tokens...
          </div>
        ) : waitingQueue.length === 0 ? (
          <div className="empty-state">
            <Layers className="empty-state-icon" />
            <h3>No waiting tokens</h3>
            <p>The queue for <strong>{selectedService}</strong> is currently empty.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Queue #</th>
                  <th>Token #</th>
                  <th>Customer</th>
                  <th>Arrival Time</th>
                  <th>People Ahead</th>
                  <th>Est. Wait</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {waitingQueue.map((t, idx) => (
                  <tr key={t.id}>
                    <td>
                      <span style={{ fontWeight: 800, color: '#0f2744' }}>#{idx + 1}</span>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7' }}>
                        {t.tokenNumber}
                      </span>
                    </td>
                    <td>
                      <div>
                        <strong>{t.customerName || 'Customer'}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.customerEmail}</div>
                      </div>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                    <td>{t.peopleAhead}</td>
                    <td>{t.estimatedWaitMinutes} mins</td>
                    <td>
                      <StatusBadge status={t.status} />
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

export default StaffQueue;
