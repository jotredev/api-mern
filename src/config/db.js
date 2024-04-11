import mongoose from 'mongoose';
import { exit } from 'node:process';

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Conexión exitosa a la base de datos');
  } catch (error) {
    console.log(error);
    console.log('Error al conectar a la base de datos');
    exit(1);
  }
};
