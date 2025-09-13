import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 opacity-5">
          <svg viewBox="0 0 200 200" className="w-full h-full text-amber-600">
            <defs>
              <pattern id="dashboard-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="3" fill="currentColor" />
                <path d="M10,10 Q20,5 30,10 Q25,20 30,30 Q20,35 10,30 Q15,20 10,10" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="200" height="200" fill="url(#dashboard-pattern)" />
          </svg>
        </div>

        <div className="absolute top-20 right-10 w-32 h-32 opacity-10 text-orange-600">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M50,10 Q70,30 50,50 Q30,30 50,10" fill="currentColor" />
            <circle cx="50" cy="70" r="8" fill="currentColor" />
          </svg>
        </div>
      </div>

      {/* Header Section */}
      <div className="relative bg-white/90 backdrop-blur-sm border-b-2 border-amber-200 shadow-sm mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1
              className="text-4xl font-bold text-amber-800 mb-2"
              style={{ fontFamily: 'Cinzel, serif' }}
            >
              E-Kalolsavam Dashboard
            </h1>
            <p
              className="text-xl text-orange-700 italic"
              style={{ fontFamily: 'Dancing Script, cursive' }}
            >
              "Manage Your Cultural Journey"
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
                <path d="M0,0 Q50,25 100,0 L100,50 Q75,25 100,100 L50,100 Q25,75 0,100 Z" fill="currentColor" />
              </svg>
            </div>

            <div className="relative z-10">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-amber-800 mb-4">{t('welcome')}</h2>
              <p className="text-lg text-orange-700">Choose your role to access the appropriate dashboard</p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <DashboardCard
            title={t('student_dashboard')}
            description="View registered events, schedule, and results"
            link="/student"
            color="from-blue-500 to-blue-600"
            icon="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"
            navigate={navigate}
          />
          <DashboardCard
            title={t('judge_dashboard')}
            description="Score participants and view assigned events"
            link="/judge"
            color="from-green-500 to-green-600"
            /* Justice scale icon path for a professional judge representation */
            icon="M12 2C12.552 2 13 2.448 13 3V5H20C20.552 5 21 5.448 21 6V7C21 7.552 20.552 8 20 8H18.874C19.594 8.613 20 9.444 20 10.5C20 12.433 18.433 14 16.5 14C14.567 14 13 12.433 13 10.5C13 9.444 13.406 8.613 14.126 8H9.874C10.594 8.613 11 9.444 11 10.5C11 12.433 9.433 14 7.5 14C5.567 14 4 12.433 4 10.5C4 9.444 4.406 8.613 5.126 8H4C3.448 8 3 7.552 3 7V6C3 5.448 3.448 5 4 5H11V3C11 2.448 11.448 2 12 2ZM7.5 10C8.328 10 9 10.672 9 11.5C9 12.328 8.328 13 7.5 13C6.672 13 6 12.328 6 11.5C6 10.672 6.672 10 7.5 10ZM16.5 10C17.328 10 18 10.672 18 11.5C18 12.328 17.328 13 16.5 13C15.672 13 15 12.328 15 11.5C15 10.672 15.672 10 16.5 10ZM12 15C12.552 15 13 15.448 13 16V20H16C16.552 20 17 20.448 17 21C17 21.552 16.552 22 16 22H8C7.448 22 7 21.552 7 21C7 20.448 7.448 20 8 20H11V16C11 15.448 11.448 15 12 15Z"
            navigate={navigate}
          />
          <DashboardCard
            title={t('admin_panel')}
            description="Manage users, events, and certificates"
            link="/admin"
            color="from-purple-500 to-purple-600"
            icon="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M21,16V10.5L19.5,9.5L21,8.5V3H16.5L15.5,1.5L14.5,3H10V8.5L11.5,9.5L10,10.5V16L11.5,17.5L10,19V24H14.5L15.5,22.5L16.5,24H21V19L19.5,17.5L21,16Z"
            navigate={navigate}
          />
          <DashboardCard
            title={t('volunteer_dashboard')}
            description="View shifts and instructions"
            link="/volunteer"
            color="from-amber-500 to-orange-500"
            icon="M16,4C16.88,4 17.67,4.38 18.18,5C18.69,4.38 19.48,4 20.36,4C21.8,4 23,5.2 23,6.64C23,8.09 21.8,9.29 20.36,9.29C19.48,9.29 18.69,8.91 18.18,8.29C17.67,8.91 16.88,9.29 16,9.29C14.56,9.29 13.36,8.09 13.36,6.64C13.36,5.2 14.56,4 16,4M13,12H21V14H13V12M13,16H21V18H13V16M13,20H21V22H13V20M11,13H9V11H11V13M11,17H9V15H11V17M11,21H9V19H11V21Z"
            navigate={navigate}
          />
        </div>

        {/* Live Results Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl p-8 border-2 border-amber-200/50 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full text-orange-600">
              <path d="M20,20 Q50,10 80,20 Q70,50 80,80 Q50,70 20,80 Q30,50 20,20" fill="none" stroke="currentColor" strokeWidth="2" />
              <circle cx="50" cy="50" r="15" fill="currentColor" opacity="0.3" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-amber-800 mb-2">{t('live_results')}</h3>
              <p className="text-orange-700">Real-time updates from ongoing competitions</p>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
              <div className="text-center">
                <div className="animate-pulse">
                  <div className="w-16 h-16 bg-amber-200 rounded-full mx-auto mb-4"></div>
                  <p className="text-amber-700 font-medium">Live results ticker will appear here</p>
                  <p className="text-sm text-amber-600 mt-2">Competition results will be updated in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard = ({ title, description, link, color, icon, navigate }) => {
  const handleClick = () => {
    navigate(link);
  };

  return (
    <div className="group cursor-pointer" onClick={handleClick}>
      <div className={`bg-gradient-to-br ${color} text-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden`}>
        {/* Decorative Background Element */}
        <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-white">
            <circle cx="50" cy="50" r="30" fill="currentColor" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Icon */}
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d={icon} />
            </svg>
          </div>

          {/* Content */}
          <h3 className="text-xl font-bold mb-3 leading-tight">{title}</h3>
          <p className="text-white/90 mb-6 text-sm leading-relaxed">{description}</p>

          {/* Button */}
          <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 border border-white/30 hover:border-white/50">
            Access Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;