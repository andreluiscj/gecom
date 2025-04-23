
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Função para inicializar dados na aplicação
export async function initializeDatabase() {
  // Verificar se já existem municípios no banco de dados
  const { data: municipios, error: municipiosError } = await supabase
    .from('municipios')
    .select('*');
  
  if (municipiosError) {
    console.error('Erro ao verificar municípios:', municipiosError);
    toast.error('Erro ao verificar municípios no banco de dados');
    return false;
  }
  
  // Se não existem municípios, criar dados iniciais
  if (municipios.length === 0) {
    // Criar município padrão
    const { data: municipio, error: municipioError } = await supabase
      .from('municipios')
      .insert([
        {
          nome: 'São Paulo',
          estado: 'SP',
          populacao: 12000000,
          orcamento: 65000000,
          orcamento_anual: 65000000,
          prefeito: 'João Silva'
        }
      ])
      .select()
      .single();
    
    if (municipioError) {
      console.error('Erro ao criar município inicial:', municipioError);
      toast.error('Erro ao criar município inicial');
      return false;
    }
    
    // Criar setores para o município
    const setores = [
      'Saúde',
      'Educação',
      'Administrativo',
      'Transporte',
      'Assistência Social',
      'Cultura',
      'Meio Ambiente',
      'Obras',
      'Segurança Pública',
      'Fazenda',
      'Turismo',
      'Esportes e Lazer',
      'Planejamento',
      'Comunicação',
      'Ciência e Tecnologia'
    ];
    
    const setoresData = setores.map(setor => ({
      nome: setor,
      municipio_id: municipio.id
    }));
    
    const { error: setoresError } = await supabase
      .from('setores')
      .insert(setoresData);
    
    if (setoresError) {
      console.error('Erro ao criar setores iniciais:', setoresError);
      toast.error('Erro ao criar setores iniciais');
      return false;
    }
    
    // Buscar os setores criados
    const { data: setoresCriados, error: setoresBuscaError } = await supabase
      .from('setores')
      .select('*')
      .eq('municipio_id', municipio.id);
    
    if (setoresBuscaError || !setoresCriados) {
      console.error('Erro ao buscar setores criados:', setoresBuscaError);
      toast.error('Erro ao buscar setores criados');
      return false;
    }
    
    // Criar funcionários
    const funcionarios = [
      {
        nome: 'Administrador',
        cpf: '123.456.789-00',
        data_nascimento: '1980-01-01',
        email: 'admin@gecom.gov.br',
        cargo: 'Administrador',
        setor_id: setoresCriados.find(s => s.nome === 'Administrativo')?.id,
        data_contratacao: '2020-01-01',
        telefone: '(11) 99999-9999'
      },
      {
        nome: 'Maria Santos',
        cpf: '987.654.321-00',
        data_nascimento: '1985-05-15',
        email: 'maria@gecom.gov.br',
        cargo: 'Secretário de Saúde',
        setor_id: setoresCriados.find(s => s.nome === 'Saúde')?.id,
        data_contratacao: '2021-02-10',
        telefone: '(11) 98888-8888'
      },
      {
        nome: 'Carlos Oliveira',
        cpf: '456.789.123-00',
        data_nascimento: '1978-08-20',
        email: 'carlos@gecom.gov.br',
        cargo: 'Secretário de Educação',
        setor_id: setoresCriados.find(s => s.nome === 'Educação')?.id,
        data_contratacao: '2021-03-15',
        telefone: '(11) 97777-7777'
      }
    ];
    
    const { data: funcionariosCriados, error: funcionariosError } = await supabase
      .from('funcionarios')
      .insert(funcionarios)
      .select();
    
    if (funcionariosError) {
      console.error('Erro ao criar funcionários iniciais:', funcionariosError);
      toast.error('Erro ao criar funcionários iniciais');
      return false;
    }
    
    // Criar usuários para os funcionários
    if (funcionariosCriados) {
      const adminFuncionario = funcionariosCriados.find(f => f.nome === 'Administrador');
      
      if (adminFuncionario) {
        // Criar usuário admin
        const { data: adminUser, error: signUpError } = await supabase.auth.signUp({
          email: 'admin@gecom.gov.br',
          password: 'admin123'
        });
        
        if (signUpError) {
          console.error('Erro ao criar usuário admin:', signUpError);
          toast.error('Erro ao criar usuário admin');
        } else {
          // Criar registro na tabela de usuários
          const { error: usuarioError } = await supabase
            .from('usuarios')
            .insert({
              auth_user_id: adminUser.user!.id,
              username: 'admin',
              funcionario_id: adminFuncionario.id,
              role: 'admin',
              ativo: true,
              primeiro_acesso: false
            });
          
          if (usuarioError) {
            console.error('Erro ao criar registro de usuário admin:', usuarioError);
            toast.error('Erro ao criar registro de usuário admin');
          }
        }
      }
    }
    
    toast.success('Dados iniciais criados com sucesso!');
    return true;
  }
  
  return true;
}
