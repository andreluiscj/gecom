
// Permission helper functions for user authorization

// Check if user should filter by sector based on role
export const shouldFilterByUserSetor = (): boolean => {
  const userRole = localStorage.getItem('user-role');
  // Only admin and prefeito can see all departments, others must filter
  return userRole !== 'admin' && userRole !== 'prefeito';
};

// Check if user can access the dashboard
export const canAccessDashboard = (): boolean => {
  const userRole = localStorage.getItem('user-role');
  // Only admin, prefeito, and manager can access dashboard
  return userRole === 'admin' || userRole === 'prefeito' || userRole === 'manager';
};

// Check if user can access user management
export const canAccessUserManagement = (): boolean => {
  const userRole = localStorage.getItem('user-role');
  // Only admin can manage users
  return userRole === 'admin';
};

// Check if user can edit a specific workflow step
export const canEditWorkflowStep = (step: string): boolean => {
  const userRole = localStorage.getItem('user-role');
  // Admin and prefeito can edit all steps
  if (userRole === 'admin' || userRole === 'prefeito') {
    return true;
  }
  
  // For other users, check the permitted step
  const permittedStep = localStorage.getItem('user-permitted-step');
  return permittedStep === step;
};

// Get the permitted workflow step for current user
export const getPermittedWorkflowStep = (): string | null => {
  return localStorage.getItem('user-permitted-step');
};
