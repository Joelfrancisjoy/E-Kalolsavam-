import React from 'react';
import { useTranslation } from 'react-i18next';

const JudgeDashboard = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('judge_dashboard')}</h2>
      
      <div className="grid grid-cols-1 gap-6">
        <DashboardSection title={t('assigned_events')}>
          <ul className="space-y-4">
            <EventCard 
              name="Dance Competition" 
              date="Oct 15, 2023" 
              time="10:00 AM" 
              venue="Main Hall"
            />
            <EventCard 
              name="Music Solo" 
              date="Oct 16, 2023" 
              time="2:00 PM" 
              venue="Auditorium"
            />
          </ul>
        </DashboardSection>
        
        <DashboardSection title={t('scoring_panel')}>
          <div className="bg-white p-6 rounded shadow">
            <h4 className="text-lg font-semibold mb-4">Current Participant: Anjali Kumar</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <ScoreInput label="Creativity" />
              <ScoreInput label="Technique" />
              <ScoreInput label="Stage Presence" />
            </div>
            <textarea 
              className="w-full p-3 border rounded mb-4" 
              rows="3" 
              placeholder="Comments..."
            ></textarea>
            <div className="flex justify-end space-x-3">
              <button className="bg-gray-500 text-white px-4 py-2 rounded">
                Skip
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit Score
              </button>
            </div>
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

const EventCard = ({ name, date, time, venue }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex justify-between items-center">
      <div>
        <h4 className="font-semibold">{name}</h4>
        <p className="text-gray-600">{date} at {time} - {venue}</p>
      </div>
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        View Details
      </button>
    </div>
  );
};

const ScoreInput = ({ label }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type="number" 
        min="0" 
        max="10" 
        step="0.1"
        className="w-full p-2 border rounded"
        placeholder="0-10"
      />
    </div>
  );
};

export default JudgeDashboard;