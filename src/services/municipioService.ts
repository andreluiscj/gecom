
import { supabase } from '@/lib/supabase';
import { Municipio } from '@/types';
import { toast } from 'sonner';

export async function getMunicipios(): Promise<Municipio[]> {
  try {
    const { data, error } = await supabase
      .from('municipalities')
      .select('*');

    if (error) {
      console.error('Error fetching municipalities:', error);
      toast.error('Erro ao carregar municípios.');
      return [];
    }

    return data.map(municipality => ({
      id: municipality.id,
      nome: municipality.name,
      estado: municipality.state,
      populacao: municipality.population || 0,
      orcamento: municipality.budget || 0,
      orcamentoAnual: municipality.annual_budget || 0,
      prefeito: municipality.mayor || '',
      logo: municipality.logo_url || undefined
    }));
  } catch (error) {
    console.error('Error in getMunicipios:', error);
    toast.error('Ocorreu um erro ao buscar os municípios.');
    return [];
  }
}

export async function getMunicipioById(id: string): Promise<Municipio | null> {
  try {
    const { data, error } = await supabase
      .from('municipalities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching municipality:', error);
      toast.error('Erro ao carregar município.');
      return null;
    }

    return {
      id: data.id,
      nome: data.name,
      estado: data.state,
      populacao: data.population || 0,
      orcamento: data.budget || 0,
      orcamentoAnual: data.annual_budget || 0,
      prefeito: data.mayor || '',
      logo: data.logo_url || undefined
    };
  } catch (error) {
    console.error('Error in getMunicipioById:', error);
    toast.error('Ocorreu um erro ao buscar o município.');
    return null;
  }
}

// Get current municipality (assuming it's stored in localStorage or we're using the first one)
export async function getCurrentMunicipio(): Promise<Municipio | null> {
  try {
    const municipioId = localStorage.getItem('current-municipality-id');
    
    if (municipioId) {
      return getMunicipioById(municipioId);
    }
    
    // If no municipality is selected, get the first one
    const municipios = await getMunicipios();
    if (municipios.length > 0) {
      localStorage.setItem('current-municipality-id', municipios[0].id);
      return municipios[0];
    }
    
    return null;
  } catch (error) {
    console.error('Error in getCurrentMunicipio:', error);
    toast.error('Ocorreu um erro ao buscar o município atual.');
    return null;
  }
}

export async function setCurrentMunicipio(municipioId: string): Promise<boolean> {
  try {
    localStorage.setItem('current-municipality-id', municipioId);
    return true;
  } catch (error) {
    console.error('Error in setCurrentMunicipio:', error);
    return false;
  }
}
