
import { v4 as uuidv4 } from 'uuid';
import { PedidoCompra } from '@/types';
import { 
  getPedidos, 
  getPedidosPorSetor, 
  addPedido as adicionarPedidoDB, 
  updateEtapaWorkflow, 
  deletePedido 
} from '@/services/pedidoService';
import { 
  initializeWorkflow,
  updateWorkflowFromPedidoStatus 
} from '@/utils/workflowHelpers';

// Generate a random ID
export function gerarId(): string {
  return uuidv4();
}

// Add a new pedido
export async function adicionarPedido(pedido: PedidoCompra): Promise<PedidoCompra> {
  try {
    const newPedido = await adicionarPedidoDB(pedido);
    return newPedido;
  } catch (error) {
    console.error('Error adding pedido:', error);
    throw error;
  }
}

// Get all pedidos (re-exported from service)
export { getPedidos, getPedidosPorSetor, updateEtapaWorkflow, deletePedido };
