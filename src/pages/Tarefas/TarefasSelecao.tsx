
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { HeartPulse, BookOpen, Building2, Bus } from 'lucide-react';

const TarefasSelecao: React.FC = () => {
  const [secretariaSelecionada, setSecretariaSelecionada] = useState('');
  const navigate = useNavigate();

  const secretarias = [
    { value: 'saude', label: 'Saúde', icon: <HeartPulse className="h-5 w-5 text-saude-DEFAULT" /> },
    { value: 'educacao', label: 'Educação', icon: <BookOpen className="h-5 w-5 text-educacao-DEFAULT" /> },
    { value: 'administrativo', label: 'Administrativo', icon: <Building2 className="h-5 w-5 text-administrativo-DEFAULT" /> },
    { value: 'transporte', label: 'Transporte', icon: <Bus className="h-5 w-5 text-transporte-DEFAULT" /> },
  ];

  const handleAcessar = () => {
    if (secretariaSelecionada) {
      navigate(`/tarefas/${secretariaSelecionada}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Acesso às Tarefas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium block">Selecione a Secretária</label>
            <Select value={secretariaSelecionada} onValueChange={setSecretariaSelecionada}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma secretária" />
              </SelectTrigger>
              <SelectContent>
                {secretarias.map((secretaria) => (
                  <SelectItem key={secretaria.value} value={secretaria.value} className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      {secretaria.icon}
                      <span>{secretaria.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full" 
            disabled={!secretariaSelecionada}
            onClick={handleAcessar}
          >
            Acessar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TarefasSelecao;
