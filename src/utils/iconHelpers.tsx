
import React from 'react';
import {
  HeartPulse,
  BookOpen,
  Building2,
  Bus,
  Briefcase,
  Shield,
  Heart,
  Leaf,
  Coins,
  Globe,
  Music,
  Award,
  PieChart,
  Radio,
  MapPin
} from 'lucide-react';
import { Setor } from '@/types';

export const getSetorIcon = (setor: string) => {
  switch (setor) {
    case 'Saúde':
      return <HeartPulse className="h-4 w-4 text-black" />;
    case 'Educação':
      return <BookOpen className="h-4 w-4 text-black" />;
    case 'Administrativo':
      return <Building2 className="h-4 w-4 text-black" />;
    case 'Transporte':
      return <Bus className="h-4 w-4 text-black" />;
    case 'Obras':
      return <Briefcase className="h-4 w-4 text-black" />;
    case 'Segurança Pública':
      return <Shield className="h-4 w-4 text-black" />;
    case 'Assistência Social':
      return <Heart className="h-4 w-4 text-black" />;
    case 'Meio Ambiente':
      return <Leaf className="h-4 w-4 text-black" />;
    case 'Fazenda':
      return <Coins className="h-4 w-4 text-black" />;
    case 'Turismo':
      return <Globe className="h-4 w-4 text-black" />;
    case 'Cultura':
      return <Music className="h-4 w-4 text-black" />;
    case 'Esportes e Lazer':
      return <Award className="h-4 w-4 text-black" />;
    case 'Planejamento':
      return <PieChart className="h-4 w-4 text-black" />;
    case 'Comunicação':
      return <Radio className="h-4 w-4 text-black" />;
    case 'Ciência e Tecnologia':
      return <MapPin className="h-4 w-4 text-black" />;
    default:
      return <Building2 className="h-4 w-4 text-black" />;
  }
};

export const getSetorColor = (setor: string): string => {
  // Mudando todos os fundos para branco e texto para preto
  return 'bg-white text-black';
};
