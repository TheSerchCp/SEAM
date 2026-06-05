import * as UsersRepo from '../repositories/users.repository.js';

export const getUsers      = ()           => UsersRepo.getAllUsers();
export const getUserById   = (id)         => UsersRepo.getUserById(id);
export const createUser    = (data)       => UsersRepo.createUser(data);
export const updateUser    = (id, data)   => UsersRepo.updateUser(id, data);
export const removeUser    = (id)         => UsersRepo.deleteUserById(id);
