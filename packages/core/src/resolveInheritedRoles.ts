import { PermissionKey, RolePermissions } from "./types";

type RoleInput = string[] | { permissions: string[]; extends?: string[] };

type RawRolePermissions = Record<string, RoleInput>;

export function resolveInheritedRoles(
  input: RawRolePermissions
): RolePermissions {
  const resolved: RolePermissions = {};

  const visit = (role: string, stack: string[] = []): PermissionKey[] => {
    if (stack.includes(role)) {
      throw new Error(
        `Circular role inheritance: ${[...stack, role].join(" -> ")}`
      );
    }

    const def = input[role];
    if (!def) return [];

    const basePermissions: string[] = Array.isArray(def)
      ? def
      : def.permissions || [];

    const inheritedRoles: string[] =
      !Array.isArray(def) && def.extends ? def.extends : [];

    const inheritedPerms: string[] = inheritedRoles.flatMap((r) =>
      visit(r, [...stack, role])
    );

    return [
      ...new Set([...basePermissions, ...inheritedPerms]),
    ] as PermissionKey[];
  };

  for (const role in input) {
    resolved[role] = visit(role);
  }

  return resolved;
}
