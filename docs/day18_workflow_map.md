# Day 18 Workflow Map - HubSpot Lead Routing, SLA and Review Logic

## High-Level Flow

```text
Imported Test Contact
>
HubSpot Contact Created / Email Known
>
Workflow 1: Inbound Lead Routing & Owner Assignment
>
Eligibility Gate
>
Routing Branch:
- Enterprise priority
- UK territory
- US territory
- Review queue
>
Property Updates:
- VE Assigned Team
- VE SLA Hours
- VE SLA Status
- VE Stale Lead Flag
- VE Routing Notes
```

## Workflow 1 - Inbound Lead Routing & Owner Assignment

```text
Start Trigger
>
Contact created / Email known
>
Branch 1: Eligible for routing
>
Branch 2: Routing decision
>
Enterprise priority / UK territory / US territory / None met
>
Update routing fields
>
End
```

## Workflow 2 - MQL Notification Workflow

```text
MQL Contact
>
MQL qualification logic
>
Internal notification preview
>
End
```

## Workflow 3 - SLA Task Creation Workflow

```text
Pending SLA Contact
>
SLA condition met
>
Task creation preview
>
End
```

## Workflow 4 - Stale Lead Review Workflow

```text
Stale / review contact
>
Review fallback condition met
>
Review-needed update / task / note preview
>
End
```

## v2 Enhancement Notes

Future production-ready improvements:

- True date-based stale lead detection.
- Custom SLA timestamp property.
- Last Activity Date / Last Contacted based ageing logic.
- Owner-specific SLA escalation.
- Reconciliation queue for incomplete or conflicting routing data.
- Reporting dashboard for routing volume, SLA breach risk and stale lead backlog.
