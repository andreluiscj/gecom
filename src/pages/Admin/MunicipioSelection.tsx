
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, MapPin, Users, Building, ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { Municipio } from '@/types';

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
    id: 'janauba',
    nome: 'Janaúba',
    estado: 'MG',
    populacao: 72018,
    orcamento: 145300000,
    orcamentoAnual: 145300000,
    prefeito: 'José Santos',
  },
  {
    id: 'espinosa',
    nome: 'Espinosa',
    estado: 'MG',
    populacao: 31113,
    orcamento: 87600000,
    orcamentoAnual: 87600000,
    prefeito: 'Carlos Oliveira',
  }
];

const MunicipioSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectMunicipio = (id: string) => {
    // Armazena o município selecionado no localStorage
    localStorage.setItem('municipio-selecionado', id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-indigo-900 p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <div className="flex text-white mr-2">
            <ShoppingCart className="h-6 w-6" />
            <Check className="h-6 w-6 -ml-3 -mt-1" />
          </div>
          <h1 className="text-2xl font-bold text-white">GECOM</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Área Administrativa</h2>
          <p className="text-muted-foreground">
            Selecione um município para gerenciar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {municipios.map((municipio) => (
            <Card key={municipio.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-indigo-600" />
                  {municipio.nome} - {municipio.estado}
                </CardTitle>
                <CardDescription>
                  Prefeitura Municipal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">População: {municipio.populacao.toLocaleString()} habitantes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <span className="text-sm">Prefeito(a): {municipio.prefeito}</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-sm">Orçamento Anual: {formatCurrency(municipio.orcamentoAnual)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => handleSelectMunicipio(municipio.id)}
                >
                  Acessar <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      
      <footer className="bg-gray-100 p-4 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          © 2023 GECOM - Sistema de Gestão de Compras Municipais
        </div>
      </footer>
    </div>
  );
};

export default MunicipioSelection;
