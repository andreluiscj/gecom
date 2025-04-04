
import { DadosDashboard, Setor } from '@/types';

// Meses para uso nos dados mock
const MESES_ANTERIORES = [
  new Date(new Date().setMonth(new Date().getMonth() - 2)), // 3 meses atrás
  new Date(new Date().setMonth(new Date().getMonth() - 1)), // 2 meses atrás
  new Date(), // Mês atual
];

// Dados fictícios para gastos por setor nos últimos 3 meses
const gastosPorSetorEMes = {
  'Saúde': [580000, 625000, 720000],
  'Educação': [490000, 510000, 540000],
  'Administrativo': [280000, 320000, 350000],
  'Transporte': [180000, 190000, 210000],
  'Obras': [430000, 480000, 510000],
  'Segurança Pública': [370000, 395000, 425000],
  'Assistência Social': [190000, 215000, 230000],
  'Meio Ambiente': [110000, 125000, 140000],
  'Fazenda': [85000, 92000, 98000],
  'Turismo': [75000, 82000, 95000],
  'Cultura': [65000, 72000, 80000],
  'Esportes e Lazer': [130000, 145000, 160000],
  'Planejamento': [90000, 95000, 110000],
  'Comunicação': [45000, 52000, 60000],
  'Ciência e Tecnologia': [105000, 118000, 135000],
};

// Dados fictícios para orçamento previsto por setor
const orcamentoPrevistoPorSetor = {
  'Saúde': 2500000,
  'Educação': 2000000,
  'Administrativo': 1200000,
  'Transporte': 800000,
  'Obras': 1800000,
  'Segurança Pública': 1500000,
  'Assistência Social': 900000,
  'Meio Ambiente': 500000,
  'Fazenda': 400000,
  'Turismo': 350000,
  'Cultura': 300000,
  'Esportes e Lazer': 600000,
  'Planejamento': 400000,
  'Comunicação': 250000,
  'Ciência e Tecnologia': 500000,
};

// Dados fictícios para número de pedidos por setor nos últimos 3 meses
const pedidosPorSetorEMes = {
  'Saúde': [32, 38, 45],
  'Educação': [28, 30, 36],
  'Administrativo': [15, 19, 22],
  'Transporte': [12, 14, 16],
  'Obras': [25, 28, 32],
  'Segurança Pública': [20, 23, 26],
  'Assistência Social': [14, 16, 19],
  'Meio Ambiente': [8, 10, 12],
  'Fazenda': [5, 6, 7],
  'Turismo': [6, 7, 8],
  'Cultura': [4, 5, 7],
  'Esportes e Lazer': [9, 11, 14],
  'Planejamento': [6, 7, 9],
  'Comunicação': [3, 4, 5],
  'Ciência e Tecnologia': [7, 8, 11],
};

// Função para calcular dados para o dashboard
export function calcularDadosDashboard(municipioId?: string | null): DadosDashboard {
  const mesAtual = 2; // Índice do mês atual no array (0-indexed)
  
  const gastosPorSetor = {
    'Saúde': gastosPorSetorEMes['Saúde'][mesAtual],
    'Educação': gastosPorSetorEMes['Educação'][mesAtual],
    'Administrativo': gastosPorSetorEMes['Administrativo'][mesAtual],
    'Transporte': gastosPorSetorEMes['Transporte'][mesAtual],
    'Obras': gastosPorSetorEMes['Obras'][mesAtual],
    'Segurança Pública': gastosPorSetorEMes['Segurança Pública'][mesAtual],
    'Assistência Social': gastosPorSetorEMes['Assistência Social'][mesAtual],
    'Meio Ambiente': gastosPorSetorEMes['Meio Ambiente'][mesAtual],
    'Fazenda': gastosPorSetorEMes['Fazenda'][mesAtual],
    'Turismo': gastosPorSetorEMes['Turismo'][mesAtual],
    'Cultura': gastosPorSetorEMes['Cultura'][mesAtual],
    'Esportes e Lazer': gastosPorSetorEMes['Esportes e Lazer'][mesAtual],
    'Planejamento': gastosPorSetorEMes['Planejamento'][mesAtual],
    'Comunicação': gastosPorSetorEMes['Comunicação'][mesAtual],
    'Ciência e Tecnologia': gastosPorSetorEMes['Ciência e Tecnologia'][mesAtual],
  };

  const pedidosPorSetor = {
    'Saúde': pedidosPorSetorEMes['Saúde'][mesAtual],
    'Educação': pedidosPorSetorEMes['Educação'][mesAtual],
    'Administrativo': pedidosPorSetorEMes['Administrativo'][mesAtual],
    'Transporte': pedidosPorSetorEMes['Transporte'][mesAtual],
    'Obras': pedidosPorSetorEMes['Obras'][mesAtual],
    'Segurança Pública': pedidosPorSetorEMes['Segurança Pública'][mesAtual],
    'Assistência Social': pedidosPorSetorEMes['Assistência Social'][mesAtual],
    'Meio Ambiente': pedidosPorSetorEMes['Meio Ambiente'][mesAtual],
    'Fazenda': pedidosPorSetorEMes['Fazenda'][mesAtual],
    'Turismo': pedidosPorSetorEMes['Turismo'][mesAtual],
    'Cultura': pedidosPorSetorEMes['Cultura'][mesAtual],
    'Esportes e Lazer': pedidosPorSetorEMes['Esportes e Lazer'][mesAtual],
    'Planejamento': pedidosPorSetorEMes['Planejamento'][mesAtual],
    'Comunicação': pedidosPorSetorEMes['Comunicação'][mesAtual],
    'Ciência e Tecnologia': pedidosPorSetorEMes['Ciência e Tecnologia'][mesAtual],
  };

  const orcamentoPrevisto = {
    'Saúde': orcamentoPrevistoPorSetor['Saúde'],
    'Educação': orcamentoPrevistoPorSetor['Educação'],
    'Administrativo': orcamentoPrevistoPorSetor['Administrativo'],
    'Transporte': orcamentoPrevistoPorSetor['Transporte'],
    'Obras': orcamentoPrevistoPorSetor['Obras'],
    'Segurança Pública': orcamentoPrevistoPorSetor['Segurança Pública'],
    'Assistência Social': orcamentoPrevistoPorSetor['Assistência Social'],
    'Meio Ambiente': orcamentoPrevistoPorSetor['Meio Ambiente'],
    'Fazenda': orcamentoPrevistoPorSetor['Fazenda'],
    'Turismo': orcamentoPrevistoPorSetor['Turismo'],
    'Cultura': orcamentoPrevistoPorSetor['Cultura'],
    'Esportes e Lazer': orcamentoPrevistoPorSetor['Esportes e Lazer'],
    'Planejamento': orcamentoPrevistoPorSetor['Planejamento'],
    'Comunicação': orcamentoPrevistoPorSetor['Comunicação'],
    'Ciência e Tecnologia': orcamentoPrevistoPorSetor['Ciência e Tecnologia'],
  };

  // Cálculo do ticket médio por setor
  const ticketMedioPorSetor: Record<string, number> = {};
  
  for (const setor in pedidosPorSetor) {
    if (pedidosPorSetor[setor as keyof typeof pedidosPorSetor] > 0) {
      ticketMedioPorSetor[setor] = gastosPorSetor[setor as keyof typeof gastosPorSetor] / pedidosPorSetor[setor as keyof typeof pedidosPorSetor];
    } else {
      ticketMedioPorSetor[setor] = 0;
    }
  }

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
