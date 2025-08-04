import { PermissionKey } from './types';

export function matchPermission(required: PermissionKey, granted: PermissionKey): boolean {
  const allowedActions = ['create', 'read', 'edit', 'delete', '*'];

  const reqParts = required.split(':');
  const grantedParts = granted.split(':');

  const action = reqParts[0];
  if (!allowedActions.includes(action)) return false;

  for (let i = 0; i < 3; i++) {
    const grantedPart = grantedParts[i] || '*';
    const requiredPart = reqParts[i] || '';

    if (grantedPart === '*') continue;
    if (grantedPart !== requiredPart) return false;
  }

  return true;
}

