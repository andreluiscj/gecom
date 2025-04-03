
import { 
  DadosDashboard, 
  EstatisticaCartao, 
  Pedido, 
  PedidoStatus, 
  FiltroPedido,
  Setor,
  PedidoCompra
} from '@/types';
import { addDays, subMonths, subDays, parseISO, format } from 'date-fns';
import { gerarId } from '@/data/mockData';

// Meses para uso nos dados mock
const MESES_ANTERIORES = [
  subMonths(new Date(), 2), // 3 meses atrás
  subMonths(new Date(), 1), // 2 meses atrás
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

// Função para obter estatísticas dos cartões do dashboard
export function obterEstatisticasCartoes(municipioId?: string | null): EstatisticaCartao[] {
  const language = localStorage.getItem('app-language') || 'pt';
  const dados = calcularDadosDashboard(municipioId);
  
  const orcamentoTotal = Object.values(dados.orcamentoPrevisto).reduce((acc, val) => acc + val, 0);
  const gastoTotal = dados.gastosTotais;
  const totalPedidos = Object.values(dados.pedidosPorSetor).reduce((acc, val) => acc + val, 0);
  
  // Calcular ticket médio global
  const ticketMedio = totalPedidos > 0 ? gastoTotal / totalPedidos : 0;
  
  // Calcular percentuais de mudança com base no mês anterior
  const mesAnterior = 1; // Índice do mês anterior no array (0-indexed)
  
  const gastoTotalAnterior = 
    gastosPorSetorEMes['Saúde'][mesAnterior] + 
    gastosPorSetorEMes['Educação'][mesAnterior] + 
    gastosPorSetorEMes['Administrativo'][mesAnterior] + 
    gastosPorSetorEMes['Transporte'][mesAnterior];
  
  const totalPedidosAnterior = 
    pedidosPorSetorEMes['Saúde'][mesAnterior] + 
    pedidosPorSetorEMes['Educação'][mesAnterior] + 
    pedidosPorSetorEMes['Administrativo'][mesAnterior] + 
    pedidosPorSetorEMes['Transporte'][mesAnterior];
  
  const ticketMedioAnterior = totalPedidosAnterior > 0 ? gastoTotalAnterior / totalPedidosAnterior : 0;
  
  // Calcular percentuais de mudança
  const percentualMudancaGasto = gastoTotalAnterior > 0 ? ((gastoTotal - gastoTotalAnterior) / gastoTotalAnterior) * 100 : 0;
  const percentualMudancaPedidos = totalPedidosAnterior > 0 ? ((totalPedidos - totalPedidosAnterior) / totalPedidosAnterior) * 100 : 0;
  const percentualMudancaTicket = ticketMedioAnterior > 0 ? ((ticketMedio - ticketMedioAnterior) / ticketMedioAnterior) * 100 : 0;
  
  // Textos multilíngues
  const texts = {
    budgetTitle: language === 'pt' ? 'Orçamento Total' : 'Total Budget',
    expensesTitle: language === 'pt' ? 'Total Gasto' : 'Total Spent',
    dfdTitle: language === 'pt' ? 'Pedidos de Compras' : 'Purchase Orders',
    ticketTitle: language === 'pt' ? 'Ticket Médio' : 'Average Ticket'
  };
  
  return [
    {
      titulo: texts.budgetTitle,
      valor: `R$ ${(orcamentoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: 0, // Orçamento não muda mensalmente neste caso
      icon: 'Building',
      cor: 'bg-administrativo-DEFAULT'
    },
    {
      titulo: texts.expensesTitle,
      valor: `R$ ${(gastoTotal).toLocaleString('pt-BR')}`,
      percentualMudanca: percentualMudancaGasto,
      icon: 'Wallet',
      cor: 'bg-saude-DEFAULT'
    },
    {
      titulo: texts.dfdTitle,
      valor: totalPedidos.toString(),
      percentualMudanca: percentualMudancaPedidos,
      icon: 'ShoppingCart',
      cor: 'bg-educacao-DEFAULT'
    },
    {
      titulo: texts.ticketTitle,
      valor: `R$ ${(ticketMedio).toLocaleString('pt-BR')}`,
      percentualMudanca: percentualMudancaTicket,
      icon: 'Receipt',
      cor: 'bg-transporte-DEFAULT'
    }
  ];
}

// Gerar pedidos fictícios para cada setor nos últimos 3 meses
const gerarPedidosFicticios = (): PedidoCompra[] => {
  const pedidos: PedidoCompra[] = [];
  const setores: Setor[] = ['Saúde', 'Educação', 'Administrativo', 'Transporte'];
  const status: PedidoStatus[] = ['Pendente', 'Aprovado', 'Reprovado'];
  
  // Para cada setor
  setores.forEach(setor => {
    // Para cada mês dos últimos 3 meses
    MESES_ANTERIORES.forEach((mes, mesIndex) => {
      // Número de pedidos para este setor e mês
      const numPedidos = pedidosPorSetorEMes[setor][mesIndex];
      
      // Valor total gasto neste setor e mês
      const valorTotal = gastosPorSetorEMes[setor][mesIndex];
      
      // Valor médio por pedido
      const valorMedioPedido = numPedidos > 0 ? valorTotal / numPedidos : 0;
      
      // Gerar N pedidos
      for (let i = 0; i < numPedidos; i++) {
        // Distribuir a data do pedido ao longo do mês
        const dataCompra = new Date(mes);
        dataCompra.setDate(Math.floor(Math.random() * 28) + 1); // Dia aleatório do mês
        
        // Gerar um valor que pode variar até 30% para mais ou para menos do valor médio
        const valorPedido = valorMedioPedido * (0.7 + Math.random() * 0.6);
        
        // Determinar quantos itens terá o pedido (entre 1 e 5)
        const numItens = Math.floor(Math.random() * 5) + 1;
        
        // Criar os itens
        const itens = [];
        let valorTotalItens = 0;
        
        for (let j = 0; j < numItens; j++) {
          // O último item ajusta para o valor total desejado
          const isLastItem = j === numItens - 1;
          const valorItem = isLastItem 
            ? valorPedido - valorTotalItens 
            : valorPedido * (Math.random() * 0.5 + 0.1); // 10% a 60% do valor total
          
          const quantidade = Math.floor(Math.random() * 10) + 1;
          const valorUnitario = valorItem / quantidade;
          
          const nomesProdutos = {
            'Saúde': ['Seringas descartáveis', 'Luvas cirúrgicas', 'Máscaras N95', 'Álcool em gel', 'Medicamentos', 'Equipamento médico'],
            'Educação': ['Livros didáticos', 'Material escolar', 'Carteiras escolares', 'Quadros brancos', 'Equipamentos para laboratório'],
            'Administrativo': ['Material de escritório', 'Mobiliário', 'Computadores', 'Impressoras', 'Software administrativo'],
            'Transporte': ['Peças de reposição', 'Combustível', 'Pneus', 'Manutenção veicular', 'Sinalização viária']
          };
          
          const produtosDoSetor = nomesProdutos[setor];
          const nomeProduto = produtosDoSetor[Math.floor(Math.random() * produtosDoSetor.length)];
          
          const item = {
            id: gerarId(),
            nome: nomeProduto,
            quantidade,
            valorUnitario,
            valorTotal: valorItem
          };
          
          itens.push(item);
          valorTotalItens += valorItem;
        }
        
        // Status baseado na data (mais antigos têm mais chance de serem aprovados/reprovados)
        const diasPassados = (new Date().getTime() - dataCompra.getTime()) / (1000 * 60 * 60 * 24);
        let statusPedido: PedidoStatus;
        if (diasPassados > 45) { // Mais de 1,5 mês
          statusPedido = Math.random() > 0.2 ? (Math.random() > 0.7 ? 'Aprovado' : 'Reprovado') : 'Pendente';
        } else if (diasPassados > 15) { // Mais de meio mês
          statusPedido = Math.random() > 0.5 ? (Math.random() > 0.7 ? 'Aprovado' : 'Reprovado') : 'Pendente';
        } else {
          statusPedido = Math.random() > 0.7 ? (Math.random() > 0.7 ? 'Aprovado' : 'Reprovado') : 'Pendente';
        }
        
        // Descrições por setor
        const descricoesPorSetor = {
          'Saúde': [
            'Compra de materiais para unidade básica de saúde',
            'Aquisição de medicamentos para farmácia municipal',
            'Equipamentos para centro de especialidades médicas',
            'Materiais para campanha de vacinação',
            'Insumos hospitalares para pronto atendimento'
          ],
          'Educação': [
            'Material didático para ano letivo',
            'Mobiliário para nova escola municipal',
            'Equipamentos para laboratório de informática',
            'Materiais para projeto de leitura',
            'Instrumentos para aulas de música'
          ],
          'Administrativo': [
            'Suprimentos para departamento administrativo',
            'Equipamentos para nova sede',
            'Material de escritório para secretarias',
            'Mobiliário para sala de reuniões',
            'Equipamentos de informática para setor de RH'
          ],
          'Transporte': [
            'Peças para manutenção da frota municipal',
            'Pneus para veículos da prefeitura',
            'Combustível para transporte escolar',
            'Sinalização para vias urbanas',
            'Equipamentos para garagem municipal'
          ]
        };
        
        const descricoesPossiveis = descricoesPorSetor[setor];
        const descricao = descricoesPossiveis[Math.floor(Math.random() * descricoesPossiveis.length)];
        
        const fundosMonetarios = [
          'Fundo Municipal de Saúde',
          'Fundo Municipal de Educação',
          'Fundo Municipal de Administração',
          'Fundo Municipal de Transporte',
          'Fundo Municipal de Assistência Social',
        ];
        
        // Escolher um fundo monetário adequado ao setor
        let fundoIndex = 0;
        if (setor === 'Saúde') fundoIndex = 0;
        else if (setor === 'Educação') fundoIndex = 1;
        else if (setor === 'Administrativo') fundoIndex = 2;
        else if (setor === 'Transporte') fundoIndex = 3;
        
        const fundoMonetario = fundosMonetarios[fundoIndex];
        
        // Criar o pedido
        const pedido: PedidoCompra = {
          id: gerarId(),
          dataCompra,
          descricao,
          itens,
          valorTotal: valorTotalItens,
          fundoMonetario,
          setor,
          status: statusPedido,
          createdAt: new Date(dataCompra.getTime() - Math.random() * 24 * 60 * 60 * 1000), // Criado até 1 dia antes da compra
        };
        
        pedidos.push(pedido);
      }
    });
  });
  
  return pedidos;
};

// Gerar os pedidos fictícios
const pedidosFicticios = gerarPedidosFicticios();

// Exporte os pedidos fictícios
export const obterPedidosFicticios = () => pedidosFicticios;

// Exporte a função original também para manter compatibilidade
export * from '@/data/mockData';
