
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
  status: string;
  dataCompra: Date;
  solicitante: string;
  localEntrega: string;
  observacoes?: string;
  workflowSteps?: WorkflowStep[]; // Add this property
}

export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface WorkflowStep {
  id: string;
  title: string;
  status: WorkflowStepStatus;
  date: Date;
  dataConclusao?: Date;
  observacoes?: string;
}

export type WorkflowStepStatus = 'Pendente' | 'Em Andamento' | 'Concluído' | 'Aprovado' | 'Reprovado';

// Extend the existing UserRole type
export type UserRole = 'admin' | 'prefeito' | 'gestor' | 'servidor';

export interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: UserRole;
  municipio_id?: string;
  primeiro_acesso: boolean;
}

// Add PedidoStatus type
export type PedidoStatus = 'Pendente' | 'Em Análise' | 'Aprovado' | 'Em Andamento' | 'Concluído' | 'Rejeitado';
