import { v4 as uuidv4 } from 'uuid';
import { Funcionario, UsuarioLogin, UserRole } from '@/types';

// Removing original admin and prefeito mock data
// Only keeping empty arrays for initialization

// Empty employees data
export const mockFuncionarios: Funcionario[] = [];

// Login users data store - empty 
export const mockUsuariosLogin: UsuarioLogin[] = [];

// Login logs storage
export const mockLoginLogs: any[] = [];

// Password reset tokens storage
export const mockPasswordResetTokens: Record<string, { token: string, expires: Date, userId: string }> = {};

// Get all employees
export const getFuncionarios = () => {
  // Get from localStorage if available, otherwise use mockFuncionarios
  const storedFuncionarios = localStorage.getItem('funcionarios');
  if (storedFuncionarios) {
    const parsed = JSON.parse(storedFuncionarios);
    // Convert string dates back to Date objects
    return parsed.map((func: any) => ({
      ...func,
      dataContratacao: func.dataContratacao ? new Date(func.dataContratacao) : new Date(),
      dataNascimento: func.dataNascimento ? new Date(func.dataNascimento) : new Date()
    }));
  }
  
  // Initialize localStorage with empty array if it doesn't exist
  localStorage.setItem('funcionarios', JSON.stringify(mockFuncionarios));
  return mockFuncionarios;
};

// Get all login users
export const getUsuariosLogin = () => {
  const storedUsuarios = localStorage.getItem('usuarios-login');
  if (storedUsuarios) {
    return JSON.parse(storedUsuarios);
  }
  
  localStorage.setItem('usuarios-login', JSON.stringify(mockUsuariosLogin));
  return mockUsuariosLogin;
};

// Get login logs
export const getLoginLogs = () => {
  const storedLogs = localStorage.getItem('login-logs');
  if (storedLogs) {
    return JSON.parse(storedLogs);
  }
  
  localStorage.setItem('login-logs', JSON.stringify(mockLoginLogs));
  return mockLoginLogs;
};

// Add login log
export const addLoginLog = (userId: string, success: boolean, ip: string = "127.0.0.1") => {
  const logs = getLoginLogs();
  const newLog = {
    userId,
    timestamp: new Date().toISOString(),
    success,
    ip
  };
  
  logs.push(newLog);
  localStorage.setItem('login-logs', JSON.stringify(logs));
  return newLog;
};

// Generate username from name according to the requirements:
// Nome: André Luis Caldeira => andre.luis
// Nome: André Caldeira => andre.caldeira
export const generateUsername = (nome: string): string => {
  // Remove accents and special characters
  const normalizedName = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const nameParts = normalizedName.split(' ');
  
  if (nameParts.length >= 3) {
    // For names with 3 or more parts, use first name + second name
    return `${nameParts[0]}.${nameParts[1]}`;
  } else if (nameParts.length === 2) {
    // For names with 2 parts, use first name + last name
    return `${nameParts[0]}.${nameParts[1]}`;
  } else if (nameParts.length === 1) {
    // For single-word names
    return nameParts[0];
  } else {
    // Fallback for empty names
    return `user_${Date.now()}`;
  }
};

// Add a new employee and create login
export const addFuncionario = (funcionario: Omit<Funcionario, 'id'>) => {
  const funcionarios = getFuncionarios();
  const usuarios = getUsuariosLogin();
  
  const newFuncionario = {
    ...funcionario,
    id: uuidv4(),
  };
  
  // Generate username based on new pattern
  const username = generateUsername(funcionario.nome);
  
  // Define role based on position with explicit type casting
  let role: UserRole = 'user';
  if (funcionario.cargo.toLowerCase().includes('gerente') || funcionario.cargo.toLowerCase().includes('secretário')) {
    role = 'manager';
  } else if (funcionario.cargo.toLowerCase().includes('prefeito')) {
    role = 'prefeito';
  } else if (funcionario.cargo.toLowerCase().includes('admin')) {
    role = 'admin';
  }
  
  // Create login for the employee with default password '123'
  const newLogin: UsuarioLogin = {
    id: uuidv4(),
    username: username,
    senha: "123", // Default password for everyone
    funcionarioId: newFuncionario.id,
    role: role,
    ativo: newFuncionario.ativo,
    primeiroAcesso: true // Flag for first-time access for all new users
  };
  
  // Add new employee and login
  funcionarios.push(newFuncionario);
  usuarios.push(newLogin);
  
  // Save to localStorage
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
  
  return { funcionario: newFuncionario, login: newLogin };
};

// Update an employee
export const updateFuncionario = (id: string, funcionario: Partial<Funcionario>) => {
  const funcionarios = getFuncionarios();
  const index = funcionarios.findIndex(f => f.id === id);
  
  if (index !== -1) {
    funcionarios[index] = { ...funcionarios[index], ...funcionario };
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    
    // Update login if employee is active/inactive
    if (funcionario.ativo !== undefined) {
      const usuarios = getUsuariosLogin();
      const userIndex = usuarios.findIndex(u => u.funcionarioId === id);
      
      if (userIndex !== -1) {
        usuarios[userIndex].ativo = funcionario.ativo;
        localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
      }
    }
    
    return funcionarios[index];
  }
  
  return null;
};

// Delete an employee
export const deleteFuncionario = (id: string) => {
  const funcionarios = getFuncionarios();
  const filteredFuncionarios = funcionarios.filter(f => f.id !== id);
  
  localStorage.setItem('funcionarios', JSON.stringify(filteredFuncionarios));
  
  // Also delete associated login
  const usuarios = getUsuariosLogin();
  const filteredUsuarios = usuarios.filter(u => u.funcionarioId !== id);
  localStorage.setItem('usuarios-login', JSON.stringify(filteredUsuarios));
  
  return filteredFuncionarios;
};

// Filter employees by sector/department
export const filtrarFuncionariosPorSetor = (setor: string) => {
  const funcionarios = getFuncionarios();
  return funcionarios.filter(funcionario => 
    funcionario.ativo && (
      funcionario.setor === setor || 
      (funcionario.setoresAdicionais && funcionario.setoresAdicionais.includes(setor))
    )
  );
};

// Login functions
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

// Update user password
export const atualizarSenhaUsuario = (userId: string, novaSenha: string) => {
  const usuarios = getUsuariosLogin();
  const index = usuarios.findIndex(u => u.id === userId);
  
  if (index !== -1) {
    usuarios[index].senha = novaSenha;
    usuarios[index].primeiroAcesso = false;
    localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
    return true;
  }
  
  return false;
};

// Create password reset token
export const criarTokenRecuperacaoSenha = (username: string) => {
  const usuarios = getUsuariosLogin();
  const usuario = usuarios.find(u => u.username === username && u.ativo === true);
  
  if (!usuario) {
    return { success: false };
  }
  
  // Generate a reset token
  const token = uuidv4();
  const expires = new Date();
  expires.setHours(expires.getHours() + 1); // Token valid for 1 hour
  
  // Store token
  mockPasswordResetTokens[token] = {
    token,
    expires,
    userId: usuario.id
  };
  
  // In a real application, an email would be sent
  return { 
    success: true, 
    token,
    email: 'user@example.com' // In a real app, would get email from user data
  };
};

// Validate password reset token
export const validarTokenRecuperacaoSenha = (token: string) => {
  const tokenData = mockPasswordResetTokens[token];
  
  if (!tokenData) {
    return { valid: false, message: 'Token inválido' };
  }
  
  if (new Date() > new Date(tokenData.expires)) {
    return { valid: false, message: 'Token expirado' };
  }
  
  return { valid: true, userId: tokenData.userId };
};

// Reset password using token
export const recuperarSenhaComToken = (token: string, novaSenha: string) => {
  const validation = validarTokenRecuperacaoSenha(token);
  
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }
  
  // Update password
  const success = atualizarSenhaUsuario(validation.userId, novaSenha);
  
  if (success) {
    // Remove the used token
    delete mockPasswordResetTokens[token];
    return { success: true };
  }
  
  return { success: false, message: 'Erro ao atualizar senha' };
};

// Get user by ID
export const getUserById = (userId: string) => {
  if (!userId) return null;
  
  const usuarios = getUsuariosLogin();
  const usuario = usuarios.find(u => u.id === userId);
  
  if (usuario) {
    const funcionarios = getFuncionarios();
    const funcionario = funcionarios.find(f => f.id === usuario.funcionarioId);
    
    if (funcionario) {
      return {
        usuario,
        funcionario
      };
    }
  }
  
  return null;
};
