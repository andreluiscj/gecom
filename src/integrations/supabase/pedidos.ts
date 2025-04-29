
import { supabase } from './client';
import { PedidoCompra } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export async function getPedidos() {
  try {
    const { data, error } = await supabase
      .from('pedidos_compras')
      .select(`
        id,
        descricao,
        data_pedido as dataCompra,
        valor_previsto as valorTotal,
        status,
        secretarias!inner(nome)
      `)
      .order('data_pedido', { ascending: false });

    if (error) throw error;

    // Transform to match PedidoCompra type
    return data.map(pedido => ({
      id: pedido.id.toString(),
      descricao: pedido.descricao,
      dataCompra: new Date(pedido.dataCompra),
      valorTotal: pedido.valorTotal,
      status: pedido.status,
      setor: pedido.secretarias.nome,
      createdAt: new Date(pedido.dataCompra),
      itens: [] // We'll need to fetch these separately
    })) as PedidoCompra[];
  } catch (error) {
    console.error('Error fetching pedidos:', error);
    throw error;
  }
}

export async function getPedidoById(id: string) {
  try {
    const { data, error } = await supabase
      .from('pedidos_compras')
      .select(`
        id,
        descricao,
        data_pedido as dataCompra,
        valor_previsto as valorTotal,
        status,
        secretarias!inner(nome)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Transform to match PedidoCompra type
    return {
      id: data.id.toString(),
      descricao: data.descricao,
      dataCompra: new Date(data.dataCompra),
      valorTotal: data.valorTotal,
      status: data.status,
      setor: data.secretarias.nome,
      createdAt: new Date(data.dataCompra),
      itens: [] // We'll need to fetch these separately
    } as PedidoCompra;
  } catch (error) {
    console.error('Error fetching pedido:', error);
    throw error;
  }
}

export async function createPedido(pedido: Omit<PedidoCompra, 'id'>) {
  try {
    // First, get the secretaria_id based on the setor name
    const { data: secretariaData, error: secretariaError } = await supabase
      .from('secretarias')
      .select('id')
      .eq('nome', pedido.setor)
      .single();

    if (secretariaError) throw secretariaError;

    // Then create the pedido with the secretaria_id
    const { data, error } = await supabase
      .from('pedidos_compras')
      .insert({
        descricao: pedido.descricao,
        valor_previsto: pedido.valorTotal,
        secretaria_id: secretariaData.id,
        status: pedido.status || 'Pendente',
        fundo_id: 1, // Default fundo_id, you might need to adjust this
        dfd_id: 1,   // Default dfd_id, you might need to adjust this
      })
      .select('id');

    if (error) throw error;
    
    return { id: data[0].id };
  } catch (error) {
    console.error('Error creating pedido:', error);
    throw error;
  }
}

export async function updatePedido(id: string, updates: Partial<PedidoCompra>) {
  try {
    const updateData: any = {};
    
    if (updates.descricao) updateData.descricao = updates.descricao;
    if (updates.valorTotal) updateData.valor_previsto = updates.valorTotal;
    if (updates.status) updateData.status = updates.status;
    
    // If setor is being updated, we need to get the secretaria_id
    if (updates.setor) {
      const { data: secretariaData, error: secretariaError } = await supabase
        .from('secretarias')
        .select('id')
        .eq('nome', updates.setor)
        .single();

      if (secretariaError) throw secretariaError;
      updateData.secretaria_id = secretariaData.id;
    }

    const { error } = await supabase
      .from('pedidos_compras')
      .update(updateData)
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error updating pedido:', error);
    throw error;
  }
}

export async function deletePedido(id: string) {
  try {
    const { error } = await supabase
      .from('pedidos_compras')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting pedido:', error);
    throw error;
  }
}
