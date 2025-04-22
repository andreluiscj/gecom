
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { getMunicipalities } from '@/services/municipalityService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const MunicipioSelection: React.FC = () => {
  const [municipios, setMunicipios] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { setCurrentMunicipality } = useAuth();

  useEffect(() => {
    loadMunicipalities();
  }, []);

  const loadMunicipalities = async () => {
    setLoading(true);
    const data = await getMunicipalities();
    setMunicipios(data);
    setLoading(false);
  };

  const handleMunicipioSelect = (municipio: any) => {
    setCurrentMunicipality(municipio);
    toast.success(`Município ${municipio.name} selecionado!`);
    navigate('/dashboard');
  };

  const filteredMunicipios = municipios.filter(
    (municipio) =>
      municipio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      municipio.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex-1 container max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Selecione um Município</h1>
          <p className="text-gray-600">
            Escolha o município que você deseja gerenciar
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Buscar município por nome ou estado..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-4 pr-10"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredMunicipios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMunicipios.map((municipio) => (
              <Card
                key={municipio.id}
                className="cursor-pointer hover:shadow-lg transition-shadow border"
                onClick={() => handleMunicipioSelect(municipio)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    {municipio.logo ? (
                      <img
                        src={municipio.logo}
                        alt={`${municipio.name} logo`}
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">
                          {municipio.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg">{municipio.name}</h3>
                      <p className="text-sm text-gray-600">{municipio.state}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 p-3 flex justify-between">
                  <span className="text-sm text-gray-600">
                    {municipio.population
                      ? `${municipio.population.toLocaleString()} habitantes`
                      : 'População não informada'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Selecionar
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            {/* Admin: Add new municipality card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border border-dashed"
              onClick={() => navigate('/admin/municipios/novo')}
            >
              <CardContent className="h-full flex flex-col items-center justify-center p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <Plus className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-center">Adicionar Município</h3>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Cadastre um novo município no sistema
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center py-10">
            <h3 className="text-xl font-semibold mb-2">Nenhum município encontrado</h3>
            <p className="text-gray-600">
              Não encontramos municípios com o termo "{searchTerm}"
            </p>
            <Button
              className="mt-4"
              onClick={() => navigate('/admin/municipios/novo')}
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Município
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MunicipioSelection;
