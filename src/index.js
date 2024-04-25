import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import { corsConfig } from "./config/cors.config.js";
import { userRoutes } from "./routes/v1/user.route.js";
import { ticketRoutes } from "./routes/v1/ticket.route.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();

// Cors
app.use(cors(corsConfig));

// Database
connectDB();

// Json
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./src/uploads",
  })
);

// Routing
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/tickets", ticketRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto: ${PORT}`);
});
