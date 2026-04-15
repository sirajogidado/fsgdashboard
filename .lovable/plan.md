

# Plan: Remove Mock Data and Connect All Modules to Database

## Summary
Remove all hardcoded mock/sample data from 25+ components and connect them to live database tables. Create missing database tables for modules that don't have them yet. After this, the platform will show empty tables ready for real data entry, while preserving existing user accounts and directorates.

## Step 1: Database Migration — Create Missing Tables

Create the following tables that don't exist yet but are needed by components:

- **aircraft_status** — for ACStatusList (aoc_holder, registration_mark, aircraft_type, serial_number, cofa_expiry, registered_owner, status)
- **amo_licenses** — for LocalAMOList (holder_criteria, approval_number, maintenance_location, expiry_date, status)
- **ato_licenses** — for ATOList (organization_name, certificate_number, training_type, issue_date, expiry_date, status)
- **acceptance_certificates** — for AcceptanceCertificateList (certificate_number, aircraft_manufacturer, aircraft_type, serial_number, issue_date, status)
- **aircraft_types** — Global (type_name, manufacturer, category, description)
- **aircraft_manufacturers** — Global (manufacturer_name, country, description)
- **operation_types** — Global (operation_type, category, description)
- **state_of_registry** — Global (country_name, country_code, registration_prefix)
- **training_organizations** — Global (organization_name, country, category, description)
- **travel_agencies** — Global (agency_name, location, contact_person, description)
- **foreign_registration_marks** — Global (registration_mark, country, description)
- **certificate_types** — Global (certificate_name, category, validity, description)
- **foreign_airlines** — Global (airline_name, country, iata_code, icao_code)
- **user_roles_config** — Global (role_name, description, permissions)

All tables get RLS policies (public access for now), `id uuid` primary key, `created_at`/`updated_at` timestamps.

## Step 2: Update List/Table Components (25 files)

Replace hardcoded data with Supabase queries in each component:

**Module Lists (fetch from DB, show empty if no records):**
- `ACStatusList.tsx` → query `aircraft_status`
- `LocalAMOList.tsx` → query `amo_licenses`
- `ForeignAMOList.tsx` → query `foreign_amo`
- `AOCList.tsx` → query `aoc_certificates`
- `ATOList.tsx` → query `ato_licenses`
- `AcceptanceCertificateList.tsx` → query `acceptance_certificates`
- `FOCCMCCList.tsx` → query `focc_mcc_records`
- `ForeignAirlineDACLList.tsx` → query `foreign_airline_dacl`
- `PAASList.tsx` → query `paas_licenses`
- `AuditTrailPage.tsx` → query `audit_trail`

**Global Tables (fetch from DB, show empty if no records):**
- `AircraftTypeTable.tsx` → query `aircraft_types`
- `AircraftManufacturerTable.tsx` → query `aircraft_manufacturers`
- `OperationTypeTable.tsx` → query `operation_types`
- `StateOfRegistryTable.tsx` → query `state_of_registry`
- `TrainingOrganizationTable.tsx` → query `training_organizations`
- `TravelAgencyTable.tsx` → query `travel_agencies`
- `ForeignRegistrationMarkTable.tsx` → query `foreign_registration_marks`
- `CertificateTypeTable.tsx` → query `certificate_types`
- `ForeignAMOTable.tsx` → query `foreign_amo`
- `ForeignAirlineTable.tsx` → query `foreign_airlines`
- `GeneralAviationTable.tsx` → query `general_aviation`
- `UserRolesTable.tsx` → query `user_roles_config`
- `AuditTrailTable.tsx` → query `audit_trail`

Each component will:
1. Use `useState` + `useEffect` to fetch data from Supabase on mount
2. Show a loading state while fetching
3. Show "No records found" when empty
4. Support real delete (call `supabase.from(...).delete()`)
5. Refresh data after delete

## Step 3: Update Form Components

Update form dropdowns that use mock arrays to fetch from related DB tables instead:
- `AcceptanceCertificateForm.tsx` — fetch aircraft manufacturers from `aircraft_manufacturers`
- `ForeignAMOForm.tsx` — fetch from `foreign_amo` global table
- `FOCCMCCForm.tsx` — fetch from `general_aviation`, `state_of_registry`
- `ATOForm.tsx` — fetch from `training_organizations`
- `ForeignAirlineDACLForm.tsx` — fetch from `foreign_airlines`
- Economic License forms (PAAS, AOP, PNCF, ATOL) — fetch AOC data from `aoc_certificates`

## Step 4: Update Form Save Handlers

Ensure all form "save" handlers actually insert/update records in the database instead of just showing a toast.

## Files Changed
- `supabase/migrations/` — 1 new migration with ~14 CREATE TABLE statements
- ~25 list/table component files — replace mock data with DB queries
- ~10 form component files — replace mock dropdowns with DB queries and wire up save

## What Stays
- All user accounts (admin, reader, technical, daas, datr)
- All directorates (DAWS, DAAS, DATR, DOLTS, ICT)
- Existing aerodrome certifications, safety inspections, personnel data
- Storage bucket and profile image functionality

