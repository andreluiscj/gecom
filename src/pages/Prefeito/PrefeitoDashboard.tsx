
import React from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Users, FileText, TrendingUp, ShieldAlert, Wallet, BriefcaseBusiness, CalendarCheck } from 'lucide-react';
import { getUserRole } from '@/utils/authHelpers';

const PrefeitoDashboard = () => {
  const userRole = getUserRole();
  const isPrefeito = userRole === 'prefeito';

  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="font-semibold">Dados do Prefeito</h3>
            <p className="text-sm text-muted-foreground">Informações e acesso rápido</p>
          </div>
        </div>
      </Card>

      {/* Informações exclusivas do prefeito */}
      {isPrefeito && (
        <Card className="p-6 border-2 border-blue-200">
          <div className="flex items-center gap-4 mb-4">
            <ShieldAlert className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold">Informações Confidenciais</h3>
              <p className="text-sm text-muted-foreground">Dados exclusivos para visualização do prefeito</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Wallet className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-medium">Orçamento Secreto</h4>
              <p className="text-sm text-muted-foreground">Verbas especiais e fundos reservados</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <BriefcaseBusiness className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-medium">Projetos Estratégicos</h4>
              <p className="text-sm text-muted-foreground">Iniciativas em desenvolvimento</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="font-semibold">Gabinete</h3>
            <p className="text-sm text-muted-foreground">Sua equipe de confiança</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <CalendarCheck className="h-8 w-8 text-purple-500" />
          <div>
            <h3 className="font-semibold">Agenda Executiva</h3>
            <p className="text-sm text-muted-foreground">Compromissos e reuniões importantes</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrefeitoDashboard;
