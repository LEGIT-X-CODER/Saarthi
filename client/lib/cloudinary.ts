import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
});

// Upload image to Cloudinary (general purpose)
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // Using existing ml_default preset from Cloudinary dashboard
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};

// Upload profile picture with optimized settings
export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'profile_pictures'); // Optimized for profile pictures
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading profile picture to Cloudinary:', error);
    throw error;
  }
};

// Upload incident/banner images with unique filenames
export const uploadIncidentImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'banner_images'); // Optimized for incident reports
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading incident image to Cloudinary:', error);
    throw error;
  }
};

// Delete image from Cloudinary
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
};

// Transform image URL with Cloudinary transformations
export const transformImage = (
  url: string,
  transformations: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  }
): string => {
  const baseUrl = url.split('/upload/')[0];
  const imagePath = url.split('/upload/')[1];
  
  const transformArray = [];
  
  if (transformations.width) transformArray.push(`w_${transformations.width}`);
  if (transformations.height) transformArray.push(`h_${transformations.height}`);
  if (transformations.crop) transformArray.push(`c_${transformations.crop}`);
  if (transformations.quality) transformArray.push(`q_${transformations.quality}`);
  if (transformations.format) transformArray.push(`f_${transformations.format}`);
  
  const transformString = transformArray.join(',');
  
  return `${baseUrl}/upload/${transformString}/${imagePath}`;
};

export default cloudinary;