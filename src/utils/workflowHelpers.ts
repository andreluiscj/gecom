import { Workflow } from '@/types';
import { getUserRoleSync } from './auth';
import { canEditWorkflowStepSync } from './auth/permissionHelpers';

// Helper function to check if a user can edit a workflow step
export const canEditStep = (workflow: Workflow, stepIndex: number): boolean => {
  // Check if the workflow exists and has steps
  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return false;
  }
  
  // Check if the step index is valid
  if (stepIndex < 0 || stepIndex >= workflow.steps.length) {
    return false;
  }
  
  // Check if previous steps are completed
  for (let i = 0; i < stepIndex; i++) {
    if (workflow.steps[i].status !== 'Concluído') {
      return false;
    }
  }
  
  // Check if the current step is already completed
  if (workflow.steps[stepIndex].status === 'Concluído') {
    return false;
  }
  
  // Check user role permissions
  const userRole = getUserRoleSync();
  
  // Admin and prefeito can edit any step
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // For other roles, check specific permissions
  return canEditWorkflowStepSync(workflow.steps[stepIndex].title);
};
