
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const VisualizarPedido: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Visualização do Pedido</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ID do Pedido: {id}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Esta página será implementada para mostrar os detalhes completos do pedido.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisualizarPedido;
