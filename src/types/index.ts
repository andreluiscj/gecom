
export interface Municipio {
  id: string;
  nome: string;
  estado: string;
  populacao: number;
  orcamento: number;
  orcamentoAnual: number;
  prefeito: string;
}

export interface DadosDashboard {
  resumoFinanceiro: ResumoFinanceiro;
  cartoes: Cartao[];
  orcamentoPrevisto: Record<string, number>;
  gastosPorSetor: Record<string, number>;
  valorContratadoTotal: number;
  pedidosPorSetor: Record<string, number>;
  indicadoresDesempenho: IndicadoresDesempenho;
}

export interface ResumoFinanceiro {
  estimativaDespesa: number;
  valorContratadoTotal: number;
  percentualUtilizado: number;
  totalPedidos: number;
}

export interface Cartao {
  titulo: string;
  valor: number | string;
  percentualMudanca: number;
  icon: string;
  classeCor: string;
}

export interface IndicadoresDesempenho {
  tempoMedioConclusao: number;
  percentualEconomia: number;
}

export interface PedidoCompra {
  id: string;
  descricao: string;
  justificativa: string;
  setor: string;
  items: Item[];
  valorTotal: number;
  status: PedidoStatus;
  dataCompra: Date;
  solicitante: string;
  localEntrega: string;
  fundoMonetario?: string;
  observacoes?: string;
  workflow?: Workflow;
  workflowSteps?: WorkflowStep[];
  responsavel?: Responsavel;
  createdAt?: Date;
  fonteRecurso?: string;
  anexos?: Anexo[];
}

export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface Responsavel {
  id: string;
  nome: string;
  email: string;
  cargo: string;
}

export interface Anexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  url: string;
}

export interface WorkflowStep {
  id: string;
  title: string;
  status: WorkflowStepStatus;
  date: Date;
  dataConclusao?: Date;
  observacoes?: string;
  responsavel?: string;
}

export interface Workflow {
  percentComplete: number;
  currentStep: number;
  totalSteps: number;
  steps: WorkflowStep[];
}

export type WorkflowStepStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Aprovado' | 'Reprovado';

// User role type
export type UserRole = 'admin' | 'prefeito' | 'gestor' | 'servidor';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  municipio_id?: string;
  primeiro_acesso: boolean;
  ativo?: boolean;
}

// Add PedidoStatus type
export type PedidoStatus = 'Pendente' | 'Em Análise' | 'Aprovado' | 'Em Andamento' | 'Concluído' | 'Rejeitado';

// Add missing types for Funcionario and Setor
export type Setor = string;

export interface Funcionario {
  id: string;
  nome: string;
  cpf?: string;
  email: string;
  cargo: string;
  setor: Setor;
  dataNascimento?: Date;
  dataContratacao?: Date;
  ativo: boolean;
  permissaoEtapa?: string;
}

export interface UsuarioLogin {
  username: string;
  password: string;
  role: UserRole;
}

// Add for Supabase
export type DbPedidoStatus = 'pendente' | 'em_analise' | 'aprovado' | 'em_andamento' | 'concluido' | 'rejeitado';
export type WorkflowStatus = 'pendente' | 'em_andamento' | 'concluido';
