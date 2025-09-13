import React from 'react';
import { useTranslation } from 'react-i18next';

const LiveResults = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">{t('live_results')}</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-indigo-600 text-white p-4">
          <h3 className="text-xl font-semibold">Dance Competition Results</h3>
        </div>
        
        <div className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Live Updates</span>
              <span className="text-sm text-gray-500">Last updated: Just now</span>
            </div>
            <div className="bg-gray-100 p-4 rounded">
              <p>🏆 1st Place: Anjali Kumar - Score: 9.5</p>
              <p>🥈 2nd Place: Ravi Pillai - Score: 9.2</p>
              <p>🥉 3rd Place: Priya Nair - Score: 8.9</p>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">All Participants</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">1</td>
                    <td className="px-6 py-4 whitespace-nowrap">Anjali Kumar</td>
                    <td className="px-6 py-4 whitespace-nowrap">9.5</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">2</td>
                    <td className="px-6 py-4 whitespace-nowrap">Ravi Pillai</td>
                    <td className="px-6 py-4 whitespace-nowrap">9.2</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">3</td>
                    <td className="px-6 py-4 whitespace-nowrap">Priya Nair</td>
                    <td className="px-6 py-4 whitespace-nowrap">8.9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveResults;