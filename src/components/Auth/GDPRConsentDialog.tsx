
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
import { Checkbox } from '@/components/ui/checkbox';

interface GDPRConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
}

export const GDPRConsentDialog: React.FC<GDPRConsentDialogProps> = ({
  open,
  onOpenChange,
  onAccept,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Termos de uso e privacidade</DialogTitle>
          <DialogDescription>
            Para utilizar o GECOM, precisamos que você concorde com nossos termos de uso e política de privacidade.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm">
          <div className="space-y-2">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />
              <label
                htmlFor="terms"
                className="leading-tight"
              >
                Li e concordo com os <span className="text-primary underline">Termos de Uso</span> do GECOM.
              </label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="privacy" />
              <label
                htmlFor="privacy"
                className="leading-tight"
              >
                Li e concordo com a <span className="text-primary underline">Política de Privacidade</span> do GECOM.
              </label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onAccept}>Aceitar e continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
