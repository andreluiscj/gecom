
// Tipos dos setores
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

// Interface para Pedido de Compra
export interface PedidoCompra {
  id: string;
  dataCompra: Date;
  descricao: string;
  itens: Item[];
  valorTotal: number;
  fundoMonetario: string;
  setor: Setor;
  status: PedidoStatus;
  createdAt: Date;
  observacoes?: string;
  fonteRecurso?: string;
  responsavel?: {
    id: string;
    nome: string;
    email: string;
    cargo: string;
  };
  anexos?: any[];
}

// Interface para Item de Pedido
export interface Item {
  id: string;
  nome: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
}

// Interface para Dados do Dashboard
export interface DadosDashboard {
  gastosTotais: number;
  gastosPorSetor: Record<Setor, number>;
  orcamentoPrevisto: Record<Setor, number>;
  pedidosPorSetor: Record<Setor, number>;
  ticketMedioPorSetor: Record<Setor, number>;
}

// Interface para Estatísticas dos Cartões
export interface CardStats {
  titulo: string;
  valor: number | string;
  percentualMudanca: number;
  icon: string;
  cor: string;
}

// Interface para Município
export interface Municipio {
  id: string;
  nome: string;
  estado: string;
  populacao: number;
  orcamentoAnual: number;
  prefeito: string;
  logoUrl?: string;
}

// Interface para EstatisticaCartao
export interface EstatisticaCartao {
  titulo: string;
  valor: string | number;
  percentualMudanca: number;
  icon: string; // Keep as string - we'll use string identifiers for icons
  cor: string;
}

// Interface para Pedido - Adicionada para resolver o erro
export interface Pedido {
  id: string;
  dataCompra: Date;
  descricao: string;
  itens: Item[];
  valorTotal: number;
  fundoMonetario: string;
  setor: Setor;
  status: PedidoStatus;
  createdAt: Date;
}

// Tipo para PedidoStatus - Adicionado para resolver o erro
export type PedidoStatus = 
  | 'Pendente' 
  | 'Aprovado' 
  | 'Reprovado'
  | 'Em Andamento'
  | 'Concluído'
  | 'Em Análise';

// Interface para FiltroPedido - Adicionada para resolver o erro
export interface FiltroPedido {
  setor?: Setor;
  status?: PedidoStatus;
  dataInicio?: Date;
  dataFim?: Date;
  valorMinimo?: number;
  valorMaximo?: number;
  termo?: string;
}
