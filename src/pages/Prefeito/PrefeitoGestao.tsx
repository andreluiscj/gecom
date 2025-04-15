
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, UserCog, Users2, FileText } from 'lucide-react';
import { getUserRole } from '@/utils/authHelpers';
import { useNavigate } from 'react-router-dom';

const PrefeitoGestao = () => {
  const userRole = getUserRole();
  const navigate = useNavigate();
  
  if (userRole !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gerenciamento de Prefeitos</h3>
        <div className="space-y-4">
          <Button className="w-full flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
            <Plus className="h-4 w-4" />
            Cadastrar Novo Prefeito
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Gerenciar Prefeitos Ativos
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            Lista de Ex-Prefeitos
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Relatórios e Documentos
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PrefeitoGestao;
