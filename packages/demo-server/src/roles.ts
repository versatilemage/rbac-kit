import chokidar from 'chokidar';
import { loadRolesFromFile } from 'rbac-kit';
import path from 'path';

let rolePermissions = loadRolesFromFile('roles.json');

if (process.env.NODE_ENV !== 'production') {
  const watcher = chokidar.watch(path.resolve(process.cwd(), 'roles.json'), {
    ignoreInitial: true
  });

  watcher.on('change', () => {
    try {
      rolePermissions = loadRolesFromFile('roles.json');
      console.log('♻️  Reloaded roles.json');
    } catch (e) {
      if (e instanceof Error) {
        console.error('❌ Failed to reload roles.json:', e.message);
      } else {
        console.error('❌ Failed to reload roles.json:', e);
      }
    }
  });
}

export function getRolePermissions() {
  return rolePermissions;
}
