
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function addAdminUser() {
  try {
    console.log('Iniciando criação do usuário administrador...');
    
    // Verificar se o usuário já existe
    const { data: existingUser, error: existingUserError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'andreluiscj2207@gmail.com')
      .single();

    if (existingUserError && existingUserError.code !== 'PGRST116') {
      console.error('Erro ao verificar usuário existente:', existingUserError);
      return false;
    }

    if (existingUser) {
      console.log('Usuário admin já existe no sistema');
      return true;
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'andreluiscj2207@gmail.com',
      password: 'consultoriamosaico'
    });

    if (authError) {
      console.error('Erro ao criar usuário no Auth:', authError);
      throw authError;
    }

    if (!authData.user) {
      console.error('Usuário não foi criado no Auth');
      return false;
    }

    console.log('Usuário criado no Auth com sucesso:', authData.user?.id);

    // Obter o ID do município (assumindo que já existe pelo menos um)
    const { data: municipioData, error: municipioError } = await supabase
      .from('municipios')
      .select('id')
      .limit(1)
      .single();

    if (municipioError) {
      console.error('Erro ao obter município:', municipioError);
      throw municipioError;
    }

    console.log('Município obtido:', municipioData.id);

    // Criar usuário na tabela usuarios
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        nome: 'Administrador Principal',
        email: 'andreluiscj2207@gmail.com',
        role: 'admin',
        municipio_id: municipioData.id,
        primeiro_acesso: false // Já configura como não sendo primeiro acesso
      });

    if (usuarioError) {
      console.error('Erro ao criar usuário na tabela usuarios:', usuarioError);
      throw usuarioError;
    }

    // Obter a primeira secretaria disponível para vincular o usuário
    const { data: secretariaData, error: secretariaError } = await supabase
      .from('secretarias')
      .select('id')
      .limit(1)
      .single();

    if (secretariaError) {
      console.error('Erro ao obter secretaria:', secretariaError);
      throw secretariaError;
    }

    console.log('Secretaria obtida:', secretariaData.id);

    // Criar associação entre usuário e secretaria
    const { error: userSecretariaError } = await supabase
      .from('usuario_secretarias')
      .insert({
        usuario_id: authData.user.id,
        secretaria_id: secretariaData.id
      });

    if (userSecretariaError) {
      console.error('Erro ao criar associação entre usuário e secretaria:', userSecretariaError);
      throw userSecretariaError;
    }

    // Criar usuário adicional solicitado
    const { data: additionalUserData, error: additionalUserError } = await supabase.auth.signUp({
      email: 'usuario@exemplo.com',
      password: 'senha123'
    });

    if (additionalUserError) {
      console.error('Erro ao criar usuário adicional:', additionalUserError);
      throw additionalUserError;
    }

    // Criar registro do usuário adicional na tabela usuarios
    const { error: additionalUsuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: additionalUserData.user?.id,
        nome: 'Nome do Usuário',
        email: 'usuario@exemplo.com',
        role: 'servidor',
        municipio_id: municipioData.id,
        primeiro_acesso: true
      });

    if (additionalUsuarioError) {
      console.error('Erro ao criar registro do usuário adicional:', additionalUsuarioError);
      throw additionalUsuarioError;
    }

    // Criar associação entre usuário adicional e secretaria
    const { error: additionalUserSecretariaError } = await supabase
      .from('usuario_secretarias')
      .insert({
        usuario_id: additionalUserData.user?.id,
        secretaria_id: secretariaData.id
      });

    if (additionalUserSecretariaError) {
      console.error('Erro ao criar associação do usuário adicional:', additionalUserSecretariaError);
      throw additionalUserSecretariaError;
    }

    console.log('Usuário administrador e usuário adicional criados com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    return false;
  }
}
