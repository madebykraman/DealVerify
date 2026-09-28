# DealVerify Supabase setup

The dedicated Supabase project is already created.

- Project: DealVerify
- Project ref: mdjpmydholvwedxzxnlk
- Region: ap-south-1
- Project URL: https://mdjpmydholvwedxzxnlk.supabase.co

## Runtime variables

Set these in Vercel and local development:

```
NEXT_PUBLIC_SUPABASE_URL=https://mdjpmydholvwedxzxnlk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable key>
SUPABASE_SERVICE_ROLE_KEY=<Supabase server-only service role key>
DEALVERIFY_INGESTION_SECRET=<random long secret>
```

The publishable key is safe to expose to the browser. The service-role key is server-only and must never be committed or prefixed with `NEXT_PUBLIC_`.

## What is already done

- Supabase project created.
- Core schema applied.
- RLS enabled.
- Own-user settings policies applied.
- Pincode-scoped verified-deal read policy applied.
- Five seed monitored accounts inserted.
- Server-side authenticated settings/feed code wired.
- Server-only ingestion client and protected ingestion endpoint added.

## What Aman still needs to do

1. Copy the Supabase publishable key into Vercel as `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Copy the Supabase service-role key into Vercel as `SUPABASE_SERVICE_ROLE_KEY`.
3. Generate a long random `DEALVERIFY_INGESTION_SECRET` and add it to Vercel.
4. Redeploy after adding the variables.
5. For local development, put the same values in `.env.local`.

Do not commit `.env.local` or any service-role key.

## Current product boundary

The ingestion service deliberately requires trusted `livePrice`, `inStock`, and `deliverable` inputs. Price history is no longer caller-supplied; it is derived from `price_observations`.

The next production ingestion step is to connect the Amazon/Flipkart adapters to a real pincode-delivery check and call the protected ingestion endpoint only after that check passes.
