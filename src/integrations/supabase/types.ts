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
      anexos_tarefa: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          nome_arquivo: string
          tamanho_bytes: number
          tarefa_id: string
          tipo_arquivo: string
          url: string
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          nome_arquivo: string
          tamanho_bytes: number
          tarefa_id: string
          tipo_arquivo: string
          url: string
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          nome_arquivo?: string
          tamanho_bytes?: number
          tarefa_id?: string
          tipo_arquivo?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "anexos_tarefa_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "anexos_tarefa_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      comentarios_tarefa: {
        Row: {
          autor_id: string | null
          created_at: string
          id: string
          tarefa_id: string
          texto: string
        }
        Insert: {
          autor_id?: string | null
          created_at?: string
          id?: string
          tarefa_id: string
          texto: string
        }
        Update: {
          autor_id?: string | null
          created_at?: string
          id?: string
          tarefa_id?: string
          texto?: string
        }
        Relationships: [
          {
            foreignKeyName: "comentarios_tarefa_autor_id_fkey"
            columns: ["autor_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentarios_tarefa_tarefa_id_fkey"
            columns: ["tarefa_id"]
            isOneToOne: false
            referencedRelation: "tarefas"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          ativo: boolean
          cargo: string
          cpf: string
          created_at: string
          data_contratacao: string
          data_nascimento: string
          email: string
          id: string
          nome: string
          setor_id: string | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cargo: string
          cpf: string
          created_at?: string
          data_contratacao: string
          data_nascimento: string
          email: string
          id?: string
          nome: string
          setor_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cargo?: string
          cpf?: string
          created_at?: string
          data_contratacao?: string
          data_nascimento?: string
          email?: string
          id?: string
          nome?: string
          setor_id?: string | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "funcionarios_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          created_at: string
          id: string
          nome: string
          pedido_id: string
          quantidade: number
          updated_at: string
          valor_total: number
          valor_unitario: number
        }
        Insert: {
          created_at?: string
          id?: string
          nome: string
          pedido_id: string
          quantidade?: number
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Update: {
          created_at?: string
          id?: string
          nome?: string
          pedido_id?: string
          quantidade?: number
          updated_at?: string
          valor_total?: number
          valor_unitario?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
        ]
      }
      municipios: {
        Row: {
          created_at: string
          estado: string
          id: string
          logo: string | null
          nome: string
          orcamento: number
          orcamento_anual: number
          populacao: number
          prefeito: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          estado: string
          id?: string
          logo?: string | null
          nome: string
          orcamento?: number
          orcamento_anual?: number
          populacao?: number
          prefeito: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          estado?: string
          id?: string
          logo?: string | null
          nome?: string
          orcamento?: number
          orcamento_anual?: number
          populacao?: number
          prefeito?: string
          updated_at?: string
        }
        Relationships: []
      }
      pedidos_compra: {
        Row: {
          created_at: string
          data_compra: string
          descricao: string
          fundo_monetario: string | null
          id: string
          justificativa: string | null
          local_entrega: string | null
          observacoes: string | null
          setor_id: string
          solicitante_id: string | null
          status: string
          updated_at: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_compra: string
          descricao: string
          fundo_monetario?: string | null
          id?: string
          justificativa?: string | null
          local_entrega?: string | null
          observacoes?: string | null
          setor_id: string
          solicitante_id?: string | null
          status?: string
          updated_at?: string
          valor_total?: number
        }
        Update: {
          created_at?: string
          data_compra?: string
          descricao?: string
          fundo_monetario?: string | null
          id?: string
          justificativa?: string | null
          local_entrega?: string | null
          observacoes?: string | null
          setor_id?: string
          solicitante_id?: string | null
          status?: string
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_compra_setor_id_fkey"
            columns: ["setor_id"]
            isOneToOne: false
            referencedRelation: "setores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pedidos_compra_solicitante_id_fkey"
            columns: ["solicitante_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      setores: {
        Row: {
          created_at: string
          id: string
          municipio_id: string
          nome: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          municipio_id: string
          nome: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          municipio_id?: string
          nome?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "setores_municipio_id_fkey"
            columns: ["municipio_id"]
            isOneToOne: false
            referencedRelation: "municipios"
            referencedColumns: ["id"]
          },
        ]
      }
      tarefas: {
        Row: {
          created_at: string
          data_vencimento: string | null
          descricao: string | null
          id: string
          prioridade: string
          responsavel_id: string | null
          status: string
          titulo: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          prioridade?: string
          responsavel_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          ativo: boolean
          auth_user_id: string | null
          created_at: string
          funcionario_id: string
          id: string
          primeiro_acesso: boolean
          role: string
          updated_at: string
          username: string
        }
        Insert: {
          ativo?: boolean
          auth_user_id?: string | null
          created_at?: string
          funcionario_id: string
          id?: string
          primeiro_acesso?: boolean
          role: string
          updated_at?: string
          username: string
        }
        Update: {
          ativo?: boolean
          auth_user_id?: string | null
          created_at?: string
          funcionario_id?: string
          id?: string
          primeiro_acesso?: boolean
          role?: string
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_etapas: {
        Row: {
          created_at: string
          data_conclusao: string | null
          data_inicio: string | null
          id: string
          ordem: number
          responsavel_id: string | null
          status: string
          titulo: string
          updated_at: string
          workflow_id: string
        }
        Insert: {
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string | null
          id?: string
          ordem: number
          responsavel_id?: string | null
          status?: string
          titulo: string
          updated_at?: string
          workflow_id: string
        }
        Update: {
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string | null
          id?: string
          ordem?: number
          responsavel_id?: string | null
          status?: string
          titulo?: string
          updated_at?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_etapas_responsavel_id_fkey"
            columns: ["responsavel_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_etapas_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflow_pedidos"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_pedidos: {
        Row: {
          created_at: string
          etapa_atual: number
          id: string
          pedido_id: string
          percentual_completo: number
          total_etapas: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          etapa_atual?: number
          id?: string
          pedido_id: string
          percentual_completo?: number
          total_etapas?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          etapa_atual?: number
          id?: string
          pedido_id?: string
          percentual_completo?: number
          total_etapas?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_pedidos_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos_compra"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
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
