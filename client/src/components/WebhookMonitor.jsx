import React, { useState } from 'react';

export default function WebhookMonitor({ webhooks, onTestPing }) {
  const [testUrl, setTestUrl] = useState('https://webhook.site/nexuspay-demo');

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Webhook Dispatch & Delivery Engine</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            All outbound events are signed with HMAC-SHA256 headers for tamper resistance
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input mono"
            style={{ width: '280px', padding: '6px 10px', fontSize: '12px' }}
            value={testUrl}
            onChange={(e) => setTestUrl(e.target.value)}
          />
          <button className="btn-primary btn-sm" onClick={() => onTestPing(testUrl)}>
            Dispatch Test Event
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Delivery ID</th>
              <th>Event Trigger</th>
              <th>Destination URL</th>
              <th>HTTP Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {webhooks.map((w) => (
              <tr key={w.deliveryId}>
                <td className="mono" style={{ color: 'var(--accent-cyan)' }}>{w.deliveryId}</td>
                <td>
                  <span className="mono" style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {w.eventType}
                  </span>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{w.targetUrl}</td>
                <td>
                  <span className="badge badge-succeeded">{w.responseStatus} OK</span>
                </td>
                <td style={{ fontSize: '12px' }}>{new Date(w.deliveredAt).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
