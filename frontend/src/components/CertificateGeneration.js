import React, { useEffect, useState } from 'react';
import certificateService from '../services/certificateService';
import eventService from '../services/eventService';
import userService from '../services/userService';

const CertificateGeneration = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [events, setEvents] = useState([]);
    const [participants, setParticipants] = useState([]);
    const [certificates, setCertificates] = useState([]);

    const [selectedEvent, setSelectedEvent] = useState('');
    const [selectedParticipant, setSelectedParticipant] = useState('');

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        try {
            setLoading(true);
            const [ev, certs] = await Promise.all([
                eventService.listEvents(),
                certificateService.list(),
            ]);
            setEvents(ev);
            setCertificates(certs);

            // Load participants list (users). If role filter exists, try role=student
            try {
                const users = await userService.list({ role: 'student' });
                setParticipants(users);
            } catch (_) {
                try { const usersAll = await userService.list(); setParticipants(usersAll); } catch (e2) { }
            }
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const refreshCertificates = async () => {
        try {
            const certs = await certificateService.list();
            setCertificates(certs);
        } catch (_) { }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!selectedEvent || !selectedParticipant) {
            setError('Please select event and participant');
            return;
        }
        setSaving(true);
        setError('');
        setSuccess('');
        try {
            await certificateService.generate({ participant: Number(selectedParticipant), event: Number(selectedEvent) });
            setSuccess('Certificate generated successfully');
            await refreshCertificates();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error(err);
            const apiMsg = err.response?.data;
            setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to generate certificate');
        } finally {
            setSaving(false);
        }
    };

    const downloadPdf = (id) => {
        const url = certificateService.downloadPdfUrl(id);
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg">
                <div className="border-b border-gray-200 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Certificate Generation</h2>
                            <p className="mt-1 text-gray-600">Generate and download certificates</p>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={init} className="px-3 py-2 rounded-md border">Refresh</button>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">{error}</div>
                )}
                {success && (
                    <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">{success}</div>
                )}

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
                        <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Event</label>
                                <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                    <option value="">Select event</option>
                                    {events.map((ev) => (
                                        <option key={ev.id} value={ev.id}>{ev.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Participant</label>
                                <select value={selectedParticipant} onChange={(e) => setSelectedParticipant(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                                    <option value="">Select participant</option>
                                    {participants.map((u) => (
                                        <option key={u.id} value={u.id}>{u.username || u.email || `User#${u.id}`}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-end">
                                <button type="submit" disabled={saving} className={`w-full px-4 py-2 rounded-md text-white ${saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>{saving ? 'Generating...' : 'Generate'}</button>
                            </div>
                        </form>
                    </div>

                    <div className="md:col-span-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Existing Certificates</h3>
                        {certificates.length === 0 ? (
                            <div className="text-gray-500">No certificates generated yet</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participant</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued At</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {certificates.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.event_details?.name || c.event}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{c.participant_details?.username || c.participant_details?.email || c.participant}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(c.issued_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button onClick={() => downloadPdf(c.id)} className="text-blue-600 hover:text-blue-900">Download PDF</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateGeneration;