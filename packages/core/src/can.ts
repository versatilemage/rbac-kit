import { RolePermissions, PermissionKey } from './types';
import { matchPermission } from './matchPermission';

/**
 * Checks if the role has access to a given permission.
 */
export function can(
  role: string,
  action: string,
  resource: string,
  feature: string | undefined,
  rolePermissions: RolePermissions
): boolean {
  const required: PermissionKey = feature
    ? `${action}:${resource}:${feature}`
    : `${action}:${resource}`;

  const permissions = rolePermissions[role] ?? [];

  return permissions.some((perm) => matchPermission(required, perm));
}
