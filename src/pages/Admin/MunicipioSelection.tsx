
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Building } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Municipio } from '@/types';
import GecomLogo from '@/assets/GecomLogo';

const municipios: Municipio[] = [
  {
    id: 'pai-pedro',
    nome: 'Pai Pedro',
    estado: 'MG',
    populacao: 6083,
    orcamento: 28500000,
    orcamentoAnual: 28500000,
    prefeito: 'Maria Silva',
  },
  {
    id: 'capitao-eneas',
    nome: 'Capitão Enéas',
    estado: 'MG',
    populacao: 15438,
    orcamento: 48000000,
    orcamentoAnual: 48000000,
    prefeito: 'José Santos',
  }
];

const MunicipioSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectMunicipio = (id: string) => {
    localStorage.setItem('municipio-selecionado', id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <GecomLogo size={96} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Administração</h1>
              <p className="text-gray-500">Selecione um município para gerenciar</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {municipios.map((municipio) => (
            <Card 
              key={municipio.id} 
              className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => handleSelectMunicipio(municipio.id)}
            >
              <CardHeader className="border-b pb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  {municipio.nome}
                </CardTitle>
                <p className="text-sm text-gray-500">{municipio.estado}</p>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">População: {municipio.populacao.toLocaleString()} habitantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Prefeito(a): {municipio.prefeito}</span>
                </div>
                <div className="pt-4">
                  <Button className="w-full">Acessar Município</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MunicipioSelection;
