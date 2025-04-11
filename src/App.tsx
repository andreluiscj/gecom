
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout/AppLayout";
import Dashboard from "./pages/Dashboard/Dashboard";
import ListaSetores from "./pages/Setores/ListaSetores";
import DetalheSetor from "./pages/Setores/DetalheSetor";
import TarefasKanban from "./pages/Tarefas/TarefasKanban";
import TarefasSelecao from "./pages/Tarefas/TarefasSelecao";
import ListaPedidos from "./pages/Pedidos/ListaPedidos";
import VisualizarPedido from "./pages/Pedidos/VisualizarPedido";
import NovoPedido from "./pages/Pedidos/NovoPedido";
import MunicipioSelection from "./pages/Admin/MunicipioSelection";
import Admin from "./pages/Admin/Admin";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
import Login from "./pages/Login";
import WorkflowPedido from "./pages/Pedidos/WorkflowPedido";
import AprovacaoDFD from "./pages/Pedidos/AprovacaoDFD";
import Funcionarios from "./pages/Gerenciamento/Funcionarios";
import CadastroGerente from "./pages/Admin/CadastroGerente";
import { useEffect } from "react";
import { getFuncionarios, getUsuariosLogin } from "./data/funcionarios/mockFuncionarios";

function App() {
  // Initialize data on app start
  useEffect(() => {
    // These calls ensure the admin user is created
    getFuncionarios();
    getUsuariosLogin();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/municipios" element={<MunicipioSelection />} />

      <Route path="/" element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="setores" element={<ListaSetores />} />
        <Route path="setores/:id" element={<DetalheSetor />} />
        <Route path="tarefas" element={<TarefasSelecao />} />
        <Route path="tarefas/kanban" element={<TarefasKanban />} />
        <Route path="pedidos" element={<ListaPedidos />} />
        <Route path="pedidos/:id" element={<VisualizarPedido />} />
        <Route path="pedidos/workflow/:id" element={<WorkflowPedido />} />
        <Route path="pedidos/aprovacao/:id" element={<AprovacaoDFD />} />
        <Route path="pedidos/novo" element={<NovoPedido />} />
        <Route path="admin/gerentes" element={<CadastroGerente />} />
        <Route path="gerenciamento/funcionarios" element={<Funcionarios />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
