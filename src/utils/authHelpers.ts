
// Este arquivo contém funções auxiliares para autenticação e permissões
import { supabase } from '@/lib/supabase';

export async function getUserRole(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return 'guest';
  }
  
  try {
    const { data } = await supabase
      .from('usuarios')
      .select('role')
      .eq('auth_user_id', session.user.id)
      .single();
    
    return data?.role || 'user';
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return 'user';
  }
}

export function canEditWorkflowStep(stepTitle: string): boolean {
  const userRole = localStorage.getItem('user-role');
  
  // Admin pode editar todas as etapas
  if (userRole === 'admin') {
    return true;
  }
  
  // Para gerentes e usuários, definimos permissões específicas por etapa
  if (userRole === 'manager') {
    // Gerentes podem aprovar coisas
    if (stepTitle === 'Aprovação') return true;
    if (stepTitle === 'Análise') return true;
  }
  
  if (userRole === 'user') {
    // Usuários comuns só podem atualizar as etapas iniciais
    if (stepTitle === 'Solicitação') return true;
  }
  
  return false;
}

export function isAuthenticated(): boolean {
  // No ambiente real, verificamos se o usuário está autenticado
  return localStorage.getItem('user-authenticated') === 'true';
}
