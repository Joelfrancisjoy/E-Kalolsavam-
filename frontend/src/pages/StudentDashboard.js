import React from 'react';
import { useTranslation } from 'react-i18next';

const StudentDashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('student_dashboard')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSection title={t('registered_events')}>
          <ul className="space-y-2">
            <li className="bg-white p-4 rounded shadow">Dance Competition - Oct 15, 2023</li>
            <li className="bg-white p-4 rounded shadow">Music Solo - Oct 16, 2023</li>
          </ul>
        </DashboardSection>
        
        <DashboardSection title={t('schedule')}>
          <ul className="space-y-2">
            <li className="bg-white p-4 rounded shadow">Dance Competition: 10:00 AM - Main Hall</li>
            <li className="bg-white p-4 rounded shadow">Music Solo: 2:00 PM - Auditorium</li>
          </ul>
        </DashboardSection>
        
        <DashboardSection title={t('qr_id_card')}>
          <div className="bg-white p-4 rounded shadow text-center">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-32 h-32 mx-auto mb-4" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded">
              Download QR ID Card
            </button>
          </div>
        </DashboardSection>
        
        <DashboardSection title={t('results')}>
          <ul className="space-y-2">
            <li className="bg-white p-4 rounded shadow">Dance Competition: 2nd Place</li>
            <li className="bg-white p-4 rounded shadow">Music Solo: Participated</li>
          </ul>
        </DashboardSection>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">{t('feedback')}</h3>
        <div className="bg-white p-6 rounded shadow">
          <textarea 
            className="w-full p-3 border rounded mb-4" 
            rows="4" 
            placeholder="Share your feedback about the event..."
          ></textarea>
          <button className="bg-green-500 text-white px-4 py-2 rounded">
            Submit Feedback
          </button>
        </div>
      </div>
    </div>
  );
};

const DashboardSection = ({ title, children }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
};

export default StudentDashboard;