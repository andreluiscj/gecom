
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import ListaPedidos from "./pages/Pedidos/ListaPedidos";
import NovoPedido from "./pages/Pedidos/NovoPedido";
import Relatorios from "./pages/Relatorios/Relatorios";
import ListaSetores from "./pages/Setores/ListaSetores";
import DetalheSetor from "./pages/Setores/DetalheSetor";
import TarefasSelecao from "./pages/Tarefas/TarefasSelecao";
import TarefasKanban from "./pages/Tarefas/TarefasKanban";
import MunicipioSelection from "./pages/Admin/MunicipioSelection";
import Login from "./pages/Login";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Componente de Proteção de Rotas
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  // Redirecionamento inicial
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '/index') {
      if (localStorage.getItem('user-authenticated') === 'true') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/login';
      }
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/index" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <MunicipioSelection />
                </ProtectedRoute>
              } 
            />
            <Route element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/pedidos" element={<ListaPedidos />} />
              <Route path="/pedidos/novo" element={<NovoPedido />} />
              <Route path="/relatorios" element={<Relatorios />} />
              <Route path="/tarefas" element={<TarefasSelecao />} />
              <Route path="/tarefas/:secretaria" element={<TarefasKanban />} />
              <Route path="/setores" element={<ListaSetores />} />
              <Route path="/setores/:setor" element={<DetalheSetor />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
