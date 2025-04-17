
import React from 'react';
import { Workflow, WorkflowStep } from '@/types';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkflowTimelineProps {
  workflow: Workflow;
  onAdvanceStep?: (etapaIndex: number) => void;
  onCompleteStep?: (etapaIndex: number) => void;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ 
  workflow, 
  onAdvanceStep,
  onCompleteStep 
}) => {
  if (!workflow || !workflow.steps || workflow.steps.length === 0) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">Workflow não definido para este pedido</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Progresso</p>
          <p className="font-medium">{workflow.percentComplete}% concluído</p>
        </div>
        <div className="text-sm text-muted-foreground">
          Etapa {workflow.currentStep} de {workflow.totalSteps}
        </div>
      </div>

      <div className="space-y-4">
        {workflow.steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-4">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step.status === 'Concluído' ? 'bg-green-100 text-green-600' :
                  step.status === 'Em Andamento' ? 'bg-blue-100 text-blue-600' :
                  'bg-gray-100 text-gray-400'
                }`}>
                  {step.status === 'Concluído' ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : step.status === 'Em Andamento' ? (
                    <Clock className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}
                </div>
                {index < workflow.steps.length - 1 && (
                  <div className="w-px h-10 bg-gray-200"></div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-medium">{step.title}</h3>
                <div className="flex flex-wrap gap-2 mt-1 text-sm text-muted-foreground">
                  {step.responsavel && (
                    <span>Responsável: {step.responsavel}</span>
                  )}
                  {step.date && (
                    <span>Iniciado em: {format(step.date, "dd 'de' MMMM", { locale: ptBR })}</span>
                  )}
                  {step.dataConclusao && (
                    <span>Concluído em: {format(step.dataConclusao, "dd 'de' MMMM", { locale: ptBR })}</span>
                  )}
                </div>

                {/* Action buttons */}
                {onAdvanceStep && onCompleteStep && (
                  <div className="flex gap-2 mt-2">
                    {step.status === 'Pendente' && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onAdvanceStep(index)}
                      >
                        Iniciar etapa
                      </Button>
                    )}
                    {step.status === 'Em Andamento' && (
                      <Button 
                        variant="default" 
                        size="sm"
                        onClick={() => onCompleteStep(index)}
                      >
                        Concluir etapa
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkflowTimeline;
