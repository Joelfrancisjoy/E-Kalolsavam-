import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AllowedEmailsManager from '../components/AllowedEmailsManager';
import UserManagement from '../components/UserManagement';
import EventManagement from '../components/EventManagement';
import ResultPublishing from '../components/ResultPublishing';
import CertificateGeneration from '../components/CertificateGeneration';
import VolunteerCoordination from '../components/VolunteerCoordination';
import SystemSettings from '../components/SystemSettings';
import SchoolManagement from '../components/SchoolManagement';
import IDManagement from '../components/IDManagementEnhanced';

const AdminPanel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { section } = useParams();

  // Determine active section from URL param; default to dashboard
  const activeSection = useMemo(() => section || 'dashboard', [section]);

  const goTo = (target) => navigate(target ? `/admin/${target}` : '/admin');

  const renderContent = () => {
    switch (activeSection) {
      case 'allowed-emails':
        return <AllowedEmailsManager />;
      case 'users':
        return <UserManagement />;
      case 'events':
        return <EventManagement />;
      case 'results':
        return <ResultPublishing />;
      case 'certificates':
        return <CertificateGeneration />;
      case 'volunteers':
        return <VolunteerCoordination />;
      case 'settings':
        return <SystemSettings />;
      case 'schools':
        return <SchoolManagement />;
      case 'ids':
        return <IDManagement />;
      case 'dashboard':
      default:
        return (
          <div className="relative">
            {/* Header with enhanced styling */}
            <div className="text-center mb-12">
              <div className="inline-block">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                  {t('admin_panel')}
                </h2>
                <div className="w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </div>
              <p className="text-gray-600 mt-4 text-lg">Comprehensive management dashboard for E-Kalolsavam</p>
            </div>

            {/* Creative grid layout with staggered animation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Row 1 */}
              <div className="animate-fade-in-up animation-delay-100">
                <AdminCard
                  title={t('user_management')}
                  description="Manage students, judges, and volunteers"
                  icon="👥"
                  onClick={() => goTo('users')}
                />
              </div>
              <div className="animate-fade-in-up animation-delay-200">
                <AdminCard
                  title="Google Signup Emails"
                  description="Manage allowed email addresses for Google signup"
                  icon="📧"
                  onClick={() => goTo('allowed-emails')}
                />
              </div>
              <div className="animate-fade-in-up animation-delay-300 md:col-span-1 lg:col-span-1">
                <AdminCard
                  title={t('event_management')}
                  description="Create and schedule events"
                  icon="📅"
                  onClick={() => goTo('events')}
                />
              </div>

              {/* Row 2 */}
              <div className="animate-fade-in-up animation-delay-400">
                <AdminCard
                  title={t('result_publishing')}
                  description="Publish and manage results"
                  icon="🏆"
                  onClick={() => goTo('results')}
                />
              </div>
              <div className="animate-fade-in-up animation-delay-500">
                <AdminCard
                  title={t('certificate_generation')}
                  description="Generate and distribute certificates"
                  icon="📜"
                  onClick={() => goTo('certificates')}
                />
              </div>
              <div className="animate-fade-in-up animation-delay-600">
                <AdminCard
                  title={t('volunteer_coordination')}
                  description="Assign shifts and manage volunteers"
                  icon="🤝"
                  onClick={() => goTo('volunteers')}
                />
              </div>

              {/* Row 3 - New workflow features */}
              <div className="animate-fade-in-up animation-delay-700">
                <AdminCard
                  title="School Management"
                  description="Create and manage school accounts"
                  icon="🏫"
                  onClick={() => goTo('schools')}
                />
              </div>
              <div className="animate-fade-in-up animation-delay-800">
                <AdminCard
                  title="ID Management"
                  description="Generate IDs for volunteers and judges"
                  icon="🔑"
                  onClick={() => goTo('ids')}
                />
              </div>

              {/* Row 4 - Centered single card */}
              <div className="md:col-span-2 lg:col-span-3 flex justify-center animate-fade-in-up animation-delay-900">
                <div className="max-w-md w-full">
                  <AdminCard
                    title={t('system_settings') || 'System Settings'}
                    description="Configure portal settings and system preferences"
                    icon="⚙️"
                    onClick={() => goTo('settings')}
                  />
                </div>
              </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-xl"></div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200/30 to-pink-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Bar */}
      {activeSection !== 'dashboard' && (
        <div className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => goTo('')}
                  className="group flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  <span className="transform group-hover:-translate-x-1 transition-transform duration-200">←</span>
                  <span className="ml-2">Back to Admin Dashboard</span>
                </button>
                <div className="text-gray-300">|</div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {activeSection === 'allowed-emails' && 'Google Signup Email Management'}
                  {activeSection === 'users' && 'User Management'}
                  {activeSection === 'events' && 'Event Management'}
                  {activeSection === 'results' && 'Result Publishing'}
                  {activeSection === 'certificates' && 'Certificate Generation'}
                  {activeSection === 'volunteers' && 'Volunteer Coordination'}
                  {activeSection === 'settings' && 'System Settings'}
                </h1>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`relative z-10 ${activeSection === 'dashboard' ? 'max-w-7xl mx-auto px-4 py-12' : ''}`}>
        {renderContent()}
      </div>
    </div>
  );
};

const SectionPlaceholder = ({ title }) => (
  <div className="container mx-auto px-4 py-8">
    <h2 className="text-2xl font-bold mb-6">{title}</h2>
    <p className="text-gray-700 mb-2">Coming soon.</p>
    <p className="text-gray-600">Build this section at: <code className="bg-gray-100 px-1 py-0.5 rounded">/admin/&lt;section&gt;</code></p>
  </div>
);

const AdminCard = ({ title, description, icon, onClick }) => {
  return (
    <div
      className="group relative bg-gradient-to-br from-white via-gray-50 to-gray-100 border border-gray-200/80 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-105 overflow-hidden"
      onClick={onClick}
    >
      {/* Animated background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
      <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-500 delay-100"></div>

      <div className="relative z-10">
        {/* Interactive icon with hover animation */}
        <div className="text-4xl mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 group-hover:drop-shadow-lg">
          {icon}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mb-3 tracking-wide group-hover:text-blue-700 transition-colors duration-300">
          {title}
        </h3>

        <p className="text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>

        {/* Enhanced button with ripple effect */}
        <button className="relative inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden group/btn">
          <span className="relative z-10">Manage</span>
          <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300">→</span>

          {/* Ripple effect */}
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-xl"></div>
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;