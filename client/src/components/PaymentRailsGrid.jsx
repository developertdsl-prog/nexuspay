import React from 'react';

const RAILS = [
  { code: 'ACH', name: 'US ACH Transfer', speed: '1-2 Days', fee: '0.80% + $0.25', status: 'HEALTHY' },
  { code: 'FEDWIRE', name: 'FedWire Real-Time', speed: 'Same-Day Gross', fee: '0.15% + $15.00', status: 'HEALTHY' },
  { code: 'SEPA', name: 'SEPA Credit (EU)', speed: 'Next-Day', fee: '0.60% + €0.35', status: 'HEALTHY' },
  { code: 'RTP', name: 'The Clearing House RTP', speed: 'Instant (24/7)', fee: '0.95% + $0.75', status: 'HEALTHY' },
  { code: 'CARD', name: 'Corporate Interchange', speed: 'T+2 Days', fee: '2.40% + $0.30', status: 'HEALTHY' }
];

export default function PaymentRailsGrid() {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h3 style={{ fontSize: '14px', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '12px', letterSpacing: '0.5px' }}>
        Operational Settlement Rail Health
      </h3>
      <div className="rails-grid">
        {RAILS.map((rail) => (
          <div key={rail.code} className="rail-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="rail-name">{rail.name}</span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }}></span>
            </div>
            <div className="rail-param">
              <span>Settlement:</span>
              <span style={{ color: '#fff' }}>{rail.speed}</span>
            </div>
            <div className="rail-param">
              <span>Base Rate:</span>
              <span className="mono" style={{ color: 'var(--accent-cyan)' }}>{rail.fee}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
