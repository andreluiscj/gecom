
/**
 * Password helper functions for hashing and verifying passwords
 */

import { createHash } from 'crypto';

// Simple hash function for passwords
export async function hashPassword(password: string): Promise<string> {
  return createHash('sha256').update(password).digest('hex');
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
