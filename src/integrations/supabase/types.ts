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
      pre_approval_leads: {
        Row: {
          additional_income: string | null
          annual_income: string
          city_province: string | null
          co_additional_income: string | null
          co_annual_income: string | null
          co_credit_score: string | null
          co_date_of_birth: string | null
          co_email: string | null
          co_employer_name: string | null
          co_employment_status: string | null
          co_first_name: string | null
          co_job_title: string | null
          co_last_name: string | null
          co_phone: string | null
          consent: boolean
          created_at: string
          credit_score: string | null
          current_payment: string | null
          date_of_birth: string | null
          down_payment: string | null
          email: string
          employer_name: string | null
          employment_status: string
          first_name: string
          first_time_buyer: string | null
          has_co_applicant: boolean
          id: string
          job_title: string | null
          last_name: string
          notes: string | null
          phone: string
          property_type: string | null
          purchase_price: string | null
          timeline: string | null
        }
        Insert: {
          additional_income?: string | null
          annual_income: string
          city_province?: string | null
          co_additional_income?: string | null
          co_annual_income?: string | null
          co_credit_score?: string | null
          co_date_of_birth?: string | null
          co_email?: string | null
          co_employer_name?: string | null
          co_employment_status?: string | null
          co_first_name?: string | null
          co_job_title?: string | null
          co_last_name?: string | null
          co_phone?: string | null
          consent?: boolean
          created_at?: string
          credit_score?: string | null
          current_payment?: string | null
          date_of_birth?: string | null
          down_payment?: string | null
          email: string
          employer_name?: string | null
          employment_status: string
          first_name: string
          first_time_buyer?: string | null
          has_co_applicant?: boolean
          id?: string
          job_title?: string | null
          last_name: string
          notes?: string | null
          phone: string
          property_type?: string | null
          purchase_price?: string | null
          timeline?: string | null
        }
        Update: {
          additional_income?: string | null
          annual_income?: string
          city_province?: string | null
          co_additional_income?: string | null
          co_annual_income?: string | null
          co_credit_score?: string | null
          co_date_of_birth?: string | null
          co_email?: string | null
          co_employer_name?: string | null
          co_employment_status?: string | null
          co_first_name?: string | null
          co_job_title?: string | null
          co_last_name?: string | null
          co_phone?: string | null
          consent?: boolean
          created_at?: string
          credit_score?: string | null
          current_payment?: string | null
          date_of_birth?: string | null
          down_payment?: string | null
          email?: string
          employer_name?: string | null
          employment_status?: string
          first_name?: string
          first_time_buyer?: string | null
          has_co_applicant?: boolean
          id?: string
          job_title?: string | null
          last_name?: string
          notes?: string | null
          phone?: string
          property_type?: string | null
          purchase_price?: string | null
          timeline?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
