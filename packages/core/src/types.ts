export type PermissionKey =
  | `${string}:${string}`
  | `${string}:${string}:${string}`;

export type RolePermissions = Record<string, PermissionKey[]>;

export type Action = string;
export type Resource = string;
export type Feature = string | undefined;
