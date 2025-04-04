
import { DadosDashboard, Setor } from '@/types';

// Meses para uso nos dados mock
const MESES_ANTERIORES = [
  new Date(new Date().setMonth(new Date().getMonth() - 2)), // 3 meses atrás
  new Date(new Date().setMonth(new Date().getMonth() - 1)), // 2 meses atrás
  new Date(), // Mês atual
];

// Dados mock para gastos por setor nos últimos 3 meses
const gastosPorSetorEMes = {
  'Saúde': [125000, 142000, 138000],
  'Educação': [98000, 105000, 112000],
  'Administrativo': [78000, 74000, 82000],
  'Transporte': [45000, 56000, 51000],
};

// Dados mock para orçamento previsto por setor
const orcamentoPrevistoPorSetor = {
  'Saúde': 150000,
  'Educação': 120000,
  'Administrativo': 90000,
  'Transporte': 60000,
};

// Dados mock para número de pedidos por setor nos últimos 3 meses
const pedidosPorSetorEMes = {
  'Saúde': [24, 28, 26],
  'Educação': [18, 20, 22],
  'Administrativo': [15, 14, 17],
  'Transporte': [10, 12, 11],
};

// Função para calcular dados para o dashboard
export function calcularDadosDashboard(municipioId?: string | null): DadosDashboard {
  const mesAtual = 2; // Índice do mês atual no array (0-indexed)
  
  const gastosPorSetor = {
    'Saúde': gastosPorSetorEMes['Saúde'][mesAtual],
    'Educação': gastosPorSetorEMes['Educação'][mesAtual],
    'Administrativo': gastosPorSetorEMes['Administrativo'][mesAtual],
    'Transporte': gastosPorSetorEMes['Transporte'][mesAtual],
  };

  const pedidosPorSetor = {
    'Saúde': pedidosPorSetorEMes['Saúde'][mesAtual],
    'Educação': pedidosPorSetorEMes['Educação'][mesAtual],
    'Administrativo': pedidosPorSetorEMes['Administrativo'][mesAtual],
    'Transporte': pedidosPorSetorEMes['Transporte'][mesAtual],
  };

  const orcamentoPrevisto = {
    'Saúde': orcamentoPrevistoPorSetor['Saúde'],
    'Educação': orcamentoPrevistoPorSetor['Educação'],
    'Administrativo': orcamentoPrevistoPorSetor['Administrativo'],
    'Transporte': orcamentoPrevistoPorSetor['Transporte'],
  };

  // Cálculo do ticket médio por setor
  const ticketMedioPorSetor = {
    'Saúde': pedidosPorSetor['Saúde'] ? gastosPorSetor['Saúde'] / pedidosPorSetor['Saúde'] : 0,
    'Educação': pedidosPorSetor['Educação'] ? gastosPorSetor['Educação'] / pedidosPorSetor['Educação'] : 0,
    'Administrativo': pedidosPorSetor['Administrativo'] ? gastosPorSetor['Administrativo'] / pedidosPorSetor['Administrativo'] : 0,
    'Transporte': pedidosPorSetor['Transporte'] ? gastosPorSetor['Transporte'] / pedidosPorSetor['Transporte'] : 0,
  };

  const gastosTotais = Object.values(gastosPorSetor).reduce((acc, val) => acc + val, 0);

  return {
    gastosTotais,
    gastosPorSetor,
    orcamentoPrevisto,
    pedidosPorSetor,
    ticketMedioPorSetor,
  };
}

// Exporting constants for usage in other modules
export { 
  gastosPorSetorEMes, 
  orcamentoPrevistoPorSetor, 
  pedidosPorSetorEMes,
  MESES_ANTERIORES
};
