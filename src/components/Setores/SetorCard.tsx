
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SetorCardProps {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  colorClass: string;
  href: string;
}

const SetorCard: React.FC<SetorCardProps> = ({
  titulo,
  descricao,
  icone,
  colorClass,
  href,
}) => {
  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-md bg-white shadow-sm">
            {icone}
          </div>
          <CardTitle>{titulo}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{descricao}</p>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" asChild className="ml-auto">
          <Link to={href}>
            Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SetorCard;
