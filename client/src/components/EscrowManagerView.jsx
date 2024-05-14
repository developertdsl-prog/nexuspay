import React from 'react';

export default function EscrowManagerView({ escrows, onRelease }) {
  return (
    <div className="glass-card" style={{ padding: '0px' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Active Escrow Vault Accounts</h3>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Funds held securely pending buyer inspection and delivery sign-off
          </p>
        </div>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Escrow Reference</th>
              <th>Parent Intent</th>
              <th>Payer Entity</th>
              <th>Locked Balance</th>
              <th>Release Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {escrows.map((e) => (
              <tr key={e.escrowId}>
                <td className="mono" style={{ color: 'var(--accent-amber)' }}>{e.escrowId}</td>
                <td className="mono">{e.intentId}</td>
                <td>{e.payerEmail}</td>
                <td className="mono" style={{ fontWeight: 700, color: '#f59e0b' }}>
                  ${(e.amountCents / 100).toFixed(2)}
                </td>
                <td style={{ fontSize: '12px' }}>{e.releaseCondition}</td>
                <td>
                  <span className={`badge ${e.status === 'HELD' ? 'badge-escrow' : 'badge-succeeded'}`}>
                    {e.status}
                  </span>
                </td>
                <td>
                  {e.status === 'HELD' && (
                    <button
                      className="btn-primary btn-sm"
                      style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
                      onClick={() => onRelease(e.escrowId)}
                    >
                      Release Funds
                    </button>
                  )}
                  {e.status === 'RELEASED' && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>Settled to Balance</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
