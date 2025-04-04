
import { addDays, addHours, format, subMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PedidoCompra, Item, Setor } from '@/types';

// Array com os fundos monetários disponíveis
export const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Administração',
  'Fundo Municipal de Transporte',
  'Fundo Municipal de Assistência Social',
  'Fundo Municipal de Cultura',
  'Fundo Municipal de Meio Ambiente',
];

// Função para gerar IDs únicos
export function gerarId() {
  return uuidv4();
}

// Initialize todosPedidos
const todosPedidos: PedidoCompra[] = [];

// Function to initialize the data - will be called when needed
export function initializeMockData() {
  // Reset todosPedidos array to start with a clean slate
  todosPedidos.length = 0;
  return todosPedidos;
}

// Make sure data is initialized before first use
initializeMockData();

// Import functions from pedidos module
import { obterPedidosFicticios } from './pedidos/mockPedidos';

// Re-export the function for external use
export { obterPedidosFicticios };

// Função para adicionar um novo pedido
export function adicionarPedido(pedido: PedidoCompra) {
  todosPedidos.push(pedido);
  return pedido;
}

// Função para remover um pedido
export function removerPedido(id: string, setor?: Setor) {
  const index = todosPedidos.findIndex(p => p.id === id);
  if (index !== -1) {
    todosPedidos.splice(index, 1);
    return true;
  }
  return false;
}

// Função para obter todos os pedidos
export function obterPedidos(): PedidoCompra[] {
  return todosPedidos;
}

// Função para obter todos os pedidos (alias para compatibilidade)
export const obterTodosPedidos = obterPedidos;

// Função para obter pedidos por setor
export function obterPedidosPorSetor(setor: Setor): PedidoCompra[] {
  return todosPedidos.filter(pedido => pedido.setor === setor);
}

// Função auxiliar para formatar data
export function formatarData(data: Date): string {
  return format(data, 'dd/MM/yyyy');
}

// Função para filtrar pedidos com base em critérios
export function filtrarPedidos(pedidos: PedidoCompra[], filtros: any) {
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
      const itensMatch = pedido.itens.some(item => 
        item.nome.toLowerCase().includes(termo)
      );
      
      if (!descricaoMatch && !itensMatch) {
        return false;
      }
    }
    
    return true;
  });
}
