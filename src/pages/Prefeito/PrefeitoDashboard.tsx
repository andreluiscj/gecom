
import React from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Users, FileText, TrendingUp } from 'lucide-react';

const PrefeitoDashboard = () => {
  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="font-semibold">Gestão Municipal</h3>
            <p className="text-sm text-muted-foreground">Visualize dados do seu município</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="font-semibold">Gerenciamento de Equipe</h3>
            <p className="text-sm text-muted-foreground">Acesse informações dos servidores</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <FileText className="h-8 w-8 text-purple-500" />
          <div>
            <h3 className="font-semibold">Pedidos de Compra</h3>
            <p className="text-sm text-muted-foreground">Acompanhe as solicitações</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <TrendingUp className="h-8 w-8 text-orange-500" />
          <div>
            <h3 className="font-semibold">Indicadores</h3>
            <p className="text-sm text-muted-foreground">Analise métricas importantes</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrefeitoDashboard;
