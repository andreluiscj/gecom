
import { Routes, Route, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

// Lazy load components for better performance
const AppLayout = lazy(() => import("./components/Layout/AppLayout"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const ListaSetores = lazy(() => import("./pages/Setores/ListaSetores"));
const DetalheSetor = lazy(() => import("./pages/Setores/DetalheSetor"));
const TarefasKanban = lazy(() => import("./pages/Tarefas/TarefasKanban"));
const TarefasSelecao = lazy(() => import("./pages/Tarefas/TarefasSelecao"));
const ListaPedidos = lazy(() => import("./pages/Pedidos/ListaPedidos"));
const VisualizarPedido = lazy(() => import("./pages/Pedidos/VisualizarPedido"));
const NovoPedido = lazy(() => import("./pages/Pedidos/NovoPedido"));
const MunicipioSelection = lazy(() => import("./pages/Admin/MunicipioSelection"));
const Admin = lazy(() => import("./pages/Admin/Admin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Index = lazy(() => import("./pages/Index"));
const Login = lazy(() => import("./pages/Login"));
const WorkflowPedido = lazy(() => import("./pages/Pedidos/WorkflowPedido"));
const AprovacaoDFD = lazy(() => import("./pages/Pedidos/AprovacaoDFD"));

// Loading component
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

// Auth guard for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('user-authenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/municipios" element={
            <ProtectedRoute>
              <MunicipioSelection />
            </ProtectedRoute>
          } />

          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }>
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
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster />
    </AuthProvider>
  );
}

export default App;
