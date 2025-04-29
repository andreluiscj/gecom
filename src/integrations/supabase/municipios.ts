
import { supabase } from './client';
import { Municipio } from '@/types';

export async function getMunicipios(): Promise<Municipio[]> {
  try {
    const { data, error } = await supabase
      .from('municipios')
      .select('*');

    if (error) throw error;

    return data.map(m => ({
      id: m.id.toString(),
      nome: m.nome,
      estado: m.estado,
      populacao: 0, // Default value since it's not in the DB
      orcamento: 0, // Default value
      orcamentoAnual: m.orcamento_previsto || 0,
      prefeito: 'Não informado' // This might need to be fetched from a separate table
    }));
  } catch (error) {
    console.error('Error fetching municipios:', error);
    throw error;
  }
}

export async function getMunicipioById(id: string): Promise<Municipio | null> {
  try {
    const { data, error } = await supabase
      .from('municipios')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id.toString(),
      nome: data.nome,
      estado: data.estado,
      populacao: 0, // Default value since it's not in the DB
      orcamento: 0, // Default value
      orcamentoAnual: data.orcamento_previsto || 0,
      prefeito: 'Não informado' // This might need to be fetched from a separate table
    };
  } catch (error) {
    console.error('Error fetching municipio:', error);
    throw error;
  }
}
