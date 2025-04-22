
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Municipality } from "@/types";

export async function getMunicipalities() {
  try {
    const { data, error } = await supabase
      .from("municipalities")
      .select("*")
      .order("name", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching municipalities:", error);
    toast.error("Erro ao carregar municípios");
    return [];
  }
}

export async function getMunicipalityById(id: number) {
  try {
    const { data, error } = await supabase
      .from("municipalities")
      .select("*")
      .eq("id", id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching municipality:", error);
    return null;
  }
}

export async function createMunicipality(municipalityData: {
  name: string;
  state: string;
  population?: number | null;
  budget?: number | null;
  mayor?: string | null;
  logo?: string | null;
}) {
  try {
    // Create the municipality first
    const { data, error } = await supabase
      .from("municipalities")
      .insert(municipalityData)
      .select()
      .single();
      
    if (error) throw error;

    // Success! Default sectors are created automatically via database trigger
    return { success: true, data };
  } catch (error: any) {
    console.error("Error creating municipality:", error);
    toast.error("Erro ao criar município");
    return { success: false, error };
  }
}

export async function updateMunicipality(id: number, municipalityData: any) {
  try {
    const { error } = await supabase
      .from("municipalities")
      .update(municipalityData)
      .eq("id", id);
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating municipality:", error);
    toast.error("Erro ao atualizar município");
    return { success: false, error };
  }
}

export async function deleteMunicipality(id: number) {
  try {
    const { error } = await supabase
      .from("municipalities")
      .delete()
      .eq("id", id);
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting municipality:", error);
    toast.error("Erro ao excluir município");
    return { success: false, error };
  }
}

export async function assignUserToMunicipality(userId: string, municipalityId: number) {
  try {
    const { error } = await supabase
      .from("municipality_users")
      .insert({
        user_id: userId,
        municipality_id: municipalityId
      });
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error assigning user to municipality:", error);
    return { success: false, error };
  }
}

export async function getMunicipalitySectors(municipalityId: number) {
  try {
    const { data, error } = await supabase
      .from("sectors")
      .select("*")
      .eq("municipality_id", municipalityId)
      .order("name", { ascending: true });
      
    if (error) throw error;
    return data || [];
  } catch (error: any) {
    console.error("Error fetching municipality sectors:", error);
    return [];
  }
}
