
import { Funcionario, WorkflowStep } from "@/types";

export const DEFAULT_WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "1",
    title: "Análise Inicial",
    status: "Pendente",
  },
  {
    id: "2",
    title: "Aprovação Financeira",
    status: "Pendente",
  },
  {
    id: "3",
    title: "Cotações",
    status: "Pendente",
  },
  {
    id: "4",
    title: "Análise de Cotações",
    status: "Pendente",
  },
  {
    id: "5",
    title: "Empenho",
    status: "Pendente",
  },
  {
    id: "6",
    title: "Aprovação Final",
    status: "Pendente",
  },
];

export function funcionarioTemPermissao(
  funcionario: Funcionario,
  etapa: string
): boolean {
  if (funcionario.permissaoEtapa === "all") return true;
  return funcionario.permissaoEtapa === etapa;
}

export function canEditStep(
  userRole: string | null,
  stepStatus: string,
  isResponsible: boolean
): boolean {
  // Admin can edit any step
  if (userRole === "admin") return true;

  // Managers can edit pending steps
  if (userRole === "manager" && stepStatus === "Pendente") return true;

  // Responsible users can edit their in-progress steps
  if (isResponsible && stepStatus === "Em Andamento") return true;

  return false;
}
