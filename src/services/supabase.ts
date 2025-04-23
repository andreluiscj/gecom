import { supabase } from '@/integrations/supabase/client';
import { 
  Municipio, 
  Setor, 
  Funcionario, 
  PedidoCompra, 
  Item, 
  Workflow, 
  WorkflowStep, 
  UsuarioLogin,
  Tarefa
} from '@/types';

// Serviço de Municípios
export const municipioService = {
  async getAll(): Promise<Municipio[]> {
    const { data, error } = await supabase
      .from('municipios')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar municípios:', error);
      return [];
    }
    
    return data as Municipio[];
  },
  
  async getById(id: string): Promise<Municipio | null> {
    const { data, error } = await supabase
      .from('municipios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar município ${id}:`, error);
      return null;
    }
    
    return data as Municipio;
  },
  
  async create(municipio: Omit<Municipio, 'id'>): Promise<Municipio | null> {
    const { data, error } = await supabase
      .from('municipios')
      .insert(municipio)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar município:', error);
      return null;
    }
    
    return data as Municipio;
  },
  
  async update(id: string, municipio: Partial<Municipio>): Promise<Municipio | null> {
    const { data, error } = await supabase
      .from('municipios')
      .update(municipio)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erro ao atualizar município ${id}:`, error);
      return null;
    }
    
    return data as Municipio;
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('municipios')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir município ${id}:`, error);
      return false;
    }
    
    return true;
  }
};

// Serviço de Setores
export const setorService = {
  async getAll(): Promise<{ id: string, nome: string, municipio_id: string }[]> {
    const { data, error } = await supabase
      .from('setores')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar setores:', error);
      return [];
    }
    
    return data as { id: string, nome: string, municipio_id: string }[];
  },
  
  async getByMunicipioId(municipioId: string): Promise<{ id: string, nome: string, municipio_id: string }[]> {
    const { data, error } = await supabase
      .from('setores')
      .select('*')
      .eq('municipio_id', municipioId);
    
    if (error) {
      console.error(`Erro ao buscar setores do município ${municipioId}:`, error);
      return [];
    }
    
    return data as { id: string, nome: string, municipio_id: string }[];
  },
  
  async getById(id: string): Promise<{ id: string, nome: string, municipio_id: string } | null> {
    const { data, error } = await supabase
      .from('setores')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar setor ${id}:`, error);
      return null;
    }
    
    return data as { id: string, nome: string, municipio_id: string };
  },
  
  async create(setor: { nome: string, municipio_id: string }): Promise<{ id: string, nome: string, municipio_id: string } | null> {
    const { data, error } = await supabase
      .from('setores')
      .insert(setor)
      .select()
      .single();
    
    if (error) {
      console.error('Erro ao criar setor:', error);
      return null;
    }
    
    return data as { id: string, nome: string, municipio_id: string };
  }
};

// Serviço de Funcionários
export const funcionarioService = {
  async getAll(): Promise<Funcionario[]> {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        setores:setor_id (nome)
      `);
    
    if (error) {
      console.error('Erro ao buscar funcionários:', error);
      return [];
    }
    
    return data.map(func => ({
      ...func,
      setor: func.setores?.nome,
      data_nascimento: new Date(func.data_nascimento),
      data_contratacao: new Date(func.data_contratacao)
    })) as Funcionario[];
  },
  
  async getById(id: string): Promise<Funcionario | null> {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        setores:setor_id (nome)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar funcionário ${id}:`, error);
      return null;
    }
    
    return {
      ...data,
      setor: data.setores?.nome,
      data_nascimento: new Date(data.data_nascimento),
      data_contratacao: new Date(data.data_contratacao)
    } as Funcionario;
  },
  
  async getBySetor(setorId: string): Promise<Funcionario[]> {
    const { data, error } = await supabase
      .from('funcionarios')
      .select(`
        *,
        setores:setor_id (nome)
      `)
      .eq('setor_id', setorId);
    
    if (error) {
      console.error(`Erro ao buscar funcionários do setor ${setorId}:`, error);
      return [];
    }
    
    return data.map(func => ({
      ...func,
      setor: func.setores?.nome,
      data_nascimento: new Date(func.data_nascimento),
      data_contratacao: new Date(func.data_contratacao)
    })) as Funcionario[];
  }
};

// Serviço de Pedidos de Compra
export const pedidoService = {
  async getAll(): Promise<PedidoCompra[]> {
    // Primeiro, buscamos todos os pedidos de compra
    const { data: pedidos, error: pedidosError } = await supabase
      .from('pedidos_compra')
      .select(`
        *,
        setores:setor_id (nome),
        solicitante:solicitante_id (nome)
      `);
    
    if (pedidosError) {
      console.error('Erro ao buscar pedidos de compra:', pedidosError);
      return [];
    }
    
    // Para cada pedido, buscamos os itens correspondentes
    const pedidosCompletos = await Promise.all(pedidos.map(async (pedido) => {
      const { data: itens, error: itensError } = await supabase
        .from('itens_pedido')
        .select('*')
        .eq('pedido_id', pedido.id);
      
      if (itensError) {
        console.error(`Erro ao buscar itens do pedido ${pedido.id}:`, itensError);
        return {
          ...pedido,
          setor: pedido.setores?.nome,
          solicitante: pedido.solicitante?.nome,
          data_compra: new Date(pedido.data_compra),
          created_at: new Date(pedido.created_at),
          itens: []
        };
      }
      
      // Também buscamos o workflow do pedido
      const { data: workflow, error: workflowError } = await supabase
        .from('workflow_pedidos')
        .select('*')
        .eq('pedido_id', pedido.id)
        .single();
      
      let workflowCompleto = null;
      
      if (!workflowError && workflow) {
        const { data: etapas, error: etapasError } = await supabase
          .from('workflow_etapas')
          .select(`
            *,
            responsavel:responsavel_id (nome)
          `)
          .eq('workflow_id', workflow.id)
          .order('ordem', { ascending: true });
        
        if (!etapasError && etapas) {
          workflowCompleto = {
            ...workflow,
            steps: etapas.map(etapa => ({
              ...etapa,
              responsavel: etapa.responsavel?.nome,
              data_inicio: etapa.data_inicio ? new Date(etapa.data_inicio) : undefined,
              data_conclusao: etapa.data_conclusao ? new Date(etapa.data_conclusao) : undefined
            }))
          };
        }
      }
      
      return {
        ...pedido,
        setor: pedido.setores?.nome,
        solicitante: pedido.solicitante?.nome,
        data_compra: new Date(pedido.data_compra),
        created_at: new Date(pedido.created_at),
        itens: itens || [],
        workflow: workflowCompleto
      };
    }));
    
    return pedidosCompletos as PedidoCompra[];
  },
  
  async getById(id: string): Promise<PedidoCompra | null> {
    // Buscamos o pedido de compra
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos_compra')
      .select(`
        *,
        setores:setor_id (nome),
        solicitante:solicitante_id (nome)
      `)
      .eq('id', id)
      .single();
    
    if (pedidoError) {
      console.error(`Erro ao buscar pedido de compra ${id}:`, pedidoError);
      return null;
    }
    
    // Buscamos os itens do pedido
    const { data: itens, error: itensError } = await supabase
      .from('itens_pedido')
      .select('*')
      .eq('pedido_id', pedido.id);
    
    if (itensError) {
      console.error(`Erro ao buscar itens do pedido ${pedido.id}:`, itensError);
      return null;
    }
    
    // Buscamos o workflow do pedido
    const { data: workflow, error: workflowError } = await supabase
      .from('workflow_pedidos')
      .select('*')
      .eq('pedido_id', pedido.id)
      .single();
    
    let workflowCompleto = null;
    
    if (!workflowError && workflow) {
      const { data: etapas, error: etapasError } = await supabase
        .from('workflow_etapas')
        .select(`
          *,
          responsavel:responsavel_id (nome)
        `)
        .eq('workflow_id', workflow.id)
        .order('ordem', { ascending: true });
      
      if (!etapasError && etapas) {
        workflowCompleto = {
          ...workflow,
          steps: etapas.map(etapa => ({
            ...etapa,
            responsavel: etapa.responsavel?.nome,
            data_inicio: etapa.data_inicio ? new Date(etapa.data_inicio) : undefined,
            data_conclusao: etapa.data_conclusao ? new Date(etapa.data_conclusao) : undefined
          }))
        };
      }
    }
    
    return {
      ...pedido,
      setor: pedido.setores?.nome,
      solicitante: pedido.solicitante?.nome,
      data_compra: new Date(pedido.data_compra),
      created_at: new Date(pedido.created_at),
      itens: itens || [],
      workflow: workflowCompleto
    } as PedidoCompra;
  },
  
  async create(pedido: Omit<PedidoCompra, 'id' | 'created_at' | 'itens' | 'workflow'>, 
                itens: Omit<Item, 'id' | 'pedido_id'>[]): Promise<PedidoCompra | null> {
    // Primeiro, inserimos o pedido de compra
    const { data: novoPedido, error: pedidoError } = await supabase
      .from('pedidos_compra')
      .insert(pedido)
      .select()
      .single();
    
    if (pedidoError) {
      console.error('Erro ao criar pedido de compra:', pedidoError);
      return null;
    }
    
    // Se houver itens, inserimos cada um deles
    if (itens && itens.length > 0) {
      const itensComPedidoId = itens.map(item => ({
        ...item,
        pedido_id: novoPedido.id
      }));
      
      const { error: itensError } = await supabase
        .from('itens_pedido')
        .insert(itensComPedidoId);
      
      if (itensError) {
        console.error(`Erro ao criar itens do pedido ${novoPedido.id}:`, itensError);
      }
    }
    
    // Retornamos o pedido criado
    return await this.getById(novoPedido.id);
  },
  
  async update(id: string, pedido: Partial<PedidoCompra>): Promise<PedidoCompra | null> {
    // Atualizamos o pedido de compra
    const { data: pedidoAtualizado, error: pedidoError } = await supabase
      .from('pedidos_compra')
      .update(pedido)
      .eq('id', id)
      .select()
      .single();
    
    if (pedidoError) {
      console.error(`Erro ao atualizar pedido de compra ${id}:`, pedidoError);
      return null;
    }
    
    // Retornamos o pedido atualizado
    return await this.getById(id);
  },
  
  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('pedidos_compra')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erro ao excluir pedido de compra ${id}:`, error);
      return false;
    }
    
    return true;
  }
};

// Serviço de Usuários
export const usuarioService = {
  async getAll(): Promise<UsuarioLogin[]> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar usuários:', error);
      return [];
    }
    
    return data as UsuarioLogin[];
  },
  
  async getById(id: string): Promise<UsuarioLogin | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar usuário ${id}:`, error);
      return null;
    }
    
    return data as UsuarioLogin;
  },
  
  async getByAuthUserId(authUserId: string): Promise<UsuarioLogin | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();
    
    if (error) {
      console.error(`Erro ao buscar usuário com auth_user_id ${authUserId}:`, error);
      return null;
    }
    
    return data as UsuarioLogin;
  },
  
  async getCurrentUser(): Promise<UsuarioLogin | null> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }
    
    return this.getByAuthUserId(user.id);
  }
};

// Serviço de Autenticação
export const authService = {
  async signUp(email: string, password: string, userData: { 
    nome: string, 
    cpf: string,
    funcionario_id: string,
    role: 'admin' | 'user' | 'manager'
  }): Promise<{ user: any, error: any }> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: userData.nome,
          cpf: userData.cpf
        }
      }
    });
    
    if (error) {
      return { user: null, error };
    }
    
    if (data.user) {
      // Criar o registro na tabela de usuários
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          auth_user_id: data.user.id,
          username: email,
          funcionario_id: userData.funcionario_id,
          role: userData.role,
          ativo: true,
          primeiro_acesso: true
        });
      
      if (usuarioError) {
        return { user: data.user, error: usuarioError };
      }
    }
    
    return { user: data.user, error: null };
  },
  
  async signIn(email: string, password: string): Promise<{ user: any, error: any }> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return { user: data.user, error };
  },
  
  async signOut(): Promise<{ error: any }> {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
  
  async getSession(): Promise<{ session: any, error: any }> {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },
  
  async getUser(): Promise<{ user: any, error: any }> {
    const { data, error } = await supabase.auth.getUser();
    return { user: data.user, error };
  },
  
  async updatePassword(password: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.updateUser({
      password
    });
    
    return { error };
  },
  
  async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }
};
