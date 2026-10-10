import React from 'react';

const StatCard = ({ title, value, subtitle, icon: Icon, colorTheme = 'teal' }) => {
  return (
    <div className="stat-card">
      <div className="stat-info">
        <h4>{title}</h4>
        <div className="stat-value">{value}</div>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {Icon && (
        <div className={`stat-icon-wrap ${colorTheme}`}>
          <Icon size={24} />
        </div>
      )}
    </div>
  );
};

export default StatCard;
