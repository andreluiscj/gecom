
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { WorkflowStep } from '@/types';
import { CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { canEditStep } from '@/utils/workflowHelpers';

interface WorkflowTimelineProps {
  workflowSteps: WorkflowStep[];
  workflow?: { steps: WorkflowStep[] };
  onAdvanceStep?: (stepIndex: number) => void;
  onCompleteStep?: (stepIndex: number) => void;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({
  workflowSteps,
  workflow,
  onAdvanceStep,
  onCompleteStep
}) => {
  // Use workflowSteps if provided, otherwise use workflow.steps if available
  const steps = workflowSteps || (workflow?.steps || []);
  
  const getStepIcon = (step: WorkflowStep) => {
    switch (step.status) {
      case 'Concluído':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Em Andamento':
        return <Clock className="h-6 w-6 text-blue-500" />;
      case 'Pendente':
      default:
        return <Clock className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepStatusColor = (step: WorkflowStep) => {
    switch (step.status) {
      case 'Concluído':
        return 'bg-green-100 text-green-800 border-green-500';
      case 'Em Andamento':
        return 'bg-blue-100 text-blue-800 border-blue-500';
      case 'Pendente':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {steps && steps.length > 0 ? steps.map((step, index) => (
        <div key={step.id} className="relative">
          {/* Timeline connector */}
          {index < steps.length - 1 && (
            <div 
              className={`absolute left-5 top-12 w-0.5 h-16 ${
                step.status === 'Concluído' ? 'bg-green-500' : 'bg-gray-300'
              }`}
            ></div>
          )}
          
          <div className="flex items-start gap-4">
            <div className="flex flex-col items-center">
              <div className={`
                rounded-full p-1 border-2
                ${step.status === 'Concluído' ? 'border-green-500 bg-green-50' : 
                  step.status === 'Em Andamento' ? 'border-blue-500 bg-blue-50' : 
                  'border-gray-300 bg-gray-50'}
              `}>
                {getStepIcon(step)}
              </div>
            </div>
            
            <div className={`
              flex-1 p-4 rounded-lg border
              ${step.status === 'Concluído' ? 'border-green-200 bg-green-50' : 
                step.status === 'Em Andamento' ? 'border-blue-200 bg-blue-50' : 
                'border-gray-200 bg-gray-50'}
            `}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {step.date && (
                      <>Iniciado em {format(new Date(step.date), "dd 'de' MMMM", { locale: ptBR })}</>
                    )}
                    {step.dataConclusao && (
                      <> • Concluído em {format(new Date(step.dataConclusao), "dd 'de' MMMM", { locale: ptBR })}</>
                    )}
                    {step.responsavel && (
                      <> • Responsável: {step.responsavel}</>
                    )}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge className={getStepStatusColor(step)}>
                    {step.status}
                  </Badge>
                  
                  {workflow && canEditStep(workflow, index) && onAdvanceStep && step.status === 'Pendente' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => onAdvanceStep(index)}
                    >
                      Iniciar
                    </Button>
                  )}
                  
                  {workflow && canEditStep(workflow, index) && onCompleteStep && step.status === 'Em Andamento' && (
                    <Button 
                      size="sm" 
                      variant="default"
                      onClick={() => onCompleteStep(index)}
                    >
                      Concluir
                    </Button>
                  )}
                </div>
              </div>
              
              {step.observacoes && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm italic">{step.observacoes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )) : (
        <div className="text-center p-6 border rounded-lg">
          <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto mb-2" />
          <h4 className="font-medium">Nenhuma etapa definida</h4>
          <p className="text-muted-foreground">Este pedido não possui um fluxo de aprovação definido.</p>
        </div>
      )}
    </div>
  );
};

export default WorkflowTimeline;
