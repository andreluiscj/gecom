
import React from 'react';
import { FileIcon, Download, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Attachment } from '@/types';

interface PedidoAttachmentsProps {
  attachments: Attachment[];
}

const PedidoAttachments: React.FC<PedidoAttachmentsProps> = ({ attachments = [] }) => {
  if (!attachments || attachments.length === 0) {
    return (
      <div className="text-center py-8">
        <FileIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Nenhum anexo encontrado</p>
      </div>
    );
  }

  const handleDownload = (url: string, fileName: string) => {
    // In a real app, this would download the file from the URL
    console.log(`Downloading ${fileName} from ${url}`);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="space-y-4">
      {attachments.map((attachment) => (
        <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-md">
          <div className="flex items-center space-x-3">
            <div className="bg-gray-100 p-2 rounded-md">
              <File className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium">{attachment.name}</p>
              <p className="text-xs text-muted-foreground">
                {attachment.type} • {formatFileSize(attachment.size)}
                {attachment.createdAt && ` • Adicionado em ${format(attachment.createdAt, 'dd/MM/yyyy')}`}
              </p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => handleDownload(attachment.url || '#', attachment.name)}
            disabled={!attachment.url}
          >
            <Download className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};

export default PedidoAttachments;
