
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
      return <HeartPulse className="h-4 w-4" />;
    case 'Educação':
      return <BookOpen className="h-4 w-4" />;
    case 'Administrativo':
      return <Building2 className="h-4 w-4" />;
    case 'Transporte':
      return <Bus className="h-4 w-4" />;
    case 'Obras':
      return <Briefcase className="h-4 w-4" />;
    case 'Segurança Pública':
      return <Shield className="h-4 w-4" />;
    case 'Assistência Social':
      return <Heart className="h-4 w-4" />;
    case 'Meio Ambiente':
      return <Leaf className="h-4 w-4" />;
    case 'Fazenda':
      return <Coins className="h-4 w-4" />;
    case 'Turismo':
      return <Globe className="h-4 w-4" />;
    case 'Cultura':
      return <Music className="h-4 w-4" />;
    case 'Esportes e Lazer':
      return <Award className="h-4 w-4" />;
    case 'Planejamento':
      return <PieChart className="h-4 w-4" />;
    case 'Comunicação':
      return <Radio className="h-4 w-4" />;
    case 'Ciência e Tecnologia':
      return <MapPin className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

export const getSetorColor = (setor: string): string => {
  switch (setor) {
    case 'Saúde':
      return 'bg-saude-DEFAULT text-white';
    case 'Educação':
      return 'bg-educacao-DEFAULT text-white';
    case 'Administrativo':
      return 'bg-administrativo-DEFAULT text-white';
    case 'Transporte':
      return 'bg-transporte-DEFAULT text-white';
    case 'Obras':
      return 'bg-blue-500 text-white';
    case 'Segurança Pública':
      return 'bg-red-500 text-white';
    case 'Assistência Social':
      return 'bg-purple-500 text-white';
    case 'Meio Ambiente':
      return 'bg-green-500 text-white';
    case 'Fazenda':
      return 'bg-yellow-600 text-white';
    case 'Turismo':
      return 'bg-cyan-500 text-white';
    case 'Cultura':
      return 'bg-pink-500 text-white';
    case 'Esportes e Lazer':
      return 'bg-orange-500 text-white';
    case 'Planejamento':
      return 'bg-indigo-500 text-white';
    case 'Comunicação':
      return 'bg-blue-400 text-white';
    case 'Ciência e Tecnologia':
      return 'bg-teal-500 text-white';
    default:
      return 'bg-slate-600 text-white';
  }
};
