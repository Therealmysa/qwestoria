
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface MissionProofUploadProps {
  onUploadSuccess: (fileUrl: string) => void;
  onUploadError: (error: string) => void;
  disabled?: boolean;
}

const MissionProofUpload = ({ onUploadSuccess, onUploadError, disabled = false }: MissionProofUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  console.log('MissionProofUpload - selectedFile:', selectedFile);
  console.log('MissionProofUpload - isUploading:', isUploading);

  const validateFile = (file: File): string | null => {
    console.log('Validating file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    // Vérifier la taille (100 MB max)
    const maxSize = 100 * 1024 * 1024; // 100 MB
    if (file.size > maxSize) {
      return "Le fichier ne doit pas dépasser 100 MB.";
    }

    // Types de fichiers autorisés
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return "Type de fichier non supporté. Utilisez une image, PDF, document Word ou vidéo.";
    }

    return null;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file);
    
    if (file) {
      const error = validateFile(file);
      if (error) {
        console.error('File validation error:', error);
        toast.error(error);
        setUploadError(error);
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
      setUploadedFileUrl(null);
      console.log('File validated and set:', file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Veuillez sélectionner un fichier.");
      return;
    }

    console.log('Starting upload for file:', selectedFile.name);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    setUploadedFileUrl(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      console.log('Uploading to https://qwestoria.com/upload.php');

      const response = await fetch('https://qwestoria.com/upload.php', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      // Simuler la progression (puisque fetch ne donne pas la progression réelle)
      setUploadProgress(100);

      // Construire l'URL du fichier côté client
      const fileName = encodeURIComponent(selectedFile.name).replace(/\+/g, '%20');
      const fileUrl = `https://qwestoria.com/uploads/${fileName}`;

      console.log('File uploaded successfully, URL:', fileUrl);
      setUploadedFileUrl(fileUrl);
      toast.success("Fichier uploadé avec succès !");
      onUploadSuccess(fileUrl);

    } catch (error) {
      console.error('Upload failed:', error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'upload";
      setUploadError(errorMessage);
      toast.error(errorMessage);
      onUploadError(errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setUploadedFileUrl(null);
    setUploadError(null);
    setUploadProgress(0);
    // Réinitialiser l'input file
    const fileInput = document.getElementById('proof-file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="proof-file">Fichier de preuve *</Label>
        <Input
          id="proof-file"
          type="file"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          className="dark:bg-amber-900/20 bg-amber-50/70 backdrop-blur-sm border-amber-200 dark:border-amber-500/30"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Images, PDF, documents Word ou vidéos (max 100MB)
        </p>
      </div>

      {selectedFile && !uploadedFileUrl && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-500/30">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Fichier sélectionné: {selectedFile.name} ({Math.round(selectedFile.size / 1024 / 1024 * 100) / 100} MB)
          </p>
        </div>
      )}

      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-600"></div>
            <span className="text-sm text-gray-600 dark:text-gray-300">Upload en cours...</span>
          </div>
          <Progress value={uploadProgress} className="w-full" />
        </div>
      )}

      {uploadedFileUrl && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <p className="text-sm text-green-700 dark:text-green-300 font-medium">
              Fichier uploadé avec succès !
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a 
              href={uploadedFileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <ExternalLink className="h-3 w-3" />
              Voir le fichier
            </a>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetUpload}
              className="ml-auto"
            >
              Changer de fichier
            </Button>
          </div>
        </div>
      )}

      {uploadError && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-500/30">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-700 dark:text-red-300">
              {uploadError}
            </p>
          </div>
        </div>
      )}

      <Button 
        onClick={handleUpload}
        disabled={disabled || !selectedFile || isUploading || !!uploadedFileUrl}
        className="w-full dark:bg-amber-700/50 dark:hover:bg-amber-700/70 bg-amber-100/70 hover:bg-amber-200/90 backdrop-blur-sm border-amber-300 dark:border-amber-500/30 text-amber-700 dark:text-amber-300"
      >
        {isUploading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            Upload en cours...
          </div>
        ) : (
          <>
            <Upload className="h-4 w-4 mr-2" />
            Envoyer ma mission
          </>
        )}
      </Button>
    </div>
  );
};

export default MissionProofUpload;
