
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

