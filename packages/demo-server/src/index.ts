import express from 'express';
import { requirePermission } from 'rbac-kit';
import { getRolePermissions } from './roles';

const app = express();
app.use(express.json());

// 🔥 Load roles.json from root
// const roles = loadRolesFromFile('roles.json');

const getUserRole = (req: express.Request) => {
  return req.headers['x-role'] as string || 'guest';
};

app.get(
  '/jobs',
  requirePermission({
    rolePermissions: getRolePermissions(),
    getUserRole,
    action: 'edit',
    resource: 'job',
    feature: 'title'
  }),
  (req, res) => {
    res.send('You are allowed to edit job title.');
  }
);

app.get(
  '/logs',
  requirePermission({
    rolePermissions: getRolePermissions(),
    getUserRole,
    action: 'read',
    resource: 'internal',
    feature: 'logs'
  }),
  (req, res) => {
    res.send('You are allowed to read the logs.');
  }
);

app.listen(3000, () => {
  console.log('🚀 Server running on http://localhost:3000');
});
