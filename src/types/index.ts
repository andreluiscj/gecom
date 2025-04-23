export type Role = "admin" | "editor" | "user" | null;

export type Tarefa = {
  id: string;
  titulo: string;
  descricao: string;
  status: "pendente" | "em_progresso" | "concluida";
  prioridade: "alta" | "media" | "baixa";
  data_vencimento: Date | null;
  responsavel_id: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Setor =
  | "Saúde"
  | "Educação"
  | "Administrativo"
  | "Transporte"
  | "Assistência Social"
  | "Cultura"
  | "Meio Ambiente"
  | "Obras"
  | "Segurança Pública"
  | "Fazenda"
  | "Turismo"
  | "Esportes e Lazer"
  | "Planejamento"
  | "Comunicação"
  | "Ciência e Tecnologia";

export type PedidoStatus = 'Pendente' | 'Em Análise' | 'Aprovado' | 'Em Andamento' | 'Concluído' | 'Rejeitado';

export type Municipio = {
  id: string;
  nome: string;
  estado: string;
  populacao: number;
  logo?: string;
  orcamento: number;
  orcamento_anual: number;
  prefeito: string;
  created_at: Date;
  updated_at: Date;
};

export type Item = {
  id: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  pedido_id: string;
};

export type PedidoCompra = {
  id: string;
  descricao: string;
  data_compra: Date;
  setor_id: string;
  setor?: string;
  itens: Item[];
  valor_total: number;
  status: PedidoStatus;
  fundo_monetario: string | null;
  created_at: Date;
  justificativa?: string;
  solicitante_id?: string;
  solicitante?: string;
  observacoes?: string;
  workflow?: Workflow;
  local_entrega?: string;
};

export type WorkflowStepStatus = 'Pendente' | 'Em Andamento' | 'Concluído';

export type WorkflowStep = {
  id: string;
  titulo: string;
  status: WorkflowStepStatus;
  data_inicio?: Date;
  data_conclusao?: Date;
  responsavel_id?: string | null;
  responsavel?: string;
  ordem: number;
};

export type Workflow = {
  id: string;
  pedido_id: string;
  etapa_atual: number;
  total_etapas: number;
  percentual_completo: number;
  steps: WorkflowStep[];
};

export type Funcionario = {
  id: string;
  nome: string;
  cpf: string;
  data_nascimento: Date;
  email: string;
  cargo: string;
  setor_id: string | null;
  setor?: string;
  setores_adicionais?: string[];
  data_contratacao: Date;
  ativo: boolean;
  telefone?: string;
};

export interface DadosDashboard {
  resumo_financeiro: {
    estimativa_despesa: number;
    valor_contratado_total: number;
    percentual_utilizado: number;
    total_pedidos: number;
  };
  cartoes: Array<{
    titulo: string;
    valor: string | number;
    percentual_mudanca: number;
    icon: string;
    classe_cor: string;
  }>;
  orcamento_previsto: Record<string, number>;
  gastos_por_setor: Record<string, number>;
  valor_contratado_total: number;
  pedidos_por_setor: Record<string, number>;
}

export type UserRole = 'admin' | 'user' | 'manager';

export interface LoginLog {
  user_id: string;
  timestamp: string;
  success: boolean;
  ip: string;
}

export interface UsuarioLogin {
  id: string;
  auth_user_id?: string;
  username: string;
  funcionario_id: string;
  role: UserRole;
  ativo: boolean;
  primeiro_acesso?: boolean;
}

// Interface para representar os dados do Supabase
export interface Database {
  municipios: Municipio[];
  setores: {
    id: string;
    nome: string;
    municipio_id: string;
  }[];
  funcionarios: Funcionario[];
  usuarios: UsuarioLogin[];
  pedidos_compra: PedidoCompra[];
  itens_pedido: Item[];
  workflow_pedidos: Workflow[];
  workflow_etapas: WorkflowStep[];
  tarefas: Tarefa[];
}
