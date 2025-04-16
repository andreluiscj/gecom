
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export async function initializeSystem() {
  try {
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

    if (municipioError) throw municipioError;

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

    if (secretariaError) throw secretariaError;

    // Create admin user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'admin@gecom.com',
      password: 'AdminGecom2024!'
    });

    if (authError) throw authError;

    // Create corresponding user in usuarios table
    const { error: usuarioError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user?.id,
        nome: 'Administrador',
        email: 'admin@gecom.com',
        role: 'admin',
        municipio_id: municipioData.id,
        primeiro_acesso: true
      });

    if (usuarioError) throw usuarioError;

    // Create user-secretaria association
    const { error: userSecretariaError } = await supabase
      .from('usuario_secretarias')
      .insert({
        usuario_id: authData.user?.id,
        secretaria_id: secretariaData.id
      });

    if (userSecretariaError) throw userSecretariaError;

    toast.success('Sistema inicializado com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao inicializar o sistema:', error);
    toast.error('Erro ao inicializar o sistema');
    return false;
  }
}
