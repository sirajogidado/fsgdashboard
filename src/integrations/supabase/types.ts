export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      acceptance_certificates: {
        Row: {
          aircraft_manufacturer: string | null
          aircraft_type: string | null
          certificate_number: string | null
          created_at: string | null
          id: string
          issue_date: string | null
          serial_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_manufacturer?: string | null
          aircraft_type?: string | null
          certificate_number?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_manufacturer?: string | null
          aircraft_type?: string | null
          certificate_number?: string | null
          created_at?: string | null
          id?: string
          issue_date?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aerodrome_certifications: {
        Row: {
          aerodrome_name: string
          category: string | null
          certificate_number: string
          certificate_type: string
          comments: string | null
          created_at: string | null
          expiry_date: string
          icao_code: string | null
          id: string
          issue_date: string
          last_inspection_date: string | null
          location: string
          next_inspection_date: string | null
          operator_name: string
          runway_count: number | null
          runway_length: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aerodrome_name: string
          category?: string | null
          certificate_number: string
          certificate_type: string
          comments?: string | null
          created_at?: string | null
          expiry_date: string
          icao_code?: string | null
          id?: string
          issue_date: string
          last_inspection_date?: string | null
          location: string
          next_inspection_date?: string | null
          operator_name: string
          runway_count?: number | null
          runway_length?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aerodrome_name?: string
          category?: string | null
          certificate_number?: string
          certificate_type?: string
          comments?: string | null
          created_at?: string | null
          expiry_date?: string
          icao_code?: string | null
          id?: string
          issue_date?: string
          last_inspection_date?: string | null
          location?: string
          next_inspection_date?: string | null
          operator_name?: string
          runway_count?: number | null
          runway_length?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aerodrome_personnel: {
        Row: {
          aerodrome_id: string | null
          created_at: string | null
          email: string | null
          full_name: string
          hire_date: string | null
          id: string
          phone: string | null
          position: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aerodrome_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          position: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aerodrome_id?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          hire_date?: string | null
          id?: string
          phone?: string | null
          position?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "aerodrome_personnel_aerodrome_id_fkey"
            columns: ["aerodrome_id"]
            isOneToOne: false
            referencedRelation: "aerodrome_certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          session_name: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_name?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_name?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_reports: {
        Row: {
          created_at: string | null
          id: string
          report_data: Json | null
          report_name: string | null
          report_type: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          report_data?: Json | null
          report_name?: string | null
          report_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          report_data?: Json | null
          report_name?: string | null
          report_type?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      aircraft_manufacturers: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          manufacturer_name: string
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          manufacturer_name: string
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          manufacturer_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      aircraft_status: {
        Row: {
          aircraft_type: string | null
          aoc_holder: string | null
          cofa_expiry: string | null
          created_at: string | null
          id: string
          registered_owner: string | null
          registration_mark: string | null
          serial_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_type?: string | null
          aoc_holder?: string | null
          cofa_expiry?: string | null
          created_at?: string | null
          id?: string
          registered_owner?: string | null
          registration_mark?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_type?: string | null
          aoc_holder?: string | null
          cofa_expiry?: string | null
          created_at?: string | null
          id?: string
          registered_owner?: string | null
          registration_mark?: string | null
          serial_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aircraft_types: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          manufacturer: string | null
          type_name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          manufacturer?: string | null
          type_name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          manufacturer?: string | null
          type_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      amo_licenses: {
        Row: {
          approval_number: string | null
          created_at: string | null
          expiry_date: string | null
          holder_criteria: string | null
          id: string
          maintenance_location: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          holder_criteria?: string | null
          id?: string
          maintenance_location?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          holder_criteria?: string | null
          id?: string
          maintenance_location?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aoc_certificates: {
        Row: {
          certificate_number: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      aop_licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      atl_licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ato_licenses: {
        Row: {
          certificate_number: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          organization_name: string | null
          status: string | null
          training_type: string | null
          updated_at: string | null
        }
        Insert: {
          certificate_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          organization_name?: string | null
          status?: string | null
          training_type?: string | null
          updated_at?: string | null
        }
        Update: {
          certificate_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          organization_name?: string | null
          status?: string | null
          training_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      atol_licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      audit_trail: {
        Row: {
          action: string
          created_at: string | null
          details: string | null
          id: string
          ip_address: string | null
          module: string | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: string | null
          module?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: string | null
          id?: string
          ip_address?: string | null
          module?: string | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: []
      }
      certificate_types: {
        Row: {
          category: string | null
          certificate_name: string
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          validity: string | null
        }
        Insert: {
          category?: string | null
          certificate_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          validity?: string | null
        }
        Update: {
          category?: string | null
          certificate_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          validity?: string | null
        }
        Relationships: []
      }
      directorates: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      document_analysis: {
        Row: {
          analysis_result: Json | null
          confidence_score: number | null
          created_at: string | null
          extracted_text: string | null
          file_name: string | null
          file_url: string | null
          id: string
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_result?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_result?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string | null
          file_url?: string | null
          id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          created_at: string | null
          file_type: string | null
          file_url: string | null
          id: string
          module: string | null
          name: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          module?: string | null
          name: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          module?: string | null
          name?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      fcop_licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      focc_mcc_records: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          operator_name: string | null
          record_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          operator_name?: string | null
          record_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          operator_name?: string | null
          record_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_airline_dacl: {
        Row: {
          airline_name: string | null
          country: string | null
          created_at: string | null
          id: string
          permit_number: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          airline_name?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          permit_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          airline_name?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          permit_number?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_airlines: {
        Row: {
          airline_name: string
          country: string | null
          created_at: string | null
          iata_code: string | null
          icao_code: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          airline_name: string
          country?: string | null
          created_at?: string | null
          iata_code?: string | null
          icao_code?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          airline_name?: string
          country?: string | null
          created_at?: string | null
          iata_code?: string | null
          icao_code?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_amo: {
        Row: {
          approval_number: string | null
          country: string | null
          created_at: string | null
          id: string
          organization_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approval_number?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          organization_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approval_number?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          organization_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_registration_marks: {
        Row: {
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          registration_mark: string
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          registration_mark: string
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          registration_mark?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      general_aviation: {
        Row: {
          aircraft_type: string | null
          created_at: string | null
          id: string
          operator_name: string | null
          registration: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aircraft_type?: string | null
          created_at?: string | null
          id?: string
          operator_name?: string | null
          registration?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aircraft_type?: string | null
          created_at?: string | null
          id?: string
          operator_name?: string | null
          registration?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      operation_types: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          operation_type: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      paas_licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pending_registrations: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone_number: string | null
          rejection_reason: string | null
          requested_directorate: string | null
          requested_role: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone_number?: string | null
          rejection_reason?: string | null
          requested_directorate?: string | null
          requested_role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          rejection_reason?: string | null
          requested_directorate?: string | null
          requested_role?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      personnel_certifications: {
        Row: {
          certification_name: string
          certification_number: string | null
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          issuing_authority: string | null
          personnel_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          certification_name: string
          certification_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          personnel_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          certification_name?: string
          certification_number?: string | null
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          issuing_authority?: string | null
          personnel_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personnel_certifications_personnel_id_fkey"
            columns: ["personnel_id"]
            isOneToOne: false
            referencedRelation: "aerodrome_personnel"
            referencedColumns: ["id"]
          },
        ]
      }
      pncl_licenses: {
        Row: {
          created_at: string | null
          expiry_date: string | null
          id: string
          issue_date: string | null
          license_number: string | null
          operator_name: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issue_date?: string | null
          license_number?: string | null
          operator_name?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      safety_inspections: {
        Row: {
          aerodrome_id: string | null
          completed_date: string | null
          compliance_status: string | null
          created_at: string | null
          findings: string | null
          id: string
          inspection_type: string
          inspector_name: string
          next_inspection_date: string | null
          recommendations: string | null
          scheduled_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          aerodrome_id?: string | null
          completed_date?: string | null
          compliance_status?: string | null
          created_at?: string | null
          findings?: string | null
          id?: string
          inspection_type: string
          inspector_name: string
          next_inspection_date?: string | null
          recommendations?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          aerodrome_id?: string | null
          completed_date?: string | null
          compliance_status?: string | null
          created_at?: string | null
          findings?: string | null
          id?: string
          inspection_type?: string
          inspector_name?: string
          next_inspection_date?: string | null
          recommendations?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_inspections_aerodrome_id_fkey"
            columns: ["aerodrome_id"]
            isOneToOne: false
            referencedRelation: "aerodrome_certifications"
            referencedColumns: ["id"]
          },
        ]
      }
      state_of_registry: {
        Row: {
          country_code: string | null
          country_name: string
          created_at: string | null
          id: string
          registration_prefix: string | null
          updated_at: string | null
        }
        Insert: {
          country_code?: string | null
          country_name: string
          created_at?: string | null
          id?: string
          registration_prefix?: string | null
          updated_at?: string | null
        }
        Update: {
          country_code?: string | null
          country_name?: string
          created_at?: string | null
          id?: string
          registration_prefix?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      training_organizations: {
        Row: {
          category: string | null
          country: string | null
          created_at: string | null
          description: string | null
          id: string
          organization_name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          organization_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      travel_agencies: {
        Row: {
          agency_name: string
          contact_person: string | null
          created_at: string | null
          description: string | null
          id: string
          location: string | null
          updated_at: string | null
        }
        Insert: {
          agency_name: string
          contact_person?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
        }
        Update: {
          agency_name?: string
          contact_person?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles_config: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          permissions: Json | null
          role_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          permissions?: Json | null
          role_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          permissions?: Json | null
          role_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          token: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          token: string
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          directorate: string | null
          email: string
          id: string
          is_active: boolean | null
          name: string
          password_hash: string
          phone_number: string | null
          profile_image: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          directorate?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          password_hash: string
          phone_number?: string | null
          profile_image?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          directorate?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          password_hash?: string
          phone_number?: string | null
          profile_image?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      approve_pending_registration: {
        Args: { registration_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
