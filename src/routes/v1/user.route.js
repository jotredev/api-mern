import express from 'express';
import { UserController } from '../../controllers/user.controller.js';

export const userRoutes = express.Router();

// Create user
userRoutes.post('/', UserController.createUser);
// Obtener usuarios
userRoutes.get('/', UserController.getAllUsers);
// Obtner usuario por ID
userRoutes.get('/:id', UserController.getUserById);
// Editar usuario
userRoutes.put('/:id', UserController.updateUser);
// Eliminar usuario
userRoutes.delete('/:id', UserController.deleteUser);
