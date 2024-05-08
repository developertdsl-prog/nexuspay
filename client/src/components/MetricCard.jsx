import React from 'react';

export default function MetricCard({ title, value, subtitle, trend, icon }) {
  return (
    <div className="glass-card">
      <div className="stat-header">
        <span className="stat-title">{title}</span>
        <span style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-trend trend-up">
        <span>{trend}</span>
        <span style={{ color: 'var(--text-muted)', marginLeft: '4px' }}>{subtitle}</span>
      </div>
    </div>
  );
}
