import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RolePermissions } from './types';
import { resolveInheritedRoles } from './resolveInheritedRoles';

export function loadRolesFromFile(relativePath: string): RolePermissions {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const absolutePath = path.resolve(__dirname, relativePath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Roles file not found at ${absolutePath}`);
  }

  const fileContent = fs.readFileSync(absolutePath, 'utf-8');
  const parsed = JSON.parse(fileContent);

  return resolveInheritedRoles(parsed);
}
