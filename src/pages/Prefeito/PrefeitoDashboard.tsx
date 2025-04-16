
import React from 'react';
import { Card } from '@/components/ui/card';
import { Building2, Users, FileText, TrendingUp, ShieldAlert, Wallet, BriefcaseBusiness, CalendarCheck, UserPlus } from 'lucide-react';
import { getUserRole } from '@/utils/authHelpers';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PrefeitoDashboard = () => {
  const userRole = getUserRole();
  const isPrefeito = userRole === 'prefeito';
  const navigate = useNavigate();

  return (
    <div className="grid gap-6">
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Building2 className="h-8 w-8 text-blue-500" />
          <div>
            <h3 className="font-semibold text-xl">Área do Prefeito</h3>
            <p className="text-sm text-muted-foreground">Gestão municipal e acesso rápido</p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Button 
            variant="outline"
            className="flex items-center gap-2 h-auto p-4 justify-start"
            onClick={() => navigate('/gerenciamento/funcionarios')}
          >
            <Users className="h-5 w-5 text-blue-500" />
            <div className="text-left">
              <div className="font-medium">Gerenciar Servidores</div>
              <div className="text-sm text-muted-foreground">Administrar funcionários</div>
            </div>
          </Button>
          <Button 
            variant="outline"
            className="flex items-center gap-2 h-auto p-4 justify-start"
            onClick={() => navigate('/admin/gerentes')}
          >
            <UserPlus className="h-5 w-5 text-blue-500" />
            <div className="text-left">
              <div className="font-medium">Cadastro de Gestor</div>
              <div className="text-sm text-muted-foreground">Gerenciar gestores de setores</div>
            </div>
          </Button>
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
              <p className="mt-2 font-semibold">R$ 1.250.000,00</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <BriefcaseBusiness className="h-6 w-6 text-blue-600 mb-2" />
              <h4 className="font-medium">Projetos Estratégicos</h4>
              <p className="text-sm text-muted-foreground">Iniciativas em desenvolvimento</p>
              <p className="mt-2 font-semibold">3 projetos em andamento</p>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Users className="h-8 w-8 text-green-500" />
          <div>
            <h3 className="font-semibold">Gabinete</h3>
            <p className="text-sm text-muted-foreground">Sua equipe de confiança</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <div>
              <h4 className="font-medium">Daniela Ribeiro</h4>
              <p className="text-sm text-muted-foreground">Chefe de Gabinete</p>
            </div>
            <div className="text-sm text-green-600">Online</div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium">Carlos Eduardo</h4>
              <p className="text-sm text-muted-foreground">Assessor Jurídico</p>
            </div>
            <div className="text-sm text-slate-600">Ocupado</div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
            <div>
              <h4 className="font-medium">Mariana Costa</h4>
              <p className="text-sm text-muted-foreground">Secretária Executiva</p>
            </div>
            <div className="text-sm text-slate-600">Disponível</div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <CalendarCheck className="h-8 w-8 text-purple-500" />
          <div>
            <h3 className="font-semibold">Agenda Executiva</h3>
            <p className="text-sm text-muted-foreground">Compromissos importantes</p>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div className="p-3 border border-purple-200 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Hoje, 14:00</div>
            <h4 className="font-medium mt-1">Reunião com Secretários</h4>
            <p className="text-sm text-muted-foreground">Sala de Reuniões - Prefeitura</p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">Amanhã, 09:30</div>
            <h4 className="font-medium mt-1">Visita à Escola Municipal</h4>
            <p className="text-sm text-muted-foreground">E.M. Paulo Freire</p>
          </div>
          
          <div className="p-3 border border-gray-200 rounded-lg">
            <div className="text-sm text-gray-600 font-medium">18/04, 11:00</div>
            <h4 className="font-medium mt-1">Inauguração Posto de Saúde</h4>
            <p className="text-sm text-muted-foreground">Bairro Nova Esperança</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PrefeitoDashboard;
