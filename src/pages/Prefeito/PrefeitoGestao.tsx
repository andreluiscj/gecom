
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users2, FileText, UserCheck, History } from 'lucide-react';
import { getUserRole } from '@/utils/authHelpers';
import { useNavigate } from 'react-router-dom';

const PrefeitoGestao = () => {
  const userRole = getUserRole();
  const navigate = useNavigate();
  
  if (userRole !== 'admin') {
    return null;
  }

  const handleGerenciarPrefeitos = () => {
    // Navegar para lista de prefeitos ativos quando implementado
    navigate('/gerenciamento/funcionarios?cargo=prefeito');
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Gerenciamento de Prefeitos</h3>
        <div className="space-y-4">
          <Button 
            onClick={handleGerenciarPrefeitos}
            variant="outline" 
            className="w-full flex items-center gap-2"
          >
            <UserCheck className="h-4 w-4" />
            Gerenciar Prefeitos Ativos
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <History className="h-4 w-4" />
            Lista de Ex-Prefeitos
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <Users2 className="h-4 w-4" />
            Relatório de Mandatos
          </Button>
          <Button variant="outline" className="w-full flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documentos Oficiais
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default PrefeitoGestao;
