
// This file is now a compatibility layer that redirects to the Supabase service
// It ensures backward compatibility during the transition to Supabase

import { 
  adicionarPedido as adicionarPedidoService,
  removerPedido as removerPedidoService,
  obterTodosPedidos as obterTodosPedidosService,
  obterPedidos as obterPedidosService,
  obterPedidosPorSetor as obterPedidosPorSetorService,
  atualizarStatusPedido as atualizarStatusPedidoService,
  atualizarEtapaWorkflow as atualizarEtapaWorkflowService,
  fundosMonetarios,
  formatarData
} from '@/services/dfdService';

// Re-export everything from the service
export const adicionarPedido = adicionarPedidoService;
export const removerPedido = removerPedidoService;
export const obterTodosPedidos = obterTodosPedidosService;
export const obterPedidos = obterPedidosService;
export const obterPedidosPorSetor = obterPedidosPorSetorService;
export const atualizarStatusPedido = atualizarStatusPedidoService;
export const atualizarEtapaWorkflow = atualizarEtapaWorkflowService;
export { fundosMonetarios, formatarData };

// Helper function to generate ID - kept for backward compatibility
export function gerarId(): string {
  return crypto.randomUUID();
}
