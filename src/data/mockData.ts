
// Add workflow updates function that updates the title property for compatibility
export function atualizarWorkflow(
  pedidoId: string,
  etapaId: string,
  novoStatus: string,
  justificativa?: string,
  proximoResponsavelId?: string
): Promise<boolean> {
  // Here would be API call in real implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      // Update the workflow step in a real system
      resolve(true);
    }, 500);
  });
}

// Add missing functions
export const atualizarEtapaWorkflow = atualizarWorkflow;

export function obterTodosPedidos() {
  // Import from mockPedidos for consistency
  const { obterPedidosFicticios } = require('./pedidos/mockPedidos');
  return obterPedidosFicticios();
}

export function obterPedidos() {
  return obterTodosPedidos();
}

export function obterPedidosPorSetor(setorId: string) {
  return obterTodosPedidos().filter(p => p.setor_id === setorId);
}

// Update to accept only one parameter
export function removerPedido(id: string) {
  console.log(`Removing pedido ${id}`);
  return Promise.resolve(true);
}

// Export the formatarData function for compatibility
export { formatarData } from '../utils/formatters';
