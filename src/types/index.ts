
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

export interface Item {
  id: string;
  nome: string;
  descricao?: string;
  quantidade: number;
  valorUnitario: number;
  valorTotal: number;
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
  status?: string; // pendente, em_analise, aprovado, em_processo, concluido, rejeitado
}

export interface DadosSetor {
  nome: string;
  descricao: string;
  responsavel: string;
  contato: string;
  orcamentoAnual: number;
  orcamentoUtilizado: number;
}
