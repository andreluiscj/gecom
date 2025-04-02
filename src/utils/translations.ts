
// Translation utility for the dashboard
export const getDashboardTranslation = (key: string, language: string = 'pt') => {
  const translations: Record<string, Record<string, string>> = {
    dashboardTitle: {
      pt: 'Dashboard',
      en: 'Dashboard'
    },
    overview: {
      pt: 'Visão geral da gestão municipal e dos recursos financeiros.',
      en: 'Overview of municipal management and financial resources.'
    },
    graphicsTab: {
      pt: 'Gráficos',
      en: 'Charts'
    },
    summaryTab: {
      pt: 'Resumo',
      en: 'Summary'
    },
    // Add other translations as needed
  };
  
  return translations[key]?.[language] || translations[key]?.['pt'] || key;
};
