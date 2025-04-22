// This file is no longer used for dashboard data
// All data is now fetched directly from the database

import { obterPedidos } from './mockData';
import { Setor } from '@/types';

// This function is kept for backward compatibility but is no longer used
// by the dashboard
export function calcularDadosDashboard() {
  const pedidos = obterPedidos();
  const valorTotal = pedidos.reduce((sum, pedido) => sum + pedido.valorTotal, 0);
  const pedidosPorSetor: Record<string, number> = {};
  const gastosPorSetor: Record<string, number> = {};
  const todosSetores: Setor[] = [
    'Saúde', 'Educação', 'Administrativo', 'Transporte', 
    'Obras', 'Segurança Pública', 'Assistência Social', 
    'Meio Ambiente', 'Fazenda', 'Turismo', 'Cultura', 
    'Esportes e Lazer', 'Planejamento', 'Comunicação', 
    'Ciência e Tecnologia'
  ];
  todosSetores.forEach(setor => {
    pedidosPorSetor[setor] = 0;
    gastosPorSetor[setor] = 0;
  });
  pedidos.forEach(pedido => {
    if (pedidosPorSetor[pedido.setor] !== undefined) {
      pedidosPorSetor[pedido.setor]++;
      gastosPorSetor[pedido.setor] += pedido.valorTotal;
    }
  });
  return {
    totalPedidos: pedidos.length,
    valorTotal,
    pedidosPorSetor,
    gastosPorSetor,
    orcamentoPrevisto: {
      'Saúde': 500000.00,
      'Educação': 400000.00,
      'Administrativo': 300000.00,
      'Transporte': 300000.00,
      'Obras': 250000.00,
      'Segurança Pública': 200000.00,
      'Assistência Social': 180000.00,
      'Meio Ambiente': 150000.00,
      'Fazenda': 120000.00,
      'Turismo': 100000.00,
      'Cultura': 90000.00,
      'Esportes e Lazer': 80000.00,
      'Planejamento': 70000.00,
      'Comunicação': 60000.00,
      'Ciência e Tecnologia': 50000.00
    }
  };
}

// Also keeping this for backward compatibility
export function obterDadosDashboard() {
  // Return empty data to avoid any possible issues in case some code still uses this
  return {
    resumoFinanceiro: {
      orcamentoAnual: 0,
      orcamentoUtilizado: 0,
      percentualUtilizado: 0,
      totalPedidos: 0,
    },
    cartoes: [],
    orcamentoPrevisto: {},
    gastosPorSetor: {}
  };
}
