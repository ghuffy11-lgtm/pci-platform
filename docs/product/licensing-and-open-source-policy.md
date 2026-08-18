# PCI Licensing and Open-Source Policy

**Status:** Foundation product policy
**Version:** 0.1

## Goal

Maintain a no-mandatory-software-license-cost architecture while respecting every dependency's license and distribution obligations.

## Principles

- Prefer mature, widely adopted open-source standards and components.
- Do not introduce a dependency solely because it is free; security, maintainability, license compatibility, and operational fit also matter.
- Track dependency licenses.
- Preserve required notices and source obligations.
- Avoid components whose licensing terms create unacceptable product-distribution constraints.
- Keep proprietary customer data and configuration separate from third-party component licensing.

## Commercial Product

PCI may be productized as a supported solution while continuing to use open-source infrastructure where licenses permit. Commercial support, deployment services, enterprise features, or hardware are product decisions and do not change the architectural requirement to avoid mandatory proprietary runtime dependencies.

## Acceptance Criteria

Every distributable release has a dependency inventory and license review appropriate to its distribution model.
