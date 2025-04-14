
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { addFuncionario, getFuncionarios } from '@/data/funcionarios/mockFuncionarios';
import { Funcionario, Setor } from '@/types';

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

const CadastroGerente: React.FC = () => {
  const navigate = useNavigate();
  
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [email, setEmail] = useState('');
  const [cargo, setCargo] = useState('Gerente');
  const [setor, setSetor] = useState<Setor>('Administrativo');
  const [setoresAdicionais, setSetoresAdicionais] = useState<Setor[]>([]);
  const [dataContratacao, setDataContratacao] = useState('');
  const [ativo, setAtivo] = useState(true);
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<Setor[]>([]);
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  useEffect(() => {
    // Carregar setores disponíveis (excluindo o setor principal)
    const setoresRestantes = setores.filter(s => s !== setor);
    setSetoresDisponiveis(setoresRestantes);
    
    // Load existing funcionários for validation
    const loadFuncionarios = async () => {
      try {
        const data = await getFuncionarios();
        setFuncionarios(data);
      } catch (error) {
        console.error("Error loading funcionários:", error);
      }
    };
    
    loadFuncionarios();
  }, [setor]);

  // Handle primary sector change
  const handleSetorChange = (value: Setor) => {
    setSetor(value);
    // Remove the new primary sector from additional sectors if it's there
    setSetoresAdicionais(prev => prev.filter(s => s !== value));
  };

  // Toggle an additional sector
  const toggleSetorAdicional = (value: Setor) => {
    if (setoresAdicionais.includes(value)) {
      setSetoresAdicionais(setoresAdicionais.filter((s) => s !== value));
    } else {
      setSetoresAdicionais([...setoresAdicionais, value]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email inválido');
      setIsLoading(false);
      return;
    }
    
    // Check if email is already in use
    const existingEmail = funcionarios.filter(f => f.email === email);
    if (existingEmail.length > 0) {
      toast.error('Este email já está em uso');
      setIsLoading(false);
      return;
    }
    
    // Password validation
    if (senha.length < 3) {
      toast.error('A senha deve ter pelo menos 3 caracteres');
      setIsLoading(false);
      return;
    }
    
    if (senha !== confirmarSenha) {
      toast.error('As senhas não coincidem');
      setIsLoading(false);
      return;
    }
    
    try {
      // Format date strings to Date objects
      const dataNascimentoObj = new Date(dataNascimento);
      const dataContratacaoObj = new Date(dataContratacao);
      
      const novoGerente: Omit<Funcionario, 'id'> = {
        nome,
        cpf,
        dataNascimento: dataNascimentoObj,
        email,
        cargo,
        setor,
        setoresAdicionais,
        dataContratacao: dataContratacaoObj,
        ativo,
        senha,
        telefone
      };
      
      const resultado = await addFuncionario(novoGerente);
      
      if (resultado) {
        toast.success('Gerente cadastrado com sucesso!');
        
        // Debug info
        const debugInfo = {
          funcionario: resultado.funcionario,
          login: resultado.login
        };
        console.log('Dados cadastrados:', debugInfo);
        
        // Return to list
        navigate('/admin/gerentes');
      }
    } catch (error) {
      console.error('Erro ao cadastrar gerente:', error);
      toast.error('Ocorreu um erro ao cadastrar o gerente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Cadastrar Gerente</CardTitle>
          <CardDescription>
            Preencha as informações para cadastrar um novo gerente no sistema
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome">Nome completo</Label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              {/* CPF */}
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </div>
              
              {/* Telefone */}
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
              
              {/* Data de Nascimento */}
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={dataNascimento}
                  onChange={(e) => setDataNascimento(e.target.value)}
                  required
                />
              </div>
              
              {/* Data de Contratação */}
              <div className="space-y-2">
                <Label htmlFor="dataContratacao">Data de Contratação</Label>
                <Input
                  id="dataContratacao"
                  type="date"
                  value={dataContratacao}
                  onChange={(e) => setDataContratacao(e.target.value)}
                  required
                />
              </div>
              
              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo</Label>
                <Input
                  id="cargo"
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value)}
                  required
                />
              </div>
              
              {/* Setor Principal */}
              <div className="space-y-2">
                <Label htmlFor="setor">Setor Principal</Label>
                <Select onValueChange={(value) => handleSetorChange(value as Setor)} value={setor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um setor" />
                  </SelectTrigger>
                  <SelectContent>
                    {setores.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Senha e Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="senha">Senha</Label>
                <Input
                  id="senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmarSenha">Confirmar Senha</Label>
                <Input
                  id="confirmarSenha"
                  type="password"
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {/* Setores Adicionais */}
            <div className="space-y-4">
              <Label>Setores Adicionais</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {setoresDisponiveis.map((s) => (
                  <div key={s} className="flex items-center space-x-2">
                    <Checkbox
                      id={`setor-${s}`}
                      checked={setoresAdicionais.includes(s)}
                      onCheckedChange={() => toggleSetorAdicional(s)}
                    />
                    <Label htmlFor={`setor-${s}`} className="text-sm">
                      {s}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Status (Ativo/Inativo) */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="ativo"
                checked={ativo}
                onCheckedChange={() => setAtivo(!ativo)}
              />
              <Label htmlFor="ativo">Usuário Ativo</Label>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/gerentes')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Cadastrar Gerente'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CadastroGerente;
