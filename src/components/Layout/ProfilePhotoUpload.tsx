
import React, { useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProfilePhotoUploadProps {
  initials: string;
  onPhotoChange: (photoUrl: string | null) => void;
  currentPhoto?: string | null;
}

export function ProfilePhotoUpload({ initials, onPhotoChange, currentPhoto }: ProfilePhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.includes('image/')) {
      toast.error("Por favor selecione uma imagem válida");
      return;
    }
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("A imagem deve ter no máximo 2MB");
      return;
    }
    
    setIsUploading(true);
    
    // Convert to base64 for storage in localStorage
    // In a real app, this would upload to a server/storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      onPhotoChange(base64String);
      setIsUploading(false);
      toast.success("Imagem de perfil atualizada");
    };
    reader.onerror = () => {
      setIsUploading(false);
      toast.error("Erro ao processar a imagem");
    };
    reader.readAsDataURL(file);
  };
  
  const handleRemovePhoto = () => {
    onPhotoChange(null);
    toast.success("Imagem de perfil removida");
  };
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <div className="h-28 w-28 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-gray-600 text-2xl font-bold dark:bg-gray-700 dark:text-gray-300">
          {currentPhoto ? (
            <img 
              src={currentPhoto} 
              alt="Profile" 
              className="h-full w-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-0 right-0 rounded-full shadow-md"
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={isUploading}
        >
          <Camera className="h-4 w-4" />
        </Button>
      </div>
      
      <input
        type="file"
        id="photo-upload"
        className="hidden"
        accept="image/png, image/jpeg, image/gif"
        onChange={handleFileInput}
        disabled={isUploading}
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
          onClick={() => document.getElementById('photo-upload')?.click()}
          disabled={isUploading}
        >
          <Upload className="h-4 w-4" />
          {isUploading ? 'Carregando...' : 'Alterar foto'}
        </Button>
        
        {currentPhoto && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleRemovePhoto}
            disabled={isUploading}
          >
            Remover
          </Button>
        )}
      </div>
    </div>
  );
}
