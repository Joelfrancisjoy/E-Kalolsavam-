import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import AllowedEmailsManager from '../components/AllowedEmailsManager';
import UserManagement from '../components/UserManagement';
import EventManagement from '../components/EventManagement';
import ResultPublishing from '../components/ResultPublishing';
import CertificateGeneration from '../components/CertificateGeneration';

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
        return <SectionPlaceholder title={t('volunteer_coordination')} />;
      case 'settings':
        return <SectionPlaceholder title={t('system_settings') || 'System Settings'} />;
      case 'dashboard':
      default:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-6">{t('admin_panel')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdminCard
                title={t('user_management')}
                description="Manage students, judges, and volunteers"
                icon="👥"
                onClick={() => goTo('users')}
              />
              <AdminCard
                title="Google Signup Emails"
                description="Manage allowed email addresses for Google signup"
                icon="📧"
                onClick={() => goTo('allowed-emails')}
              />
              <AdminCard
                title={t('event_management')}
                description="Create and schedule events"
                icon="📅"
                onClick={() => goTo('events')}
              />
              <AdminCard
                title={t('result_publishing')}
                description="Publish and manage results"
                icon="🏆"
                onClick={() => goTo('results')}
              />
              <AdminCard
                title={t('certificate_generation')}
                description="Generate and distribute certificates"
                icon="📜"
                onClick={() => goTo('certificates')}
              />
              <AdminCard
                title={t('volunteer_coordination')}
                description="Assign shifts and manage volunteers"
                icon="🤝"
                onClick={() => goTo('volunteers')}
              />
              <AdminCard
                title={t('system_settings') || 'System Settings'}
                description="Configure portal settings"
                icon="⚙️"
                onClick={() => goTo('settings')}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      {activeSection !== 'dashboard' && (
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => goTo('')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Back to Admin Dashboard
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
      <div className={activeSection === 'dashboard' ? 'container mx-auto px-4 py-8' : ''}>
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
      className="bg-white/95 backdrop-blur-sm border border-amber-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="text-amber-700 text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-amber-900 mb-2 tracking-wide">{title}</h3>
      <p className="text-amber-800/80 mb-4 leading-relaxed">{description}</p>
      <button className="text-amber-800 font-semibold border border-amber-300 px-3 py-1.5 rounded-lg hover:bg-amber-50">
        Manage →
      </button>
    </div>
  );
};

export default AdminPanel;