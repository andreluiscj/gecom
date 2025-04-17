
import { getUserRoleSync, getUserSetorSync } from '@/utils/auth';

/**
 * Helper function to check if user has secretarias permissions
 */
export function getUserSecretariasSync(): string[] {
  // This is a placeholder implementation - in a real app, this would fetch from user context
  const setorId = getUserSetorSync();
  
  // Just return the setor ID in an array for now
  return setorId ? [setorId] : [];
}

/**
 * Helper function to check workflow permissions
 */
export function getPermittedWorkflowStep(): number | null {
  const role = getUserRoleSync();
  
  // Different roles can access different workflow steps
  if (role === 'admin') return null; // Admin can access all steps
  if (role === 'manager') return 2; // Manager can access step 2
  return null; // Other roles have no specific workflow step permissions
}

/**
 * Helper function to check if user can edit a specific workflow step
 */
export function canEditWorkflowStepSync(stepTitle: string): boolean {
  const role = getUserRoleSync();
  
  // This is a simplified implementation - in a real app, this would be more complex
  if (role === 'admin') return true;
  
  // Define which roles can edit which steps
  const stepPermissions: Record<string, string[]> = {
    'Aprovação da DFD': ['admin', 'manager'],
    'Cotação': ['admin', 'manager'],
    'Abertura de Processo': ['admin'],
    'Empenhamento': ['admin', 'financeiro'],
    'Licitação': ['admin', 'licitacao'],
    'Contratação': ['admin', 'juridico'],
    'Entrega': ['admin', 'almoxarifado'],
    'Pagamento': ['admin', 'financeiro']
  };
  
  // Check if the user's role is in the allowed roles for this step
  return stepPermissions[stepTitle]?.includes(role) || false;
}

/**
 * Check if user can access specific features
 */
export function canAccessSync(feature: string): boolean {
  const role = getUserRoleSync();
  const secretarias = getUserSecretariasSync();
  
  // Define feature permissions
  const featurePermissions: Record<string, string[]> = {
    'dashboard': ['admin', 'manager', 'prefeito', 'servidor'],
    'pedidos': ['admin', 'manager', 'servidor'],
    'aprovacao': ['admin', 'manager', 'prefeito'],
    'usuarios': ['admin'],
    'relatorios': ['admin', 'manager', 'prefeito'],
    'setores': ['admin', 'manager', 'prefeito']
  };
  
  // Check if the user's role is allowed for this feature
  return featurePermissions[feature]?.includes(role) || false;
}

export { canEditWorkflowStepSync, canAccessSync, getPermittedWorkflowStep };
