
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';

interface PrefeitoFormProps {
  formData: {
    nome: string;
    email: string;
    telefone: string;
    cpf: string;
    mandatoInicio: string;
    mandatoFim: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  resetForm: () => void;
  setIsDialogOpen: (open: boolean) => void;
  selectedPrefeito: {
    id: string;
    nome: string;
  } | null;
}

export const PrefeitoForm: React.FC<PrefeitoFormProps> = ({
  formData,
  handleInputChange,
  handleSave,
  resetForm,
  setIsDialogOpen,
  selectedPrefeito
}) => {
  return (
    <>
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
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="(00) 00000-0000"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mandatoInicio">Início do Mandato*</Label>
          <Input
            id="mandatoInicio"
            name="mandatoInicio"
            type="date"
            value={formData.mandatoInicio}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mandatoFim">Fim do Mandato*</Label>
          <Input
            id="mandatoFim"
            name="mandatoFim"
            type="date"
            value={formData.mandatoFim}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => {
          resetForm();
          setIsDialogOpen(false);
        }}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          {selectedPrefeito ? 'Atualizar' : 'Cadastrar'}
        </Button>
      </DialogFooter>
    </>
  );
};
