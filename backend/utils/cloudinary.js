import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadToCloudinary = async (file, folder) => {
  try {
    // If file has a path (disk storage), use path
    if (file.path) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        resource_type: 'auto'
      });
      return result.secure_url;
    }
    
    // If file is in memory (buffer), upload buffer
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(file.buffer);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export default cloudinary;
