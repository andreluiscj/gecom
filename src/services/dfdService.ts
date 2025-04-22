
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export async function createDfd(dfdData: any, items: any[]) {
  try {
    // Start a transaction by using supabase functions
    // 1. Insert DFD
    const { data: dfd, error } = await supabase
      .from("dfds")
      .insert(dfdData)
      .select()
      .single();
      
    if (error) throw error;
    
    // 2. Insert items for this DFD
    if (items && items.length > 0) {
      const dfdItems = items.map(item => ({
        dfd_id: dfd.id,
        name: item.nome || item.name,
        quantity: item.quantidade || item.quantity,
        unit_value: item.valorUnitario || item.unit_value,
        total_value: item.valorTotal || item.total_value || 
                    (item.quantidade || item.quantity) * (item.valorUnitario || item.unit_value)
      }));
      
      const { error: itemsError } = await supabase
        .from("dfd_items")
        .insert(dfdItems);
        
      if (itemsError) throw itemsError;
    }
    
    // 3. Create workflow steps for this DFD
    await createDefaultWorkflow(dfd.id);
    
    return { success: true, data: dfd };
  } catch (error: any) {
    console.error("Error creating DFD:", error);
    toast.error("Erro ao criar DFD");
    return { success: false, error };
  }
}

export async function getDfds(municipalityId?: number) {
  try {
    let query = supabase
      .from("dfds")
      .select(`
        *,
        sector:sector_id(id, name),
        requester:requester_id(id, name),
        items:dfd_items(*)
      `);
    
    if (municipalityId) {
      query = query.eq("municipality_id", municipalityId);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Transform data to match the expected structure
    const formattedData = data?.map(dfd => ({
      ...dfd,
      setor: dfd.sector?.name || "",
      items: dfd.items?.map((item: any) => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantity,
        valorUnitario: item.unit_value,
        valorTotal: item.total_value
      }))
    }));
    
    return formattedData || [];
  } catch (error: any) {
    console.error("Error fetching DFDs:", error);
    return [];
  }
}

export async function getDfdById(id: string) {
  try {
    const { data, error } = await supabase
      .from("dfds")
      .select(`
        *,
        sector:sector_id(id, name),
        requester:requester_id(id, name, cpf),
        items:dfd_items(*),
        workflow_steps(*, responsible:responsible_id(id, name))
      `)
      .eq("id", id)
      .single();
    
    if (error) throw error;
    
    // Transform data to match expected structure
    const formattedData = {
      ...data,
      setor: data.sector?.name || "",
      workflow: {
        steps: data.workflow_steps
          .sort((a: any, b: any) => a.step_order - b.step_order)
          .map((step: any) => ({
            id: step.id,
            title: step.title,
            status: step.status,
            date: step.start_date,
            dataConclusao: step.completion_date,
            responsavel: step.responsible?.name || ""
          })),
        currentStep: data.workflow_steps.filter((s: any) => s.status === "Concluído").length,
        totalSteps: data.workflow_steps.length,
        percentComplete: Math.round(
          (data.workflow_steps.filter((s: any) => s.status === "Concluído").length / 
          data.workflow_steps.length) * 100
        )
      },
      items: data.items?.map((item: any) => ({
        id: item.id,
        nome: item.name,
        quantidade: item.quantity,
        valorUnitario: item.unit_value,
        valorTotal: item.total_value
      }))
    };
    
    return formattedData;
  } catch (error: any) {
    console.error("Error fetching DFD:", error);
    return null;
  }
}

export async function updateDfd(id: string, dfdData: any, items?: any[]) {
  try {
    // 1. Update DFD
    const { error } = await supabase
      .from("dfds")
      .update(dfdData)
      .eq("id", id);
      
    if (error) throw error;
    
    // 2. Update items if provided
    if (items) {
      // First, delete existing items
      const { error: deleteError } = await supabase
        .from("dfd_items")
        .delete()
        .eq("dfd_id", id);
        
      if (deleteError) throw deleteError;
      
      // Then insert new items
      const dfdItems = items.map(item => ({
        dfd_id: id,
        name: item.nome || item.name,
        quantity: item.quantidade || item.quantity,
        unit_value: item.valorUnitario || item.unit_value,
        total_value: item.valorTotal || item.total_value || 
                    (item.quantidade || item.quantity) * (item.valorUnitario || item.unit_value)
      }));
      
      if (dfdItems.length > 0) {
        const { error: itemsError } = await supabase
          .from("dfd_items")
          .insert(dfdItems);
          
        if (itemsError) throw itemsError;
      }
    }
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating DFD:", error);
    toast.error("Erro ao atualizar DFD");
    return { success: false, error };
  }
}

export async function updateWorkflowStep(dfdId: string, stepId: string, data: any) {
  try {
    const { error } = await supabase
      .from("workflow_steps")
      .update(data)
      .eq("id", stepId)
      .eq("dfd_id", dfdId);
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating workflow step:", error);
    toast.error("Erro ao atualizar etapa do workflow");
    return { success: false, error };
  }
}

async function createDefaultWorkflow(dfdId: string) {
  try {
    const defaultSteps = [
      { title: 'Aprovação da DFD', status: 'Pendente', step_order: 0 },
      { title: 'Criação da ETP', status: 'Pendente', step_order: 1 },
      { title: 'Criação do TR', status: 'Pendente', step_order: 2 },
      { title: 'Pesquisa de Preços', status: 'Pendente', step_order: 3 },
      { title: 'Parecer Jurídico', status: 'Pendente', step_order: 4 },
      { title: 'Edital', status: 'Pendente', step_order: 5 },
      { title: 'Sessão Licitação', status: 'Pendente', step_order: 6 },
      { title: 'Recursos', status: 'Pendente', step_order: 7 },
      { title: 'Homologação', status: 'Pendente', step_order: 8 },
    ];
    
    const workflowSteps = defaultSteps.map(step => ({
      ...step,
      dfd_id: dfdId
    }));
    
    const { error } = await supabase
      .from("workflow_steps")
      .insert(workflowSteps);
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error creating workflow steps:", error);
    return { success: false, error };
  }
}

export async function createPurchaseOrder(dfdId: string) {
  try {
    const { error } = await supabase
      .from("purchase_orders")
      .insert({
        dfd_id: dfdId,
        status: 'Pendente'
      });
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error creating purchase order:", error);
    toast.error("Erro ao criar ordem de compra");
    return { success: false, error };
  }
}

export async function updatePurchaseOrder(dfdId: string, data: any) {
  try {
    const { error } = await supabase
      .from("purchase_orders")
      .update(data)
      .eq("dfd_id", dfdId);
      
    if (error) throw error;
    return { success: true };
  } catch (error: any) {
    console.error("Error updating purchase order:", error);
    toast.error("Erro ao atualizar ordem de compra");
    return { success: false, error };
  }
}

export async function getPurchaseOrder(dfdId: string) {
  try {
    const { data, error } = await supabase
      .from("purchase_orders")
      .select("*")
      .eq("dfd_id", dfdId)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "row not found"
    return data;
  } catch (error: any) {
    console.error("Error fetching purchase order:", error);
    return null;
  }
}
