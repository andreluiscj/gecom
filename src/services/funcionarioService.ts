
import { supabase } from '@/lib/supabase';
import { Funcionario, UserRole } from '@/types';
import { toast } from 'sonner';

export async function getFuncionarios(): Promise<Funcionario[]> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, name, email, cpf, birth_date, active, hire_date, phone,
        roles (id, name),
        user_secretariats (
          secretariat_id,
          is_primary,
          secretariats (id, name)
        )
      `);

    if (error) {
      console.error('Error fetching users:', error);
      toast.error('Erro ao carregar funcionários.');
      return [];
    }

    return data.map(user => {
      // Find primary secretariat
      const primarySecretariat = user.user_secretariats?.find(us => us.is_primary);
      const setorName = primarySecretariat?.secretariats?.name || 'Administrativo';
      
      // Map to other secretariats
      const otherSecretariats = user.user_secretariats
        ?.filter(us => !us.is_primary)
        .map(us => us.secretariats?.name);

      return {
        id: user.id,
        nome: user.name,
        cpf: user.cpf || '',
        dataNascimento: user.birth_date ? new Date(user.birth_date) : new Date(),
        email: user.email,
        cargo: user.roles?.name || 'Servidor',
        setor: setorName as any,
        setoresAdicionais: otherSecretariats as any[],
        dataContratacao: user.hire_date ? new Date(user.hire_date) : new Date(),
        ativo: user.active || false,
        telefone: user.phone
      };
    });
  } catch (error) {
    console.error('Error in getFuncionarios:', error);
    toast.error('Ocorreu um erro ao buscar os funcionários.');
    return [];
  }
}

export async function addFuncionario(funcionario: Omit<Funcionario, 'id'>): Promise<{ funcionario: Funcionario, login: any } | null> {
  try {
    // Create user in auth system
    const email = funcionario.email;
    const senha = funcionario.senha || '123'; // Default password
    
    // Create entry in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        name: funcionario.nome,
        email: funcionario.email,
        password_hash: 'temporary_hash', // Will be replaced by auth system
        cpf: funcionario.cpf,
        birth_date: funcionario.dataNascimento.toISOString().split('T')[0],
        role_id: await getRoleIdByName(funcionario.cargo),
        active: funcionario.ativo,
        hire_date: funcionario.dataContratacao.toISOString().split('T')[0],
        first_access: true,
        phone: funcionario.telefone
      })
      .select('id')
      .single();

    if (userError) {
      console.error('Error adding user:', userError);
      toast.error('Erro ao adicionar funcionário.');
      return null;
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: senha,
      options: {
        data: {
          user_id: userData.id
        }
      }
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      // Clean up the user entry
      await supabase.from('users').delete().eq('id', userData.id);
      toast.error('Erro ao criar usuário na autenticação.');
      return null;
    }

    // Associate user with secretariats
    const secretariatId = await getSecretariatIdByName(funcionario.setor);
    
    if (secretariatId) {
      await supabase
        .from('user_secretariats')
        .insert({
          user_id: userData.id,
          secretariat_id: secretariatId,
          is_primary: true
        });

      // Add additional secretariats if any
      if (funcionario.setoresAdicionais?.length) {
        for (const setor of funcionario.setoresAdicionais) {
          const additionalSecretariatId = await getSecretariatIdByName(setor);
          if (additionalSecretariatId) {
            await supabase
              .from('user_secretariats')
              .insert({
                user_id: userData.id,
                secretariat_id: additionalSecretariatId,
                is_primary: false
              });
          }
        }
      }
    }

    // Get the created funcionario
    return {
      funcionario: {
        id: userData.id,
        ...funcionario
      },
      login: {
        id: userData.id,
        username: generateUsername(funcionario.nome),
        senha,
        funcionarioId: userData.id,
        role: mapRoleName(funcionario.cargo),
        ativo: funcionario.ativo,
        primeiroAcesso: true
      }
    };
  } catch (error) {
    console.error('Error in addFuncionario:', error);
    toast.error('Ocorreu um erro ao adicionar o funcionário.');
    return null;
  }
}

// Helper function to generate username from name (firstName.lastName)
function generateUsername(nome: string): string {
  const nameParts = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ');
  
  if (nameParts.length >= 2) {
    return `${nameParts[0]}.${nameParts[nameParts.length - 1]}`;
  } else if (nameParts.length === 1) {
    return nameParts[0];
  } else {
    return `user_${Date.now()}`;
  }
}

// Helper function to map role name to UserRole
function mapRoleName(cargoName: string): UserRole {
  const lowercaseRole = cargoName.toLowerCase();
  
  if (lowercaseRole.includes('admin')) {
    return 'admin';
  } else if (lowercaseRole.includes('gerente') || lowercaseRole.includes('secretário')) {
    return 'manager';
  } else {
    return 'user';
  }
}

// Helper function to get role ID by name
async function getRoleIdByName(roleName: string): Promise<string> {
  try {
    // Default to 'Servidor' role (id 4)
    let searchRole = 'Servidor';
    
    // Map to database role names
    const lowercaseRole = roleName.toLowerCase();
    if (lowercaseRole.includes('admin')) {
      searchRole = 'Administrador';
    } else if (lowercaseRole.includes('prefeito')) {
      searchRole = 'Prefeito';
    } else if (lowercaseRole.includes('gestor') || lowercaseRole.includes('secretário')) {
      searchRole = 'Gestor';
    }
    
    const { data, error } = await supabase
      .from('roles')
      .select('id')
      .eq('name', searchRole)
      .single();

    if (error || !data) {
      console.error('Error getting role:', error);
      // Return default role ID (4 for Servidor)
      return 'e3f9e6ac-35cc-449d-8b31-166a8e69e902';
    }

    return data.id;
  } catch (error) {
    console.error('Error in getRoleIdByName:', error);
    // Return default role ID (4 for Servidor)
    return 'e3f9e6ac-35cc-449d-8b31-166a8e69e902';
  }
}

// Helper function to get secretariat ID by name
async function getSecretariatIdByName(secretariatName: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('secretariats')
      .select('id')
      .eq('name', secretariatName)
      .single();

    if (error || !data) {
      console.error('Error getting secretariat:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in getSecretariatIdByName:', error);
    return null;
  }
}

// Function to update the funcionario
export async function updateFuncionario(id: string, funcionario: Partial<Funcionario>): Promise<Funcionario | null> {
  try {
    // Update the user in the database
    const { error: userError } = await supabase
      .from('users')
      .update({
        name: funcionario.nome,
        email: funcionario.email,
        cpf: funcionario.cpf,
        birth_date: funcionario.dataNascimento?.toISOString().split('T')[0],
        role_id: funcionario.cargo ? await getRoleIdByName(funcionario.cargo) : undefined,
        active: funcionario.ativo,
        hire_date: funcionario.dataContratacao?.toISOString().split('T')[0],
        phone: funcionario.telefone
      })
      .eq('id', id);

    if (userError) {
      console.error('Error updating user:', userError);
      toast.error('Erro ao atualizar funcionário.');
      return null;
    }

    // Update secretariat associations if setor has changed
    if (funcionario.setor) {
      // Delete existing primary association
      await supabase
        .from('user_secretariats')
        .delete()
        .eq('user_id', id)
        .eq('is_primary', true);

      // Add new primary association
      const secretariatId = await getSecretariatIdByName(funcionario.setor);
      
      if (secretariatId) {
        await supabase
          .from('user_secretariats')
          .insert({
            user_id: id,
            secretariat_id: secretariatId,
            is_primary: true
          });
      }
    }

    // Update additional secretariats if provided
    if (funcionario.setoresAdicionais) {
      // Delete existing non-primary associations
      await supabase
        .from('user_secretariats')
        .delete()
        .eq('user_id', id)
        .eq('is_primary', false);

      // Add new non-primary associations
      for (const setor of funcionario.setoresAdicionais) {
        const additionalSecretariatId = await getSecretariatIdByName(setor);
        if (additionalSecretariatId) {
          await supabase
            .from('user_secretariats')
            .insert({
              user_id: id,
              secretariat_id: additionalSecretariatId,
              is_primary: false
            });
        }
      }
    }

    // Get the updated funcionario
    const { data, error } = await supabase
      .from('users')
      .select(`
        id, name, email, cpf, birth_date, active, hire_date, phone,
        roles (id, name),
        user_secretariats (
          secretariat_id,
          is_primary,
          secretariats (id, name)
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('Error fetching updated user:', error);
      toast.error('Erro ao buscar funcionário atualizado.');
      return null;
    }

    // Find primary secretariat
    const primarySecretariat = data.user_secretariats?.find(us => us.is_primary);
    const setorName = primarySecretariat?.secretariats?.name || 'Administrativo';
    
    // Map to other secretariats
    const otherSecretariats = data.user_secretariats
      ?.filter(us => !us.is_primary)
      .map(us => us.secretariats?.name);

    return {
      id: data.id,
      nome: data.name,
      cpf: data.cpf || '',
      dataNascimento: data.birth_date ? new Date(data.birth_date) : new Date(),
      email: data.email,
      cargo: data.roles?.name || 'Servidor',
      setor: setorName as any,
      setoresAdicionais: otherSecretariats as any[],
      dataContratacao: data.hire_date ? new Date(data.hire_date) : new Date(),
      ativo: data.active || false,
      telefone: data.phone
    };
  } catch (error) {
    console.error('Error in updateFuncionario:', error);
    toast.error('Ocorreu um erro ao atualizar o funcionário.');
    return null;
  }
}

// Function to delete the funcionario
export async function deleteFuncionario(id: string): Promise<boolean> {
  try {
    // Delete user from users table
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting user:', error);
      toast.error('Erro ao excluir funcionário.');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteFuncionario:', error);
    toast.error('Ocorreu um erro ao excluir o funcionário.');
    return false;
  }
}

// Function to filter funcionarios by setor
export async function filtrarFuncionariosPorSetor(setor: string): Promise<Funcionario[]> {
  try {
    const secretariatId = await getSecretariatIdByName(setor);
    
    if (!secretariatId) {
      return [];
    }
    
    const { data, error } = await supabase
      .from('user_secretariats')
      .select(`
        user_id,
        users (
          id, name, email, cpf, birth_date, active, hire_date, phone,
          roles (id, name),
          user_secretariats (
            secretariat_id,
            is_primary,
            secretariats (id, name)
          )
        )
      `)
      .eq('secretariat_id', secretariatId);

    if (error) {
      console.error('Error fetching users by secretariat:', error);
      toast.error('Erro ao buscar funcionários por setor.');
      return [];
    }

    return data.map(item => {
      const user = item.users;
      
      // Find primary secretariat
      const primarySecretariat = user.user_secretariats?.find(us => us.is_primary);
      const setorName = primarySecretariat?.secretariats?.name || 'Administrativo';
      
      // Map to other secretariats
      const otherSecretariats = user.user_secretariats
        ?.filter(us => !us.is_primary)
        .map(us => us.secretariats?.name);

      return {
        id: user.id,
        nome: user.name,
        cpf: user.cpf || '',
        dataNascimento: user.birth_date ? new Date(user.birth_date) : new Date(),
        email: user.email,
        cargo: user.roles?.name || 'Servidor',
        setor: setorName as any,
        setoresAdicionais: otherSecretariats as any[],
        dataContratacao: user.hire_date ? new Date(user.hire_date) : new Date(),
        ativo: user.active || false,
        telefone: user.phone
      };
    });
  } catch (error) {
    console.error('Error in filtrarFuncionariosPorSetor:', error);
    toast.error('Ocorreu um erro ao buscar os funcionários por setor.');
    return [];
  }
}
