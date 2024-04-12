import express from 'express';
import { UserController } from '../../controllers/user.controller.js';
import { checkAuth } from '../../middlewares/checkAuth.middleware.js';

export const userRoutes = express.Router();

// Create user
userRoutes.post('/', UserController.createUser);
// Obtener usuarios
userRoutes.get('/', checkAuth, UserController.getAllUsers);
// Obtner usuario por ID
userRoutes.get('/:id', UserController.getUserById);
// Editar usuario
userRoutes.put('/:id', checkAuth, UserController.updateUser);
// Eliminar usuario
userRoutes.delete('/:id', checkAuth, UserController.deleteUser);
// Confirmar cuenta
userRoutes.post('/confirm-account', UserController.confirmAccount);
// Login
userRoutes.post('/login', UserController.login);
// Recuperamos el usaurio de la sesión
userRoutes.get('/session/session-user', checkAuth, UserController.getMe);
