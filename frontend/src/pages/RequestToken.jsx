import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  AlertCircle,
  ShieldCheck,
  CreditCard,
  Building2
} from 'lucide-react';
import TokenCard from '../components/TokenCard';

const SERVICES = [
  {
    name: 'Cash Deposit',
    code: 'CD',
    counter: 'Counter 1',
    duration: 5,
    icon: Banknote,
    description: 'Instant cash deposits into savings or current accounts. (Requires Account Verification)'
  },
  {
    name: 'Cash Withdrawal',
    code: 'CW',
    counter: 'Counter 2',
    duration: 5,
    icon: ArrowDownLeft,
    description: 'Over-the-counter high value or standard cash disbursements. (Requires Account Verification)'
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
  const { user } = useAuth();
  const [submittingService, setSubmittingService] = useState(null);
  const [generatedToken, setGeneratedToken] = useState(null);
  const [error, setError] = useState('');
  
  // Verification Modal State for Cash Deposit / Cash Withdrawal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyService, setVerifyService] = useState('');
  const [inputAccountNumber, setInputAccountNumber] = useState('');
  const [verifyError, setVerifyError] = useState('');

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

  // Direct auto-generation for new customers opening accounts
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const autoService = searchParams.get('autoService');
    if (autoService) {
      handleGenerateToken(autoService);
    }
  }, []);

  const handleServiceClick = (serviceName) => {
    setError('');

    // For Cash Deposit and Cash Withdrawal: open verification modal first!
    if (serviceName === 'Cash Deposit' || serviceName === 'Cash Withdrawal') {
      setVerifyService(serviceName);
      setInputAccountNumber('');
      setVerifyError('');
      setShowVerifyModal(true);
    } else {
      handleGenerateToken(serviceName);
    }
  };

  const handleVerifyAndSubmit = async (e) => {
    e.preventDefault();
    setVerifyError('');

    const entered = inputAccountNumber.trim();
    const registered = (
      user?.accountNumber ||
      localStorage.getItem('bankq_account_number') ||
      localStorage.getItem('bankq_login_account_number') ||
      ''
    ).trim();

    // If an account number was registered or entered at login, verify it matches
    if (registered) {
      if (entered !== registered) {
        setVerifyError('enter correct account number');
        return;
      }
    } else {
      // If customer did not have an account number saved yet
      if (!entered) {
        setVerifyError('enter correct account number');
        return;
      }
      // Save this entered account number to their profile
      localStorage.setItem('bankq_account_number', entered);
      localStorage.setItem('bankq_login_account_number', entered);
      if (user) user.accountNumber = entered;
    }

    // Account verification successful! Proceed to generate token
    setShowVerifyModal(false);
    setInputAccountNumber('');
    handleGenerateToken(verifyService);
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f2744' }}>Select a Banking Service</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
            Choose the service you need today to generate an official digital queue token.
          </p>
        </div>

        {user?.bankName && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#e0f2fe',
            color: '#0369a1',
            padding: '0.4rem 0.85rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            <Building2 size={15} />
            <span>{user.bankName}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="alert-box alert-error" style={{ marginBottom: '1.5rem' }}>
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
          const isCashService = srv.name === 'Cash Deposit' || srv.name === 'Cash Withdrawal';

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
                  onClick={() => handleServiceClick(srv.name)}
                  disabled={isBusy}
                >
                  {isBusy ? 'Generating...' : (isCashService ? 'Verify & Generate Token' : 'Generate Token')}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Number Verification Modal for Cash Deposit / Cash Withdrawal */}
      {showVerifyModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            maxWidth: '440px',
            width: '100%',
            padding: '2rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(2, 132, 199, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#0284c7'
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f2744' }}>
                  Account Verification
                </h3>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                  Required for {verifyService}
                </p>
              </div>
            </div>

            <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1.25rem', lineHeight: 1.5 }}>
              For security, please enter your registered <strong>{user?.bankName || 'bank'}</strong> account number to proceed:
            </p>

            {verifyError && (
              <div style={{
                padding: '0.75rem 1rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                color: '#dc2626',
                fontSize: '0.9rem',
                fontWeight: 700,
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <AlertCircle size={18} />
                <span>{verifyError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyAndSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label htmlFor="modalAccInput" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, color: '#0f2744' }}>
                  <CreditCard size={15} color="#0284c7" />
                  <span>Enter Account Number</span>
                </label>
                <input
                  id="modalAccInput"
                  type="text"
                  className="form-input"
                  placeholder="e.g. 104829104928"
                  value={inputAccountNumber}
                  onChange={(e) => {
                    setInputAccountNumber(e.target.value);
                    setVerifyError('');
                  }}
                  autoFocus
                  required
                  style={{ width: '100%', padding: '0.75rem 1rem', fontSize: '1rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  type="button"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontWeight: 600,
                    background: '#f1f5f9',
                    color: '#475569',
                    border: '1px solid #cbd5e1',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setShowVerifyModal(false);
                    setInputAccountNumber('');
                    setVerifyError('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', fontWeight: 700 }}
                >
                  Verify & Generate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestToken;
