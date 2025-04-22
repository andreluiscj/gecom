
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getUserRole } from '@/utils/authHelpers';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Lock, UserPlus } from 'lucide-react';
import { generateUsername, addFuncionario, getFuncionarios, updateFuncionario, deleteFuncionario } from '@/data/funcionarios/mockFuncionarios';
import { Setor } from '@/types';
import { PrefeitoForm } from '@/components/Prefeito/PrefeitoForm';
import { PrefeitoTable } from '@/components/Prefeito/PrefeitoTable';

interface Prefeito {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cpf: string;
  mandatoInicio: Date;
  mandatoFim: Date;
  municipio: string;
}

const PrefeitoPage = () => {
  const navigate = useNavigate();
  const userRole = getUserRole();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPrefeito, setSelectedPrefeito] = useState<Prefeito | null>(null);
  const [prefeitos, setPrefeitos] = useState<Prefeito[]>([]);
  const municipioSelecionado = localStorage.getItem('municipio-selecionado') || 'pai-pedro';

  // Form state
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf: '',
    mandatoInicio: '',
    mandatoFim: '',
  });

  useEffect(() => {
    // Only admin can access this page
    if (userRole !== 'admin') {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }

    // Load prefeitos from storage
    loadPrefeitos();
  }, [navigate, userRole]);

  const loadPrefeitos = () => {
    // Get all funcionarios
    const allFuncionarios = getFuncionarios();
    
    // Filter for prefeitos - those with cargo containing "prefeito"
    const prefeitosList = allFuncionarios.filter(
      (f: any) => f.cargo.toLowerCase().includes('prefeito') && f.municipio === municipioSelecionado
    ).map((f: any) => ({
      id: f.id,
      nome: f.nome,
      email: f.email,
      telefone: f.telefone || '',
      cpf: f.cpf,
      mandatoInicio: new Date(f.mandatoInicio || f.dataContratacao),
      mandatoFim: new Date(f.mandatoFim || new Date().setFullYear(new Date().getFullYear() + 4)),
      municipio: f.municipio || municipioSelecionado
    }));
    
    setPrefeitos(prefeitosList);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.nome || !formData.email || !formData.cpf) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    // Validate CPF
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    if (!cpfRegex.test(formData.cpf)) {
      toast.error('CPF inválido. Utilize o formato 000.000.000-00');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    if (selectedPrefeito) {
      // Update existing prefeito
      const updatedPrefeito = {
        id: selectedPrefeito.id,
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        cargo: 'Prefeito',
        setor: 'Gabinete' as Setor,
        ativo: true,
        dataContratacao: new Date(formData.mandatoInicio),
        dataNascimento: new Date(), // Placeholder
        mandatoInicio: new Date(formData.mandatoInicio),
        mandatoFim: new Date(formData.mandatoFim),
        municipio: municipioSelecionado
      };
      
      // Update in funcionarios collection
      updateFuncionario(selectedPrefeito.id, updatedPrefeito);
      toast.success('Prefeito atualizado com sucesso');
      loadPrefeitos();
    } else {
      // Add new prefeito as funcionario
      const novoPrefeito = {
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone,
        cpf: formData.cpf,
        cargo: 'Prefeito',
        setor: 'Gabinete' as Setor,
        ativo: true,
        dataContratacao: new Date(formData.mandatoInicio),
        dataNascimento: new Date(), // Placeholder
        mandatoInicio: new Date(formData.mandatoInicio),
        mandatoFim: new Date(formData.mandatoFim),
        municipio: municipioSelecionado
      };
      
      // This will also create the login for the prefeito
      const result = addFuncionario(novoPrefeito);
      
      if (result) {
        // Show login credentials to admin
        const username = generateUsername(formData.nome);
        toast.success(`Prefeito cadastrado com sucesso. Login: ${username}, Senha inicial: 123`);
        loadPrefeitos();
      } else {
        toast.error('Erro ao cadastrar prefeito');
      }
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedPrefeito) {
      deleteFuncionario(selectedPrefeito.id);
      toast.success('Prefeito removido com sucesso');
      setIsDeleteDialogOpen(false);
      setSelectedPrefeito(null);
      loadPrefeitos();
    }
  };

  const handleEdit = (prefeito: Prefeito) => {
    setSelectedPrefeito(prefeito);
    setFormData({
      nome: prefeito.nome,
      email: prefeito.email,
      telefone: prefeito.telefone || '',
      cpf: prefeito.cpf,
      mandatoInicio: format(prefeito.mandatoInicio, 'yyyy-MM-dd'),
      mandatoFim: format(prefeito.mandatoFim, 'yyyy-MM-dd'),
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      mandatoInicio: '',
      mandatoFim: '',
    });
    setSelectedPrefeito(null);
  };

  // Only admin can see this page
  if (userRole !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold text-red-500">Acesso Negado</h2>
        <p className="text-gray-500 mt-2">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 pb-16">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Cadastro de Prefeito</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Gerencie os prefeitos cadastrados no sistema
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Novo Prefeito
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Município: {municipioSelecionado.toUpperCase()}</span>
          </div>

          <PrefeitoTable 
            prefeitos={prefeitos}
            handleEdit={handleEdit}
            setSelectedPrefeito={setSelectedPrefeito}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsDialogOpen(open);
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedPrefeito ? 'Editar Prefeito' : 'Adicionar Prefeito'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do prefeito para o município {municipioSelecionado.toUpperCase()}
            </DialogDescription>
          </DialogHeader>

          <PrefeitoForm 
            formData={formData}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            resetForm={resetForm}
            setIsDialogOpen={setIsDialogOpen}
            selectedPrefeito={selectedPrefeito}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o prefeito{' '}
              <strong>{selectedPrefeito?.nome}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PrefeitoPage;
