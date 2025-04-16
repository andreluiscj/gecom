
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function initializeSystem() {
  try {
    console.log("Iniciando inicialização do sistema...");
    
    // Verificar se já existe um município cadastrado
    const { data: existingMunicipios, error: municipiosCheckError } = await supabase
      .from('municipios')
      .select('*')
      .limit(1);
      
    if (municipiosCheckError) {
      console.error("Erro ao verificar municípios existentes:", municipiosCheckError);
      throw municipiosCheckError;
    }
    
    if (existingMunicipios && existingMunicipios.length > 0) {
      console.log("Sistema já inicializado anteriormente, pulando inicialização");
      return true;
    }
    
    // Create a default municipality
    const { data: municipioData, error: municipioError } = await supabase
      .from('municipios')
      .insert({
        nome: 'Pai Pedro',
        estado: 'MG',
        prefeito: 'Maria Silva',
        populacao: 6083,
        orcamento_anual: 28500000
      })
      .select()
      .single();

    if (municipioError) {
      console.error("Erro ao criar município:", municipioError);
      throw municipioError;
    }

    console.log("Município criado com sucesso:", municipioData);

    // Create a default secretaria
    const { data: secretariaData, error: secretariaError } = await supabase
      .from('secretarias')
      .insert({
        nome: 'Administração',
        municipio_id: municipioData.id,
        descricao: 'Secretaria de Administração Municipal'
      })
      .select()
      .single();

    if (secretariaError) {
      console.error("Erro ao criar secretaria:", secretariaError);
      throw secretariaError;
    }

    console.log("Secretaria criada com sucesso:", secretariaData);

    // Create admin user in Supabase Auth with a more secure password
    const adminEmail = 'admin@gecom.com';
    const adminPassword = 'Admin@Gecom2024!';
    
    console.log("Criando usuário administrador...");
    
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: adminEmail,
      password: adminPassword
    });

    if (authError) {
      console.error("Erro ao criar usuário admin no Auth:", authError);
      throw authError;
    }

    console.log("Usuário admin criado com sucesso no Auth:", authData.user?.id);

    // Create corresponding user in usuarios table
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user?.id,
        nome: 'Administrador',
        email: adminEmail,
        role: 'admin',
        municipio_id: municipioData.id,
        primeiro_acesso: true
      });

    if (usuarioError) {
      console.error("Erro ao criar registro do usuário admin:", usuarioError);
      throw usuarioError;
    }

    console.log("Registro do usuário admin criado com sucesso");

    // Create user-secretaria association
    const { error: userSecretariaError } = await supabase
      .from('usuario_secretarias')
      .insert({
        usuario_id: authData.user?.id,
        secretaria_id: secretariaData.id
      });

    if (userSecretariaError) {
      console.error("Erro ao associar usuário admin à secretaria:", userSecretariaError);
      throw userSecretariaError;
    }

    console.log("Associação do usuário admin com secretaria criada com sucesso");

    // Create additional user (usuário servidor)
    const { data: additionalUserData, error: additionalUserError } = await supabase.auth.signUp({
      email: 'servidor@exemplo.com',
      password: 'Servidor@2024!'
    });

    if (additionalUserError) {
      console.error("Erro ao criar usuário servidor no Auth:", additionalUserError);
      throw additionalUserError;
    }
    
    console.log("Usuário servidor criado com sucesso no Auth:", additionalUserData.user?.id);

    // Create corresponding record in usuarios table
    const { error: additionalUsuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: additionalUserData.user?.id,
        nome: 'Servidor Municipal',
        email: 'servidor@exemplo.com',
        role: 'servidor',
        municipio_id: municipioData.id,
        primeiro_acesso: true
      });

    if (additionalUsuarioError) {
      console.error("Erro ao criar registro do usuário servidor:", additionalUsuarioError);
      throw additionalUsuarioError;
    }

    console.log("Registro do usuário servidor criado com sucesso");

    // Associate additional user with secretaria
    const { error: additionalUserSecretariaError } = await supabase
      .from('usuario_secretarias')
      .insert({
        usuario_id: additionalUserData.user?.id,
        secretaria_id: secretariaData.id
      });

    if (additionalUserSecretariaError) {
      console.error("Erro ao associar usuário servidor à secretaria:", additionalUserSecretariaError);
      throw additionalUserSecretariaError;
    }

    console.log("Associação do usuário servidor com secretaria criada com sucesso");
    console.log("Sistema inicializado com sucesso!");

    toast.success('Sistema inicializado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o sistema:', error);
    toast.error('Erro ao inicializar o sistema');
    return false;
  }
}
