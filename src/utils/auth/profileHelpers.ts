
// User profile related functions

// Function to get user profile photo
export function getProfilePhoto(): string | null {
  return localStorage.getItem('user-profile-photo');
}

// Function to set user profile photo
export function setProfilePhoto(photoUrl: string | null): void {
  if (photoUrl) {
    localStorage.setItem('user-profile-photo', photoUrl);
  } else {
    localStorage.removeItem('user-profile-photo');
  }
}

// Function to get user contact information
export function getUserContactInfo(): {phone: string, email: string} {
  return {
    phone: localStorage.getItem('user-phone') || '',
    email: localStorage.getItem('user-email') || ''
  };
}

// Function to get user address information
export function getUserAddressInfo(): {address: string, city: string, state: string} {
  return {
    address: localStorage.getItem('user-address') || '',
    city: localStorage.getItem('user-city') || '',
    state: localStorage.getItem('user-state') || ''
  };
}
