# OLION Security Release Runbook

This runbook covers the authentication, access-control, and Socket.IO changes in the security remediation branch. It is intended for a controlled staging rollout before any production activation.

## 1. Release boundaries

The remediation branch adds:

- Email-verification state on users and one-time authentication tokens.
- Password-reset and email-verification endpoints.
- JWT session-version checks for HTTP and Socket.IO.
- Enforcement of the email-verification feature flag across required and optional HTTP authentication and Socket.IO handshakes.
- Password-change and password-reset session revocation.
- Additional API access-control and Socket.IO authorization regression tests.

The database migration is additive. It expects the existing OLION `"User"` table and does not create the rest of the OLION schema. The migration has **not** been applied to production by this change. Do not run `prisma db push`, `prisma migrate reset`, or destructive schema operations against production.

## 2. Environment configuration

Configure these values in the backend deployment environment:

| Variable | Requirement |
|---|---|
| `FRONTEND_URL` | Canonical frontend origin. Must be HTTPS when `NODE_ENV=production`. |
| `SMTP_HOST` | SMTP hostname. |
| `SMTP_PORT` | SMTP port, commonly 587 or 465 according to the provider. |
| `SMTP_SECURE` | Set according to the provider's TLS mode. |
| `SMTP_USER` / `SMTP_PASS` | Configure both or leave both empty if the provider permits unauthenticated relay. |
| `SMTP_FROM` | Valid sender identity permitted by the provider. |
| `REQUIRE_EMAIL_VERIFICATION` | Keep `false` during initial staging verification. |

Never commit SMTP credentials or copy them into issue comments. Use the deployment provider's encrypted environment-variable store. Confirm outbound SMTP connectivity and provider sender-domain verification separately.

## 3. Database preflight and migration

Before applying the migration to any persistent database:

1. Identify the exact target database and deployment environment.
2. Take a database backup and verify that the backup can be restored.
3. Confirm that the existing `"User"` table and `"User"."id"` column match the expected OLION schema.
4. Review `prisma/migrations/20261108030000_auth_tokens_email_verification/migration.sql` and compare it with the actual target schema.
5. Inspect `_prisma_migrations` history. This repository does not contain a complete historical baseline for all existing OLION tables, so do not assume a blank database can be provisioned by this single migration.
6. Apply only after a database owner has approved the target and the migration plan.

For an approved existing target, use the deployment migration process:

```bash
cd backend
npx prisma migrate status
npx prisma migrate deploy
npx prisma migrate status
```

Do not use `migrate dev` against production. Do not use `db push` as a substitute for a reviewed production migration. Verify the resulting columns and table:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'User'
  AND column_name IN ('emailVerifiedAt', 'tokenVersion');

SELECT table_name
FROM information_schema.tables
WHERE table_name = 'AuthToken';
```

Expected result: `emailVerifiedAt` is nullable, `tokenVersion` is an integer with default 0, and `AuthToken` exists with its unique token-hash index, lookup indexes, and cascading user foreign key.

## 4. Staging rollout sequence

1. Deploy the backend code with `REQUIRE_EMAIL_VERIFICATION=false`.
2. Deploy the frontend and confirm that it points to the intended staging API and Socket.IO origins.
3. Configure SMTP and HTTPS `FRONTEND_URL`; restart/redeploy the backend so the process loads the values.
4. Verify SMTP delivery using controlled test accounts. Do not use real user credentials or production personal data.
5. Exercise email verification and password recovery end-to-end.
6. Confirm that old unverified accounts can request and complete verification.
7. Review the number of remaining unverified accounts:
   
   ```sql
   SELECT COUNT(*) AS unverified_users
   FROM "User"
   WHERE "emailVerifiedAt" IS NULL;
   ```

8. Only after account migration/support readiness is confirmed, enable `REQUIRE_EMAIL_VERIFICATION=true` in staging.
9. Retest all protected HTTP and Socket.IO paths with both verified and unverified controlled accounts.

Enabling the flag blocks unverified accounts from protected HTTP routes and Socket.IO, including accounts that still hold JWTs issued before the flag was enabled. It also makes unverified optional-auth requests behave as guests. Existing users must be given a working verification path before enabling the flag.

## 5. Authentication acceptance tests

Use separate controlled accounts and fresh browser profiles.

| Test | Expected result |
|---|---|
| Register while the flag is enabled | Account is created without an authenticated JWT; verification link is sent. |
| Open verification URL without pressing the confirmation button | Token remains unused. |
| Explicitly confirm a valid verification token | Email becomes verified; token is consumed. |
| Reuse or replay a consumed token | Rejected. |
| Use an expired token | Rejected. |
| Request a replacement verification token | Previous active token is invalidated. |
| Request reset for a known or unknown email | Same public status and response message. |
| Reset password with a valid token | Password changes; reset tokens are consumed; `tokenVersion` increments. |
| Reuse a password-reset token | Rejected; no further password change. |
| Use an old JWT after password reset | HTTP authentication rejects it. |
| Change password from a logged-in session | Other sessions are invalidated; current browser receives a rotated JWT. |
| Use an unverified legacy JWT with verification required | Protected HTTP route returns `403 EMAIL_NOT_VERIFIED`. |
| Connect Socket.IO with an unverified legacy JWT | Handshake is rejected. |
| Connect with verified account and current JWT version | Handshake succeeds. |
| Send an email through an invalid SMTP configuration | Public request remains generic where applicable; no usable token should be left after a delivery failure. |

Also retest Google login and account linking using a Google ID token whose `email_verified` claim is true. Existing password accounts must authenticate to OLION before linking the Google identity.

## 6. Access-control and real-time regression

Retest the existing API and Socket.IO controls with controlled users representing USER, EXPERT, MODERATOR, and ADMIN:

- Hidden discussion detail, comments, votes, bookmarks, and view counters.
- Ownership checks for discussion, comment, and bookmark mutations.
- Conversation message read/send operations by participants and non-participants.
- Call invite, accept, reject, cancel, end, and signaling events.
- Invalid call types, oversized SDP, malformed ICE data, and cross-conversation call attempts.

Automated tests use a local Express/Socket.IO server and synthetic fixtures; the Prisma database operations in those suites are mocked. Those tests are not a substitute for a staging test against a migrated database.

## 7. Deployment configuration and operational notes

- Set `ALLOWED_ORIGINS` to exact frontend origins. CORS is not an authorization mechanism; JWT and server-side membership/ownership checks remain mandatory.
- Ensure the frontend API URL and Socket.IO URL point to the same intended environment.
- Keep CSP in Report-Only until real browser reports are reviewed and required Google Identity, API, upload, and WebRTC flows are validated.
- The current Express rate limiters use the default in-memory store. In a multi-instance or serverless deployment, limits are instance-local. Use a shared rate-limit store or edge/API-gateway controls before relying on them as a global abuse-control boundary.
- Email tokens are stored as SHA-256 hashes; never log or return raw tokens.
- Confirm sender-domain SPF, DKIM, and DMARC at the mail provider before production rollout to reduce delivery and spoofing problems.


### PostgreSQL provisioning through Vercel Marketplace (no Neon)

OLION requires PostgreSQL for Prisma. The selected Vercel-managed workflow is **Prisma Postgres**, installed from the Vercel Marketplace. This is a Vercel Native Marketplace integration; the database is operated by Prisma and its usage is billed through Vercel. It is not a PostgreSQL process hosted inside a Vercel Function. Do not provision or connect Neon for this staging setup.

1. In the Vercel team dashboard, open Marketplace and install [Prisma Postgres](https://vercel.com/marketplace/prisma/prisma-postgres).
2. Create a new database resource named `olion-staging`. Do not reuse the existing Production database and do not import Production user data.
3. Connect that resource only to the `olion-api` Vercel project and select **Preview only**. Do not connect it to Production or Development. The frontend project does not need a database connection.
4. The integration supplies a direct `DATABASE_URL` and a pooled `DATABASE_URL_POOLED`. Prisma CLI migration commands use the direct URL. The API's Prisma Client prefers the pooled URL and falls back to `DATABASE_URL` for other PostgreSQL providers.
5. On `olion-api`, create `OLION_PREVIEW_DATABASE_ISOLATED=true` for Preview branch `security/vapt-remediation-2026-11` only. Do not make this a global Preview variable. Other Preview branches remain fail-closed.
6. Configure branch-specific `ALLOWED_ORIGINS` with only the new frontend Preview origin. On `olion`, configure branch-specific `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SOCKET_URL` to the new API Preview origin. Do not add Production URLs to these Preview values.
7. Redeploy both projects from the remediation branch after every required environment variable has been saved.

#### Rehearsing the existing-schema migration on the empty staging database

The repository does not contain a complete historical migration baseline. Therefore, a brand-new staging database must first be initialized to the **pre-remediation** OLION schema, then the new additive migration must be applied. On a clean, empty `olion-staging` database only:

```bash
git fetch origin main
git show origin/main:backend/prisma/schema.prisma > /tmp/olion-pre-remediation-schema.prisma

cd backend
DATABASE_URL="$STAGING_DATABASE_URL" npx prisma db push --schema /tmp/olion-pre-remediation-schema.prisma
DATABASE_URL="$STAGING_DATABASE_URL" npx prisma migrate deploy
DATABASE_URL="$STAGING_DATABASE_URL" npx prisma migrate status
```

This sequence is permitted only against the newly created empty staging database. It builds the old schema without Production data, then tests the exact remediation migration against that schema. Do not use this procedure against Production. Afterward, verify `User.emailVerifiedAt`, `User.tokenVersion`, and `AuthToken` plus its indexes and foreign key before enabling the Preview guard marker and deploying the API.

### Preview database isolation gate

Vercel Preview deployments are deliberately fail-closed. Before the API can initialize Prisma on a Preview deployment, it requires:

- `OLION_PREVIEW_DATABASE_ISOLATED=true` scoped only to the intended Preview Git branch.
- A valid remote PostgreSQL `DATABASE_URL` scoped only to that same Preview branch.
- No Preview-scoped Production database credentials or provider credentials.

The source guard is implemented in `src/config/databaseEnvironmentGuard.js` and runs before `PrismaClient` initialization. Production and local development are unaffected. Do not set the marker until the Neon branch is confirmed to contain schema only and the branch-specific connection URL has been installed. The marker is not a substitute for verifying the actual Neon branch and endpoint.

When the staging API deployment is ready, add a branch-scoped Preview `ALLOWED_ORIGINS` with the exact staging frontend origin. The frontend must receive a branch-scoped Preview `NEXT_PUBLIC_API_URL` that points to that API Preview deployment. Do not use Production origins, API keys, JWT secrets, upload credentials, or AI keys in Preview.

## 8. Rollback

The schema change is additive. If a rollout must be stopped:

1. Set `REQUIRE_EMAIL_VERIFICATION=false` and redeploy/restart the backend.
2. Keep the added columns and `AuthToken` table in place; do not drop them as an emergency rollback.
3. Keep SMTP credentials in the deployment secret store; disable outbound delivery at the provider or by removing SMTP configuration if necessary.
4. Preserve logs without secrets and capture the failing request, request ID, and relevant deployment SHA.
5. Revert application code only through a reviewed rollback commit. Do not reset the production database.

Setting the feature flag back to false restores compatibility for unverified accounts, but does not reverse password changes or restore previously revoked JWT sessions.

## 9. Release exit criteria

Production activation should wait until all of the following are true:

- The approved database backup and migration have been verified.
- SMTP send/receive and HTTPS link generation work in the deployed environment.
- The full regression suite and production build pass on the exact release SHA.
- Controlled staging tests pass for verified and unverified users, old JWTs, password reset, and Socket.IO.
- The unverified-account count and communication plan are approved.
- CSP reports, CORS allowlist, and distributed rate-limit strategy have been reviewed.

A successful unit/CI run alone does not establish production readiness.
