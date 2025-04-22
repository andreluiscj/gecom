
// Exibir dashboard sempre com dados zerados se não houver pedidos de compras

import { obterPedidos } from './mockData';
import { Setor } from '@/types';

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

// Painel utiliza resultados calculados — sempre retorna zero se vazio
export function obterDadosDashboard() {
  const calculatedData = calcularDadosDashboard();
  return {
    resumoFinanceiro: {
      orcamentoAnual: 2500000.00,
      orcamentoUtilizado: calculatedData.valorTotal,
      percentualUtilizado: (calculatedData.valorTotal / 2500000.00) * 100,
      totalPedidos: calculatedData.totalPedidos,
    },
    cartoes: [
      {
        titulo: "Pedidos Abertos",
        valor: calculatedData.totalPedidos,
        percentualMudanca: 0,
        icon: "ShoppingCart",
        classeCor: "bg-blue-500"
      },
      {
        titulo: "Orçamento Restante",
        valor: `R$ ${(2500000.00 - calculatedData.valorTotal).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`,
        percentualMudanca: 0,
        icon: "Wallet",
        classeCor: "bg-green-500"
      },
      {
        titulo: "Pedidos Aprovados",
        valor: 0, // não existem aprovados
        percentualMudanca: 0,
        icon: "CheckCircle",
        classeCor: "bg-emerald-500"
      },
      {
        titulo: "Valor Médio",
        valor: `R$ 0,00`,
        percentualMudanca: 0,
        icon: "TrendingUp",
        classeCor: "bg-amber-500"
      }
    ],
    orcamentoPrevisto: calculatedData.orcamentoPrevisto,
    gastosPorSetor: calculatedData.gastosPorSetor
  };
}

