
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
