
import { supabase } from './client';
import { Funcionario, UsuarioLogin, Setor } from '@/types';

export async function getUsuarios() {
  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select(`
        *,
        tipos_usuarios(nome)
      `);

    if (error) throw error;

    const funcionarios = data.map(u => ({
      id: u.id.toString(),
      nome: u.nome,
      email: u.email,
      cpf: u.cpf,
      dataNascimento: u.data_nascimento ? new Date(u.data_nascimento) : new Date(),
      cargo: u.tipos_usuarios.nome,
      setor: 'Não especificado' as Setor, // Cast to Setor type
      dataContratacao: new Date(), // Not available in the DB schema
      ativo: true // Not available in the DB schema
    })) as Funcionario[];

    return funcionarios;
  } catch (error) {
    console.error('Error fetching usuarios:', error);
    throw error;
  }
}

export async function autenticarUsuario(email: string, senha: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha
    });

    if (error) throw error;

    // Fetch user data from the usuarios table
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select(`
        *,
        tipos_usuarios(nome)
      `)
      .eq('email', email)
      .single();

    if (userError) throw userError;

    return {
      authenticated: true,
      userId: userData.id.toString(),
      role: userData.tipos_usuarios.nome.toLowerCase(),
      funcionario: {
        id: userData.id.toString(),
        nome: userData.nome,
        setor: 'Não especificado' as Setor // Cast to Setor type
      },
      primeiroAcesso: userData.primeiro_login || false
    };
  } catch (error) {
    console.error('Error authenticating user:', error);
    return { authenticated: false };
  }
}
