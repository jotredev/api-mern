import { Types } from 'mongoose';
import User from '../models/user.model.js';
import { hashPassword } from '../utils/user.util.js';
import { validateEmail } from '../validators/email.validator.js';

export class UserController {
  static createUser = async (req, res) => {
    try {
      const { name, lastName, email, password } = req.body;

      if (!name || !lastName || !email || !password) {
        return res.status(400).json({
          response: 'error',
          message: 'Todos los datos son obligatorios',
        });
      }

      const userExists = await User.findOne({ email });

      if (userExists) {
        return res
          .status(409)
          .json({ response: 'error', message: 'El usuario ya existe' });
      }

      if (!validateEmail(email)) {
        return res
          .status(409)
          .json({ response: 'error', message: 'Email no valido' });
      }

      if (password.length < 6) {
        return res.status(409).json({
          response: 'error',
          message: 'El password debe contener al menos 6 caracteres',
        });
      }

      const hashedPassword = await hashPassword(password);

      const user = new User({
        name,
        lastName,
        email,
        password: hashedPassword,
      });
      // Guardar en la base datos
      await user.save();

      res.status(202).json({
        response: 'success',
        message: 'Usuario creado',
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };

  static getAllUsers = async (req, res) => {
    try {
      const users = await User.find();

      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };

  static getUserById = async (req, res) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res
          .status(404)
          .json({ response: 'error', message: 'ID no válido' });
      }

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ response: 'error', message: 'Usuario no encontrado' });
      }

      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };

  static updateUser = async (req, res) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res
          .status(404)
          .json({ response: 'error', message: 'ID no válido' });
      }

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ response: 'error', message: 'Usuario no encontrado' });
      }

      const { name, lastName } = req.body;

      user.name = name || user.name;
      user.lastName = lastName || user.lastName;

      //TODO: Validar email al actualizar
      //TODO: Validar que el email no exista
      //TODO: Validar password

      await user.save();

      res
        .status(200)
        .json({ response: 'success', message: 'Usuario actualizado' });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };

  static deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      if (!Types.ObjectId.isValid(id)) {
        return res
          .status(404)
          .json({ response: 'error', message: 'ID no válido' });
      }

      const user = await User.findById(id);

      if (!user) {
        return res
          .status(404)
          .json({ response: 'error', message: 'Usuario no encontrado' });
      }

      await user.deleteOne();

      res
        .status(200)
        .json({ response: 'success', message: 'Usuario eliminado' });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };
}
