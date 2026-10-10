import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerApi } from '../services/api';
import { 
  Banknote, 
  ArrowDownLeft, 
  UserPlus, 
  BookOpen, 
  FileCheck, 
  HelpCircle, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import TokenCard from '../components/TokenCard';

const SERVICES = [
  {
    name: 'Cash Deposit',
    code: 'CD',
    counter: 'Counter 1',
    duration: 5,
    icon: Banknote,
    description: 'Instant cash deposits into savings or current accounts.'
  },
  {
    name: 'Cash Withdrawal',
    code: 'CW',
    counter: 'Counter 2',
    duration: 5,
    icon: ArrowDownLeft,
    description: 'Over-the-counter high value or standard cash disbursements.'
  },
  {
    name: 'Account Opening',
    code: 'AO',
    counter: 'Counter 3',
    duration: 15,
    icon: UserPlus,
    description: 'Open new savings, corporate, fixed deposit, or NRI accounts.'
  },
  {
    name: 'Passbook Update',
    code: 'PB',
    counter: 'Counter 1',
    duration: 3,
    icon: BookOpen,
    description: 'Fast physical passbook printing and statement verification.'
  },
  {
    name: 'Cheque Services',
    code: 'CH',
    counter: 'Counter 2',
    duration: 8,
    icon: FileCheck,
    description: 'Cheque clearance, stop-payment requests, and banker drafts.'
  },
  {
    name: 'Loan Enquiry',
    code: 'LE',
    counter: 'Counter 3',
    duration: 20,
    icon: HelpCircle,
    description: 'Consult with personal, home, or business loan specialists.'
  }
];

const RequestToken = () => {
  const [submittingService, setSubmittingService] = useState(null);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGenerateToken = async (serviceName) => {
    setError('');
    setSubmittingService(serviceName);

    try {
      const res = await customerApi.requestToken(serviceName);
      setGeneratedToken(res.data);
    } catch (err) {
      setError(err.message || 'Failed to request token');
    } finally {
      setSubmittingService(null);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>Select a Banking Service</h2>
        <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
          Choose the service you need today to generate an official digital queue token.
        </p>
      </div>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Generated Token Success Banner */}
      {generatedToken && (
        <div style={{ marginBottom: '2rem' }}>
          <div className="alert-box alert-success" style={{ marginBottom: '1rem' }}>
            <CheckCircle2 size={18} />
            <span>
              Token generated successfully! Your digital queue token is <strong>{generatedToken.tokenNumber}</strong>.
            </span>
          </div>

          <TokenCard token={generatedToken} />
        </div>
      )}

      {/* Services Grid */}
      <div className="services-grid">
        {SERVICES.map((srv) => {
          const Icon = srv.icon;
          const isBusy = submittingService === srv.name;

          return (
            <div key={srv.name} className="service-card">
              <div>
                <div className="service-card-top">
                  <div className="stat-icon-wrap teal" style={{ width: '42px', height: '42px' }}>
                    <Icon size={20} />
                  </div>
                  <span className="service-code-tag">{srv.code}</span>
                </div>

                <h3 className="service-title">{srv.name}</h3>
                <p className="service-desc">{srv.description}</p>
              </div>

              <div>
                <div className="service-meta">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <MapPin size={14} color="#0284c7" />
                    {srv.counter}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Clock size={14} color="#059669" />
                    ~{srv.duration} mins avg
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => handleGenerateToken(srv.name)}
                  disabled={isBusy}
                >
                  {isBusy ? 'Generating...' : 'Generate Token'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RequestToken;
