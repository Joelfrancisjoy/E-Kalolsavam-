import React from 'react';
import { useTranslation } from 'react-i18next';

const VolunteerDashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('volunteer_dashboard')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardSection title={t('shift_allocation')}>
          <ul className="space-y-4">
            <ShiftCard 
              event="Dance Competition" 
              date="Oct 15, 2023" 
              time="9:00 AM - 12:00 PM" 
              venue="Main Hall"
              status="Confirmed"
            />
            <ShiftCard 
              event="Music Solo" 
              date="Oct 16, 2023" 
              time="1:00 PM - 5:00 PM" 
              venue="Auditorium"
              status="Pending Confirmation"
            />
          </ul>
        </DashboardSection>
        
        <DashboardSection title={t('instructions')}>
          <div className="bg-white p-6 rounded shadow">
            <ul className="list-disc pl-5 space-y-2">
              <li>Arrive 30 minutes before your shift starts</li>
              <li>Wear your volunteer ID badge at all times</li>
              <li>Report to the volunteer coordinator upon arrival</li>
              <li>Assist participants as needed</li>
              <li>Notify coordinator of any issues immediately</li>
            </ul>
          </div>
        </DashboardSection>
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

const ShiftCard = ({ event, date, time, venue, status }) => {
  const statusColor = status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-semibold">{event}</h4>
          <p className="text-gray-600">{date}</p>
          <p className="text-gray-600">{time} - {venue}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor}`}>
          {status}
        </span>
      </div>
      <div className="mt-4 flex space-x-2">
        <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
          View Details
        </button>
        {status !== 'Confirmed' && (
          <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
            Confirm
          </button>
        )}
      </div>
    </div>
  );
};

export default VolunteerDashboard;