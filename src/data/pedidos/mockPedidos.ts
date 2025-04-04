
import { PedidoCompra, Item, Setor, PedidoStatus } from '@/types';
import { MESES_ANTERIORES, gastosPorSetorEMes, pedidosPorSetorEMes } from '../dashboard/dashboardCalculator';
import { gerarId } from '@/data/mockData';

// Gerar pedidos fictícios para cada setor nos últimos 3 meses
export const obterPedidosFicticios = (): PedidoCompra[] => {
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
