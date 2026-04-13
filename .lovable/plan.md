

# Plan: Database Function, Test Users, and Registration Approval

## What This Plan Does

1. **Create the `approve_pending_registration` database function** that takes a pending registration ID, creates a user in the `users` table with default password "password", and updates the registration status to "approved"
2. **Seed the directorates table** with DAWS, DAAS, DATR, DOLTS, ICT entries
3. **Create 4 additional test user accounts**:
   - **Reader User** (`reader@ncaa.gov.ng` / `reader123`) — Role: "Read and View", Directorate: DAWS — can only view data
   - **Technical User** (`technical@ncaa.gov.ng` / `tech123`) — Role: "Technical", Directorate: DAWS — can read and write
   - **DAAS User** (`daas@ncaa.gov.ng` / `daas123`) — Role: "Technical", Directorate: DAAS — only sees DAAS module
   - **DATR User** (`datr@ncaa.gov.ng` / `datr123`) — Role: "Technical", Directorate: DATR — only sees DATR/Economic License views

## Technical Details

### Step 1: Database Migration
Create the `approve_pending_registration` SQL function:
```sql
CREATE OR REPLACE FUNCTION public.approve_pending_registration(registration_id uuid)
RETURNS void AS $$
DECLARE
  reg RECORD;
BEGIN
  SELECT * INTO reg FROM pending_registrations WHERE id = registration_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Registration not found'; END IF;
  
  INSERT INTO users (name, email, phone_number, directorate, role, password_hash)
  VALUES (reg.full_name, reg.email, reg.phone_number, reg.requested_directorate, 
          COALESCE(reg.requested_role, 'Read and View'), 'password');
  
  UPDATE pending_registrations SET status = 'approved', updated_at = now() 
  WHERE id = registration_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Step 2: Insert Seed Data
- Insert directorates: DAWS, DAAS, DATR, DOLTS, ICT
- Insert 4 test user accounts with the credentials listed above

### Step 3: Fix PendingRegistrations Component
Update the `handleApprove` call to use the RPC function properly (remove the `as any` cast since the function will now exist in the types).

### Step 4: Test Login
Navigate to the app and verify admin login works with `admin@ncaa.gov.ng` / `admin123`.

## Test Accounts Summary

| Email | Password | Role | Directorate | Access |
|-------|----------|------|-------------|--------|
| admin@ncaa.gov.ng | admin123 | Super User | ICT | Full access |
| reader@ncaa.gov.ng | reader123 | Read and View | DAWS | View only |
| technical@ncaa.gov.ng | tech123 | Technical | DAWS | Read & write |
| daas@ncaa.gov.ng | daas123 | Technical | DAAS | DAAS module only |
| datr@ncaa.gov.ng | datr123 | Technical | DATR | Economic License only |

