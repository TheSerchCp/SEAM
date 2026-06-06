/**
 * Mapeo de operaciones que afectan a cada página.
 * Usado por listeners de data:changed para determinar si deben actualizar.
 */
export const OPERATION_LISTENERS = {
    users: ['auth:register', 'auth:login', 'users:create', 'users:update', 'users:delete'],
    permissions: ['permissions:create', 'permissions:update', 'permissions:delete', 'permissions:assign', 'permissions:unassign', 'roles:create', 'roles:update', 'roles:delete'],
    roles: ['roles:create', 'roles:update', 'roles:delete'],
    sidebar: ['sidebar:create', 'sidebar:update', 'sidebar:delete'],
};

/**
 * Verifica si una operación debe ser procesada por una página específica
 */
export const shouldUpdatePage = (pageType, operation) => {
    return OPERATION_LISTENERS[pageType]?.includes(operation);
};
