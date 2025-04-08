
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Funcionario, Setor } from '@/types';
import {
  getFuncionarios,
  addFuncionario,
  updateFuncionario,
  deleteFuncionario,
} from '@/data/funcionarios/mockFuncionarios';
import { canAccessUserManagement } from '@/utils/authHelpers';
import { toast } from 'sonner';
import { CheckCircle, Edit, PlusCircle, Search, Trash2, XCircle } from 'lucide-react';

const setores: Setor[] = [
  'Saúde',
  'Educação',
  'Administrativo',
  'Transporte',
  'Assistência Social',
  'Cultura',
  'Meio Ambiente',
  'Obras',
  'Segurança Pública',
  'Fazenda',
  'Turismo',
  'Esportes e Lazer',
  'Planejamento',
  'Comunicação',
  'Ciência e Tecnologia',
];

const Funcionarios: React.FC = () => {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Funcionario, 'id'>>({
    nome: '',
    email: '',
    cargo: '',
    setor: 'Administrativo',
    dataContratacao: new Date(),
    ativo: true,
    senha: '',
  });

  useEffect(() => {
    // Check if user has access to this page
    if (!canAccessUserManagement()) {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }

    // Load employees data
    loadFuncionarios();
  }, [navigate]);

  const loadFuncionarios = () => {
    const data = getFuncionarios();
    setFuncionarios(data);
  };

  const handleOpenAddDialog = () => {
    setSelectedFuncionario(null);
    setFormData({
      nome: '',
      email: '',
      cargo: '',
      setor: 'Administrativo',
      dataContratacao: new Date(),
      ativo: true,
      senha: '',
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      email: funcionario.email,
      cargo: funcionario.cargo,
      setor: funcionario.setor,
      dataContratacao: funcionario.dataContratacao,
      ativo: funcionario.ativo,
      senha: '',
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsDeleteDialogOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveFuncionario = () => {
    // Validate form data
    if (!formData.nome || !formData.email || !formData.cargo || !formData.setor) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    if (selectedFuncionario) {
      // Update existing funcionario
      updateFuncionario(selectedFuncionario.id, formData);
      toast.success(`Funcionário ${formData.nome} atualizado com sucesso`);
    } else {
      // Create new funcionario
      if (!formData.senha) {
        toast.error('A senha é obrigatória para novos funcionários');
        return;
      }
      addFuncionario(formData);
      toast.success(`Funcionário ${formData.nome} adicionado com sucesso`);
    }

    setIsDialogOpen(false);
    loadFuncionarios();
  };

  const handleDeleteFuncionario = () => {
    if (selectedFuncionario) {
      deleteFuncionario(selectedFuncionario.id);
      toast.success(`Funcionário ${selectedFuncionario.nome} excluído com sucesso`);
      setIsDeleteDialogOpen(false);
      loadFuncionarios();
    }
  };

  // Filter funcionarios based on search term
  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      funcionario.nome.toLowerCase().includes(searchLower) ||
      funcionario.email.toLowerCase().includes(searchLower) ||
      funcionario.cargo.toLowerCase().includes(searchLower) ||
      funcionario.setor.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Gerenciamento de Funcionários</CardTitle>
            <CardDescription>
              Adicione, edite ou remova funcionários do sistema
            </CardDescription>
          </div>
          <Button onClick={handleOpenAddDialog} className="flex items-center">
            <PlusCircle className="h-4 w-4 mr-2" />
            Adicionar Funcionário
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Pesquisar por nome, email, cargo ou setor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Setor</TableHead>
                  <TableHead>Data Contratação</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.length > 0 ? (
                  filteredFuncionarios.map((funcionario) => (
                    <TableRow key={funcionario.id}>
                      <TableCell className="font-medium">{funcionario.nome}</TableCell>
                      <TableCell>{funcionario.email}</TableCell>
                      <TableCell>{funcionario.cargo}</TableCell>
                      <TableCell>{funcionario.setor}</TableCell>
                      <TableCell>
                        {format(new Date(funcionario.dataContratacao), 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            funcionario.ativo
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {funcionario.ativo ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleOpenEditDialog(funcionario)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleOpenDeleteDialog(funcionario)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Nenhum funcionário encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedFuncionario ? 'Editar Funcionário' : 'Adicionar Funcionário'}
            </DialogTitle>
            <DialogDescription>
              {selectedFuncionario
                ? 'Atualize os dados do funcionário'
                : 'Preencha os dados para adicionar um novo funcionário'}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo*</Label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo*</Label>
              <Input
                id="cargo"
                name="cargo"
                value={formData.cargo}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="setor">Setor*</Label>
              <Select
                value={formData.setor}
                onValueChange={(value) => handleSelectChange(value, 'setor')}
              >
                <SelectTrigger id="setor">
                  <SelectValue placeholder="Selecione um setor" />
                </SelectTrigger>
                <SelectContent>
                  {setores.map((setor) => (
                    <SelectItem key={setor} value={setor}>
                      {setor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="senha">
                {selectedFuncionario ? 'Senha (deixe em branco para manter)' : 'Senha*'}
              </Label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2 flex items-end">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ativo"
                  name="ativo"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label htmlFor="ativo" className="mb-0">Funcionário Ativo</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveFuncionario}>
              {selectedFuncionario ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o funcionário{' '}
              <strong>{selectedFuncionario?.nome}</strong>? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteFuncionario}
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

export default Funcionarios;
