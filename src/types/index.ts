
export type Setor =
  | 'Saúde'
  | 'Educação'
  | 'Administrativo'
  | 'Transporte'
  | 'Obras'
  | 'Segurança Pública'
  | 'Assistência Social'
  | 'Meio Ambiente'
  | 'Fazenda'
  | 'Turismo'
  | 'Cultura'
  | 'Esportes e Lazer'
  | 'Planejamento'
  | 'Comunicação'
  | 'Ciência e Tecnologia';

export type PedidoStatus =
  | 'Pendente'
  | 'Em Análise'
  | 'Aprovado'
  | 'Em Andamento'
  | 'Concluído'
  | 'Rejeitado';

export type WorkflowStepStatus = 'Concluído' | 'Em Andamento' | 'Pendente';

export interface WorkflowStep {
  id: string;
  title: string;
  status: WorkflowStepStatus;
  date?: Date;
}

export interface Item {
  id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

export interface PedidoWorkflow {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
  steps: WorkflowStep[];
}

export interface PedidoCompra {
  id: string;
  numero?: string;
  descricao: string;
  justificativa?: string;
  dataCompra: Date;
  setor: Setor;
  solicitante?: string;
  valorTotal: number;
  itens: Item[];
  status?: PedidoStatus;
  fundoMonetario?: string;
  createdAt?: Date;
  observacoes?: string;
  fonteRecurso?: string;
  responsavel?: {
    id: string;
    nome: string;
    email: string;
    cargo: string;
  };
  anexos?: any[];
  workflow?: PedidoWorkflow;
}

export interface DadosSetor {
  nome: string;
  descricao: string;
  responsavel: string;
  contato: string;
  orcamentoAnual: number;
  orcamentoUtilizado: number;
}

export interface Municipio {
  id: string;
  nome: string;
  estado: string;
  populacao: number;
  orcamento: number;
  prefeito: string;
  orcamentoAnual: number;
}

export interface DadosDashboard {
  resumoFinanceiro: {
    orcamentoAnual: number;
    orcamentoUtilizado: number;
    percentualUtilizado: number;
    totalPedidos: number;
  };
  cartoes: Array<{
    titulo: string;
    valor: number;
    percentualMudanca: number;
    icon: string;
    cor: string;
  }>;
  pedidosRecentes: PedidoCompra[];
  dadosMensais: {
    [mes: string]: number;
  };
  distribuicaoSetor: {
    [setor in Setor]?: number;
  };
  orcamentoPrevisto: {
    [setor in Setor]?: number;
  };
  gastosPorSetor: {
    [setor in Setor]?: number;
  };
  pedidosPorSetor: {
    [setor in Setor]?: number;
  };
  gastosTotais: number;
}
