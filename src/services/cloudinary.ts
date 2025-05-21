
/**
 * Service pour gérer les uploads vers Cloudinary
 * IMPORTANT: N'utilisez pas ces clés directement dans le frontend.
 * Idéalement, les uploads devraient passer par une fonction edge Supabase.
 */

// Constantes de configuration de Cloudinary
const CLOUDINARY_CLOUD_NAME = 'bradflow';
const CLOUDINARY_UPLOAD_PRESET = 'bradflow_unsigned';

/**
 * Upload un fichier vers Cloudinary de façon sécurisée via le frontend
 * en utilisant un preset upload non signé (doit être configuré dans le Dashboard Cloudinary)
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Upload failed: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

/**
 * Transforme une URL Cloudinary pour appliquer des transformations
 * @param url URL de l'image Cloudinary
 * @param options Options de transformation
 * @returns L'URL transformée
 */
export const transformCloudinaryUrl = (
  url: string, 
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: number;
    format?: string;
  }
): string => {
  if (!url || !url.includes('cloudinary.com')) {
    return url;
  }

  // Extraire les composants de l'URL
  const urlParts = url.split('/upload/');
  if (urlParts.length !== 2) {
    return url;
  }

  // Construire la chaîne de transformation
  const transformations = [];
  
  if (options.crop && (options.width || options.height)) {
    transformations.push(`c_${options.crop}`);
  }
  
  if (options.width) {
    transformations.push(`w_${options.width}`);
  }
  
  if (options.height) {
    transformations.push(`h_${options.height}`);
  }
  
  if (options.quality) {
    transformations.push(`q_${options.quality}`);
  }
  
  if (options.format) {
    transformations.push(`f_${options.format}`);
  }
  
  if (transformations.length === 0) {
    return url;
  }
  
  // Assembler l'URL transformée
  return `${urlParts[0]}/upload/${transformations.join(',')}/v1/${urlParts[1]}`;
};
