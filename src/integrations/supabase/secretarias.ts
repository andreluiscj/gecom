
import { supabase } from './client';
import { Setor } from '@/types';

export async function getSecretarias(): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('secretarias')
      .select('nome');

    if (error) throw error;

    return data.map(s => s.nome);
  } catch (error) {
    console.error('Error fetching secretarias:', error);
    return [];
  }
}

export async function getSecretariaStats(municipioId: string) {
  try {
    const { data, error } = await supabase
      .from('secretarias')
      .select('nome, orcamento_previsto, orcamento_utilizado, quantidade_pedidos')
      .eq('municipio_id', municipioId);

    if (error) throw error;

    return data.map(s => ({
      nome: s.nome,
      orcamentoPrevisto: s.orcamento_previsto || 0,
      orcamentoUtilizado: s.orcamento_utilizado || 0,
      quantidadePedidos: s.quantidade_pedidos || 0,
    }));
  } catch (error) {
    console.error('Error fetching secretaria stats:', error);
    return [];
  }
}
