
// This file re-exports all auth helpers from the new structure
// for backward compatibility
// Export all from auth except for the ambiguous functions
import * as auth from './auth';
import * as permissionHelpers from './auth/permissionHelpers';
import * as profileHelpers from './auth/profileHelpers';
import * as authCore from './auth/authCore';

// Re-export everything except the ambiguous functions
export * from './auth/permissionHelpers';
export * from './auth/profileHelpers';

// For ambiguous functions, specifically choose the implementation from auth.ts
// as it appears to be the more complete implementation
export const getUserRole = auth.getUserRole;
export const getUserSetor = auth.getUserSetor;
export const getUserName = auth.getUserName;
export const getUserId = auth.getUserId;
export const canAccessDashboard = auth.canAccessDashboard;

// Export everything else from auth
export const isAdmin = auth.isAdmin;
export const isPrefeito = auth.isPrefeito;
export const isGestor = auth.isGestor;
export const isServidor = auth.isServidor;
export const getUserMunicipality = auth.getUserMunicipality;
export const getUserSecretarias = auth.getUserSecretarias;
