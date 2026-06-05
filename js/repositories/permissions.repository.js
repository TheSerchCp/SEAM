import { ApiClient } from '../core/ApiClient.js';

export const getAllPermissions    = ()                         => ApiClient.get('/permission');
export const getPermissionsByRole = (roleId)                   => ApiClient.get(`/permission/getByRoleId?roleId=${roleId}`).then(r => r.map(p => ({ ...p, permissionId: p.idPermission })));
export const createPermission     = (data)                     => ApiClient.post('/permission/register', data);
export const removePermission     = (id)                       => ApiClient.delete(`/permission/${id}`);
export const assignToRole         = (roleId, permissionId)     => ApiClient.post('/permission/assign', { roleId, permissionId });
export const removeFromRole       = (roleId, permissionId)     => ApiClient.delete('/permission/unassign', { roleId, permissionId });
