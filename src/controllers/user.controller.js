import { Types } from 'mongoose';
import User from '../models/user.model.js';
import { checkPassword, hashPassword } from '../utils/user.util.js';
import { validateEmail } from '../validators/email.validator.js';
import Token from '../models/token.model.js';
import { generateJWT, generateToken } from '../utils/token.util.js';
import { UserEmail } from '../emails/user.email.js';

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

      // Generamos token de 6 digitos
      const token = new Token({
        token: generateToken(),
        user: user._id,
      });

      // Guardar en la base datos el usuario y el token
      await Promise.allSettled([user.save(), token.save()]);

      // Enviamos el email de confirmación
      UserEmail.confirmAccount({
        name: user.name,
        email: user.email,
        token: token.token,
      });

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

  static confirmAccount = async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) {
        return res
          .status(409)
          .json({ response: 'error', message: 'El token es obligatorio' });
      }

      const tokenExists = await Token.findOne({ token });

      if (!tokenExists) {
        return res
          .status(409)
          .json({ response: 'error', message: 'Token no válido' });
      }

      // Buscamos el usuario y cambios el isConfirmed
      const user = await User.findById(tokenExists.user);
      user.isConfirmed = true;

      // Guardamos los cambios y eliminamos el token
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);

      res
        .status(200)
        .json({ response: 'success', message: 'Cuanta confirmada' });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };

  static login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(409).json({
          response: 'error',
          message: 'El email y el password son obligatorios',
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({ response: 'error', message: 'Usuario no encontrado' });
      }

      if (!user.isActive) {
        return res.status(401).json({
          response: 'error',
          message: 'Tu cuenta esta inactiva, contacta un administrador',
        });
      }

      if (!user.isConfirmed) {
        // Generamos un token nuevo
        const token = new Token({
          token: generateToken(),
          user: user._id,
        });

        await token.save();

        // Enviamos el correo con el token
        UserEmail.confirmAccount({
          name: user.name,
          email: user.email,
          token: token.token,
        });

        return res.status(401).json({
          response: 'error',
          message:
            'Tu cuenta no ha sido confirmada, pero hemos enviado un nuevo token',
        });
      }

      // Verificamos si el password coincide
      const isPasswordCorrect = await checkPassword(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(401).json({
          response: 'error',
          message: 'Password incorrecto',
        });
      }

      // Traemos el usaurio autenticado sin password
      const userAutenticated = await User.findOne({ email }).select(
        '-password'
      );

      // const x = { ...user };
      // delete x.password;
      // console.log(x);

      const token = generateJWT(user._id);
      res
        .status(200)
        .json({ response: 'success', user: userAutenticated, token });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ response: 'error', message: 'Error del servidor' });
    }
  };

  static getMe = async (req, res) => {
    const { user } = req;
    res.status(200).json(user);
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
