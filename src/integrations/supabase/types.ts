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
      anexos: {
        Row: {
          caminho: string
          created_at: string | null
          id: string
          nome: string
          tamanho: number | null
          tipo: string | null
        }
        Insert: {
          caminho: string
          created_at?: string | null
          id?: string
          nome: string
          tamanho?: number | null
          tipo?: string | null
        }
        Update: {
          caminho?: string
          created_at?: string | null
          id?: string
          nome?: string
          tamanho?: number | null
          tipo?: string | null
        }
        Relationships: []
      }
      dfd_anexos: {
        Row: {
          anexo_id: string
          created_at: string | null
          dfd_id: string
          id: string
        }
        Insert: {
          anexo_id: string
          created_at?: string | null
          dfd_id: string
          id?: string
        }
        Update: {
          anexo_id?: string
          created_at?: string | null
          dfd_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dfd_anexos_anexo_id_fkey"
            columns: ["anexo_id"]
            isOneToOne: false
            referencedRelation: "anexos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfd_anexos_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfd_anexos_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "vw_relatorio_dfds"
            referencedColumns: ["id"]
          },
        ]
      }
      dfd_itens: {
        Row: {
          created_at: string | null
          dfd_id: string
          id: string
          nome: string
          quantidade: number
          updated_at: string | null
          valor_unitario: number
        }
        Insert: {
          created_at?: string | null
          dfd_id: string
          id?: string
          nome: string
          quantidade: number
          updated_at?: string | null
          valor_unitario: number
        }
        Update: {
          created_at?: string | null
          dfd_id?: string
          id?: string
          nome?: string
          quantidade?: number
          updated_at?: string | null
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "dfd_itens_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfd_itens_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "vw_relatorio_dfds"
            referencedColumns: ["id"]
          },
        ]
      }
      dfd_workflows: {
        Row: {
          created_at: string | null
          dfd_id: string
          etapa_atual: number
          id: string
          percentual_completo: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dfd_id: string
          etapa_atual?: number
          id?: string
          percentual_completo?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dfd_id?: string
          etapa_atual?: number
          id?: string
          percentual_completo?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dfd_workflows_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: true
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfd_workflows_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: true
            referencedRelation: "vw_relatorio_dfds"
            referencedColumns: ["id"]
          },
        ]
      }
      dfds: {
        Row: {
          created_at: string | null
          data_pedido: string | null
          descricao: string
          fundo_id: string | null
          id: string
          justificativa: string | null
          local_entrega: string | null
          secretaria_id: string
          solicitante_id: string
          status: Database["public"]["Enums"]["dfd_status"]
          updated_at: string | null
          valor_estimado: number | null
          valor_realizado: number | null
        }
        Insert: {
          created_at?: string | null
          data_pedido?: string | null
          descricao: string
          fundo_id?: string | null
          id?: string
          justificativa?: string | null
          local_entrega?: string | null
          secretaria_id: string
          solicitante_id: string
          status?: Database["public"]["Enums"]["dfd_status"]
          updated_at?: string | null
          valor_estimado?: number | null
          valor_realizado?: number | null
        }
        Update: {
          created_at?: string | null
          data_pedido?: string | null
          descricao?: string
          fundo_id?: string | null
          id?: string
          justificativa?: string | null
          local_entrega?: string | null
          secretaria_id?: string
          solicitante_id?: string
          status?: Database["public"]["Enums"]["dfd_status"]
          updated_at?: string | null
          valor_estimado?: number | null
          valor_realizado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "dfds_fundo_id_fkey"
            columns: ["fundo_id"]
            isOneToOne: false
            referencedRelation: "fundos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfds_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfds_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_secretaria"
            referencedColumns: ["secretaria_id"]
          },
          {
            foreignKeyName: "dfds_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      etapa_workflow_anexos: {
        Row: {
          anexo_id: string
          created_at: string | null
          etapa_workflow_id: string
          id: string
        }
        Insert: {
          anexo_id: string
          created_at?: string | null
          etapa_workflow_id: string
          id?: string
        }
        Update: {
          anexo_id?: string
          created_at?: string | null
          etapa_workflow_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "etapa_workflow_anexos_anexo_id_fkey"
            columns: ["anexo_id"]
            isOneToOne: false
            referencedRelation: "anexos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "etapa_workflow_anexos_etapa_workflow_id_fkey"
            columns: ["etapa_workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_etapas_dfd"
            referencedColumns: ["id"]
          },
        ]
      }
      fundos: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          municipio_id: string
          nome: string
          secretaria_id: string | null
          updated_at: string | null
          valor_total: number | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          municipio_id: string
          nome: string
          secretaria_id?: string | null
          updated_at?: string | null
          valor_total?: number | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          municipio_id?: string
          nome?: string
          secretaria_id?: string | null
          updated_at?: string | null
          valor_total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fundos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fundos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_municipio"
            referencedColumns: ["municipio_id"]
          },
          {
            foreignKeyName: "fundos_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_secretaria"
            referencedColumns: ["municipio_id"]
          },
          {
            foreignKeyName: "fundos_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fundos_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_secretaria"
            referencedColumns: ["secretaria_id"]
          },
        ]
      }
      historico_atividades: {
        Row: {
          created_at: string | null
          descricao: string
          dfd_id: string | null
          id: string
          tipo: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          descricao: string
          dfd_id?: string | null
          id?: string
          tipo: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          descricao?: string
          dfd_id?: string | null
          id?: string
          tipo?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_atividades_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_atividades_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "vw_relatorio_dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_atividades_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios: {
        Row: {
          created_at: string | null
          estado: string
          id: string
          logo: string | null
          nome: string
          orcamento_anual: number | null
          populacao: number | null
          prefeito: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          estado: string
          id?: string
          logo?: string | null
          nome: string
          orcamento_anual?: number | null
          populacao?: number | null
          prefeito?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          estado?: string
          id?: string
          logo?: string | null
          nome?: string
          orcamento_anual?: number | null
          populacao?: number | null
          prefeito?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      secretarias: {
        Row: {
          created_at: string | null
          descricao: string | null
          id: string
          municipio_id: string
          nome: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          municipio_id: string
          nome: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descricao?: string | null
          id?: string
          municipio_id?: string
          nome?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secretarias_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secretarias_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_municipio"
            referencedColumns: ["municipio_id"]
          },
          {
            foreignKeyName: "secretarias_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_secretaria"
            referencedColumns: ["municipio_id"]
          },
        ]
      }
      usuario_secretarias: {
        Row: {
          created_at: string | null
          id: string
          secretaria_id: string
          usuario_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          secretaria_id: string
          usuario_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          secretaria_id?: string
          usuario_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuario_secretarias_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_secretarias_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_secretaria"
            referencedColumns: ["secretaria_id"]
          },
          {
            foreignKeyName: "usuario_secretarias_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean | null
          created_at: string | null
          email: string
          id: string
          municipio_id: string | null
          nome: string
          primeiro_acesso: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          created_at?: string | null
          email: string
          id: string
          municipio_id?: string | null
          nome: string
          primeiro_acesso?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          created_at?: string | null
          email?: string
          id?: string
          municipio_id?: string | null
          nome?: string
          primeiro_acesso?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_municipio"
            referencedColumns: ["municipio_id"]
          },
          {
            foreignKeyName: "usuarios_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "vw_dashboard_secretaria"
            referencedColumns: ["municipio_id"]
          },
        ]
      }
      workflow_etapas: {
        Row: {
          created_at: string | null
          id: string
          ordem: number
          titulo: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ordem: number
          titulo: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ordem?: number
          titulo?: string
        }
        Relationships: []
      }
      workflow_etapas_dfd: {
        Row: {
          created_at: string | null
          data_conclusao: string | null
          data_inicio: string | null
          dfd_workflow_id: string
          id: string
          observacoes: string | null
          responsavel_id: string | null
          status: Database["public"]["Enums"]["workflow_status"]
          updated_at: string | null
          workflow_etapa_id: string
        }
        Insert: {
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          dfd_workflow_id: string
          id?: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string | null
          workflow_etapa_id: string
        }
        Update: {
          created_at?: string | null
          data_conclusao?: string | null
          data_inicio?: string | null
          dfd_workflow_id?: string
          id?: string
          observacoes?: string | null
          responsavel_id?: string | null
          status?: Database["public"]["Enums"]["workflow_status"]
          updated_at?: string | null
          workflow_etapa_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_etapas_dfd_dfd_workflow_id_fkey"
            columns: ["dfd_workflow_id"]
            isOneToOne: false
            referencedRelation: "dfd_workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_etapas_dfd_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_etapas_dfd_workflow_etapa_id_fkey"
            columns: ["workflow_etapa_id"]
            isOneToOne: false
            referencedRelation: "workflow_etapas"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      vw_dashboard_municipio: {
        Row: {
          dfds_concluidas: number | null
          dfds_em_andamento: number | null
          municipio_id: string | null
          municipio_nome: string | null
          orcamento_anual: number | null
          percentual_orcamento_utilizado: number | null
          tempo_medio_conclusao: number | null
          total_dfds: number | null
          total_secretarias: number | null
          valor_estimado_total: number | null
          valor_realizado_total: number | null
        }
        Relationships: []
      }
      vw_dashboard_secretaria: {
        Row: {
          dfds_aprovadas: number | null
          dfds_concluidas: number | null
          dfds_em_andamento: number | null
          dfds_pendentes: number | null
          dfds_rejeitadas: number | null
          municipio_id: string | null
          municipio_nome: string | null
          secretaria_id: string | null
          secretaria_nome: string | null
          tempo_medio_conclusao: number | null
          total_dfds: number | null
          valor_estimado_total: number | null
          valor_realizado_total: number | null
        }
        Relationships: []
      }
      vw_relatorio_dfds: {
        Row: {
          created_at: string | null
          data_pedido: string | null
          descricao: string | null
          duracao_dias: number | null
          fundo: string | null
          id: string | null
          justificativa: string | null
          local_entrega: string | null
          municipio: string | null
          percentual_completo: number | null
          percentual_economia: number | null
          secretaria: string | null
          solicitante: string | null
          status: Database["public"]["Enums"]["dfd_status"] | null
          updated_at: string | null
          valor_estimado: number | null
          valor_realizado: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      dfd_status:
        | "pendente"
        | "em_analise"
        | "aprovado"
        | "em_andamento"
        | "concluido"
        | "rejeitado"
      user_role: "admin" | "prefeito" | "gestor" | "servidor"
      workflow_status: "pendente" | "em_andamento" | "concluido"
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
    Enums: {
      dfd_status: [
        "pendente",
        "em_analise",
        "aprovado",
        "em_andamento",
        "concluido",
        "rejeitado",
      ],
      user_role: ["admin", "prefeito", "gestor", "servidor"],
      workflow_status: ["pendente", "em_andamento", "concluido"],
    },
  },
} as const
