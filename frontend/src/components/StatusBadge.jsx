import React from 'react';
import { Clock, Bell, CheckCircle2, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  switch (status) {
    case 'WAITING':
      return (
        <span className="badge badge-waiting">
          <Clock size={13} /> Waiting in Queue
        </span>
      );
    case 'CALLED':
      return (
        <span className="badge badge-called">
          <Bell size={13} /> Now Serving
        </span>
      );
    case 'COMPLETED':
      return (
        <span className="badge badge-completed">
          <CheckCircle2 size={13} /> Completed
        </span>
      );
    case 'CANCELLED':
      return (
        <span className="badge" style={{ background: '#fee2e2', color: '#b91c1c' }}>
          <XCircle size={13} /> Cancelled
        </span>
      );
    default:
      return <span className="badge badge-completed">{status || 'UNKNOWN'}</span>;
  }
};

export default StatusBadge;
