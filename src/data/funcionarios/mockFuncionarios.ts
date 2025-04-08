import { v4 as uuidv4 } from 'uuid';
import { Funcionario } from '@/types';

// Sample employees data
export const mockFuncionarios: Funcionario[] = [
  {
    id: uuidv4(),
    nome: 'João Silva',
    email: 'joao.silva@municipio.gov.br',
    cargo: 'Analista Administrativo',
    setor: 'Administrativo',
    setoresAdicionais: ['Saúde', 'Educação'],
    dataContratacao: new Date('2020-01-10'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@municipio.gov.br',
    cargo: 'Enfermeira Chefe',
    setor: 'Saúde',
    dataContratacao: new Date('2019-03-15'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Carlos Santos',
    email: 'carlos.santos@municipio.gov.br',
    cargo: 'Professor',
    setor: 'Educação',
    setoresAdicionais: ['Cultura'],
    dataContratacao: new Date('2021-02-05'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Ana Pereira',
    email: 'ana.pereira@municipio.gov.br',
    cargo: 'Engenheira Civil',
    setor: 'Obras',
    setoresAdicionais: ['Transporte', 'Meio Ambiente'],
    dataContratacao: new Date('2018-07-22'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Paulo Mendes',
    email: 'paulo.mendes@municipio.gov.br',
    cargo: 'Guarda Municipal',
    setor: 'Segurança Pública',
    dataContratacao: new Date('2022-01-15'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Fernanda Costa',
    email: 'fernanda.costa@municipio.gov.br',
    cargo: 'Assistente Social',
    setor: 'Assistência Social',
    setoresAdicionais: ['Saúde'],
    dataContratacao: new Date('2020-09-10'),
    ativo: false,
  },
  {
    id: uuidv4(),
    nome: 'Roberto Alves',
    email: 'roberto.alves@municipio.gov.br',
    cargo: 'Contador',
    setor: 'Fazenda',
    setoresAdicionais: ['Administrativo'],
    dataContratacao: new Date('2019-11-03'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Luciana Moreira',
    email: 'luciana.moreira@municipio.gov.br',
    cargo: 'Secretária de Cultura',
    setor: 'Cultura',
    dataContratacao: new Date('2021-05-12'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'André Luis',
    email: 'andre.luis@municipio.gov.br',
    cargo: 'Analista de Licitações',
    setor: 'Saúde',
    dataContratacao: new Date('2021-03-15'),
    ativo: true,
  },
  {
    id: uuidv4(),
    nome: 'Breno Jorge',
    email: 'breno.jorge@municipio.gov.br',
    cargo: 'Analista de Compras',
    setor: 'Administrativo',
    setoresAdicionais: ['Educação'],
    dataContratacao: new Date('2022-01-20'),
    ativo: true,
    permissaoEtapa: 'Pesquisa de Preços'
  }
];

// Get all employees
export const getFuncionarios = () => {
  // Get from localStorage if available, otherwise use mockFuncionarios
  const storedFuncionarios = localStorage.getItem('funcionarios');
  if (storedFuncionarios) {
    const parsed = JSON.parse(storedFuncionarios);
    // Convert string dates back to Date objects
    return parsed.map((func: any) => ({
      ...func,
      dataContratacao: new Date(func.dataContratacao)
    }));
  }
  
  // Initialize localStorage with mock data if it doesn't exist
  localStorage.setItem('funcionarios', JSON.stringify(mockFuncionarios));
  return mockFuncionarios;
};

// Add a new employee
export const addFuncionario = (funcionario: Omit<Funcionario, 'id'>) => {
  const funcionarios = getFuncionarios();
  const newFuncionario = {
    ...funcionario,
    id: uuidv4(),
  };
  
  funcionarios.push(newFuncionario);
  localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
  
  return newFuncionario;
};

// Update an employee
export const updateFuncionario = (id: string, funcionario: Partial<Funcionario>) => {
  const funcionarios = getFuncionarios();
  const index = funcionarios.findIndex(f => f.id === id);
  
  if (index !== -1) {
    funcionarios[index] = { ...funcionarios[index], ...funcionario };
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));
    return funcionarios[index];
  }
  
  return null;
};

// Delete an employee
export const deleteFuncionario = (id: string) => {
  const funcionarios = getFuncionarios();
  const filteredFuncionarios = funcionarios.filter(f => f.id !== id);
  
  localStorage.setItem('funcionarios', JSON.stringify(filteredFuncionarios));
  return filteredFuncionarios;
};

// Filter employees by sector/department
export const filtrarFuncionariosPorSetor = (setor: string) => {
  const funcionarios = getFuncionarios();
  return funcionarios.filter(funcionario => 
    funcionario.ativo && (
      funcionario.setor === setor || 
      (funcionario.setoresAdicionais && funcionario.setoresAdicionais.includes(setor))
    )
  );
};
