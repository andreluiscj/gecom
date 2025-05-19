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
          caminho_arquivo: string
          data_upload: string | null
          id: number
          nome_arquivo: string
          responsavel_id: number
          tarefa_id: number
          tipo_arquivo: string | null
        }
        Insert: {
          caminho_arquivo: string
          data_upload?: string | null
          id?: number
          nome_arquivo: string
          responsavel_id: number
          tarefa_id: number
          tipo_arquivo?: string | null
        }
        Update: {
          caminho_arquivo?: string
          data_upload?: string | null
          id?: number
          nome_arquivo?: string
          responsavel_id?: number
          tarefa_id?: number
          tipo_arquivo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "anexos_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anexos_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_homologadas: {
        Row: {
          data_homologacao: string | null
          id: number
          tarefa_id: number
          usuario_homologador_id: number
          valor_total: number
        }
        Insert: {
          data_homologacao?: string | null
          id?: number
          tarefa_id: number
          usuario_homologador_id: number
          valor_total: number
        }
        Update: {
          data_homologacao?: string | null
          id?: number
          tarefa_id?: number
          usuario_homologador_id?: number
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "compras_homologadas_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_homologadas_usuario_homologador_id_fkey"
            columns: ["usuario_homologador_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      dfds: {
        Row: {
          data_pedido: string | null
          descricao: string | null
          fundo_id: number
          id: number
          justificativa_necessidade: string
          nome_produto: string
          quantidade: number
          responsavel: number
          secretaria_id: number
          valor_previsto: number
          valor_unitario: number
        }
        Insert: {
          data_pedido?: string | null
          descricao?: string | null
          fundo_id: number
          id?: number
          justificativa_necessidade: string
          nome_produto: string
          quantidade: number
          responsavel: number
          secretaria_id: number
          valor_previsto: number
          valor_unitario: number
        }
        Update: {
          data_pedido?: string | null
          descricao?: string | null
          fundo_id?: number
          id?: number
          justificativa_necessidade?: string
          nome_produto?: string
          quantidade?: number
          responsavel?: number
          secretaria_id?: number
          valor_previsto?: number
          valor_unitario?: number
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
            foreignKeyName: "dfds_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dfds_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      etapas: {
        Row: {
          id: number
          nome: string
          ordem: number
        }
        Insert: {
          id?: number
          nome: string
          ordem: number
        }
        Update: {
          id?: number
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      fundos: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      historico_status_tarefas: {
        Row: {
          data_mudanca: string | null
          id: number
          responsavel_id: number
          status_anterior: number
          status_atual: number
          tarefa_id: number
        }
        Insert: {
          data_mudanca?: string | null
          id?: number
          responsavel_id: number
          status_anterior: number
          status_atual: number
          tarefa_id: number
        }
        Update: {
          data_mudanca?: string | null
          id?: number
          responsavel_id?: number
          status_anterior?: number
          status_atual?: number
          tarefa_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "historico_status_tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "historico_status_tarefas_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          acao: string
          data: string | null
          id: number
          id_afetado: number
          tabela_afetada: string
          usuario_id: number | null
        }
        Insert: {
          acao: string
          data?: string | null
          id?: number
          id_afetado: number
          tabela_afetada: string
          usuario_id?: number | null
        }
        Update: {
          acao?: string
          data?: string | null
          id?: number
          id_afetado?: number
          tabela_afetada?: string
          usuario_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios: {
        Row: {
          estado: string
          id: number
          nome: string
          orcamento_previsto: number | null
        }
        Insert: {
          estado: string
          id?: number
          nome: string
          orcamento_previsto?: number | null
        }
        Update: {
          estado?: string
          id?: number
          nome?: string
          orcamento_previsto?: number | null
        }
        Relationships: []
      }
      pedido_dfd: {
        Row: {
          dfd_id: number
          pedido_id: number
        }
        Insert: {
          dfd_id: number
          pedido_id: number
        }
        Update: {
          dfd_id?: number
          pedido_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedido_dfd_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedido_dfd_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compras"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos_compras: {
        Row: {
          data_pedido: string | null
          descricao: string
          dfd_id: number
          fundo_id: number
          id: number
          secretaria_id: number
          status: string | null
          valor_previsto: number
          valor_realizado: number | null
        }
        Insert: {
          data_pedido?: string | null
          descricao: string
          dfd_id: number
          fundo_id: number
          id?: number
          secretaria_id: number
          status?: string | null
          valor_previsto: number
          valor_realizado?: number | null
        }
        Update: {
          data_pedido?: string | null
          descricao?: string
          dfd_id?: number
          fundo_id?: number
          id?: number
          secretaria_id?: number
          status?: string | null
          valor_previsto?: number
          valor_realizado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_compras_dfd_id_fkey"
            columns: ["dfd_id"]
            isOneToOne: false
            referencedRelation: "dfds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compras_fundo_id_fkey"
            columns: ["fundo_id"]
            isOneToOne: false
            referencedRelation: "fundos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compras_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
        ]
      }
      permissoes: {
        Row: {
          etapa_id: number | null
          id: number
          responsavel: boolean | null
          secretaria_id: number
          tarefa_id: number | null
          tipo_permissao: string
          usuario_id: number
        }
        Insert: {
          etapa_id?: number | null
          id?: number
          responsavel?: boolean | null
          secretaria_id: number
          tarefa_id?: number | null
          tipo_permissao: string
          usuario_id: number
        }
        Update: {
          etapa_id?: number | null
          id?: number
          responsavel?: boolean | null
          secretaria_id?: number
          tarefa_id?: number | null
          tipo_permissao?: string
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "permissoes_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "permissoes_usuario_id_secretaria_id_fkey"
            columns: ["usuario_id", "secretaria_id"]
            isOneToOne: false
            referencedRelation: "usuario_secretaria"
            referencedColumns: ["usuario_id", "secretaria_id"]
          },
        ]
      }
      secretarias: {
        Row: {
          id: number
          municipio_id: number
          nome: string
          orcamento_previsto: number | null
          orcamento_utilizado: number | null
          quantidade_pedidos: number | null
        }
        Insert: {
          id?: number
          municipio_id: number
          nome: string
          orcamento_previsto?: number | null
          orcamento_utilizado?: number | null
          quantidade_pedidos?: number | null
        }
        Update: {
          id?: number
          municipio_id?: number
          nome?: string
          orcamento_previsto?: number | null
          orcamento_utilizado?: number | null
          quantidade_pedidos?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "secretarias_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          data_fim: string | null
          data_inicio: string | null
          descricao: string
          etapa_anterior_concluida: boolean | null
          etapa_id: number
          id: number
          pedido_id: number
          progresso: number | null
          responsavel_id: number
          status: string | null
        }
        Insert: {
          data_fim?: string | null
          data_inicio?: string | null
          descricao: string
          etapa_anterior_concluida?: boolean | null
          etapa_id: number
          id?: number
          pedido_id: number
          progresso?: number | null
          responsavel_id: number
          status?: string | null
        }
        Update: {
          data_fim?: string | null
          data_inicio?: string | null
          descricao?: string
          etapa_anterior_concluida?: boolean | null
          etapa_id?: number
          id?: number
          pedido_id?: number
          progresso?: number | null
          responsavel_id?: number
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_etapa_id_fkey"
            columns: ["etapa_id"]
            isOneToOne: false
            referencedRelation: "etapas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      tipos_usuarios: {
        Row: {
          id: number
          nome: string
        }
        Insert: {
          id?: number
          nome: string
        }
        Update: {
          id?: number
          nome?: string
        }
        Relationships: []
      }
      usuario_secretaria: {
        Row: {
          secretaria_id: number
          tipo_usuario: number
          usuario_id: number
        }
        Insert: {
          secretaria_id: number
          tipo_usuario: number
          usuario_id: number
        }
        Update: {
          secretaria_id?: number
          tipo_usuario?: number
          usuario_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "usuario_secretaria_secretaria_id_fkey"
            columns: ["secretaria_id"]
            isOneToOne: false
            referencedRelation: "secretarias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_secretaria_tipo_usuario_fkey"
            columns: ["tipo_usuario"]
            isOneToOne: false
            referencedRelation: "tipos_usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuario_secretaria_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          bairro: string | null
          cep: string | null
          cpf: string
          data_nascimento: string | null
          email: string
          endereco: string | null
          id: number
          lgpd_aceito: boolean | null
          municipio_id: number | null
          nome: string
          numero: string | null
          primeiro_login: boolean | null
          senha: string
          tipo_usuario: number
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          cpf: string
          data_nascimento?: string | null
          email: string
          endereco?: string | null
          id?: number
          lgpd_aceito?: boolean | null
          municipio_id?: number | null
          nome: string
          numero?: string | null
          primeiro_login?: boolean | null
          senha?: string
          tipo_usuario: number
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          cpf?: string
          data_nascimento?: string | null
          email?: string
          endereco?: string | null
          id?: number
          lgpd_aceito?: boolean | null
          municipio_id?: number | null
          nome?: string
          numero?: string | null
          primeiro_login?: boolean | null
          senha?: string
          tipo_usuario?: number
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
            foreignKeyName: "usuarios_tipo_usuario_fkey"
            columns: ["tipo_usuario"]
            isOneToOne: false
            referencedRelation: "tipos_usuarios"
            referencedColumns: ["id"]
          },
        ]
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
