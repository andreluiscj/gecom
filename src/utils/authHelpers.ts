
// This file re-exports all auth helpers from the new structure
// for backward compatibility
import * as authCore from './auth/authCore';
import * as permissionHelpers from './auth/permissionHelpers';
import * as profileHelpers from './auth/profileHelpers';

// Re-export everything from the core modules
export * from './auth/index';
