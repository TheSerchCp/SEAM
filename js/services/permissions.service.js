import * as PermRepo from '../repositories/permissions.repository.js';

export const getAllPermissions        = ()                         => PermRepo.getAllPermissions();
export const getPermissionsByRole     = (roleId)                   => PermRepo.getPermissionsByRole(roleId);
export const createPermission         = (data)                     => PermRepo.createPermission(data);
export const removePermission         = (id)                       => PermRepo.removePermission(id);
export const assignPermissionToRole   = (roleId, permissionId)     => PermRepo.assignToRole(roleId, permissionId);
export const removePermissionFromRole = (roleId, permissionId)     => PermRepo.removeFromRole(roleId, permissionId);
