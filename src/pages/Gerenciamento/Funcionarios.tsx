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
import { Funcionario, Setor, UsuarioLogin } from '@/types';
import {
  getFuncionarios,
  addFuncionario,
  updateFuncionario,
  deleteFuncionario,
  getUsuariosLogin,
  generateUsername,
  getLoginLogs,
} from '@/data/funcionarios/mockFuncionarios';
import { canAccessUserManagement } from '@/utils/authHelpers';
import { toast } from 'sonner';
import { CheckCircle, Edit, PlusCircle, Search, Trash2, History } from 'lucide-react';

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
  const [usuariosLogin, setUsuariosLogin] = useState<UsuarioLogin[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState<Funcionario | null>(null);
  const [loginLogs, setLoginLogs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Omit<Funcionario, 'id'>>({
    nome: '',
    cpf: '',
    dataNascimento: new Date(),
    email: '',
    cargo: '',
    setor: 'Administrativo',
    dataContratacao: new Date(),
    ativo: true,
  });

  useEffect(() => {
    if (!canAccessUserManagement()) {
      toast.error('Você não tem permissão para acessar esta página');
      navigate('/dashboard');
      return;
    }

    loadFuncionarios();
    loadUsuariosLogin();
  }, [navigate]);

  const loadFuncionarios = () => {
    const data = getFuncionarios();
    setFuncionarios(data);
  };

  const loadUsuariosLogin = () => {
    const data = getUsuariosLogin();
    setUsuariosLogin(data);
  };

  const handleOpenAddDialog = () => {
    setSelectedFuncionario(null);
    setFormData({
      nome: '',
      cpf: '',
      dataNascimento: new Date(),
      email: '',
      cargo: '',
      setor: 'Administrativo',
      dataContratacao: new Date(),
      ativo: true,
    });
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setFormData({
      nome: funcionario.nome,
      cpf: funcionario.cpf || '',
      dataNascimento: funcionario.dataNascimento || new Date(),
      email: funcionario.email,
      cargo: funcionario.cargo,
      setor: funcionario.setor,
      dataContratacao: funcionario.dataContratacao,
      ativo: funcionario.ativo,
    });
    setIsDialogOpen(true);
  };

  const handleOpenDeleteDialog = (funcionario: Funcionario) => {
    setSelectedFuncionario(funcionario);
    setIsDeleteDialogOpen(true);
  };

  const handleOpenLogsDialog = (funcionario: Funcionario) => {
    const usuario = usuariosLogin.find(u => u.funcionarioId === funcionario.id);
    if (usuario) {
      setSelectedFuncionario(funcionario);
      const logs = getLoginLogs().filter(log => log.userId === usuario.id);
      setLoginLogs(logs);
      setIsLogsDialogOpen(true);
    } else {
      toast.error('Informações de login não encontradas');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const dateValue = e.target.value ? new Date(e.target.value) : new Date();
    setFormData({
      ...formData,
      [fieldName]: dateValue,
    });
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveFuncionario = () => {
    if (!formData.nome || !formData.cpf || !formData.email || !formData.cargo || !formData.setor) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
    if (!cpfRegex.test(formData.cpf)) {
      toast.error('CPF inválido. Utilize o formato 000.000.000-00 ou 00000000000');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Email inválido');
      return;
    }

    try {
      if (selectedFuncionario) {
        updateFuncionario(selectedFuncionario.id, formData);
        toast.success(`Funcionário ${formData.nome} atualizado com sucesso`);
      } else {
        const result = addFuncionario(formData);
        
        toast.success(
          <div className="flex flex-col gap-1">
            <div>Funcionário {formData.nome} adicionado com sucesso</div>
            <div className="text-sm">Login criado: {result.login.username} | Senha: 123</div>
          </div>
        );
      }

      setIsDialogOpen(false);
      loadFuncionarios();
      loadUsuariosLogin();
    } catch (error) {
      console.error('Error saving employee:', error);
      toast.error('Erro ao salvar funcionário. Tente novamente.');
    }
  };

  const handleDeleteFuncionario = () => {
    if (selectedFuncionario) {
      deleteFuncionario(selectedFuncionario.id);
      toast.success(`Funcionário ${selectedFuncionario.nome} excluído com sucesso`);
      setIsDeleteDialogOpen(false);
      loadFuncionarios();
      loadUsuariosLogin();
    }
  };

  const filteredFuncionarios = funcionarios.filter((funcionario) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      funcionario.nome.toLowerCase().includes(searchLower) ||
      funcionario.email.toLowerCase().includes(searchLower) ||
      funcionario.cargo.toLowerCase().includes(searchLower) ||
      funcionario.setor.toLowerCase().includes(searchLower) ||
      (funcionario.cpf && funcionario.cpf.includes(searchLower))
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
                placeholder="Pesquisar por nome, email, CPF, cargo ou setor..."
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
                  <TableHead>Data Nascimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFuncionarios.length > 0 ? (
                  filteredFuncionarios.map((funcionario) => (
                    <TableRow key={funcionario.id}>
                      <TableCell className="font-medium">{funcionario.nome}</TableCell>
                      <TableCell>{funcionario.cpf || '-'}</TableCell>
                      <TableCell>{funcionario.email}</TableCell>
                      <TableCell>{funcionario.cargo}</TableCell>
                      <TableCell>{funcionario.setor}</TableCell>
                      <TableCell>
                        {funcionario.dataNascimento ? format(new Date(funcionario.dataNascimento), 'dd/MM/yyyy') : '-'}
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
                            size="sm"
                            onClick={() => handleOpenLogsDialog(funcionario)}
                            title="Registros de Login"
                            className="flex items-center"
                          >
                            <History className="h-4 w-4 mr-1" />
                            Logs
                          </Button>
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
                    <TableCell colSpan={8} className="text-center py-6">
                      Nenhum funcionário encontrado
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
              <Label htmlFor="cpf">CPF*</Label>
              <Input
                id="cpf"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="000.000.000-00"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento*</Label>
              <Input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                value={format(formData.dataNascimento, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(e, 'dataNascimento')}
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
              <Label htmlFor="setor">Secretaria*</Label>
              <Select
                value={formData.setor}
                onValueChange={(value) => handleSelectChange(value, 'setor')}
              >
                <SelectTrigger id="setor">
                  <SelectValue placeholder="Selecione uma secretaria" />
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
              <Label htmlFor="dataContratacao">Data de Contratação*</Label>
              <Input
                id="dataContratacao"
                name="dataContratacao"
                type="date"
                value={format(formData.dataContratacao, 'yyyy-MM-dd')}
                onChange={(e) => handleDateChange(e, 'dataContratacao')}
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

      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Registros de Login</DialogTitle>
            <DialogDescription>
              Histórico de acessos ao sistema para {selectedFuncionario?.nome}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {loginLogs.length > 0 ? (
              <div className="max-h-80 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Data</TableHead>
                      <TableHead>Hora</TableHead>
                      <TableHead>IP</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loginLogs.map((log, index) => (
                      <TableRow key={index}>
                        <TableCell>{format(new Date(log.timestamp), 'dd/MM/yyyy')}</TableCell>
                        <TableCell>{format(new Date(log.timestamp), 'HH:mm:ss')}</TableCell>
                        <TableCell>{log.ip}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              log.success
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {log.success ? 'Sucesso' : 'Falha'}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="py-4 text-center text-muted-foreground">
                Nenhum registro de login encontrado para este usuário.
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setIsLogsDialogOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
