// Mock data for pedidos
import { PedidoCompra, PedidoStatus } from '@/types';
import { updateWorkflowFromPedidoStatus } from '@/utils/workflowHelpers';

// Generate a random ID
function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Generate random date in the past 30 days
function randomPastDate(days = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * days));
  return date;
}

// Generate mock pedidos
export function obterPedidosFicticios(): PedidoCompra[] {
  const pedidos: PedidoCompra[] = [
    {
      id: "ped-001",
      descricao: "Aquisição de material de escritório",
      data_compra: randomPastDate(15),
      setor_id: "setor-001",
      setor: "Secretaria de Administração",
      valor_total: 1250.75,
      status: "Concluído",
      fundo_monetario: "Fundo Rotativo",
      created_at: randomPastDate(20),
      updated_at: new Date(),
      solicitante_id: "func-001",
      solicitante: "João Silva",
      local_entrega: "Prédio Central",
      justificativa: "Reposição de estoque para o trimestre",
      observacoes: "Entrega deve ser feita em horário comercial",
      itens: [
        {
          id: "item-001",
          nome: "Resma de Papel A4",
          quantidade: 10,
          valor_unitario: 25.50,
          valor_total: 255.00,
          pedido_id: "ped-001"
        },
        {
          id: "item-002",
          nome: "Canetas Esferográficas",
          quantidade: 50,
          valor_unitario: 2.50,
          valor_total: 125.00,
          pedido_id: "ped-001"
        },
        {
          id: "item-003",
          nome: "Grampeadores",
          quantidade: 5,
          valor_unitario: 35.75,
          valor_total: 178.75,
          pedido_id: "ped-001"
        },
        {
          id: "item-004",
          nome: "Pastas Arquivo",
          quantidade: 30,
          valor_unitario: 12.00,
          valor_total: 360.00,
          pedido_id: "ped-001"
        },
        {
          id: "item-005",
          nome: "Toner para Impressora",
          quantidade: 2,
          valor_unitario: 166.00,
          valor_total: 332.00,
          pedido_id: "ped-001"
        }
      ]
    },
    {
      id: "ped-002",
      descricao: "Manutenção de equipamentos de informática",
      data_compra: randomPastDate(10),
      setor_id: "setor-002",
      setor: "Secretaria de Tecnologia",
      valor_total: 3750.00,
      status: "Em Andamento",
      fundo_monetario: "Fundo Administrativo",
      created_at: randomPastDate(12),
      updated_at: new Date(),
      solicitante_id: "func-002",
      solicitante: "Maria Oliveira",
      local_entrega: "Departamento de TI",
      justificativa: "Manutenção preventiva dos equipamentos",
      itens: [
        {
          id: "item-006",
          nome: "Serviço de Manutenção de Servidores",
          quantidade: 1,
          valor_unitario: 2500.00,
          valor_total: 2500.00,
          pedido_id: "ped-002"
        },
        {
          id: "item-007",
          nome: "Substituição de Peças",
          quantidade: 1,
          valor_unitario: 1250.00,
          valor_total: 1250.00,
          pedido_id: "ped-002"
        }
      ]
    },
    {
      id: "ped-003",
      descricao: "Aquisição de medicamentos para posto de saúde",
      data_compra: randomPastDate(5),
      setor_id: "setor-003",
      setor: "Secretaria de Saúde",
      valor_total: 8750.25,
      status: "Pendente",
      fundo_monetario: "Fundo Municipal de Saúde",
      created_at: randomPastDate(7),
      updated_at: new Date(),
      solicitante_id: "func-003",
      solicitante: "Carlos Santos",
      local_entrega: "Posto de Saúde Central",
      justificativa: "Reposição de estoque de medicamentos essenciais",
      observacoes: "Entrega urgente",
      itens: [
        {
          id: "item-008",
          nome: "Dipirona 500mg",
          quantidade: 500,
          valor_unitario: 0.35,
          valor_total: 175.00,
          pedido_id: "ped-003"
        },
        {
          id: "item-009",
          nome: "Amoxicilina 500mg",
          quantidade: 300,
          valor_unitario: 0.75,
          valor_total: 225.00,
          pedido_id: "ped-003"
        },
        {
          id: "item-010",
          nome: "Paracetamol 750mg",
          quantidade: 400,
          valor_unitario: 0.45,
          valor_total: 180.00,
          pedido_id: "ped-003"
        },
        {
          id: "item-011",
          nome: "Insulina",
          quantidade: 50,
          valor_unitario: 165.00,
          valor_total: 8250.00,
          pedido_id: "ped-003"
        }
      ]
    },
    {
      id: "ped-004",
      descricao: "Contratação de serviço de limpeza",
      data_compra: randomPastDate(20),
      setor_id: "setor-001",
      setor: "Secretaria de Administração",
      valor_total: 12000.00,
      status: "Aprovado",
      fundo_monetario: "Fundo Administrativo",
      created_at: randomPastDate(25),
      updated_at: new Date(),
      solicitante_id: "func-001",
      solicitante: "João Silva",
      justificativa: "Manutenção da limpeza dos prédios públicos",
      itens: [
        {
          id: "item-012",
          nome: "Serviço de Limpeza - 3 meses",
          quantidade: 1,
          valor_unitario: 12000.00,
          valor_total: 12000.00,
          pedido_id: "ped-004"
        }
      ]
    },
    {
      id: "ped-005",
      descricao: "Aquisição de material escolar",
      data_compra: randomPastDate(8),
      setor_id: "setor-004",
      setor: "Secretaria de Educação",
      valor_total: 15750.50,
      status: "Em Análise",
      fundo_monetario: "Fundo Municipal de Educação",
      created_at: randomPastDate(10),
      updated_at: new Date(),
      solicitante_id: "func-004",
      solicitante: "Ana Pereira",
      local_entrega: "Almoxarifado Central",
      justificativa: "Distribuição para escolas municipais",
      itens: [
        {
          id: "item-013",
          nome: "Cadernos",
          quantidade: 1000,
          valor_unitario: 5.50,
          valor_total: 5500.00,
          pedido_id: "ped-005"
        },
        {
          id: "item-014",
          nome: "Lápis",
          quantidade: 2000,
          valor_unitario: 0.75,
          valor_total: 1500.00,
          pedido_id: "ped-005"
        },
        {
          id: "item-015",
          nome: "Borrachas",
          quantidade: 1000,
          valor_unitario: 0.50,
          valor_total: 500.00,
          pedido_id: "ped-005"
        },
        {
          id: "item-016",
          nome: "Mochilas",
          quantidade: 500,
          valor_unitario: 15.00,
          valor_total: 7500.00,
          pedido_id: "ped-005"
        },
        {
          id: "item-017",
          nome: "Réguas",
          quantidade: 1000,
          valor_unitario: 0.75,
          valor_total: 750.00,
          pedido_id: "ped-005"
        }
      ]
    },
    {
      id: "ped-006",
      descricao: "Manutenção de veículos",
      data_compra: randomPastDate(3),
      setor_id: "setor-005",
      setor: "Secretaria de Transportes",
      valor_total: 4500.00,
      status: "Rejeitado",
      fundo_monetario: "Fundo Rotativo",
      created_at: randomPastDate(5),
      updated_at: new Date(),
      solicitante_id: "func-005",
      solicitante: "Roberto Almeida",
      justificativa: "Manutenção preventiva da frota municipal",
      observacoes: "Orçamento acima do esperado, necessita revisão",
      itens: [
        {
          id: "item-018",
          nome: "Troca de Óleo",
          quantidade: 10,
          valor_unitario: 150.00,
          valor_total: 1500.00,
          pedido_id: "ped-006"
        },
        {
          id: "item-019",
          nome: "Alinhamento e Balanceamento",
          quantidade: 10,
          valor_unitario: 120.00,
          valor_total: 1200.00,
          pedido_id: "ped-006"
        },
        {
          id: "item-020",
          nome: "Revisão Geral",
          quantidade: 3,
          valor_unitario: 600.00,
          valor_total: 1800.00,
          pedido_id: "ped-006"
        }
      ]
    }
  ];

  // Add workflow data to each pedido
  return pedidos.map(pedido => updateWorkflowFromPedidoStatus(pedido));
}

// Get a specific pedido by ID
export function obterPedidoPorId(id: string): PedidoCompra | undefined {
  return obterPedidosFicticios().find(p => p.id === id);
}

// Get pedidos by status
export function obterPedidosPorStatus(status: PedidoStatus): PedidoCompra[] {
  return obterPedidosFicticios().filter(p => p.status === status);
}

// Get pedidos by setor
export function obterPedidosPorSetor(setorId: string): PedidoCompra[] {
  return obterPedidosFicticios().filter(p => p.setor_id === setorId);
}

// Get pedidos by solicitante
export function obterPedidosPorSolicitante(solicitanteId: string): PedidoCompra[] {
  return obterPedidosFicticios().filter(p => p.solicitante_id === solicitanteId);
}

// Get pedidos by date range
export function obterPedidosPorPeriodo(dataInicio: Date, dataFim: Date): PedidoCompra[] {
  return obterPedidosFicticios().filter(p => {
    const dataCompra = new Date(p.data_compra);
    return dataCompra >= dataInicio && dataCompra <= dataFim;
  });
}

// Get total value of all pedidos
export function obterValorTotalPedidos(): number {
  return obterPedidosFicticios().reduce((total, pedido) => total + pedido.valor_total, 0);
}

// Get count of pedidos by status
export function obterContagemPorStatus(): Record<PedidoStatus, number> {
  const contagem: Partial<Record<PedidoStatus, number>> = {};
  
  obterPedidosFicticios().forEach(pedido => {
    contagem[pedido.status] = (contagem[pedido.status] || 0) + 1;
  });
  
  return contagem as Record<PedidoStatus, number>;
}
