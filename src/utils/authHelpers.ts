
// This file re-exports all auth helpers from the new structure
// for backward compatibility
import * as authCore from './auth/authCore';
import * as permissionHelpers from './auth/permissionHelpers';
import * as profileHelpers from './auth/profileHelpers';

// Re-export everything from the core modules
export * from './auth';

// Adding specific exports that are being used in components
export const getPermittedWorkflowStep = permissionHelpers.getPermittedWorkflowStep;
export const canEditWorkflowStepSync = permissionHelpers.canEditWorkflowStepSync;
export const canAccessSync = permissionHelpers.canAccessSync;
export const getUserIdSync = authCore.getUserIdSync;
export const shouldFilterByUserSetorSync = profileHelpers.shouldFilterByUserSetorSync;
export const hasSetorAccessSync = profileHelpers.hasSetorAccessSync;
export const canAccessUserManagementSync = profileHelpers.canAccessUserManagementSync; 
export const canAccessDashboardSync = authCore.canAccessDashboardSync;
export const getUserNameSync = profileHelpers.getUserNameSync;
