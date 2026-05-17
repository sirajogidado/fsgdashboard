# Phase 2 Build Plan

You picked three pillars (**Workflow & Approvals**, **Operator Self-Service Portal**, **Compliance Automation / expiry engine**) plus **Email + SMS** notifications. This is a large body of work, so I'll ship it in **4 milestones** you can approve and test one at a time.

---

## Milestone 1 — Foundations (workflow + notifications wiring)

**Goal:** every record in the platform gains a workflow lifecycle, and the system can send an email or SMS when something happens.

### Database
- New `workflow_stages` table — global stage definitions (Draft, Submitted, Inspector Review, Director Approval, Issued, Rejected).
- New `record_workflow` table — links any record (table_name + record_id) to its current stage, assigned approver, and history of transitions.
- New `notifications` table — in-app inbox per user (title, body, link, read flag).
- New `notification_preferences` table — per-user toggles (email on/off, SMS on/off, per category).

### Backend (Edge Functions)
- `workflow-engine` — submit / approve / reject / reassign actions. Logs every transition to `audit_trail`.
- `send-notification` — single dispatcher; takes `{user_id, channel, template, data}` and routes to in-app + email + SMS based on prefs.
- Twilio integration for SMS (we'll request the Twilio API key here).
- Email infrastructure setup (requires you to configure a sender domain — handled via the email setup dialog).

### Frontend
- "My Approvals" page — queue of records awaiting the logged-in user's action.
- Stage badge + "Submit / Approve / Reject" action bar on every existing record detail page.
- Bell icon in the header → notifications dropdown + full inbox page.
- Notification preferences in Profile page.

---

## Milestone 2 — Compliance Automation (expiry engine)

**Goal:** the platform proactively chases expiring certificates instead of waiting to be checked.

### Backend
- `expiry-scanner` Edge Function — runs daily via `pg_cron`. Scans every certificate table (AOC, ATO, AMO, Aerodrome, PAAS, AOP, ATL, ATOL, FCOP, PNCL, Acceptance) for `expiry_date` within 90 / 60 / 30 / 7 days.
- For each match: creates a notification, optionally drafts a renewal record, and tags the record with a risk level.
- Skips duplicates so the same cert isn't notified twice in the same window.

### Frontend
- **Expiry Dashboard** — heatmap + table of all expiring certificates grouped by directorate, with filters and CSV export.
- **Risk badge** on every certificate list (green / amber / red / expired).
- "Generate Renewal" button on expiring records — pre-fills a new application linked to the previous certificate.

---

## Milestone 3 — Operator Self-Service Portal

**Goal:** external operators (airlines, AMOs, ATOs, training orgs) can log in, submit applications, upload supporting documents, and track status — without staff data entry.

### Database
- `operators` table — external organisations (name, type, country, contact email).
- `operator_users` table — login accounts tied to an operator (separate from staff `users`).
- `applications` table — generic application record (operator_id, application_type, payload jsonb, current workflow stage, attached documents).
- Extends the auth-api Edge Function with `operator_login` / `operator_register` actions and a separate session namespace.

### Frontend (new public site at `/portal`)
- Public landing page with NCAA branding.
- Operator registration + login.
- Operator dashboard: my applications, status, documents, certificates issued.
- Application submission wizard (chooses application type → dynamic form → upload docs → submit).
- Read-only certificate viewer.

### Staff side
- "Applications Inbox" feeding the existing workflow engine — staff review operator submissions, approve/reject, issue certificates.

---

## Milestone 4 — Polish & Reporting

- AI-generated weekly summary email per directorate (uses existing AI features).
- PDF certificate generation on approval (issued certificates downloadable by operator and staff).
- Public verification page (`/verify/:certificate_number`) so third parties can confirm a certificate is genuine — read-only, no auth.
- Audit trail filters extended to cover workflow + notification + portal events.

---

## Technical Notes (for the developer)
- Workflow stages stored as a config table so super users can edit them later without code changes.
- `record_workflow` keyed by `(table_name, record_id)` to keep it generic across all 14 record types instead of one workflow column per table.
- Notifications follow a queue → dispatcher pattern; SMS uses Twilio gateway, email uses Lovable Email.
- Operator portal uses a separate session token namespace to keep staff and operator authentication isolated; both flow through the existing `auth-api` Edge Function with new actions.

---

## What I need from you before I start

1. **Email sender domain.** I'll trigger the setup dialog at the start of Milestone 1 — you'll add 2 NS records at your domain provider so emails come from `@yourdomain.gov.ng`.
2. **Twilio account** (or Africa's Talking — say which one). I'll request the API key/secret when we get to the SMS dispatcher in Milestone 1.
3. **Confirm the milestone order** — I recommend 1 → 2 → 3 → 4. If you'd rather I start with the Operator Portal (Milestone 3) before Compliance Automation, tell me now.

Reply **"go"** to start Milestone 1, or tell me what to change.