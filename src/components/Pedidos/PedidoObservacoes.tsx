
import React from 'react';

interface PedidoObservacoesProps {
  observacoes: string;
}

const PedidoObservacoes: React.FC<PedidoObservacoesProps> = ({ observacoes }) => {
  if (!observacoes || observacoes.trim() === '') {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-muted-foreground">Nenhuma observação registrada</p>
      </div>
    );
  }

  // Split by newlines and render each paragraph
  const paragraphs = observacoes.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <div key={index} className="p-4 bg-gray-50 rounded-lg">
          <p className="whitespace-pre-wrap">{paragraph}</p>
        </div>
      ))}
    </div>
  );
};

export default PedidoObservacoes;
