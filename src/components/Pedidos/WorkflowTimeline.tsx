
import React from 'react';
import { CheckCircle, Clock, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Workflow } from '@/types';

interface WorkflowTimelineProps {
  workflow: Workflow;
  onAdvanceStep?: (stepIndex: number) => void;
  onCompleteStep?: (stepIndex: number) => void;
}

const WorkflowTimeline: React.FC<WorkflowTimelineProps> = ({ 
  workflow, 
  onAdvanceStep, 
  onCompleteStep 
}) => {
  if (!workflow?.steps || workflow.steps.length === 0) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground">
          Não há etapas de workflow definidas para este pedido.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-2">
      {workflow.steps.map((step, index) => (
        <div key={index} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              step.status === 'Concluído' ? 'bg-green-100' :
              step.status === 'Em Andamento' ? 'bg-blue-100' : 'bg-gray-100'
            } border ${
              step.status === 'Concluído' ? 'border-green-500' :
              step.status === 'Em Andamento' ? 'border-blue-500' : 'border-gray-300'
            }`}>
              {step.status === 'Concluído' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : step.status === 'Em Andamento' ? (
                <Clock className="h-5 w-5 text-blue-600" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </div>
            {index < workflow.steps.length - 1 && (
              <div className={`h-12 w-0.5 ${
                step.status === 'Concluído' ? 'bg-green-500' : 'bg-gray-200'
              } mx-auto`}></div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium mb-1">{step.title}</h3>
            <div className="space-y-2 text-sm">
              {step.date && (
                <p className="text-muted-foreground">
                  Data: {format(new Date(step.date), 'dd/MM/yyyy')}
                </p>
              )}
              {step.responsavel && (
                <p className="text-muted-foreground">
                  Responsável: {step.responsavel}
                </p>
              )}
              {step.dataConclusao && (
                <p className="text-muted-foreground">
                  Concluído em: {format(new Date(step.dataConclusao), 'dd/MM/yyyy')}
                </p>
              )}
              
              <div className="flex space-x-2 pt-1">
                {step.status === 'Pendente' && onAdvanceStep && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onAdvanceStep(index)}
                  >
                    Iniciar Etapa
                  </Button>
                )}
                
                {step.status === 'Em Andamento' && onCompleteStep && (
                  <Button 
                    size="sm" 
                    onClick={() => onCompleteStep(index)}
                  >
                    Concluir Etapa
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkflowTimeline;
