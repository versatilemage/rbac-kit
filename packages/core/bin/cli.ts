#!/usr/bin/env node

import { Command } from 'commander';
import { loadRolesFromFile } from '../src/loadRolesFromFile';
import { PermissionKey } from '../src/types';

import { resolveInheritedRoles } from '../src/resolveInheritedRoles';
import { matchPermission } from '../src/matchPermission';

const program = new Command();

program
    .name('rbac')
    .description('RBAC CLI utilities')
    .version('0.1.0');

program
    .command('validate')
    .description('Validate roles.json for circular refs and malformed permissions')
    .action(() => {
        try {
            const roles = loadRolesFromFile('roles.json');

            let valid = true;

            Object.entries(roles).forEach(([role, perms]) => {
                perms.forEach(p => {
                    if (!/^[^:]+:[^:]+(?::[^:]+)?$/.test(p)) {
                        console.warn(`⚠️  Role "${role}" has malformed permission: "${p}"`);
                        valid = false;
                    }
                });
            });

            if (valid) {
                console.log('✅ roles.json is valid');
            } else {
                console.error('❌ roles.json has issues');
                process.exit(1);
            }
        } catch (e) {
            console.error('❌ Error loading roles.json:', e instanceof Error ? e.message : e);
            process.exit(1);
        }
    });

program
    .command('who-can')
    .argument('<permission>', 'Permission to check (e.g., edit:job:title)')
    .description('List roles that have the specified permission')
    .action((permission: PermissionKey) => {
        try {
            const roles = loadRolesFromFile('roles.json');
            const resolvedRoles = resolveInheritedRoles(roles);
            const allKnownPermissions = new Set<PermissionKey>(
                Object.values(resolvedRoles).flat().filter(p => !p.includes('*'))
            );

            if (!Array.from(allKnownPermissions).some(p => matchPermission(permission, p))) {
                console.log(`❌ "${permission}" is not a valid permission`);
                process.exit(1);
            }
            const matchingRoles = Object.entries(resolvedRoles)
                .filter(([_, perms]) => perms.some(p => matchPermission(permission, p)))
                .map(([role]) => role);

            if (matchingRoles.length > 0) {
                console.log(`✅ Roles with "${permission}":`);
                matchingRoles.forEach(r => console.log(`- ${r}`));
            } else {
                console.log(`🔒 No role has permission "${permission}"`);
            }
        } catch (e) {
            console.error('❌ Error checking permission:', e instanceof Error ? e.message : e);
        }
    });

program.parse(process.argv);
