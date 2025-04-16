
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function addAdminUser() {
  try {
    console.log("Verificando se já existem usuários administradores...");
    
    // Verificar se já existe um município para associar
    const { data: municipio, error: municipioError } = await supabase
      .from('municipios')
      .select('id')
      .limit(1)
      .single();
      
    if (municipioError) {
      console.error("Erro ao verificar municípios:", municipioError);
      toast.error("É necessário ter pelo menos um município cadastrado");
      return false;
    }
    
    // Verificar se já existe secretaria para associar
    const { data: secretaria, error: secretariaError } = await supabase
      .from('secretarias')
      .select('id')
      .eq('municipio_id', municipio.id)
      .limit(1)
      .single();
      
    if (secretariaError) {
      console.error("Erro ao verificar secretarias:", secretariaError);
      toast.error("É necessário ter pelo menos uma secretaria cadastrada");
      return false;
    }

    // Credenciais específicas para o usuário administrador de consultoria
    const adminEmail = 'andreluiscj2207@gmail.com';
    const adminPassword = 'consultoriamosaico';
    
    console.log("Criando usuário administrador de consultoria...");
    
    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword,
    });
    
    if (existingUser.user) {
      console.log("Usuário administrador de consultoria já existe");
      return true;
    }

    // Criar o usuário no Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true
    });

    if (authError) {
      console.error("Erro ao criar usuário administrador de consultoria:", authError);
      
      // Tentar método alternativo
      const { data: authData2, error: authError2 } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword
      });
      
      if (authError2) {
        console.error("Erro ao criar usuário usando método alternativo:", authError2);
        throw authError2;
      }
      
      console.log("Usuário administrador criado com método alternativo");
      
      // Criar registro na tabela usuarios
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          id: authData2.user?.id,
          nome: 'Consultoria Mosaico',
          email: adminEmail,
          role: 'admin',
          municipio_id: municipio.id,
          primeiro_acesso: false
        });

      if (usuarioError) {
        console.error("Erro ao criar registro do usuário administrador:", usuarioError);
        throw usuarioError;
      }

      // Associar à secretaria
      const { error: userSecretariaError } = await supabase
        .from('usuario_secretarias')
        .insert({
          usuario_id: authData2.user?.id,
          secretaria_id: secretaria.id
        });

      if (userSecretariaError) {
        console.error("Erro ao associar usuário à secretaria:", userSecretariaError);
        throw userSecretariaError;
      }
    } else {
      // Criar registro na tabela usuarios
      const { error: usuarioError } = await supabase
        .from('usuarios')
        .insert({
          id: authData.user?.id,
          nome: 'Consultoria Mosaico',
          email: adminEmail,
          role: 'admin',
          municipio_id: municipio.id,
          primeiro_acesso: false
        });

      if (usuarioError) {
        console.error("Erro ao criar registro do usuário administrador:", usuarioError);
        throw usuarioError;
      }

      // Associar à secretaria
      const { error: userSecretariaError } = await supabase
        .from('usuario_secretarias')
        .insert({
          usuario_id: authData.user?.id,
          secretaria_id: secretaria.id
        });

      if (userSecretariaError) {
        console.error("Erro ao associar usuário à secretaria:", userSecretariaError);
        throw userSecretariaError;
      }
    }

    console.log("Usuário administrador de consultoria criado com sucesso");
    toast.success("Usuário administrador criado com sucesso");
    return true;
  } catch (error) {
    console.error('Erro ao adicionar usuário administrador:', error);
    toast.error('Erro ao adicionar usuário administrador');
    return false;
  }
}
