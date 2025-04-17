
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

interface PedidoObservacoesProps {
  observacoes: string;
}

const PedidoObservacoes: React.FC<PedidoObservacoesProps> = ({ observacoes }) => {
  if (!observacoes || observacoes.trim() === '') {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Sem observações registradas</p>
      </div>
    );
  }

  // Split by double newlines to create paragraphs
  const paragraphs = observacoes.split('\n\n');

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <Card key={index} className="p-4 bg-muted/30">
          <p className="whitespace-pre-wrap">{paragraph}</p>
        </Card>
      ))}
    </div>
  );
};

export default PedidoObservacoes;
