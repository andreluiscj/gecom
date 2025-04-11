
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Edit, PlusCircle, Search, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Funcionario, Setor } from '@/types';
import { addFuncionario, getFuncionarios, updateFuncionario, deleteFuncionario } from '@/data/funcionarios/mockFuncionarios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>CPF</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Secretaria</TableHead>
                  <TableHead>Data Contratação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGerentes.length > 0 ? (
                  filteredGerentes.map((gerente) => (
                    <TableRow key={gerente.id}>
                      <TableCell className="font-medium">{gerente.nome}</TableCell>
                      <TableCell>{gerente.cpf || '-'}</TableCell>
                      <TableCell>{gerente.email}</TableCell>
                      <TableCell>{gerente.cargo}</TableCell>
                      <TableCell>{gerente.setor}</TableCell>
                      <TableCell>
                        {gerente.dataContratacao ? format(new Date(gerente.dataContratacao), 'dd/MM/yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            gerente.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {gerente.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEditDialog(gerente)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleOpenDeleteDialog(gerente)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      Nenhum gerente encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedGerente ? 'Editar Gerente' : 'Adicionar Gerente'}
            </DialogTitle>
            <DialogDescription>
              {selectedGerente
                ? 'Atualize os dados do gerente'
                : 'Preencha os dados para adicionar um novo gerente'}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do gerente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="123.456.789-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="email@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cargo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="setor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secretaria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a secretaria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {setores.map((setor) => (
                            <SelectItem key={setor} value={setor}>
                              {setor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="dataContratacao"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Contratação</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Salvando..." : (selectedGerente ? "Atualizar Gerente" : "Cadastrar Gerente")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

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
