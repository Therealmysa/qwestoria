
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UploadCloud, Loader2, CheckCircle, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FileUploadProps {
  onUploadComplete?: (url: string) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  buttonText?: string;
  secureUpload?: boolean;
}

export function FileUpload({
  onUploadComplete,
  onUploadError,
  accept = "image/*",
  maxSizeMB = 5,
  className,
  buttonText = "Upload file",
  secureUpload = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Vérifier la taille du fichier
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast.error(`Fichier trop volumineux (max ${maxSizeMB}MB)`);
      return;
    }
    
    try {
      setIsUploading(true);
      setUploadStatus("idle");
      setProgress(10);
      
      // Générer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `temp/${fileName}`;
      
      setProgress(30);
      
      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('temp')
        .upload(filePath, file);
      
      if (error) throw error;
      
      setProgress(70);
      
      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('temp')
        .getPublicUrl(filePath);
      
      setProgress(100);
      setUploadStatus("success");
      
      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
      
      toast.success("Fichier uploadé avec succès");
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("error");
      
      if (onUploadError) {
        onUploadError(error as Error);
      }
      
      toast.error("Erreur lors de l'upload du fichier");
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label className="relative flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-400 p-6 transition-all hover:border-gray-300 hover:bg-gray-800/10">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          {isUploading ? (
            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
          ) : uploadStatus === "success" ? (
            <CheckCircle className="h-10 w-10 text-green-500" />
          ) : uploadStatus === "error" ? (
            <XCircle className="h-10 w-10 text-red-500" />
          ) : (
            <UploadCloud className="h-10 w-10 text-gray-400" />
          )}
          
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-300">
              {isUploading 
                ? "Uploading..." 
                : uploadStatus === "success"
                ? "Upload completed"
                : uploadStatus === "error"
                ? "Upload failed"
                : "Drag & drop or click to upload"}
            </span>
            <span className="text-xs text-gray-400">
              {`Max ${maxSizeMB}MB. ${accept.replace("*", "all")}`}
            </span>
          </div>
        </div>
        
        {isUploading && (
          <div className="absolute bottom-2 left-2 right-2 h-1.5 overflow-hidden rounded-full bg-gray-700">
            <div
              className="h-full bg-[#9b87f5] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <Input
          type="file"
          className="sr-only"
          accept={accept}
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
      
      <Button
        type="button"
        variant="outline"
        className="mt-2"
        disabled={isUploading}
        onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </div>
  );
}
