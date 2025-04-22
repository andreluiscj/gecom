import { addDays, addHours, format, subMonths } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { PedidoCompra, Item, Setor } from '@/types';
import { updateWorkflowFromPedidoStatus, initializeWorkflow } from '@/utils/workflowHelpers';
import { toast } from 'sonner';

// Array com os fundos monetários disponíveis
export const fundosMonetarios = [
  'Fundo Municipal de Saúde',
  'Fundo Municipal de Educação',
  'Fundo Municipal de Administração',
  'Fundo Municipal de Transporte',
  'Fundo Municipal de Assistência Social',
  'Fundo Municipal de Cultura',
  'Fundo Municipal de Meio Ambiente',
];

// Nomes de funcionários fictícios para uso como responsáveis
export const nomesResponsaveis = [
  'Ana Silva',
  'Carlos Santos',
  'Mariana Oliveira',
  'Pedro Almeida',
  'Juliana Costa',
  'Roberto Pereira',
  'Fernanda Lima',
  'Lucas Martins',
  'Patricia Souza',
  'Bruno Rodrigues'
];

// Função para gerar IDs únicos
export function gerarId() {
  return uuidv4();
}

// Inicializa todosPedidos como array vazio
const todosPedidos: PedidoCompra[] = [];

// Função para inicializar dados mock - faz nada agora, pois começa vazio
export function initializeMockData() {
  todosPedidos.length = 0;
  return todosPedidos;
}

// Chamar initializeMockData para garantir array vazio
initializeMockData();

// Função para adicionar um novo pedido
export function adicionarPedido(pedido: PedidoCompra) {
  if (!pedido.workflow) {
    pedido.workflow = initializeWorkflow();
  }
  const pedidoComWorkflow = updateWorkflowFromPedidoStatus(pedido);
  const existingIndex = todosPedidos.findIndex(p => p.id === pedido.id);

  if (existingIndex >= 0) {
    todosPedidos[existingIndex] = pedidoComWorkflow;
  } else {
    todosPedidos.push(pedidoComWorkflow);
  }
  console.log(`DFD adicionada: ${pedido.descricao} para a secretaria ${pedido.setor}`);
  return pedidoComWorkflow;
}

// Função para remover um pedido
export function removerPedido(id: string, setor?: Setor) {
  const index = todosPedidos.findIndex(p => p.id === id);
  if (index !== -1) {
    todosPedidos.splice(index, 1);
    return true;
  }
  return false;
}

// Função para obter todos os pedidos — retorna sempre array vazio
export function obterPedidos(): PedidoCompra[] {
  return todosPedidos;
}

// Função para obter todos os pedidos (alias para compatibilidade)
export const obterTodosPedidos = obterPedidos;

// Função para obter pedidos por setor
export function obterPedidosPorSetor(setor: Setor): PedidoCompra[] {
  const pedidos = obterTodosPedidos();
  return pedidos.filter(pedido => pedido.setor === setor);
}

// Função auxiliar para formatar data
export function formatarData(data: Date): string {
  return format(data, 'dd/MM/yyyy');
}

// Função para filtrar pedidos com base em critérios
export function filtrarPedidos(pedidos: PedidoCompra[], filtros: any) {
  return pedidos.filter(pedido => {
    // Filtra por setor
    if (filtros.setor && pedido.setor !== filtros.setor) {
      return false;
    }
    
    // Filtra por status
    if (filtros.status && pedido.status !== filtros.status) {
      return false;
    }
    
    // Filtra por data
    if (filtros.dataInicio && new Date(filtros.dataInicio) > pedido.dataCompra) {
      return false;
    }
    
    if (filtros.dataFim && new Date(filtros.dataFim) < pedido.dataCompra) {
      return false;
    }
    
    // Filtra por valor
    if (filtros.valorMinimo && pedido.valorTotal < filtros.valorMinimo) {
      return false;
    }
    
    if (filtros.valorMaximo && pedido.valorTotal > filtros.valorMaximo) {
      return false;
    }
    
    // Filtra por termo de busca
    if (filtros.termo) {
      const termo = filtros.termo.toLowerCase();
      const descricaoMatch = pedido.descricao.toLowerCase().includes(termo);
      const itensMatch = pedido.itens.some(item => 
        item.nome.toLowerCase().includes(termo)
      );
      
      if (!descricaoMatch && !itensMatch) {
        return false;
      }
    }
    
    return true;
  });
}

// Função para atualizar status de um pedido
export function atualizarStatusPedido(id: string, novoStatus: PedidoCompra['status']) {
  const index = todosPedidos.findIndex(p => p.id === id);
  
  if (index !== -1) {
    const pedidoAtualizado = {
      ...todosPedidos[index],
      status: novoStatus
    };
    
    // Update the workflow based on the new status
    const pedidoComWorkflowAtualizado = updateWorkflowFromPedidoStatus(pedidoAtualizado);
    
    todosPedidos[index] = pedidoComWorkflowAtualizado;
    return pedidoComWorkflowAtualizado;
  }
  
  return null;
}

// Função para atualizar uma etapa específica do workflow
export function atualizarEtapaWorkflow(
  pedidoId: string, 
  etapaIndex: number, 
  novoStatus: 'Concluído' | 'Em Andamento' | 'Pendente',
  data?: Date,
  responsavel?: string,
  dataConclusao?: Date
) {
  const index = todosPedidos.findIndex(p => p.id === pedidoId);
  
  if (index !== -1 && todosPedidos[index].workflow) {
    const workflow = todosPedidos[index].workflow!;
    
    // Create a copy of steps
    const novasEtapas = [...workflow.steps];
    
    if (novasEtapas[etapaIndex]) {
      novasEtapas[etapaIndex] = {
        ...novasEtapas[etapaIndex],
        status: novoStatus,
        date: data || novasEtapas[etapaIndex].date,
        responsavel: responsavel !== undefined ? responsavel : novasEtapas[etapaIndex].responsavel,
        dataConclusao: dataConclusao !== undefined ? dataConclusao : novasEtapas[etapaIndex].dataConclusao || 
          (novoStatus === 'Concluído' && !novasEtapas[etapaIndex].dataConclusao ? new Date() : undefined)
      };
    }
    
    // Calculate new progress
    const etapasConcluidas = novasEtapas.filter(e => e.status === 'Concluído').length;
    const etapasEmAndamento = novasEtapas.filter(e => e.status === 'Em Andamento').length;
    const percentualConcluido = Math.round(
      (etapasConcluidas + (etapasEmAndamento * 0.5)) / novasEtapas.length * 100
    );
    
    // Update the workflow
    todosPedidos[index].workflow = {
      ...workflow,
      currentStep: etapasConcluidas + (etapasEmAndamento > 0 ? 1 : 0),
      percentComplete: percentualConcluido,
      steps: novasEtapas,
    };

    // Maybe update pedido status based on workflow progress
    if (percentualConcluido === 100) {
      todosPedidos[index].status = 'Concluído';
    } else if (percentualConcluido > 50) {
      todosPedidos[index].status = 'Em Andamento';
    } else if (percentualConcluido > 0) {
      todosPedidos[index].status = 'Aprovado';
    }
    
    return todosPedidos[index];
  }
  
  return null;
}
