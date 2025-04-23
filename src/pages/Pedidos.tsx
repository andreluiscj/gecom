
import React from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from '@/components/ui/button'; // Use Button as Link
import ListaPedidos from './Pedidos/ListaPedidos';
import NovoPedido from './Pedidos/NovoPedido';
import VisualizarPedido from './Pedidos/VisualizarPedido';
import AprovacaoDFD from './Pedidos/AprovacaoDFD';
import WorkflowPedido from './Pedidos/WorkflowPedido';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Pedidos: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Routes>
      <Route index element={<PedidosTabs />} />
      <Route path="novo" element={<NovoPedido />} />
      <Route path=":id" element={<VisualizarPedido />} />
      <Route path=":id/aprovacao" element={<AprovacaoDFD />} />
      <Route path=":id/workflow" element={<WorkflowPedido />} />
    </Routes>
  );
};

const PedidosTabs: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Pedidos de Compra</h1>
          <p className="text-muted-foreground">
            Gerencie todos os pedidos de compra do município
          </p>
        </div>
      
        <Button 
          onClick={() => navigate('/pedidos/novo')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nova DFD
        </Button>
      </div>
      
      <Tabs defaultValue="lista" className="w-full space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid grid-cols-2 w-[400px]">
            <TabsTrigger value="lista">Lista de Pedidos</TabsTrigger>
            <TabsTrigger value="tarefas">Minhas Tarefas</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline"
              onClick={() => navigate('/setores')}
              className="flex items-center gap-2"
            >
              Ver Secretarias
            </Button>
          </div>
        </div>
        
        <TabsContent value="lista" className="space-y-4">
          <ListaPedidos />
        </TabsContent>
        
        <TabsContent value="tarefas" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="rounded-md border shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Tarefas Pendentes</h3>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    {[1, 2, 3].map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border rounded-lg bg-white"
                      >
                        <div>
                          <h4 className="font-medium">Requisição de Material de Escritório</h4>
                          <p className="text-sm text-muted-foreground">
                            Departamento: Administração • Prazo: 15/08/2023
                          </p>
                        </div>
                        <Button 
                          variant="outline"
                          className="text-sm"
                          onClick={() => navigate(`/pedidos/${i+1}`)}
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Pedidos;
