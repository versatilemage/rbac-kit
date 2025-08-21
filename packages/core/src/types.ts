export type PermissionKey =
  | `${string}:${string}`
  | `${string}:${string}:${string}`;

export type RolePermissions = Record<string, PermissionKey[]>;

export type RequirePermissionOptions = {
  rolePermissions: RolePermissions;
  getUserRole: (req: Request) => string;
  action: string;
  resource: string;
  feature?: string;
};

export type Action = string;
export type Resource = string;
export type Feature = string | undefined;
