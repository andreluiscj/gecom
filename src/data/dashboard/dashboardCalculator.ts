
import { DadosDashboard, Setor } from '@/types';

// Meses para uso nos dados mock
const MESES_ANTERIORES = [
  new Date(new Date().setMonth(new Date().getMonth() - 2)), // 3 meses atrás
  new Date(new Date().setMonth(new Date().getMonth() - 1)), // 2 meses atrás
  new Date(), // Mês atual
];

// Dados zerados para gastos por setor nos últimos 3 meses
const gastosPorSetorEMes = {
  'Saúde': [0, 0, 0],
  'Educação': [0, 0, 0],
  'Administrativo': [0, 0, 0],
  'Transporte': [0, 0, 0],
};

// Dados zerados para orçamento previsto por setor
const orcamentoPrevistoPorSetor = {
  'Saúde': 0,
  'Educação': 0,
  'Administrativo': 0,
  'Transporte': 0,
};

// Dados zerados para número de pedidos por setor nos últimos 3 meses
const pedidosPorSetorEMes = {
  'Saúde': [0, 0, 0],
  'Educação': [0, 0, 0],
  'Administrativo': [0, 0, 0],
  'Transporte': [0, 0, 0],
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
