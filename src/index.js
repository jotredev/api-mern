import express from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './routes/v1/user.route.js';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();

// Database
connectDB();

// Json
app.use(express.json());

// Routing
app.use('/api/v1/users', userRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
