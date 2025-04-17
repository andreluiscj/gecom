
// This file will be greatly simplified as we transition to Supabase
// Most functions will be replaced with direct Supabase queries
import { PedidoCompra } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Empty array as placeholder - no more static data
const todosPedidos: PedidoCompra[] = [];

// Simplified function to fetch pedidos from Supabase
export async function obterTodosPedidos(): Promise<PedidoCompra[]> {
  try {
    const { data, error } = await supabase
      .from('dfds')
      .select(`
        id, 
        descricao, 
        valor_estimado, 
        data_pedido, 
        status, 
        secretaria_id,
        secretarias(nome)
      `)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pedidos:', error);
      toast.error('Erro ao carregar pedidos');
      return [];
    }
    
    // Transform to match PedidoCompra type
    return data.map(item => ({
      id: item.id,
      descricao: item.descricao,
      setor: item.secretarias?.nome || '',
      dataCompra: new Date(item.data_pedido),
      status: item.status,
      valorTotal: item.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(item.data_pedido),
      observacoes: '',
      fonteRecurso: '',
      responsavel: {
        id: '',
        nome: '',
        email: '',
        cargo: '',
      },
      anexos: [],
      workflow: null
    }));
  } catch (err) {
    console.error('Error in obterTodosPedidos:', err);
    return [];
  }
}

// Alias for backward compatibility
export { obterTodosPedidos as obterPedidos };

// Simplified function to get pedidos by setor
export async function obterPedidosPorSetor(setor: string): Promise<PedidoCompra[]> {
  try {
    const { data, error } = await supabase
      .from('dfds')
      .select(`
        id, 
        descricao, 
        valor_estimado, 
        data_pedido, 
        status, 
        secretaria_id,
        secretarias(nome)
      `)
      .eq('secretarias.nome', setor)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pedidos by setor:', error);
      return [];
    }
    
    // Transform to match PedidoCompra type
    return data.map(item => ({
      id: item.id,
      descricao: item.descricao,
      setor: item.secretarias?.nome || '',
      dataCompra: new Date(item.data_pedido),
      status: item.status,
      valorTotal: item.valor_estimado || 0,
      itens: [],
      fundoMonetario: '',
      createdAt: new Date(item.data_pedido),
      observacoes: '',
      fonteRecurso: '',
      responsavel: {
        id: '',
        nome: '',
        email: '',
        cargo: '',
      },
      anexos: [],
      workflow: null
    }));
  } catch (err) {
    console.error('Error in obterPedidosPorSetor:', err);
    return [];
  }
}

// Simplified function to update pedido status
export async function atualizarStatusPedido(id: string, novoStatus: PedidoCompra['status']) {
  try {
    const { data, error } = await supabase
      .from('dfds')
      .update({ status: novoStatus })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating pedido status:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Error in atualizarStatusPedido:', err);
    return null;
  }
}

// Helper function to format date (kept for convenience)
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR').format(data);
}
