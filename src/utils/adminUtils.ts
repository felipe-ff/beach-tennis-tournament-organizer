// Admin utilities for managing admin status
export const checkAdminStatus = (): boolean => {
  try {
    const adminData = localStorage.getItem('tournamentAdmin');
    if (!adminData) return false;
    
    const { isAdmin, expiryTime } = JSON.parse(adminData);
    
    // Check if admin access has expired
    if (Date.now() > expiryTime) {
      localStorage.removeItem('tournamentAdmin');
      return false;
    }
    
    return isAdmin === true;
  } catch (error) {
    console.error('Error checking admin status:', error);
    localStorage.removeItem('tournamentAdmin');
    return false;
  }
};

export const clearAdminStatus = (): void => {
  localStorage.removeItem('tournamentAdmin');
};

export const getRemainingAdminTime = (): number => {
  try {
    const adminData = localStorage.getItem('tournamentAdmin');
    if (!adminData) return 0;
    
    const { expiryTime } = JSON.parse(adminData);
    const remainingTime = expiryTime - Date.now();
    
    return Math.max(0, remainingTime);
  } catch (error) {
    return 0;
  }
};
