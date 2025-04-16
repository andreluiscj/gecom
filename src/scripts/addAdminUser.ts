
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export async function addAdminUser() {
  try {
    // Verificar se o usuário já existe
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'andreluiscj2207@gmail.com')
      .single();

    if (existingUser) {
      console.log('Usuário admin já existe no sistema');
      return true;
    }

    // Criar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'andreluiscj2207@gmail.com',
      password: 'consultoriamosaico'
    });

    if (authError) throw authError;

    // Obter o ID do município (assumindo que já existe pelo menos um)
    const { data: municipioData, error: municipioError } = await supabase
      .from('municipios')
      .select('id')
      .limit(1)
      .single();

    if (municipioError) throw municipioError;

    // Criar usuário na tabela usuarios
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user?.id,
        nome: 'Administrador Principal',
        email: 'andreluiscj2207@gmail.com',
        role: 'admin',
        municipio_id: municipioData.id,
        primeiro_acesso: false // Já configura como não sendo primeiro acesso
      });

    if (usuarioError) throw usuarioError;

    // Obter a primeira secretaria disponível para vincular o usuário
    const { data: secretariaData, error: secretariaError } = await supabase
      .from('secretarias')
      .select('id')
      .limit(1)
      .single();

    if (secretariaError) throw secretariaError;

    // Criar associação entre usuário e secretaria
    const { error: userSecretariaError } = await supabase
      .from('usuario_secretarias')
      .insert({
        usuario_id: authData.user?.id,
        secretaria_id: secretariaData.id
      });

    if (userSecretariaError) throw userSecretariaError;

    console.log('Usuário administrador criado com sucesso');
    return true;
  } catch (error) {
    console.error('Erro ao criar usuário administrador:', error);
    return false;
  }
}
