import express from 'express';
import { defineRoles, requirePermission } from 'rbac-kit';

const app = express();
app.use(express.json());

const roles = defineRoles({
  admin: ['*:*:*'],
  recruiter: ['create:job', 'edit:job:title'],
  applicant: ['create:application']
});

const getUserRole = (req: express.Request) => {
  // For demo purposes; normally you'd extract this from JWT/session
  return req.headers['x-role'] as string || 'guest';
};

app.get(
  '/jobs',
  requirePermission({
    rolePermissions: roles,
    getUserRole,
    action: 'edit',
    resource: 'job',
    feature: 'title'
  }),
  (req, res) => {
    res.send('You are allowed to edit job title.');
  }
);

app.listen(3000, () => {
  console.log('✅ Server running on http://localhost:3000');
});
