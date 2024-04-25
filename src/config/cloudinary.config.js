import { v2 as cloudinary } from "cloudinary";

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Subir archvio a cloudinary
export const uploadAvatar = async (file) => {
  return await cloudinary.uploader.upload(file, {
    folder: "curso-mern-stack/avatars",
  });
};

// Eliminar archivo de cloudinary
export const deleteFile = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};
