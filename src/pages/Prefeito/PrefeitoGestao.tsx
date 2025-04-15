
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserCog } from 'lucide-react';
import { getUserRole } from '@/utils/authHelpers';

const PrefeitoGestao = () => {
  const userRole = getUserRole();
  
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gerenciamento de Prefeitos</h3>
        <div className="space-y-4">
          <Button className="w-full flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Cadastrar Novo Prefeito
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Gerenciar Prefeitos
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PrefeitoGestao;
