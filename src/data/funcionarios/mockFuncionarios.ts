
import { v4 as uuidv4 } from 'uuid';
import { Funcionario, UsuarioLogin } from '@/types';

// Empty employees data
export const mockFuncionarios: Funcionario[] = [];

// Login users data store
export const mockUsuariosLogin: UsuarioLogin[] = [];

// Get all employees
export const getFuncionarios = () => {
  // Get from localStorage if available, otherwise use mockFuncionarios
  const storedFuncionarios = localStorage.getItem('funcionarios');
  if (storedFuncionarios) {
    const parsed = JSON.parse(storedFuncionarios);
    // Convert string dates back to Date objects
    return parsed.map((func: any) => ({
      ...func,
      dataContratacao: new Date(func.dataContratacao),
      dataNascimento: new Date(func.dataNascimento)
    }));
  }
  
  // Initialize localStorage with mock data if it doesn't exist
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

// Generate username from name (firstName.lastName)
export const generateUsername = (nome: string): string => {
  const nameParts = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(' ');
  
  if (nameParts.length >= 2) {
    return `${nameParts[0]}.${nameParts[1]}`;
  } else if (nameParts.length === 1) {
    return nameParts[0];
  } else {
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
  
  // Generate username for login
  const username = generateUsername(funcionario.nome);
  
  // Create login for the employee
  const newLogin: UsuarioLogin = {
    id: uuidv4(),
    username: username,
    senha: "123", // Default password
    funcionarioId: newFuncionario.id,
    role: funcionario.cargo.toLowerCase().includes('gerente') || 
          funcionario.cargo.toLowerCase().includes('secretário') ? 'manager' : 'user',
    ativo: newFuncionario.ativo
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
    
    if (funcionario) {
      return {
        authenticated: true,
        role: usuario.role,
        funcionario: funcionario
      };
    }
  }
  
  return { authenticated: false };
};

// Update user password
export const atualizarSenhaUsuario = (username: string, novaSenha: string) => {
  const usuarios = getUsuariosLogin();
  const index = usuarios.findIndex(u => u.username === username);
  
  if (index !== -1) {
    usuarios[index].senha = novaSenha;
    localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
    return true;
  }
  
  return false;
};
