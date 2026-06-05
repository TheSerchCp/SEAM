import * as RolesRepo from '../repositories/roles.repository.js';

export const getRoles  = () => RolesRepo.getAll();
