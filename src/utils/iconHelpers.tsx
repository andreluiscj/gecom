
import React from 'react';
import { 
  HeartPulse, BookOpen, Building2, Bus, Briefcase, Shield,
  Heart, Leaf, Coins, Globe, Music, Award, PieChart, Radio, MapPin
} from 'lucide-react';
import { Setor } from '@/types';

export function getSetorIcon(setor: Setor) {
  switch (setor) {
    case 'Saúde':
      return <HeartPulse size={16} />;
    case 'Educação':
      return <BookOpen size={16} />;
    case 'Administrativo':
      return <Building2 size={16} />;
    case 'Transporte':
      return <Bus size={16} />;
    case 'Obras':
      return <Briefcase size={16} />;
    case 'Segurança Pública':
      return <Shield size={16} />;
    case 'Assistência Social':
      return <Heart size={16} />;
    case 'Meio Ambiente':
      return <Leaf size={16} />;
    case 'Fazenda':
      return <Coins size={16} />;
    case 'Turismo':
      return <Globe size={16} />;
    case 'Cultura':
      return <Music size={16} />;
    case 'Esportes e Lazer':
      return <Award size={16} />;
    case 'Planejamento':
      return <PieChart size={16} />;
    case 'Comunicação':
      return <Radio size={16} />;
    case 'Ciência e Tecnologia':
      return <MapPin size={16} />;
    default:
      return <Building2 size={16} />;
  }
}

export function getSetorColor(setor: Setor) {
  switch (setor) {
    case 'Saúde':
      return 'bg-red-100';
    case 'Educação':
      return 'bg-blue-100';
    case 'Administrativo':
      return 'bg-gray-100';
    case 'Transporte':
      return 'bg-yellow-100';
    case 'Obras':
      return 'bg-amber-100';
    case 'Segurança Pública':
      return 'bg-purple-100';
    case 'Assistência Social':
      return 'bg-pink-100';
    case 'Meio Ambiente':
      return 'bg-green-100';
    case 'Fazenda':
      return 'bg-emerald-100';
    case 'Turismo':
      return 'bg-cyan-100';
    case 'Cultura':
      return 'bg-indigo-100';
    case 'Esportes e Lazer':
      return 'bg-orange-100';
    case 'Planejamento':
      return 'bg-lime-100';
    case 'Comunicação':
      return 'bg-sky-100';
    case 'Ciência e Tecnologia':
      return 'bg-teal-100';
    default:
      return 'bg-gray-100';
  }
}
