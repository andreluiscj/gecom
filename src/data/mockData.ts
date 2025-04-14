
// This file is now deprecated, re-export from services instead
export { 
  getPedidos as obterPedidos,
  getPedidos as obterTodosPedidos,
  getPedidosPorSetor as obterPedidosPorSetor,
  addPedido as adicionarPedido,
  updatePedidoStatus as atualizarStatusPedido,
  updateEtapaWorkflow as atualizarEtapaWorkflow,
  deletePedido as removerPedido
} from '@/services/pedidoService';

import { v4 as uuidv4 } from 'uuid';

// Re-export gerarId for compatibility
export function gerarId() {
  return uuidv4();
}

// Re-export from the new services
export { getFuncionarios, addFuncionario, updateFuncionario, deleteFuncionario } from '@/services/funcionarioService';

// Import pedidos functions from pedidos service
import { getPedidos } from '@/services/pedidoService';

// Format date helper
import { format } from 'date-fns';
export function formatarData(data: Date): string {
  return format(data, 'dd/MM/yyyy');
}

// Re-export filtering functions
export async function filtrarPedidos(pedidos: any[], filtros: any) {
  return pedidos.filter(pedido => {
    // Filtra por setor
    if (filtros.setor && pedido.setor !== filtros.setor) {
      return false;
    }
    
    // Filtra por status
    if (filtros.status && pedido.status !== filtros.status) {
      return false;
    }
    
    // Filtra por data
    if (filtros.dataInicio && new Date(filtros.dataInicio) > pedido.dataCompra) {
      return false;
    }
    
    if (filtros.dataFim && new Date(filtros.dataFim) < pedido.dataCompra) {
      return false;
    }
    
    // Filtra por valor
    if (filtros.valorMinimo && pedido.valorTotal < filtros.valorMinimo) {
      return false;
    }
    
    if (filtros.valorMaximo && pedido.valorTotal > filtros.valorMaximo) {
      return false;
    }
    
    // Filtra por termo de busca
    if (filtros.termo) {
      const termo = filtros.termo.toLowerCase();
      const descricaoMatch = pedido.descricao.toLowerCase().includes(termo);
      const itensMatch = pedido.itens.some((item: any) => 
        item.nome.toLowerCase().includes(termo)
      );
      
      if (!descricaoMatch && !itensMatch) {
        return false;
      }
    }
    
    return true;
  });
}

// Import necessary utilities
import { initializeWorkflow, updateWorkflowFromPedidoStatus } from '@/utils/workflowHelpers';
export { initializeWorkflow, updateWorkflowFromPedidoStatus };

// Re-export fundos monetarios array
export const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Administração',
  'Fundo Municipal de Transporte',
  'Fundo Municipal de Assistência Social',
  'Fundo Municipal de Cultura',
  'Fundo Municipal de Meio Ambiente',
];

// Re-export mock names
export const nomesResponsaveis = [
  'Ana Silva',
  'Carlos Santos',
  'Mariana Oliveira',
  'Pedro Almeida',
  'Juliana Costa',
  'Roberto Pereira',
  'Fernanda Lima',
  'Lucas Martins',
  'Patricia Souza',
  'Bruno Rodrigues'
];

// Initialize mock data function is now deprecated, we'll load data from Supabase
export function initializeMockData() {
  console.warn('initializeMockData is deprecated. Data now comes from Supabase.');
  return [];
}

// Re-export from pedidos service
export { getPedidos as obterPedidosFicticios } from '@/services/pedidoService';
