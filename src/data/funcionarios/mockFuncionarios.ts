
// Function to generate a unique ID
function generateId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Initial data setup (if localStorage is empty)
if (!localStorage.getItem('funcionarios')) {
  const initialFuncionarios = [
    { id: generateId(), nome: 'Admin User', setor: 'Administração', permissaoEtapa: 'all' },
    { id: generateId(), nome: 'Servidor User', setor: 'Compras', permissaoEtapa: 'analise_tecnica' },
    { id: generateId(), nome: 'Gestor User', setor: 'Financeiro', permissaoEtapa: 'cotacao' }
  ];
  localStorage.setItem('funcionarios', JSON.stringify(initialFuncionarios));
}

if (!localStorage.getItem('usuarios-login')) {
  const initialUsuariosLogin = [
    { id: generateId(), email: 'admin@gecom.com', senha: 'admin', role: 'admin', funcionarioId: JSON.parse(localStorage.getItem('funcionarios') || '[]')[0].id, primeiroAcesso: false },
    { id: generateId(), email: 'servidor@gecom.com', senha: 'servidor', role: 'servidor', funcionarioId: JSON.parse(localStorage.getItem('funcionarios') || '[]')[1].id, primeiroAcesso: false },
    { id: generateId(), email: 'gestor@gecom.com', senha: 'gestor', role: 'gestor', funcionarioId: JSON.parse(localStorage.getItem('funcionarios') || '[]')[2].id, primeiroAcesso: false }
  ];
  localStorage.setItem('usuarios-login', JSON.stringify(initialUsuariosLogin));
}

// Function to generate username from name
export function generateUsername(name: string) {
  // Convert to lowercase, remove accents, replace spaces with dots
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".")
    .substring(0, 20);
}

// Function to get all funcionarios
export function getFuncionarios() {
  const funcionarios = localStorage.getItem('funcionarios');
  return funcionarios ? JSON.parse(funcionarios) : [];
}

// Function to add a new funcionario
export function adicionarFuncionario(nome: string, setor: string, permissaoEtapa: string) {
  const funcionarios = getFuncionarios();
  const newFuncionario = { id: generateId(), nome, setor, permissaoEtapa };
  funcionarios.push(newFuncionario);
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  return newFuncionario;
}

// Function to update an existing funcionario
export function atualizarFuncionario(id: string, nome: string, setor: string, permissaoEtapa: string) {
  const funcionarios = getFuncionarios();
  const funcionarioIndex = funcionarios.findIndex((f: any) => f.id === id);
  if (funcionarioIndex !== -1) {
    funcionarios[funcionarioIndex] = { id, nome, setor, permissaoEtapa };
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    return true;
  }
  return false;
}

// Function to delete a funcionario
export function deletarFuncionario(id: string) {
  const funcionarios = getFuncionarios();
  const updatedFuncionarios = funcionarios.filter((f: any) => f.id !== id);
  localStorage.setItem('funcionarios', JSON.stringify(updatedFuncionarios));

  // Also, remove the user from usuarios-login if exists
  const usuarios = getUsuariosLogin();
  const updatedUsuarios = usuarios.filter((u: any) => u.funcionarioId !== id);
  localStorage.setItem('usuarios-login', JSON.stringify(updatedUsuarios));
  return true;
}

// Function to get all usuarios-login
export function getUsuariosLogin() {
  const usuarios = localStorage.getItem('usuarios-login');
  return usuarios ? JSON.parse(usuarios) : [];
}

// Function to add a new usuario-login
export function adicionarUsuarioLogin(email: string, senha: string, role: string, funcionarioId: string, primeiroAcesso: boolean = false) {
  const usuarios = getUsuariosLogin();
  const newUsuario = { id: generateId(), email, senha, role, funcionarioId, primeiroAcesso };
  usuarios.push(newUsuario);
  localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
  return newUsuario;
}

// Function to update an existing usuario-login
export function atualizarUsuarioLogin(id: string, email: string, senha: string, role: string, funcionarioId: string) {
  const usuarios = getUsuariosLogin();
  const usuarioIndex = usuarios.findIndex((u: any) => u.id === id);
  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex] = { id, email, senha, role, funcionarioId };
    localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
    return true;
  }
  return false;
}

// Function to delete a usuario-login
export function deletarUsuarioLogin(id: string) {
  const usuarios = getUsuariosLogin();
  const updatedUsuarios = usuarios.filter((u: any) => u.id !== id);
  localStorage.setItem('usuarios-login', JSON.stringify(updatedUsuarios));
  return true;
}

// Function to authenticate user
export function autenticarUsuario(email: string, password: string) {
  // Get users from localStorage or use an empty array if none exist
  const usuarios = JSON.parse(localStorage.getItem('usuarios-login') || '[]');
  
  // Find user with matching email and password
  const usuario = usuarios.find((u: any) => 
    u.email === email && u.senha === password
  );
  
  if (usuario) {
    // If user found, get funcionario details
    const funcionarios = JSON.parse(localStorage.getItem('funcionarios') || '[]');
    const funcionario = funcionarios.find((f: any) => f.id === usuario.funcionarioId);
    
    if (funcionario) {
      return {
        authenticated: true,
        userId: usuario.id,
        role: usuario.role,
        primeiroAcesso: usuario.primeiroAcesso,
        funcionario
      };
    }
  }
  
  return {
    authenticated: false
  };
}

// Function to update user password
export function atualizarSenhaUsuario(userId: string, newPassword: string) {
  const usuarios = getUsuariosLogin();
  const usuarioIndex = usuarios.findIndex((u: any) => u.id === userId);
  if (usuarioIndex !== -1) {
    usuarios[usuarioIndex].senha = newPassword;
    localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
    return true;
  }
  return false;
}

// ADD MISSING FUNCTIONS NEEDED BY OTHER COMPONENTS

// Function to get user by ID
export function getUserById(userId: string) {
  const usuarios = getUsuariosLogin();
  const usuario = usuarios.find(u => u.id === userId);
  
  if (usuario) {
    const funcionarios = getFuncionarios();
    const funcionario = funcionarios.find(f => f.id === usuario.funcionarioId);
    
    if (funcionario) {
      return { usuario, funcionario };
    }
  }
  
  return null;
}

// Function to add a new funcionario with full data
export function addFuncionario(funcionarioData: any) {
  const funcionarios = getFuncionarios();
  const newFuncionario = { 
    id: generateId(),
    ...funcionarioData
  };
  funcionarios.push(newFuncionario);
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  
  // Generate email from name if not provided
  const emailPrefix = generateUsername(funcionarioData.nome);
  const email = funcionarioData.email || `${emailPrefix}@gecom.com`;
  
  // Create user login for new funcionario
  const login = adicionarUsuarioLogin(
    email,
    '123', // Default password
    funcionarioData.cargo?.toLowerCase().includes('prefeito') ? 'prefeito' : 
      funcionarioData.cargo?.toLowerCase().includes('gerente') ? 'gestor' : 'user',
    newFuncionario.id,
    true // First access
  );
  
  return { funcionario: newFuncionario, login };
}

// Function to update an existing funcionario with full data
export function updateFuncionario(id: string, funcionarioData: any) {
  const funcionarios = getFuncionarios();
  const funcionarioIndex = funcionarios.findIndex(f => f.id === id);
  
  if (funcionarioIndex !== -1) {
    funcionarios[funcionarioIndex] = { 
      ...funcionarios[funcionarioIndex],
      ...funcionarioData,
      id // Ensure ID is preserved
    };
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    
    // If email changed, update the user login
    if (funcionarioData.email) {
      const usuarios = getUsuariosLogin();
      const usuario = usuarios.find(u => u.funcionarioId === id);
      if (usuario) {
        usuario.email = funcionarioData.email;
        localStorage.setItem('usuarios-login', JSON.stringify(usuarios));
      }
    }
    
    return true;
  }
  return false;
}

// Function to delete a funcionario - alias for deletarFuncionario
export const deleteFuncionario = deletarFuncionario;

// Function to filter funcionarios by setor
export function filtrarFuncionariosPorSetor(setor: string) {
  const funcionarios = getFuncionarios();
  return funcionarios.filter(f => f.setor === setor);
}

// Function to get login activity logs
export function getLoginLogs() {
  const logs = localStorage.getItem('login-logs');
  return logs ? JSON.parse(logs) : [];
}

// Function to add a new login log entry
export function addLoginLog(userId: string, success: boolean, ip: string = '127.0.0.1') {
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
}
