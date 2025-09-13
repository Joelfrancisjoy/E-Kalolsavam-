import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header = ({ changeLanguage }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    // Clear auth tokens
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b-2 border-amber-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-amber-800 tracking-wide">E-Kalolsavam Portal</h1>
        <div className="flex items-center space-x-4">
          <select
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-white text-amber-800 border-2 border-amber-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <option value="en">{t('english')}</option>
            <option value="ml">{t('malayalam')}</option>
          </select>
          <button
            onClick={handleLogout}
            className="text-amber-800 border-2 border-amber-300 hover:border-amber-400 hover:bg-amber-50 font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;