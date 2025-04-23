
import { Funcionario, UsuarioLogin } from "@/types";

// Este arquivo é usado apenas para desenvolvimento.
// Na aplicação real, estas informações virão do banco de dados.

export const funcionarios: Funcionario[] = [
  {
    id: "1",
    nome: "João Silva",
    cpf: "123.456.789-00",
    data_nascimento: new Date("1980-05-15"),
    email: "joao.silva@municipio.gov.br",
    cargo: "Analista Administrativo",
    setor_id: "1",
    setor: "Saúde",
    data_contratacao: new Date("2020-01-10"),
    ativo: true,
    telefone: "(11) 91234-5678",
  },
  {
    id: "2",
    nome: "Maria Oliveira",
    cpf: "987.654.321-00",
    data_nascimento: new Date("1985-12-03"),
    email: "maria.oliveira@municipio.gov.br",
    cargo: "Diretor Financeiro",
    setor_id: "2",
    setor: "Fazenda",
    data_contratacao: new Date("2018-03-22"),
    ativo: true,
    telefone: "(11) 98765-4321",
  },
];

export const usuarios: (UsuarioLogin & { senha: string })[] = [
  {
    id: "1",
    username: "admin@gecom.gov",
    funcionario_id: "1",
    role: "admin",
    ativo: true,
    primeiro_acesso: false,
    auth_user_id: "auth_1",
    senha: "admin123"
  },
  {
    id: "2",
    username: "maria@gecom.gov",
    funcionario_id: "2",
    role: "user",
    ativo: true,
    primeiro_acesso: true,
    auth_user_id: "auth_2",
    senha: "user123"
  },
  {
    id: "3",
    username: "gerente@gecom.gov",
    funcionario_id: "2",
    role: "manager",
    ativo: true,
    primeiro_acesso: false,
    auth_user_id: "auth_3",
    senha: "gerente123"
  }
];

export function autenticarUsuario(username: string, senha: string) {
  const usuario = usuarios.find(
    (u) => u.username === username && u.senha === senha
  );

  if (usuario) {
    const funcionario = funcionarios.find((f) => f.id === usuario.funcionario_id);

    return {
      authenticated: true,
      userId: usuario.id,
      funcionario: funcionario || funcionarios[0],
      role: usuario.role,
      primeiroAcesso: usuario.primeiro_acesso,
    };
  }

  return { authenticated: false };
}

export function atualizarSenhaUsuario(userId: string, novaSenha: string): boolean {
  const index = usuarios.findIndex((u) => u.id === userId);
  
  if (index !== -1) {
    usuarios[index].senha = novaSenha;
    usuarios[index].primeiro_acesso = false;
    return true;
  }
  
  return false;
}

// Add missing exported functions
export function getUserById(id: string): Funcionario | undefined {
  return funcionarios.find(f => f.id === id);
}

export function getUsuariosLogin() {
  return usuarios;
}

export function updateFuncionario(id: string, data: Partial<Funcionario>): boolean {
  const index = funcionarios.findIndex(f => f.id === id);
  if (index !== -1) {
    funcionarios[index] = { ...funcionarios[index], ...data };
    return true;
  }
  return false;
}

export function getFuncionarios() {
  return funcionarios;
}

export function filtrarFuncionariosPorSetor(setorId: string): Funcionario[] {
  return funcionarios.filter(f => f.setor_id === setorId);
}
