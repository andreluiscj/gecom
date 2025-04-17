
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/hooks/useAuth';

// Pages
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard/Dashboard';
import AppLayout from '@/components/Layout/AppLayout';
import NotFound from '@/pages/NotFound';
import Admin from '@/pages/Admin/Admin';
import CadastroGerente from '@/pages/Admin/CadastroGerente';
import ListaPedidos from '@/pages/Pedidos/ListaPedidos';
import NovoPedido from '@/pages/Pedidos/NovoPedido';
import VisualizarPedido from '@/pages/Pedidos/VisualizarPedido';
import AprovacaoDFD from '@/pages/Pedidos/AprovacaoDFD';
import WorkflowPedido from '@/pages/Pedidos/WorkflowPedido';
import PrefeitoPage from '@/pages/Prefeito/PrefeitoPage';
import PrefeitoDashboard from '@/pages/Prefeito/PrefeitoDashboard';
import ListaSetores from '@/pages/Setores/ListaSetores';
import DetalheSetor from '@/pages/Setores/DetalheSetor';
import Funcionarios from '@/pages/Gerenciamento/Funcionarios';
import TarefasKanban from '@/pages/Tarefas/TarefasKanban';
import TarefasSelecao from '@/pages/Tarefas/TarefasSelecao';

import './App.css';

// Initialize React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
            <Route path="/admin" element={<AppLayout><Admin /></AppLayout>} />
            <Route path="/admin/gerentes" element={<AppLayout><CadastroGerente /></AppLayout>} />
            
            {/* Pedidos Routes */}
            <Route path="/pedidos" element={<AppLayout><ListaPedidos /></AppLayout>} />
            <Route path="/pedidos/novo" element={<AppLayout><NovoPedido /></AppLayout>} />
            <Route path="/pedidos/:id" element={<AppLayout><VisualizarPedido /></AppLayout>} />
            <Route path="/pedidos/:id/aprovacao" element={<AppLayout><AprovacaoDFD /></AppLayout>} />
            <Route path="/pedidos/:id/workflow" element={<AppLayout><WorkflowPedido /></AppLayout>} />
            
            {/* Prefeito Routes */}
            <Route path="/prefeito" element={<AppLayout><PrefeitoPage /></AppLayout>} />
            <Route path="/prefeito/dashboard" element={<AppLayout><PrefeitoDashboard /></AppLayout>} />
            
            {/* Setores Routes */}
            <Route path="/setores" element={<AppLayout><ListaSetores /></AppLayout>} />
            <Route path="/setores/:id" element={<AppLayout><DetalheSetor /></AppLayout>} />
            
            {/* Gerenciamento Routes */}
            <Route path="/gerenciamento/funcionarios" element={<AppLayout><Funcionarios /></AppLayout>} />
            
            {/* Tarefas Routes */}
            <Route path="/tarefas" element={<AppLayout><TarefasSelecao /></AppLayout>} />
            <Route path="/tarefas/kanban" element={<AppLayout><TarefasKanban /></AppLayout>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
