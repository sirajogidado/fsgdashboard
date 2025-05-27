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
