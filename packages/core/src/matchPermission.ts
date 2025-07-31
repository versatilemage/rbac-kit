import { PermissionKey } from './types';

/**
 * Match required permission with a granted one.
 */
export function matchPermission(required: PermissionKey, granted: PermissionKey): boolean {
  const reqParts = required.split(':');
  const grantedParts = granted.split(':');

  for (let i = 0; i < reqParts.length; i++) {
    if (grantedParts[i] === '*') continue;
    if (grantedParts[i] !== reqParts[i]) return false;
  }

  return true;
}
