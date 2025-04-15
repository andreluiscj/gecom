
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { addFuncionario } from '@/data/funcionarios/mockFuncionarios';
import { toast } from 'sonner';
import { getUserRole } from '@/utils/authHelpers';

const PrefeitoCadastro = () => {
  const userRole = getUserRole();
  
  // Only admin can see this component
  if (userRole !== 'admin') {
    return null;
  }

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    municipio: 'pai-pedro',
    mandatoInicio: '',
    mandatoFim: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validação básica
      if (!formData.nome || !formData.email || !formData.cpf) {
        toast.error('Por favor, preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }

      // Adicionar prefeito usando a função de adicionar funcionário
      const novoFuncionario = addFuncionario({
        nome: formData.nome,
        cargo: 'Prefeito',
        setor: 'Gabinete',
        email: formData.email,
        cpf: formData.cpf,
        telefone: formData.telefone,
        dataContratacao: new Date(),
        dataNascimento: new Date(),
        ativo: true,
        permissaoEtapa: 'all',
      });

      toast.success('Prefeito cadastrado com sucesso!');
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        cpf: '',
        telefone: '',
        municipio: 'pai-pedro',
        mandatoInicio: '',
        mandatoFim: '',
      });
    } catch (error) {
      toast.error('Erro ao cadastrar prefeito. Tente novamente.');
      console.error('Erro ao cadastrar prefeito:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Cadastrar Novo Prefeito</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="nome">Nome Completo</Label>
          <Input
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            placeholder="Nome do prefeito"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@exemplo.com"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              placeholder="000.000.000-00"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              placeholder="(00) 00000-0000"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipio">Município</Label>
          <Select 
            value={formData.municipio} 
            onValueChange={(value) => handleSelectChange('municipio', value)}
          >
            <SelectTrigger id="municipio">
              <SelectValue placeholder="Selecione o município" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pai-pedro">Pai Pedro</SelectItem>
              <SelectItem value="janauba">Janaúba</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mandatoInicio">Início do Mandato</Label>
            <Input
              id="mandatoInicio"
              name="mandatoInicio"
              type="date"
              value={formData.mandatoInicio}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mandatoFim">Fim do Mandato</Label>
            <Input
              id="mandatoFim"
              name="mandatoFim"
              type="date"
              value={formData.mandatoFim}
              onChange={handleChange}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar Prefeito'}
        </Button>
      </form>
    </Card>
  );
};

export default PrefeitoCadastro;
