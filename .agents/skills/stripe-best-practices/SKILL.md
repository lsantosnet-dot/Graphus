---
name: stripe-best-practices
description: >-
  Guides Stripe integration decisions — API selection (Checkout Sessions vs
  PaymentIntents), Connect platform setup (Accounts v2, controller properties),
  billing/subscriptions, Treasury financial accounts, integration surfaces
  (Checkout, Payment Element), and migrating from deprecated Stripe APIs. Use
  when building, modifying, or reviewing any Stripe integration — including
  accepting payments, building marketplaces, integrating Stripe, processing
  payments, setting up subscriptions, or creating connected accounts.
---

Latest Stripe API version: **2026-03-25.dahlia**. Always use the latest API version and SDK unless the user specifies otherwise.

## Integration routing

| Building…                             | Recommended API                     | Details |
| ------------------------------------- | ----------------------------------- | ------- |
| One-time payments                     | Checkout Sessions                   | -       |
| Custom payment form with embedded UI  | Checkout Sessions + Payment Element | -       |
| Saving a payment method for later     | Setup Intents                       | -       |
| Connect platform or marketplace       | Accounts v2 (`/v2/core/accounts`)   | -       |
| Subscriptions or recurring billing    | Billing APIs + Checkout Sessions    | -       |
| Embedded financial accounts / banking | v2 Financial Accounts               | -       |

## Key documentation

- [Integration Options](https://docs.stripe.com/payments/payment-methods/integration-options.md) — Start here when designing any integration.
- [API Tour](https://docs.stripe.com/payments-api/tour.md) — Overview of Stripe’s API surface.
- [Go Live Checklist](https://docs.stripe.com/get-started/checklist/go-live.md) — Review before launching.
