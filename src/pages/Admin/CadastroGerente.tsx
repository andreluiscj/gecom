
import React, { useState, useEffect } from 'react';
import { ArrowLeft, PlusCircle, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Funcionario, Setor } from '@/types';
import { addFuncionario, getFuncionarios, updateFuncionario, deleteFuncionario } from '@/data/funcionarios/mockFuncionarios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format } from 'date-fns';
import { GerenteDialog } from '@/components/Admin/GerenteDialog';
import { GerentesList } from '@/components/Admin/GerentesList';

const formSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  cpf: z.string().min(11, { message: "CPF inválido" }),
  email: z.string().email({ message: "Email inválido" }),
  cargo: z.string().min(1, { message: "Cargo é obrigatório" }),
  setor: z.string().min(1, { message: "Secretaria é obrigatória" }),
  dataNascimento: z.string().min(1, { message: "Data de nascimento é obrigatória" }),
  dataContratacao: z.string().min(1, { message: "Data de contratação é obrigatória" })
});

const setores: Setor[] = [
  "Saúde",
  "Educação",
  "Administrativo",
  "Transporte",
  "Assistência Social",
  "Cultura",
  "Meio Ambiente",
  "Obras",
  "Segurança Pública",
  "Fazenda",
  "Turismo",
  "Esportes e Lazer",
  "Planejamento",
  "Comunicação",
  "Ciência e Tecnologia"
];

const CadastroGerente: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [gerentes, setGerentes] = useState<Funcionario[]>([]);
  const [selectedGerente, setSelectedGerente] = useState<Funcionario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      cpf: "",
      email: "",
      cargo: "Gerente",
      setor: "",
      dataNascimento: "",
      dataContratacao: new Date().toISOString().split('T')[0]
    },
  });

  useEffect(() => {
    loadGerentes();
  }, []);

  const loadGerentes = () => {
    // Get all funcionarios and filter only gerentes
    const allFuncionarios = getFuncionarios();
    const filteredGerentes = allFuncionarios.filter(
      funcionario => funcionario.cargo.toLowerCase().includes('gerente')
    );
    setGerentes(filteredGerentes);
  };

  const handleOpenAddDialog = () => {
    setSelectedGerente(null);
    form.reset({
      nome: "",
      cpf: "",
      email: "",
      cargo: "Gerente",
      setor: "",
      dataNascimento: "",
      dataContratacao: new Date().toISOString().split('T')[0]
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (gerente: Funcionario) => {
    setSelectedGerente(gerente);
    form.reset({
      nome: gerente.nome,
      cpf: gerente.cpf || "",
      email: gerente.email,
      cargo: gerente.cargo,
      setor: gerente.setor,
      dataNascimento: gerente.dataNascimento ? format(new Date(gerente.dataNascimento), 'yyyy-MM-dd') : "",
      dataContratacao: gerente.dataContratacao ? format(new Date(gerente.dataContratacao), 'yyyy-MM-dd') : ""
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (gerente: Funcionario) => {
    setSelectedGerente(gerente);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteGerente = () => {
    if (selectedGerente) {
      deleteFuncionario(selectedGerente.id);
      toast.success(`Gerente ${selectedGerente.nome} excluído com sucesso`);
      setIsDeleteDialogOpen(false);
      loadGerentes();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const funcionarioData: Omit<Funcionario, 'id'> = {
        nome: values.nome,
        cpf: values.cpf,
        dataNascimento: new Date(values.dataNascimento),
        email: values.email,
        cargo: values.cargo,
        setor: values.setor as Setor,
        dataContratacao: new Date(values.dataContratacao),
        ativo: true,
        permissaoEtapa: "all"  // Gerentes têm acesso a todas as etapas
      };

      if (selectedGerente) {
        // Update existing gerente
        updateFuncionario(selectedGerente.id, funcionarioData);
        toast.success(`Gerente ${values.nome} atualizado com sucesso!`);
      } else {
        // Add new gerente
        const result = addFuncionario(funcionarioData);
        toast.success(
          <div className="flex flex-col gap-1">
            <div>Gerente {values.nome} cadastrado com sucesso!</div>
            <div className="text-sm">Login criado: {result.login.username} | Senha: 123</div>
          </div>
        );
      }
      
      form.reset();
      setIsDialogOpen(false);
      loadGerentes();
    } catch (error) {
      console.error("Erro ao cadastrar gerente:", error);
      toast.error("Erro ao cadastrar gerente. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredGerentes = gerentes.filter((gerente) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      gerente.nome.toLowerCase().includes(searchLower) ||
      gerente.email.toLowerCase().includes(searchLower) ||
      gerente.cargo.toLowerCase().includes(searchLower) ||
      gerente.setor.toLowerCase().includes(searchLower) ||
      (gerente.cpf && gerente.cpf.includes(searchLower))
    );
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">Cadastro de Gerentes</h1>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg">Gerenciamento de Gerentes</CardTitle>
            <CardDescription>
              Adicione, edite ou remova gerentes do sistema
            </CardDescription>
          </div>
          <Button onClick={handleOpenAddDialog} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Gerente
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Pesquisar por nome, email, CPF, cargo ou secretaria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <GerentesList 
            gerentes={filteredGerentes}
            onEdit={handleOpenEditDialog}
            onDelete={handleOpenDeleteDialog}
          />
        </CardContent>
      </Card>

      {/* Dialog for adding/editing gerentes */}
      <GerenteDialog
        form={form}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        isEditing={!!selectedGerente}
        setores={setores}
      />

      {/* Delete confirmation dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o gerente{' '}
              <strong>{selectedGerente?.nome}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGerente}
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

export default CadastroGerente;
