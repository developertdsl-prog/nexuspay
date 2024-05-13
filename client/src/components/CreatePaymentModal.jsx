import React, { useState } from 'react';

export default function CreatePaymentModal({ isOpen, onClose, onCreate }) {
  const [formData, setFormData] = useState({
    amountUSD: '1250.00',
    rail: 'ACH',
    name: 'Acme Supply Chains LLC',
    email: 'finance@acmesupply.com',
    requiresEscrow: false,
    description: 'B2B Raw Material Order #991'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountCents = Math.round(parseFloat(formData.amountUSD) * 100);
    onCreate({
      amountCents,
      rail: formData.rail,
      customer: { name: formData.name, email: formData.email },
      requiresEscrow: formData.requiresEscrow,
      description: formData.description
    });
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3 style={{ fontSize: '18px', fontWeight: 700 }}>Create New Payment Intent</h3>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Transaction Amount (USD)</label>
            <input
              type="number"
              step="0.01"
              required
              className="form-input mono"
              value={formData.amountUSD}
              onChange={(e) => setFormData({ ...formData, amountUSD: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Settlement Rail</label>
            <select
              className="form-select"
              value={formData.rail}
              onChange={(e) => setFormData({ ...formData, rail: e.target.value })}
            >
              <option value="ACH">ACH (Automated Clearing House - 0.80%)</option>
              <option value="FEDWIRE">FedWire Gross Settlement (0.15% + $15)</option>
              <option value="SEPA_CREDIT">SEPA Credit Transfer (0.60%)</option>
              <option value="RTP">RTP Instant Network (0.95%)</option>
              <option value="CARD">Interchange Card Network (2.40%)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Client / Payer Entity</label>
            <input
              type="text"
              required
              className="form-input"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Accounting Notification Email</label>
            <input
              type="email"
              required
              className="form-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              id="escrowCheckbox"
              checked={formData.requiresEscrow}
              onChange={(e) => setFormData({ ...formData, requiresEscrow: e.target.checked })}
            />
            <label htmlFor="escrowCheckbox" style={{ fontSize: '13px', cursor: 'pointer' }}>
              Hold funds in Escrow Vault until delivery confirmation
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn-outline btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Issue Payment Intent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
