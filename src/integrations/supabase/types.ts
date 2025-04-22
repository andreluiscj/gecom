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
      dfd_items: {
        Row: {
          created_at: string | null
          dfd_id: string
          id: string
          name: string
          quantity: number
          total_value: number
          unit_value: number
        }
        Insert: {
          created_at?: string | null
          dfd_id: string
          id?: string
          name: string
          quantity: number
          total_value: number
          unit_value: number
        }
        Update: {
          created_at?: string | null
          dfd_id?: string
          id?: string
          name?: string
          quantity?: number
          total_value?: number
          unit_value?: number
        }
        Relationships: [
          {
            foreignKeyName: "dfd_items_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
        ]
      }
      dfds: {
        Row: {
          created_at: string | null
          delivery_location: string | null
          description: string
          id: string
          justification: string | null
          monetary_fund: string
          municipality_id: number
          observations: string | null
          purchase_date: string
          requester_id: string | null
          sector_id: number | null
          status: string
          total_value: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_location?: string | null
          description: string
          id?: string
          justification?: string | null
          monetary_fund: string
          municipality_id: number
          observations?: string | null
          purchase_date: string
          requester_id?: string | null
          sector_id?: number | null
          status: string
          total_value: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_location?: string | null
          description?: string
          id?: string
          justification?: string | null
          monetary_fund?: string
          municipality_id?: number
          observations?: string | null
          purchase_date?: string
          requester_id?: string | null
          sector_id?: number | null
          status?: string
          total_value?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dfds_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfds_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["municipality_id"]
          },
          {
            foreignKeyName: "dfds_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfds_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfds_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      municipalities: {
        Row: {
          budget: number | null
          created_at: string | null
          id: number
          logo: string | null
          mayor: string | null
          name: string
          population: number | null
          state: string
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          id?: number
          logo?: string | null
          mayor?: string | null
          name: string
          population?: number | null
          state: string
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          id?: number
          logo?: string | null
          mayor?: string | null
          name?: string
          population?: number | null
          state?: string
        }
        Relationships: []
      }
      municipality_users: {
        Row: {
          id: number
          municipality_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          municipality_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          municipality_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "municipality_users_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "municipality_users_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["municipality_id"]
          },
          {
            foreignKeyName: "municipality_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "municipality_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          active: boolean | null
          address: string
          birthdate: string
          city: string | null
          complement: string | null
          cpf: string
          created_at: string | null
          district: string
          email: string | null
          id: string
          municipality_id: number | null
          name: string
          position_title: string | null
          role: string
          street_number: string | null
          updated_at: string | null
          zip_code: string
        }
        Insert: {
          active?: boolean | null
          address: string
          birthdate: string
          city?: string | null
          complement?: string | null
          cpf: string
          created_at?: string | null
          district: string
          email?: string | null
          id: string
          municipality_id?: number | null
          name: string
          position_title?: string | null
          role: string
          street_number?: string | null
          updated_at?: string | null
          zip_code: string
        }
        Update: {
          active?: boolean | null
          address?: string
          birthdate?: string
          city?: string | null
          complement?: string | null
          cpf?: string
          created_at?: string | null
          district?: string
          email?: string | null
          id?: string
          municipality_id?: number | null
          name?: string
          position_title?: string | null
          role?: string
          street_number?: string | null
          updated_at?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["municipality_id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          created_at: string | null
          dfd_id: string
          homologated_value: number | null
          homologation_date: string | null
          id: string
          status: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dfd_id: string
          homologated_value?: number | null
          homologation_date?: string | null
          id?: string
          status: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dfd_id?: string
          homologated_value?: number | null
          homologation_date?: string | null
          id?: string
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
        ]
      }
      sectors: {
        Row: {
          created_at: string | null
          id: number
          municipality_id: number | null
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          municipality_id?: number | null
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          municipality_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sectors_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "municipalities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sectors_municipality_id_fkey"
            columns: ["municipality_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["municipality_id"]
          },
        ]
      }
      user_sectors: {
        Row: {
          id: number
          is_primary: boolean | null
          sector_id: number | null
          user_id: string | null
        }
        Insert: {
          id?: number
          is_primary?: boolean | null
          sector_id?: number | null
          user_id?: string | null
        }
        Update: {
          id?: number
          is_primary?: boolean | null
          sector_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sectors_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_steps: {
        Row: {
          completion_date: string | null
          created_at: string | null
          dfd_id: string
          id: string
          responsible_id: string | null
          start_date: string | null
          status: string
          step_order: number
          title: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string | null
          dfd_id: string
          id?: string
          responsible_id?: string | null
          start_date?: string | null
          status: string
          step_order: number
          title: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string | null
          dfd_id?: string
          id?: string
          responsible_id?: string | null
          start_date?: string | null
          status?: string
          step_order?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_steps_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_steps_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_steps_responsible_id_fkey"
            columns: ["responsible_id"]
            isOneToOne: false
            referencedRelation: "user_details"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_details: {
        Row: {
          active: boolean | null
          address: string | null
          birthdate: string | null
          city: string | null
          cpf: string | null
          district: string | null
          email: string | null
          id: string | null
          municipality_id: number | null
          municipality_name: string | null
          municipality_state: string | null
          name: string | null
          position_title: string | null
          role: string | null
          street_number: string | null
          zip_code: string | null
        }
        Relationships: []
      }
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
