import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import StatCard from '../components/StatCard';
import StatusBadge from '../components/StatusBadge';
import { 
  Users, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Bell, 
  ShieldCheck, 
  RefreshCw, 
  AlertCircle,
  Filter,
  BarChart2
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [counters, setCounters] = useState([]);
  const [activeTab, setActiveTab] = useState('TOKENS'); // 'TOKENS' | 'USERS' | 'SERVICES'

  const [serviceFilter, setServiceFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [branchFilter, setBranchFilter] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    try {
      setError('');
      const [dashRes, tokensRes, usersRes, servicesRes, countersRes] = await Promise.all([
        adminApi.getDashboard(),
        adminApi.getTokens({ serviceName: serviceFilter, status: statusFilter, branch: branchFilter }),
        adminApi.getUsers(),
        adminApi.getServices(),
        adminApi.getCounters()
      ]);

      setDashboard(dashRes.data);
      setTokens(tokensRes.data);
      setUsers(usersRes.data);
      setServices(servicesRes.data);
      setCounters(countersRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [serviceFilter, statusFilter, branchFilter]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>Executive Admin Console</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            System-wide traffic monitoring, user directories, service configuration, and audit logs.
          </p>
        </div>

        <button className="btn-outline" onClick={fetchAdminData}>
          <RefreshCw size={16} />
          <span>Refresh All</span>
        </button>
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
          title="Total Tokens Today"
          value={dashboard?.totalTokensToday ?? 0}
          subtitle="All branch transactions"
          icon={Layers}
          colorTheme="navy"
        />
        <StatCard
          title="Waiting Tokens"
          value={dashboard?.waitingTokens ?? 0}
          subtitle="Pending in queues"
          icon={Clock}
          colorTheme="amber"
        />
        <StatCard
          title="Called / Active"
          value={dashboard?.calledTokens ?? 0}
          subtitle="Currently at desks"
          icon={Bell}
          colorTheme="teal"
        />
        <StatCard
          title="Completed Today"
          value={dashboard?.completedTokens ?? 0}
          subtitle="Successfully served"
          icon={CheckCircle2}
          colorTheme="emerald"
        />
        <StatCard
          title="Registered Users"
          value={dashboard?.totalRegisteredUsers ?? users.length}
          subtitle="Customers, staff & admins"
          icon={Users}
          colorTheme="teal"
        />
      </div>

      {/* Visual Queue Distribution Chart */}
      {dashboard?.queueCountsByService && (
        <div className="table-card" style={{ padding: '1.5rem', marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <BarChart2 size={20} color="#0284c7" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f2744' }}>
              Service Volume & Load Distribution
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {Object.entries(dashboard.queueCountsByService).map(([srv, count]) => {
              const maxTokens = Math.max(...Object.values(dashboard.queueCountsByService), 1);
              const percentage = Math.round((count / maxTokens) * 100);

              return (
                <div key={srv}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600, color: '#0f2744' }}>{srv}</span>
                    <span style={{ color: '#64748b', fontWeight: 700 }}>{count} tokens ({percentage}%)</span>
                  </div>
                  <div style={{ height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.max(percentage, count > 0 ? 8 : 2)}%`,
                        background: 'linear-gradient(90deg, #0284c7, #38bdf8)',
                        borderRadius: '5px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
        <button
          className="btn-outline"
          style={{
            background: activeTab === 'TOKENS' ? '#0f2744' : '#fff',
            color: activeTab === 'TOKENS' ? '#fff' : '#0f2744'
          }}
          onClick={() => setActiveTab('TOKENS')}
        >
          All Tokens ({tokens.length})
        </button>
        <button
          className="btn-outline"
          style={{
            background: activeTab === 'USERS' ? '#0f2744' : '#fff',
            color: activeTab === 'USERS' ? '#fff' : '#0f2744'
          }}
          onClick={() => setActiveTab('USERS')}
        >
          Registered Accounts ({users.length})
        </button>
        <button
          className="btn-outline"
          style={{
            background: activeTab === 'SERVICES' ? '#0f2744' : '#fff',
            color: activeTab === 'SERVICES' ? '#fff' : '#0f2744'
          }}
          onClick={() => setActiveTab('SERVICES')}
        >
          Services & Counters ({services.length})
        </button>
      </div>

      {/* Tab Content 1: Tokens Table with Filters */}
      {activeTab === 'TOKENS' && (
        <div className="table-card">
          <div className="table-header">
            <h3>Master Token Registry</h3>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <select
                className="form-input"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="">All Services</option>
                {services.map((s) => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <select
                className="form-input"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="WAITING">WAITING</option>
                <option value="CALLED">CALLED</option>
                <option value="COMPLETED">COMPLETED</option>
              </select>

              <select
                className="form-input"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
              >
                <option value="">All Branches</option>
                <option value="Ameerpet">SBI — Ameerpet</option>
                <option value="Kukatpally">SBI — Kukatpally</option>
                <option value="Secunderabad">SBI — Secunderabad</option>
                <option value="Madhapur">HDFC Bank — Madhapur</option>
                <option value="Gachibowli">HDFC Bank — Gachibowli</option>
                <option value="Begumpet">HDFC Bank — Begumpet</option>
                <option value="Banjara Hills">ICICI Bank — Banjara Hills</option>
                <option value="Miyapur">ICICI Bank — Miyapur</option>
                <option value="Dilsukhnagar">ICICI Bank — Dilsukhnagar</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Token #</th>
                  <th>Branch</th>
                  <th>Service</th>
                  <th>Customer</th>
                  <th>Counter Desk</th>
                  <th>Status</th>
                  <th>Request Time</th>
                  <th>Completed Time</th>
                </tr>
              </thead>
              <tbody>
                {tokens.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
                      No tokens match the selected filters.
                    </td>
                  </tr>
                ) : (
                  tokens.map((t) => (
                    <tr key={t.id}>
                      <td>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#0284c7' }}>
                          {t.tokenNumber}
                        </span>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#7c3aed', background: '#f3e8ff', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {t.branch || 'Ameerpet'}
                        </span>
                      </td>
                      <td><strong>{t.serviceName}</strong></td>
                      <td>
                        <div>
                          <div>{t.customerName || 'Walk-in'}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{t.customerEmail}</div>
                        </div>
                      </td>
                      <td>{t.counterName || 'Counter 1'}</td>
                      <td><StatusBadge status={t.status} /></td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {t.createdAt ? new Date(t.createdAt).toLocaleTimeString() : '—'}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                        {t.completedAt ? new Date(t.completedAt).toLocaleTimeString() : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 2: Registered Users */}
      {activeTab === 'USERS' && (
        <div className="table-card">
          <div className="table-header">
            <h3>Registered User Directory</h3>
          </div>
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Bank & Branch</th>
                  <th>Account Number</th>
                  <th>Role</th>
                  <th>Member Since</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>
                        <span style={{ fontWeight: 700, color: '#0284c7' }}>{u.bankName || 'SBI'}</span>
                        <div style={{ color: '#7c3aed', fontWeight: 600 }}>{u.branch ? `${u.branch} Branch` : 'Ameerpet Branch'}</div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: u.accountNumber ? '#059669' : '#94a3b8' }}>
                        {u.accountNumber || '— (New Customer)'}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${u.role === 'ADMIN' ? 'badge-called' : u.role === 'STAFF' ? 'badge-waiting' : 'badge-completed'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab Content 3: Services & Counters */}
      {activeTab === 'SERVICES' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="table-card">
            <div className="table-header">
              <h3>Banking Services Config</h3>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Service Name</th>
                    <th>Assigned Counter</th>
                    <th>Avg Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map((s) => (
                    <tr key={s.id}>
                      <td><span className="service-code-tag">{s.code}</span></td>
                      <td><strong>{s.name}</strong></td>
                      <td>{s.assignedCounter}</td>
                      <td>{s.avgDurationMinutes} mins</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="table-card">
            <div className="table-header">
              <h3>Counter Stations</h3>
            </div>
            <div className="table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>Counter Name</th>
                    <th>Assigned Staff</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {counters.map((c) => (
                    <tr key={c.id}>
                      <td><strong>{c.name}</strong></td>
                      <td>{c.currentStaffName || 'Assigned Teller'}</td>
                      <td>
                        <span className="badge badge-called">{c.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
