import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { corsConfig } from './config/cors.config.js';
import { userRoutes } from './routes/v1/user.route.js';
import { connectDB } from './config/db.js';

dotenv.config();
const app = express();

// Cors
app.use(cors(corsConfig));

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
