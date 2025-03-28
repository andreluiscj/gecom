
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
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/index" element={<Index />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pedidos" element={<ListaPedidos />} />
            <Route path="/pedidos/novo" element={<NovoPedido />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/setores" element={<ListaSetores />} />
            <Route path="/setores/:setor" element={<DetalheSetor />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
