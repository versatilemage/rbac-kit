# rbac-kit

A lightweight and extensible Role-Based Access Control (RBAC) toolkit made with ❤️ for a smooth developer experience. Designed for Node.js applications with both CLI and core library support.

## 📦 Installation

Install as a local dependency:

```bash
pnpm add rbac-kit
```

## 🛠️ CLI Usage

Check which roles have access to a specific permission:

```bash
rbac who-can create:job
```

Use a custom roles config file:

```bash
rbac who-can create:job --config ./my-roles.json
```

**Example output:**

```
✅ Roles with "create:job":
- recruiter
```

## 🧱 Project Structure

* `core/` — Core logic for role resolution and permission checks
* `cli/` — CLI implementation using Commander.js

## ✨ Features

* ✅ Static role/permission mapping via JSON file
* ✅ Role inheritance with multiple levels
* ✅ Wildcard permission support (e.g., `read:*` or `*:*`)
* ✅ CLI for interactive permission checks
* ✅ Configurable JSON file path via `--config` flag
* ✅ Middleware-ready Express integration
* ✅ Dev-friendly hot-reloading of `roles.json` in development

## 🚀 Sample Usage in Node.js (Express)

```ts
// app.ts
import express from 'express';
import { requirePermission } from 'rbac-kit';
import { loadRolesFromFile } from 'rbac-kit/utils';
import chokidar from 'chokidar';

const app = express();
app.use(express.json());

let roles = loadRolesFromFile('./roles.json');

if (process.env.NODE_ENV !== 'production') {
  chokidar.watch('./roles.json').on('change', () => {
    roles = loadRolesFromFile('./roles.json');
    console.log('Roles updated from file');
  });
}

app.get(
  '/jobs',
  requirePermission({
    rolePermissions: () => roles,
    getUserRole: (req) => req.headers['x-role']?.toString() ?? 'guest',
    action: 'edit',
    resource: 'job',
    feature: 'title'
  }),
  (req, res) => {
    res.send('You are allowed to edit job title.');
  }
);

app.listen(3000, () => console.log('Server running on port 3000'));
```

## 📁 Using Static `roles.json` for Role Configuration

The simplest way to get started is by using a static `roles.json` file in your project. This file defines your roles and their permissions in a clear, centralized format.

**Example `roles.json`:**

```json
{
  "recruiter": ["create:job", "read:job", "edit:job:title"],
  "admin": ["*:*"],
  "intern": ["read:job"]
}
```

## 🧪 Test Role Access via Headers

During development, you can simulate roles using headers:

```http
GET /jobs
x-role: recruiter
```

This works well with the `getUserRole` function in the middleware config and allows for dynamic permission checks using real HTTP requests.

## 🔧 Advanced: Role Resolution & Middleware Flexibility

The `requirePermission` middleware allows full customization:

* `getUserRole`: extracts the user role from request
* `rolePermissions`: dynamic or static role/permission config
* `action`, `resource`, `feature`: define the permission string checked (e.g., `edit:job:title`)

You can use a function-based loader for `rolePermissions` to dynamically reload roles or integrate with a DB/cache layer.

## 👨‍💻 Author

Made by **Mohammed Syed Awadh** — built with love to enhance developer productivity.

## 📘 License

MIT License
