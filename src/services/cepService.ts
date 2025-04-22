
import { toast } from "sonner";

export type AddressData = {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
};

export async function fetchAddressFromCep(cep: string): Promise<AddressData | null> {
  try {
    // Remove non-digit characters
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      toast.error("CEP inválido");
      return null;
    }
    
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      toast.error("CEP não encontrado");
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Error fetching address:", error);
    toast.error("Erro ao buscar endereço pelo CEP");
    return null;
  }
}
