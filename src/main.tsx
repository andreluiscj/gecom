
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initializeDatabase } from './utils/initializeData.ts';
import { Toaster } from './components/ui/sonner';

// Inicializar dados no banco de dados
initializeDatabase().catch(error => {
  console.error('Erro ao inicializar dados:', error);
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>
);
