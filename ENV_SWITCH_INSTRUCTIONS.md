
# Switching Between Staging and Production Supabase Environments

You can run your app against either your production or staging Supabase project.

## How to Switch Environments (in the browser or locally)

1. **Set Environment Variable**
    - Open the browser Console on your app (`F12` or `Ctrl+Shift+I`).
    - Run the following code:
      - To use staging: `localStorage.setItem('env', 'staging'); window.location.reload();`
      - To switch back to production: `localStorage.setItem('env', 'production'); window.location.reload();`

2. **Update Your Staging Supabase Keys**
    - Edit `src/config/env.ts` with your staging project's `SUPABASE_URL` and `SUPABASE_ANON_KEY` from your Supabase dashboard.

3. **(Optional) Use Separate Deployments**
    - For production/staging deployments (e.g., with Vercel), set environment variables at build time or deploy separate code branches with different `env.ts` values.

## Keeping Databases in Sync

- Use the SQL migration files in `supabase/migrations/` to migrate both databases.
- Run all schema changes in both staging and production in order.

## Production Safety Tip

- **Never put real patient data into staging.**
- Only test with fake/demo accounts/data in your staging environment.

