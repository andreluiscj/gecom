import { Funcionario } from '@/types';

// Mock data for funcionarios
const funcionarios: Funcionario[] = [
  {
    id: "1",
    nome: "João Admin",
    cpf: "123.456.789-01",
    data_nascimento: new Date("1980-01-01"),
    email: "joao.admin@example.com",
    cargo: "Administrador",
    setor_id: null,
    data_contratacao: new Date("2010-01-01"),
    ativo: true,
    telefone: "11 91234-5678"
  },
  {
    id: "2",
    nome: "Maria Gerente",
    cpf: "987.654.321-09",
    data_nascimento: new Date("1985-05-10"),
    email: "maria.gerente@example.com",
    cargo: "Gerente de Setor",
    setor_id: "1",
    data_contratacao: new Date("2015-03-15"),
    ativo: true,
    telefone: "11 98765-4321"
  },
  {
    id: "3",
    nome: "Carlos Usuario",
    cpf: "456.789.123-45",
    data_nascimento: new Date("1990-11-20"),
    email: "carlos.usuario@example.com",
    cargo: "Analista",
    setor_id: "2",
    data_contratacao: new Date("2020-07-01"),
    ativo: true,
    telefone: "11 94567-8901"
  }
];

// Mock function to authenticate user
export function autenticarUsuario(username: string, password: string) {
  const usuario = getUsuariosLogin().find(u => u.username === username);
  if (!usuario) return { authenticated: false };
  
  const funcionario = funcionarios.find(f => f.id === usuario.funcionario_id);
  if (!funcionario) return { authenticated: false };
  
  // Basic password check (in real app, use bcrypt)
  if (password !== 'password') return { authenticated: false };
  
  return { 
    authenticated: true,
    userId: usuario.id,
    role: usuario.role,
    primeiroAcesso: usuario.primeiro_acesso,
    funcionario: {
      nome: funcionario.nome,
      email: funcionario.email,
      id: funcionario.id
    }
  };
}

// Mock function to update user password
export function atualizarSenhaUsuario(userId: string, newPassword: string): boolean {
  console.log(`Updating password for user ${userId} to ${newPassword}`);
  return true;
}

// Add missing functions for compatibility
export function getUserById(id: string) {
  const usuario = getUsuariosLogin().find(u => u.id === id);
  if (!usuario) return null;
  
  const funcionario = funcionarios.find(f => f.id === usuario.funcionario_id);
  if (!funcionario) return null;
  
  return {
    usuario,
    funcionario
  };
}

export function getUsuariosLogin() {
  return [
    {
      id: "1",
      auth_user_id: "auth1",
      username: "admin",
      funcionario_id: "1",
      role: "admin",
      ativo: true,
      primeiro_acesso: false
    },
    {
      id: "2",
      auth_user_id: "auth2",
      username: "gerente",
      funcionario_id: "2",
      role: "manager",
      ativo: true,
      primeiro_acesso: false
    },
    {
      id: "3",
      auth_user_id: "auth3",
      username: "usuario",
      funcionario_id: "3",
      role: "user",
      ativo: true,
      primeiro_acesso: true
    }
  ];
}

export function updateFuncionario(id: string, data: Partial<Funcionario>) {
  // Mock implementation that would update a funcionario
  console.log(`Updating funcionario ${id} with:`, data);
  return true;
}

export function getFuncionarios() {
  return funcionarios;
}

export function filtrarFuncionariosPorSetor(setorId: string) {
  return funcionarios.filter(f => f.setor_id === setorId);
}
