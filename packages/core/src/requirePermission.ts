import { Request, Response, NextFunction } from 'express';
import { RolePermissions } from './types';
import { can } from './can';

interface RequirePermissionOptions {
  rolePermissions: RolePermissions;
  getUserRole: (req: Request) => string;
  action: string;
  resource: string;
  feature?: string;
}

export function requirePermission(options: RequirePermissionOptions) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { rolePermissions, getUserRole, action, resource, feature } = options;
    const role = getUserRole(req);

    const isAllowed = can(role, action, resource, feature, rolePermissions);

    if (!isAllowed) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
}
