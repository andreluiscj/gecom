
import { v4 as uuidv4 } from 'uuid';
import { Funcionario, UsuarioLogin, LoginLog, UserRole, Setor } from '@/types';

// Função para obter usuários do localStorage ou criar um administrador padrão se não existir
export const getUsuariosLogin = (): UsuarioLogin[] => {
  const storedData = localStorage.getItem('usuarios-login');
  
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    if (parsedData && parsedData.length > 0) {
      return parsedData;
    }
  }
  
  // Se não houver usuários, cria o admin padrão
  const defaultAdmin: UsuarioLogin = {
    id: 'admin-id',
    username: 'admin',
    senha: 'admin',
    funcionarioId: 'admin-func-id',
    role: 'admin',
    ativo: true,
    primeiroAcesso: false
  };
  
  localStorage.setItem('usuarios-login', JSON.stringify([defaultAdmin]));
  return [defaultAdmin];
};

// Função para obter funcionários do localStorage ou criar um administrador padrão se não existir
export const getFuncionarios = (): Funcionario[] => {
  const storedData = localStorage.getItem('funcionarios');
  
  if (storedData) {
    const parsedData = JSON.parse(storedData);
    if (parsedData && parsedData.length > 0) {
      return parsedData;
    }
  }
  
  // Se não houver funcionários, cria o admin padrão
  const defaultAdmin: Funcionario = {
    id: 'admin-func-id',
    nome: 'Administrador',
    cpf: '000.000.000-00',
    dataNascimento: new Date('1980-01-01'),
    email: 'admin@gecom.gov.br',
    cargo: 'Administrador do Sistema',
    setor: 'Administrativo', // Setor válido conforme o tipo
    dataContratacao: new Date(),
    ativo: true,
    telefone: '(00) 00000-0000'
  };
  
  localStorage.setItem('funcionarios', JSON.stringify([defaultAdmin]));
  return [defaultAdmin];
};

// Função para autenticar usuário
export const autenticarUsuario = (username: string, senha: string) => {
  const usuarios = getUsuariosLogin();
  const usuario = usuarios.find(u => 
    u.username === username && 
    u.senha === senha && 
    u.ativo === true
  );
  
  if (usuario) {
    // Get associated employee data
    const funcionarios = getFuncionarios();
    const funcionario = funcionarios.find(f => f.id === usuario.funcionarioId);
    
    // Record successful login
    addLoginLog(usuario.id, true);
    
    if (funcionario) {
      return {
        authenticated: true,
        role: usuario.role,
        funcionario: funcionario,
        userId: usuario.id,
        primeiroAcesso: usuario.primeiroAcesso
      };
    }
  } else {
    // Record failed login attempt if the username exists
    const userToLog = usuarios.find(u => u.username === username);
    if (userToLog) {
      addLoginLog(userToLog.id, false);
    }
  }
  
  return { authenticated: false };
};

// Função para atualizar senha do usuário
export const atualizarSenhaUsuario = (userId: string, novaSenha: string): boolean => {
  const usuarios = getUsuariosLogin();
  const userIndex = usuarios.findIndex(u => u.id === userId);
  
  if (userIndex !== -1) {
    usuarios[userIndex] = {
      ...usuarios[userIndex],
      senha: novaSenha,
      primeiroAcesso: false
    };
    
    localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
    return true;
  }
  
  return false;
};

// Função para adicionar um novo funcionário
export const addFuncionario = (funcionarioData: Omit<Funcionario, 'id'>): { funcionario: Funcionario, login: UsuarioLogin } => {
  const funcionarios = getFuncionarios();
  const usuarios = getUsuariosLogin();
  
  // Gerar ID único para o novo funcionário
  const novoId = uuidv4();
  
  const novoFuncionario: Funcionario = {
    id: novoId,
    ...funcionarioData
  };
  
  funcionarios.push(novoFuncionario);
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  
  // Criar login para o funcionário
  const username = generateUsername(funcionarioData.nome);
  const senha = '123'; // Senha padrão
  
  const novoUsuario: UsuarioLogin = {
    id: uuidv4(),
    username,
    senha,
    funcionarioId: novoId,
    role: funcionarioData.cargo.toLowerCase().includes('gerente') ? 'manager' : 'user',
    ativo: true,
    primeiroAcesso: true
  };
  
  usuarios.push(novoUsuario);
  localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
  
  return {
    funcionario: novoFuncionario,
    login: novoUsuario
  };
};

// Função para atualizar um funcionário existente
export const updateFuncionario = (id: string, funcionarioData: Partial<Omit<Funcionario, 'id'>>): boolean => {
  const funcionarios = getFuncionarios();
  const index = funcionarios.findIndex(f => f.id === id);
  
  if (index !== -1) {
    funcionarios[index] = {
      ...funcionarios[index],
      ...funcionarioData
    };
    
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    return true;
  }
  
  return false;
};

// Função para excluir um funcionário
export const deleteFuncionario = (id: string): boolean => {
  const funcionarios = getFuncionarios();
  const filteredFuncionarios = funcionarios.filter(f => f.id !== id);
  
  if (filteredFuncionarios.length < funcionarios.length) {
    localStorage.setItem('funcionarios', JSON.stringify(filteredFuncionarios));
    
    // Também excluir o login associado
    const usuarios = getUsuariosLogin();
    const filteredUsuarios = usuarios.filter(u => u.funcionarioId !== id);
    localStorage.setItem('usuarios-login', JSON.stringify(filteredUsuarios));
    
    return true;
  }
  
  return false;
};

// Função para gerar um nome de usuário a partir do nome completo
export const generateUsername = (nome: string): string => {
  // Remover acentos
  const normalizedName = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  
  // Extrair primeiro nome e sobrenome
  const nameParts = normalizedName.toLowerCase().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
  
  // Criar username básico
  let username = firstName;
  if (lastName) {
    username = `${firstName}.${lastName}`;
  }
  
  // Verificar se já existe
  const usuarios = getUsuariosLogin();
  const existingUsernames = usuarios.map(u => u.username);
  
  if (!existingUsernames.includes(username)) {
    return username;
  }
  
  // Adicionar número se já existir
  let counter = 1;
  let newUsername = `${username}${counter}`;
  
  while (existingUsernames.includes(newUsername)) {
    counter++;
    newUsername = `${username}${counter}`;
  }
  
  return newUsername;
};

// Função para adicionar log de login
export const addLoginLog = (userId: string, success: boolean): void => {
  const logs: LoginLog[] = getLoginLogs();
  
  const newLog: LoginLog = {
    userId,
    timestamp: new Date().toISOString(),
    success,
    ip: '127.0.0.1' // Simulação de IP
  };
  
  logs.push(newLog);
  localStorage.setItem('login-logs', JSON.stringify(logs));
};

// Função para obter logs de login
export const getLoginLogs = (): LoginLog[] => {
  const storedData = localStorage.getItem('login-logs');
  
  if (storedData) {
    return JSON.parse(storedData);
  }
  
  return [];
};

// Função para obter dados de um usuário pelo ID
export const getUserById = (userId: string) => {
  const usuarios = getUsuariosLogin();
  const usuario = usuarios.find(u => u.id === userId);
  
  if (!usuario) {
    return null;
  }
  
  const funcionarios = getFuncionarios();
  const funcionario = funcionarios.find(f => f.id === usuario.funcionarioId);
  
  if (!funcionario) {
    return null;
  }
  
  return { usuario, funcionario };
};

// Função para filtrar funcionários por setor
export const filtrarFuncionariosPorSetor = (setor: Setor): Funcionario[] => {
  const funcionarios = getFuncionarios();
  
  return funcionarios.filter(funcionario => 
    funcionario.ativo && (
      funcionario.setor === setor || 
      (funcionario.setoresAdicionais && funcionario.setoresAdicionais.includes(setor))
    )
  );
};

// Inicializar dados padrão
getUsuariosLogin();
getFuncionarios();
