
// This file contains helper functions for authentication and permissions

export function getUserRole(): string {
  // In a real app, this would get the role from the authenticated user
  // For now, we'll simulate by returning a role from localStorage or a default
  return localStorage.getItem('user-role') || 'user';
}

export function canEditWorkflowStep(stepTitle: string): boolean {
  const userRole = getUserRole();
  
  // Admin can edit all steps
  if (userRole === 'admin') {
    return true;
  }
  
  // For managers and users, we can define specific permissions per step
  if (userRole === 'manager') {
    // Managers can approve things
    if (stepTitle === 'Aprovação') return true;
    if (stepTitle === 'Análise') return true;
  }
  
  if (userRole === 'user') {
    // Regular users can only update the initial steps
    if (stepTitle === 'Solicitação') return true;
  }
  
  return false;
}

export function getPermittedWorkflowStep(): string {
  // In a real app, this would get the permitted step from the authenticated user
  // For now, we'll simulate by returning a step from localStorage or a default
  return localStorage.getItem('user-permitted-step') || '';
}

export function isAuthenticated(): boolean {
  // In a real app, this would check if the user is authenticated
  return localStorage.getItem('user-authenticated') === 'true';
}
