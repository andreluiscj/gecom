
// Re-export all auth utilities from a single file for easier imports

// Re-export functions from authCore
export {
  isAuthenticated,
  getUserRole,
  getUserName,
  getUserId,
  getFuncionarioId,
  getUserSetor
} from './auth/authCore';

// Re-export functions from permissionHelpers
export {
  shouldFilterByUserSetor,
  canAccessDashboard,
  canAccessUserManagement,
  canEditWorkflowStep,
  getPermittedWorkflowStep
} from './auth/permissionHelpers';

