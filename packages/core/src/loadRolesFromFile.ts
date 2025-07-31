import fs from 'fs';
import path from 'path';
import { RolePermissions } from './types';
import { resolveInheritedRoles } from './resolveInheritedRoles';

export function loadRolesFromFile(relativePath: string): RolePermissions {
  const absolutePath = path.resolve(process.cwd(), relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Roles file not found at ${absolutePath}`);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = JSON.parse(fileContent);

  return resolveInheritedRoles(parsed);
}
