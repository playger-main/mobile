// Функция для динамической смены стилей баджа в зависимости от вида спорта
export const getBadgeStyle = (sport: string) => {
    switch (sport.toLowerCase()) {
      case 'basketball':
        return { bg: '#FFF0E6', text: '#FF8000' };
      case 'football':
        return { bg: '#EAF9F5', text: '#27AE60' };
      case 'tennis':
        return { bg: '#EBF3FF', text: '#208AEF' };
      case 'pickleball':
        return { bg: '#F2E8FF', text: '#9B51E0' };
      case 'skateboarding':
        return { bg: '#F1F3F5', text: '#495057' };
      default:
        return { bg: '#F0F4F8', text: '#6080A8' };
    }
};