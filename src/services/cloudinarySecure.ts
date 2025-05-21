
/**
 * Service pour les uploads sécurisés vers Cloudinary via Supabase Edge Functions
 * Cette approche est plus sécurisée car elle ne révèle pas les clés API dans le frontend
 */
import { supabase } from "@/integrations/supabase/client";

/**
 * Upload un fichier vers Cloudinary de façon sécurisée
 * en passant par une Edge Function Supabase
 */
export const secureUploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Créer une URL temporaire pour le fichier
    const fileBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer]);
    
    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Upload temporaire vers Supabase Storage (créer un bucket 'temp' si nécessaire)
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('temp')
      .upload(`temp/${fileName}`, fileBlob);
    
    if (uploadError) {
      console.error('Error uploading to Supabase Storage:', uploadError);
      throw uploadError;
    }
    
    // Obtenir une URL publique pour le fichier temporaire
    const { data: { publicUrl } } = supabase.storage
      .from('temp')
      .getPublicUrl(`temp/${fileName}`);
    
    // Envoyer l'URL à l'Edge Function pour l'upload vers Cloudinary
    const { data, error } = await supabase.functions.invoke('cloudinary-upload', {
      body: {
        fileUrl: publicUrl,
        fileName: file.name
      }
    });
    
    if (error) {
      console.error('Error in Edge Function:', error);
      throw error;
    }
    
    // Nettoyer le fichier temporaire
    await supabase.storage
      .from('temp')
      .remove([`temp/${fileName}`]);
      
    return data.secure_url;
  } catch (error) {
    console.error('Error in secure upload process:', error);
    throw error;
  }
};
