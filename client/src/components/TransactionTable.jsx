import React from 'react';

export default function TransactionTable({ payments, onConfirm }) {
  const getBadgeClass = (status) => {
    switch (status) {
      case 'SUCCEEDED': return 'badge-succeeded';
      case 'IN_ESCROW': return 'badge-escrow';
      case 'PROCESSING': return 'badge-processing';
      default: return 'badge-failed';
    }
  };

  return (
    <div className="glass-card" style={{ padding: '0px' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Payment Intent Ledger</h3>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Real-time updates</span>
      </div>

      <div className="data-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Intent Reference</th>
              <th>Customer Entity</th>
              <th>Rail</th>
              <th>Gross Amount</th>
              <th>Gateway Fee</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.intentId}>
                <td className="mono" style={{ color: 'var(--accent-blue)' }}>{p.intentId}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{p.customer?.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{p.customer?.email}</div>
                </td>
                <td>
                  <span className="mono" style={{ background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>
                    {p.rail}
                  </span>
                </td>
                <td className="mono" style={{ fontWeight: 700 }}>
                  ${(p.amountCents / 100).toFixed(2)}
                </td>
                <td className="mono" style={{ color: 'var(--text-muted)' }}>
                  ${(p.feeCents / 100).toFixed(2)}
                </td>
                <td>
                  <span className={`badge ${getBadgeClass(p.status)}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  {p.status === 'CREATED' && (
                    <button
                      className="btn-primary btn-sm"
                      onClick={() => onConfirm(p.intentId)}
                    >
                      Authorize
                    </button>
                  )}
                  {p.status === 'SUCCEEDED' && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-emerald)' }}>Cleared</span>
                  )}
                  {p.status === 'IN_ESCROW' && (
                    <span style={{ fontSize: '11px', color: 'var(--accent-amber)' }}>Vault Locked</span>
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
