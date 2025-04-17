
// Supabase database types
export type DbPedidoStatus = 'pendente' | 'em_analise' | 'aprovado' | 'em_andamento' | 'concluido' | 'rejeitado';
export type DbWorkflowStatus = 'pendente' | 'em_andamento' | 'concluido';
export type UserRole = 'admin' | 'prefeito' | 'gestor' | 'servidor';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  municipio_id: string | null;
  ativo: boolean;
  primeiro_acesso: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Municipio {
  id: string;
  nome: string;
  estado: string;
  populacao: number | null;
  logo: string | null;
  orcamento_anual: number | null;
  prefeito: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Secretaria {
  id: string;
  nome: string;
  descricao: string | null;
  municipio_id: string;
  created_at: string | null;
  updated_at: string | null;
}

export interface Fundo {
  id: string;
  nome: string;
  descricao: string | null;
  valor_total: number | null;
  municipio_id: string;
  secretaria_id: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Dfd {
  id: string;
  descricao: string;
  solicitante_id: string;
  secretaria_id: string;
  data_pedido: string | null;
  fundo_id: string | null;
  valor_estimado: number | null;
  valor_realizado: number | null;
  status: DbPedidoStatus;
  justificativa: string | null;
  local_entrega: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface DfdItem {
  id: string;
  dfd_id: string;
  nome: string;
  quantidade: number;
  valor_unitario: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkflowEtapa {
  id: string;
  titulo: string;
  ordem: number;
  created_at: string | null;
}

export interface DfdWorkflow {
  id: string;
  dfd_id: string;
  etapa_atual: number;
  percentual_completo: number;
  created_at: string | null;
  updated_at: string | null;
}

export interface WorkflowEtapaDfd {
  id: string;
  dfd_workflow_id: string;
  workflow_etapa_id: string;
  status: DbWorkflowStatus;
  data_inicio: string | null;
  data_conclusao: string | null;
  responsavel_id: string | null;
  observacoes: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Anexo {
  id: string;
  nome: string;
  caminho: string;
  tipo: string | null;
  tamanho: number | null;
  created_at: string | null;
}

export interface DfdAnexo {
  id: string;
  dfd_id: string;
  anexo_id: string;
  created_at: string | null;
}

export interface DashboardMunicipio {
  municipio_id: string | null;
  municipio_nome: string | null;
  orcamento_anual: number | null;
  total_secretarias: number | null;
  total_dfds: number | null;
  valor_estimado_total: number | null;
  valor_realizado_total: number | null;
  percentual_orcamento_utilizado: number | null;
  dfds_em_andamento: number | null;
  dfds_concluidas: number | null;
  tempo_medio_conclusao: number | null;
}

export interface DashboardSecretaria {
  municipio_id: string | null;
  municipio_nome: string | null;
  secretaria_id: string | null;
  secretaria_nome: string | null;
  total_dfds: number | null;
  dfds_pendentes: number | null;
  dfds_aprovadas: number | null;
  dfds_em_andamento: number | null;
  dfds_concluidas: number | null;
  dfds_rejeitadas: number | null;
  valor_estimado_total: number | null;
  valor_realizado_total: number | null;
  tempo_medio_conclusao: number | null;
}

export interface RelatorioDfd {
  id: string | null;
  descricao: string | null;
  solicitante: string | null;
  secretaria: string | null;
  municipio: string | null;
  fundo: string | null;
  data_pedido: string | null;
  valor_estimado: number | null;
  valor_realizado: number | null;
  status: DbPedidoStatus | null;
  justificativa: string | null;
  local_entrega: string | null;
  created_at: string | null;
  updated_at: string | null;
  duracao_dias: number | null;
  percentual_economia: number | null;
  percentual_completo: number | null;
}
