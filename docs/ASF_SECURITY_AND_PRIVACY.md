# ASF Digital Platform — Security, Privacy & Compliance Architecture

**Classification:** Internal Technical Architecture & Compliance Guide
**Authoritative Security Principle:** Defense-in-depth with server-enforced Row-Level Security (RLS) as the single source of truth. Frontend authorization is for UX enhancement only.

---

## 1. Authentication Security

### 1.1 Passwordless Magic-Link Mechanics
- **Zero Passwords:** The system eliminates credential stuffing, dictionary attacks, and forgotten password burdens by relying strictly on cryptographically secure magic-link tokens.
- **Token Lifecycle:**
  - Token entropy: 128-bit cryptographically secure pseudorandom string.
  - Expiry: 15 minutes strict time-to-live (TTL).
  - Single-use: Once redeemed, the token is invalidated in the database.
- **Session Tokens (JWT):**
  - Stored in secure, HTTP-only, SameSite cookies or secure local browser storage.
  - Short-lived access tokens with automatic refresh token rotation.

---

## 2. Row-Level Security (RLS) Authorization Framework

### 2.1 Database Policies
Every PostgreSQL table is locked by default (`ALTER TABLE name ENABLE ROW LEVEL SECURITY;`).

```sql
-- 1. Public Content Read Policy
CREATE POLICY "Public Read Published Content" ON bible_studies
  FOR SELECT USING (status = 'published');

-- 2. Member Private Data Isolation
CREATE POLICY "Member Personal Notes Isolation" ON user_notes
  FOR ALL USING (auth.uid() = profile_id);

-- 3. Executive Role Authorization
CREATE POLICY "Bible Study Coordinator Write" ON bible_studies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM role_assignments ra
      JOIN roles r ON ra.role_id = r.id
      WHERE ra.profile_id = auth.uid()
      AND r.role_key = 'bible_study_coordinator'
      AND ra.revoked_at IS NULL
    )
  );
```

---

## 3. Multi-Person Governance & Deletion Workflows

### 3.1 Dual-Authorization for Critical Operations
- Destructive actions (such as permanent deletion of published Bible Studies or reassigning executive privileges) cannot be executed unilaterally by any single administrator.
- A multi-signature approval request (`approval_requests`) requires at least **2 affirmative votes** from designated executives (President, Publicity Coordinator, Technical Admin).
- Requires step-up re-authentication (a fresh magic-link challenge) before casting an approval vote.

---

## 4. Privacy & Data Protection (NDPA Compliance)

### 4.1 Data Minimization & Privacy Principles
- **No Intrusive Surveillance:** The platform does not track geolocation, physical movements, or device fingerprinting.
- **Private Spiritual Records:** Personal notes, bookmarks, prayer journals, and reading history are strictly private to the member. No administrator or teacher can query or view another member's personal spiritual data.
- **Foundation School Privacy:** FS student progress is visible only to their directly assigned teacher and the FS Coordinator.

### 4.2 Right to Erasure & Export
- Members can request a full export of their personal data (notes, profile, history) in standard JSON format.
- Members can request account closure, which anonymizes or purges personal data while preserving anonymous fellowship attendance aggregates.

---

## 5. Audit Logging & Tamper Evidence

### 5.1 Immutable Audit Trail
- All administrative operations (role assignment, content publication, approval decisions, profile status changes) write an immutable record to `audit_logs`.
- Logs include:
  - `actor_profile_id`
  - `action` (e.g. `ROLE_GRANTED`)
  - `entity_type` & `entity_id`
  - `ip_address` & `user_agent`
  - `metadata` (JSON snapshot of changed fields)
  - `created_at` (server timestamp)
- The audit table has no `UPDATE` or `DELETE` policies, preventing log alteration even by elevated users.
