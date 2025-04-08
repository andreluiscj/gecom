export type Role = "admin" | "editor" | null;

export type Tarefa = {
  id: string;
  title: string;
  description: string;
  status: "pendente" | "em_progresso" | "concluida";
  priority: "alta" | "media" | "baixa";
  dueDate: Date;
  assignedTo: string;
  comments: string[];
  attachments: string[];
  createdAt: Date;
  updatedAt: Date;
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

export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal?: number;
}

export interface PedidoCompra {
  id: string;
  descricao: string;
  dataCompra: Date;
  setor: Setor;
  itens: Item[];
  valorTotal: number;
  status: PedidoStatus;
  fundoMonetario: string;
  createdAt: Date;
  justificativa?: string;
  solicitante?: string;
  observacoes?: string;
  workflow?: Workflow;
  localEntrega?: string;
}

export type WorkflowStepStatus = 'Pendente' | 'Em Andamento' | 'Concluído';

export interface WorkflowStep {
  id: string;
  title: string;
  status: WorkflowStepStatus;
  date?: Date;
  dataConclusao?: Date;   // New field: completion date
  responsavel?: string;   // New field: responsible person
}

export interface Workflow {
  currentStep: number;
  totalSteps: number;
  percentComplete: number;
  steps: WorkflowStep[];
}

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
  resumoFinanceiro: {
    orcamentoAnual: number;
    orcamentoUtilizado: number;
    percentualUtilizado: number;
    totalPedidos: number;
  };
  cartoes: Array<{
    titulo: string;
    valor: string | number;
    percentualMudanca: number;
    icon: string;
    classeCor: string;
  }>;
  orcamentoPrevisto: Record<string, number>;
  gastosPorSetor: Record<string, number>;
  gastosTotais: number;
  pedidosPorSetor: Record<string, number>;
}

export type UserRole = 'admin' | 'user' | 'manager';

export interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  setor: Setor;
  dataContratacao: Date;
  ativo: boolean;
  senha?: string; // Only used for creation/update, not stored in state
  permissaoEtapa?: string; // New field to specify which workflow step the employee can edit
}
