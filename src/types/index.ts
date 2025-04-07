import { Workflow } from "./workflow";

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
  | "Meio Ambiente";

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
  status: 'Pendente' | 'Em Análise' | 'Aprovado' | 'Em Andamento' | 'Concluído' | 'Rejeitado';
  fundoMonetario: string;
  createdAt: Date;
  justificativa?: string;
  solicitante?: string;
  observacoes?: string;
  workflow?: Workflow;
  localEntrega?: string;
}
