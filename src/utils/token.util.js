import jwt from 'jsonwebtoken';

export const generateToken = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const generateJWT = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};
