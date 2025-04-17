import React, { useState } from 'react';
import { FileUp, FileText, Download, Trash2, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Attachment {
  id: string;
  name: string;
  type?: string;
  size?: number;
  url?: string;
}

interface PedidoAttachmentsProps {
  attachments: Attachment[];
  dfdId?: string;
  canUpload?: boolean;
  onAttachmentAdded?: () => void;
}

const PedidoAttachments: React.FC<PedidoAttachmentsProps> = ({
  attachments,
  dfdId,
  canUpload = false,
  onAttachmentAdded
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) return;
    if (!dfdId) {
      toast.error('Não é possível anexar arquivos sem um ID de pedido');
      return;
    }

    const file = e.target.files[0];
    setUploading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${dfdId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('anexos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Create anexo record
      const { data: anexoData, error: anexoError } = await supabase
        .from('anexos')
        .insert({
          nome: file.name,
          caminho: filePath,
          tipo: file.type,
          tamanho: file.size
        })
        .select()
        .single();

      if (anexoError) throw anexoError;

      // Create dfd_anexo record
      const { error: dfdAnexoError } = await supabase
        .from('dfd_anexos')
        .insert({
          dfd_id: dfdId,
          anexo_id: anexoData.id
        });

      if (dfdAnexoError) throw dfdAnexoError;

      toast.success('Arquivo anexado com sucesso');
      if (onAttachmentAdded) onAttachmentAdded();
    } catch (error) {
      console.error('Error uploading attachment:', error);
      toast.error('Erro ao anexar arquivo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const getIconForFileType = (type?: string) => {
    if (!type) return <File className="h-5 w-5" />;
    if (type.startsWith('image/')) return <FileText className="h-5 w-5" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <File className="h-5 w-5" />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Tamanho desconhecido';
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDownload = async (attachment: Attachment) => {
    try {
      if (!attachment.url && !attachment.id) {
        toast.error('URL do anexo não disponível');
        return;
      }

      // If we have a URL, use it directly
      if (attachment.url) {
        window.open(attachment.url, '_blank');
        return;
      }

      // Otherwise, get the file path from database and create a download URL
      const { data: anexoData, error: anexoError } = await supabase
        .from('anexos')
        .select('caminho')
        .eq('id', attachment.id)
        .single();

      if (anexoError) throw anexoError;

      const { data, error } = await supabase.storage
        .from('anexos')
        .createSignedUrl(anexoData.caminho, 60);

      if (error) throw error;

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Erro ao baixar arquivo');
    }
  };

  return (
    <div>
      {canUpload && (
        <div className="mb-4">
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="application/pdf,image/*,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
          />

          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <FileUp className="h-4 w-4 mr-2" />
            {uploading ? 'Enviando...' : 'Anexar arquivo'}
          </Button>

          <p className="text-xs text-muted-foreground mt-2">
            Formatos aceitos: PDF, imagens, documentos do Office e texto
          </p>
        </div>
      )}

      {attachments && attachments.length > 0 ? (
        <div className="space-y-2">
          {attachments.map(attachment => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                {getIconForFileType(attachment.type)}
                <div>
                  <p className="font-medium">{attachment.name}</p>
                  {attachment.size && (
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(attachment.size)}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleDownload(attachment)}
                  title="Baixar"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-6 bg-gray-50 rounded-lg">
          <p className="text-muted-foreground">Nenhum anexo encontrado</p>
        </div>
      )}
    </div>
  );
};

export default PedidoAttachments;
