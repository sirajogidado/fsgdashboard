export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string
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
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          session_name?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          session_name?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_reports: {
        Row: {
          content: string
          created_at: string | null
          data_sources: Json | null
          id: string
          report_type: string
          status: string | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          data_sources?: Json | null
          id?: string
          report_type: string
          status?: string | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          data_sources?: Json | null
          id?: string
          report_type?: string
          status?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      certificate_types: {
        Row: {
          category: string
          certificate_name: string
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
          validity: string
        }
        Insert: {
          category: string
          certificate_name: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          validity: string
        }
        Update: {
          category?: string
          certificate_name?: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
          validity?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_number: string
          certificate_type: string
          created_at: string | null
          document_url: string | null
          expiry_date: string
          extracted_data: Json | null
          id: string
          issue_date: string
          issuing_authority: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          certificate_number: string
          certificate_type: string
          created_at?: string | null
          document_url?: string | null
          expiry_date: string
          extracted_data?: Json | null
          id?: string
          issue_date: string
          issuing_authority: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          certificate_number?: string
          certificate_type?: string
          created_at?: string | null
          document_url?: string | null
          expiry_date?: string
          extracted_data?: Json | null
          id?: string
          issue_date?: string
          issuing_authority?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      compliance_alerts: {
        Row: {
          alert_type: string
          certificate_id: string | null
          created_at: string | null
          id: string
          message: string
          severity: string | null
          status: string | null
        }
        Insert: {
          alert_type: string
          certificate_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          severity?: string | null
          status?: string | null
        }
        Update: {
          alert_type?: string
          certificate_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          severity?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compliance_alerts_certificate_id_fkey"
            columns: ["certificate_id"]
            isOneToOne: false
            referencedRelation: "certificates"
            referencedColumns: ["id"]
          },
        ]
      }
      document_analysis: {
        Row: {
          analysis_result: Json | null
          confidence_score: number | null
          created_at: string | null
          extracted_text: string | null
          file_name: string
          file_url: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          analysis_result?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name: string
          file_url: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          analysis_result?: Json | null
          confidence_score?: number | null
          created_at?: string | null
          extracted_text?: string | null
          file_name?: string
          file_url?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focc_mcc_records: {
        Row: {
          aircraft_reg_number: string
          aircraft_type: string
          created_at: string | null
          focc_number: string
          id: string
          mcc_number: string
          operator_type: string
          updated_at: string | null
          validity_date: string
        }
        Insert: {
          aircraft_reg_number: string
          aircraft_type: string
          created_at?: string | null
          focc_number: string
          id?: string
          mcc_number: string
          operator_type: string
          updated_at?: string | null
          validity_date: string
        }
        Update: {
          aircraft_reg_number?: string
          aircraft_type?: string
          created_at?: string | null
          focc_number?: string
          id?: string
          mcc_number?: string
          operator_type?: string
          updated_at?: string | null
          validity_date?: string
        }
        Relationships: []
      }
      foreign_airline_dacl: {
        Row: {
          airline_name: string
          approval: string
          country: string
          created_at: string | null
          expiry_date: string
          id: string
          issue_date: string
          status: string
          updated_at: string | null
        }
        Insert: {
          airline_name: string
          approval: string
          country: string
          created_at?: string | null
          expiry_date: string
          id?: string
          issue_date: string
          status?: string
          updated_at?: string | null
        }
        Update: {
          airline_name?: string
          approval?: string
          country?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          issue_date?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_airlines: {
        Row: {
          airline_name: string
          country: string
          created_at: string | null
          iata_code: string
          icao_code: string
          id: string
          updated_at: string | null
        }
        Insert: {
          airline_name: string
          country: string
          created_at?: string | null
          iata_code: string
          icao_code: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          airline_name?: string
          country?: string
          created_at?: string | null
          iata_code?: string
          icao_code?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_amo: {
        Row: {
          amo_name: string
          country: string
          created_at: string | null
          description: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          amo_name: string
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Update: {
          amo_name?: string
          country?: string
          created_at?: string | null
          description?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      foreign_registration_marks: {
        Row: {
          country: string
          created_at: string | null
          description: string | null
          id: string
          registration_mark: string
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          registration_mark: string
          updated_at?: string | null
        }
        Update: {
          country?: string
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
          aircraft_type: string
          created_at: string | null
          description: string | null
          id: string
          operator_name: string
          registration_mark: string
          updated_at: string | null
        }
        Insert: {
          aircraft_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          operator_name: string
          registration_mark: string
          updated_at?: string | null
        }
        Update: {
          aircraft_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          operator_name?: string
          registration_mark?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      operation_types: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          operation_type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          operation_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pending_registrations: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          phone_number: string | null
          rejection_reason: string | null
          requested_directorate: string
          requested_role: string
          status: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email: string
          full_name: string
          id?: string
          phone_number?: string | null
          rejection_reason?: string | null
          requested_directorate: string
          requested_role: string
          status?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone_number?: string | null
          rejection_reason?: string | null
          requested_directorate?: string
          requested_role?: string
          status?: string
        }
        Relationships: []
      }
      predictive_analytics: {
        Row: {
          analysis_type: string
          confidence_score: number | null
          created_at: string | null
          id: string
          input_data: Json
          predictions: Json
        }
        Insert: {
          analysis_type: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data: Json
          predictions: Json
        }
        Update: {
          analysis_type?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          input_data?: Json
          predictions?: Json
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      state_of_registry: {
        Row: {
          country_code: string
          country_name: string
          created_at: string | null
          id: string
          registration_prefix: string
          updated_at: string | null
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string | null
          id?: string
          registration_prefix: string
          updated_at?: string | null
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string | null
          id?: string
          registration_prefix?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      training_organizations: {
        Row: {
          category: string
          country: string
          created_at: string | null
          description: string | null
          id: string
          organization_name: string
          updated_at: string | null
        }
        Insert: {
          category: string
          country: string
          created_at?: string | null
          description?: string | null
          id?: string
          organization_name: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          country?: string
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
          contact_person: string
          created_at: string | null
          description: string | null
          id: string
          location: string
          updated_at: string | null
        }
        Insert: {
          agency_name: string
          contact_person: string
          created_at?: string | null
          description?: string | null
          id?: string
          location: string
          updated_at?: string | null
        }
        Update: {
          agency_name?: string
          contact_person?: string
          created_at?: string | null
          description?: string | null
          id?: string
          location?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          directorate: string
          email: string
          id: string
          is_active: boolean | null
          name: string
          password_hash: string
          phone_number: string | null
          profile_image: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          directorate: string
          email: string
          id?: string
          is_active?: boolean | null
          name: string
          password_hash: string
          phone_number?: string | null
          profile_image?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          directorate?: string
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string
          password_hash?: string
          phone_number?: string | null
          profile_image?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_certificate_expiry: {
        Args: Record<PropertyKey, never>
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
