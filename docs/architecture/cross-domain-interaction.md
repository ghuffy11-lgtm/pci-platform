# PCI Cross-Domain Interaction Architecture

## Principle

Domains are bounded contexts over one Reality Model. They do not become isolated databases or independent truth systems.

## Interaction Types

1. **Knowledge relationship** — when the relationship itself is part of organizational reality.
2. **API call** — when a synchronous capability is required.
3. **Event** — when consumers react to an occurrence without tight coupling.
4. **Workflow** — when multiple capabilities must coordinate a governed process.

## Example

```text
Network Device
   │
   ├── LOCATED_IN -> Room
   ├── SUPPORTS -> Service
   ├── HAS_TICKET -> Helpdesk Ticket
   ├── MONITORED_BY -> Monitoring
   └── MAINTAINED_BY -> Team
```

A network outage may therefore produce an operational event, correlate with a ticket, identify affected services, and trigger a governed workflow without the Network domain directly owning Helpdesk or Facilities data.

## Rule

Cross-domain integration must reference canonical object identities and contracts. Direct database access across domains is prohibited.
