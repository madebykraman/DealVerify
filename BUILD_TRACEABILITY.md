# DealVerify build traceability

This file maps the September 2026 product brief to implementation status. The brief is the product source of truth.

## Implemented in the current foundation

| Brief area | Requirement | Status |
| --- | --- | --- |
| Executive promise | Only real, available, historically good deals reach users | UI/product architecture established; live verification pending |
| Branding | DealVerify + “Only real deals. Verified.” | Implemented |
| Colors | Trust Green #0F766E, Deep Teal #0D9488, white/slate surfaces, amber priority | Implemented |
| Typography | Inter/system stack, tabular-feeling price hierarchy | Implemented with system/Inter fallback |
| PWA | Mobile-first standalone app shell | Manifest + viewport metadata implemented |
| Splash | 1.2–1.8 second branded loading | Implemented at 1.4s |
| Welcome | “Stop clicking dead deals.” + explanation | Implemented |
| Pincode | 6-digit Indian pincode, numeric input, validation | Implemented |
| Priority | Default ₹500 threshold, adjustable | Implemented |
| Home | Verified feed, pincode indicator, settings, priority treatment | Implemented |
| DealCard | Verified badge, price, history note, priority state, source, actions | Implemented with mock data |
| Empty state | Silence presented as reassuring product behavior | Implemented |
| Settings | Pincode + priority threshold + verification explanation | Implemented locally |
| Data model | users, monitored_accounts, verified_deals, price_observations | SQL migration added |
| Security | RLS and user ownership boundaries | SQL migration added |

## Intentionally not faked yet

The brief explicitly sequences real extraction after the UI foundation. Live Amazon/Flipkart extraction, pincode delivery verification, historical price assessment, X ingestion, deduplication, push notifications, and affiliate routing are not represented as “working” until their backend implementation exists. fileciteturn0file0L383-L389

## Product invariants

1. A candidate must have a product, price, and shopping link.
2. Live payable price must be <= claimed price.
3. Product must be in stock and deliverable to the user's exact pincode.
4. Recent price history must support the value signal.
5. Failed verification is discarded silently.
6. Duplicate products should collapse to one canonical deal.
7. Sub-threshold deals receive priority treatment.
8. Zero passing deals means zero notifications.

These are the core trust rules, not optional UI copy. fileciteturn0file0L67-L80

## Known prototype limitation

The current onboarding persists settings in browser localStorage so the vertical slice can be exercised without credentials. This is a prototype convenience, not the final secure persistence layer. The production path is Supabase Auth + the RLS-protected users table.
