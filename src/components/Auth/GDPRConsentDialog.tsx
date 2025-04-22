
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GDPRConsentDialogProps {
  open: boolean;
  onAccept: () => void;
  onOpenChange: (open: boolean) => void;
}

export function GDPRConsentDialog({ open, onAccept, onOpenChange }: GDPRConsentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Política de Privacidade e Termos de Uso
          </DialogTitle>
          <DialogDescription>
            Por favor, leia e aceite os termos para continuar.
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="h-[300px] rounded-md border p-4">
          <div className="space-y-4">
            <h3 className="font-semibold">Política de Privacidade</h3>
            
            <p>A presente Política de Privacidade tem por finalidade demonstrar o nosso compromisso com a privacidade e a proteção dos seus dados pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD).</p>
            
            <h4 className="font-medium mt-4">1. Dados Coletados</h4>
            <p>Coletamos os seguintes dados pessoais:</p>
            <ul className="list-disc pl-5">
              <li>Nome completo</li>
              <li>E-mail profissional</li>
              <li>Cargo</li>
              <li>Setor</li>
              <li>Data de acesso</li>
              <li>Ações realizadas no sistema</li>
            </ul>
            
            <h4 className="font-medium mt-4">2. Finalidade do Tratamento</h4>
            <p>Os dados pessoais coletados serão utilizados para:</p>
            <ul className="list-disc pl-5">
              <li>Autenticação e controle de acesso ao sistema</li>
              <li>Auditoria de ações realizadas</li>
              <li>Registro de histórico de aprovações em processos</li>
              <li>Comunicações relacionadas ao uso do sistema</li>
              <li>Melhoria contínua da plataforma</li>
            </ul>
            
            <h4 className="font-medium mt-4">3. Direitos do Titular</h4>
            <p>Conforme a LGPD, você possui os seguintes direitos:</p>
            <ul className="list-disc pl-5">
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos ou desatualizados</li>
              <li>Portabilidade dos dados</li>
              <li>Informações sobre compartilhamento dos dados</li>
              <li>Revogação do consentimento</li>
            </ul>
            
            <h4 className="font-medium mt-4">4. Compartilhamento de Dados</h4>
            <p>Os dados poderão ser compartilhados com:</p>
            <ul className="list-disc pl-5">
              <li>Órgãos públicos com finalidade de auditoria</li>
              <li>Fornecedores de tecnologia para manutenção do sistema</li>
            </ul>
            
            <h4 className="font-medium mt-4">5. Segurança dos Dados</h4>
            <p>Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais contra acessos não autorizados, destruição ou perda acidental.</p>
            
            <h4 className="font-medium mt-4">6. Período de Retenção</h4>
            <p>Seus dados serão mantidos pelo período necessário para atender às finalidades apresentadas, observando os prazos legais aplicáveis.</p>
            
            <h4 className="font-medium mt-4">7. Contato</h4>
            <p>Para exercer seus direitos ou esclarecer dúvidas, entre em contato com nosso Encarregado de Proteção de Dados pelo email: dpo@gecom.gov.br</p>
          </div>
        </ScrollArea>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="secondary" onClick={() => onOpenChange(false)}>
            Recusar
          </Button>
          <Button onClick={onAccept} className="gap-2">
            <Shield className="h-4 w-4" />
            Aceitar termos e continuar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
