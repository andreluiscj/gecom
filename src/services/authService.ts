
import { supabase } from '@/lib/supabase';
import { hashPassword, verifyPassword } from '@/utils/passwordHelpers';

interface SignInResult {
  authenticated: boolean;
  userId?: string;
  role?: string;
  name?: string;
  primeiroAcesso?: boolean;
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  try {
    // First, get user by email
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, role_id, first_access')
      .eq('email', email)
      .eq('active', true);

    if (error || !users || users.length === 0) {
      console.error('User not found or error:', error);
      return { authenticated: false };
    }

    const user = users[0];

    // Verify password
    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      console.error('Invalid password');
      return { authenticated: false };
    }

    // Get role info
    const { data: roles } = await supabase
      .from('roles')
      .select('id, name')
      .eq('id', user.role_id);

    const role = roles && roles.length > 0 ? roles[0].name : 'user';

    // Set authentication in localStorage
    localStorage.setItem('user-authenticated', 'true');
    localStorage.setItem('user-id', user.id);
    localStorage.setItem('user-role', role);
    localStorage.setItem('user-name', user.name);

    return {
      authenticated: true,
      userId: user.id,
      role,
      name: user.name,
      primeiroAcesso: user.first_access || false
    };
  } catch (error) {
    console.error('Error during sign in:', error);
    return { authenticated: false };
  }
}

export async function changePassword(userId: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword);

    const { error } = await supabase
      .from('users')
      .update({
        password_hash: hashedPassword,
        first_access: false,
        gdpr_consent_date: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating password:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error changing password:', error);
    return false;
  }
}

export async function saveGDPRConsent(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('users')
      .update({ gdpr_consent_date: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      console.error('Error saving GDPR consent:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error saving GDPR consent:', error);
    return false;
  }
}
