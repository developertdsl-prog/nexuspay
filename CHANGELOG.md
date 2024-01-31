# Changelog

All notable changes to **NexusPay Payment Gateway** are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-28
### Added
- Complete React 18 FinTech dashboard with real-time volume metrics and payment rail health.
- Interactive Escrow management interface with conditional release triggers.
- Live Webhook monitor with HMAC-SHA256 signature verification preview.
- Multi-stage Docker containerization and Docker Compose orchestration.
- Comprehensive end-to-end payment lifecycle test suite.
- Production-grade rate limiting, API key authentication, and audit logging.

## [0.3.0] - 2024-04-30
### Added
- Two-tier Escrow hold engine with dispute management and refund workflows.
- Webhook dispatch engine with HMAC-SHA256 signing and exponential retry mechanism.
- Financial audit trail schema recording all intent state transitions.

## [0.2.0] - 2024-03-29
### Added
- Multi-rail routing support (ACH, FedWire, SEPA Credit, Credit Card, Real-Time Rails).
- Dynamic fee calculator with basis point precision and merchant tier discounts.
- Distributed idempotency key locking layer preventing double-billing.

## [0.1.0] - 2024-02-23
### Added
- Core MongoDB schema models: Merchant, PaymentIntent, and Transaction.
- RESTful Payment intent lifecycle endpoints (Create, Confirm, Capture, Cancel).
- Mongoose connection pooling with replica-set failover handling.
