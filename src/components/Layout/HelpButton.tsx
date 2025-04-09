
import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HelpButton = () => {
  return (
    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
      <HelpCircle className="h-5 w-5" />
    </Button>
  );
};

export default HelpButton;
