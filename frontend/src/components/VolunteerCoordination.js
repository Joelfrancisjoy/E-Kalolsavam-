import React, { useEffect, useMemo, useState } from 'react';
import volunteerService from '../services/volunteerService';
import eventService from '../services/eventService';
import userService from '../services/userService';

// Utility
const cx = (...c) => c.filter(Boolean).join(' ');

const VolunteerCoordination = () => {
    const [shifts, setShifts] = useState([]);
    const [events, setEvents] = useState([]);
    const [volunteers, setVolunteers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        event: '',
        date: '',
        start_time: '',
        end_time: '',
        description: '',
        required_volunteers: 1,
    });

    const [query, setQuery] = useState('');

    const filteredShifts = useMemo(() => {
        const q = query.trim().toLowerCase();
        return shifts.filter(s => {
            const desc = `${s.description || ''} ${s.event_details?.name || ''}`.toLowerCase();
            return !q || desc.includes(q);
        });
    }, [shifts, query]);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError('');
            try {
                const [sh, ev] = await Promise.all([
                    volunteerService.listShifts(),
                    eventService.listEvents(),
                ]);
                setShifts(Array.isArray(sh) ? sh : sh.results || []);
                setEvents(Array.isArray(ev) ? ev : ev.results || []);
                try {
                    const users = await userService.list({ role: 'volunteer' });
                    setVolunteers(Array.isArray(users) ? users : users.results || []);
                } catch (_) { /* optional */ }
            } catch (e) {
                setError('Failed to load volunteer data.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const onCreateShift = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const created = await volunteerService.createShift(form);
            setShifts(prev => [created, ...prev]);
            setForm({ event: '', date: '', start_time: '', end_time: '', description: '', required_volunteers: 1 });
        } catch (e) {
            setError('Failed to create shift.');
        }
    };

    const assignVolunteer = async (shiftId, volunteerId) => {
        try {
            await volunteerService.createAssignment({ shift: shiftId, volunteer: volunteerId });
            const updated = await volunteerService.listShifts();
            setShifts(Array.isArray(updated) ? updated : updated.results || []);
        } catch (e) {
            setError('Failed to assign volunteer.');
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Volunteer Coordination</h2>

            {error && <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">{error}</div>}

            <div className="bg-white border rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold mb-3">Create Shift</h3>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={onCreateShift}>
                    <select
                        required
                        className="border rounded-lg px-3 py-2"
                        value={form.event}
                        onChange={e => setForm({ ...form, event: e.target.value })}
                    >
                        <option value="">Select Event</option>
                        {events.map(ev => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
                    </select>
                    <input type="date" required className="border rounded-lg px-3 py-2" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                    <input type="time" required className="border rounded-lg px-3 py-2" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
                    <input type="time" required className="border rounded-lg px-3 py-2" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} />
                    <input type="number" min="1" className="border rounded-lg px-3 py-2" value={form.required_volunteers} onChange={e => setForm({ ...form, required_volunteers: Number(e.target.value) })} placeholder="Required volunteers" />
                    <input className="border rounded-lg px-3 py-2 md:col-span-2" placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                    <div className="md:col-span-2 flex justify-end">
                        <button className="px-4 py-2 border rounded-lg bg-amber-600 text-white hover:bg-amber-700">Create Shift</button>
                    </div>
                </form>
            </div>

            <div className="bg-white border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Shifts</h3>
                    <input className="border rounded-lg px-3 py-2" placeholder="Search shifts" value={query} onChange={e => setQuery(e.target.value)} />
                </div>

                <div className="overflow-auto">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <Th>Event</Th>
                                <Th>Date</Th>
                                <Th>Time</Th>
                                <Th>Req.</Th>
                                <Th>Description</Th>
                                <Th>Assigned</Th>
                                <Th className="text-right">Assign</Th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={7} className="p-6 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredShifts.length === 0 ? (
                                <tr><td colSpan={7} className="p-6 text-center text-gray-500">No shifts</td></tr>
                            ) : (
                                filteredShifts.map(shift => (
                                    <tr key={shift.id} className="border-t">
                                        <Td>{shift.event_details?.name || '-'}</Td>
                                        <Td>{shift.date}</Td>
                                        <Td>{shift.start_time} - {shift.end_time}</Td>
                                        <Td>{shift.required_volunteers}</Td>
                                        <Td>{shift.description}</Td>
                                        <Td>
                                            <div className="flex flex-wrap gap-1">
                                                {(shift.volunteers_assigned || []).map(v => (
                                                    <span key={v.id} className="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-800 border border-amber-200">{v.username}</span>
                                                ))}
                                            </div>
                                        </Td>
                                        <Td alignRight>
                                            <select className="border rounded px-2 py-1 mr-2" defaultValue="" onChange={(e) => { const id = e.target.value; if (!id) return; assignVolunteer(shift.id, id); e.target.value = ''; }}>
                                                <option value="">Select volunteer</option>
                                                {volunteers.map(v => <option key={v.id} value={v.id}>{v.username}</option>)}
                                            </select>
                                        </Td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const Th = ({ children, className }) => (
    <th className={cx('text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3', className)}>{children}</th>
);
const Td = ({ children, alignRight }) => (
    <td className={cx('px-4 py-3 text-sm text-gray-800', alignRight && 'text-right')}>{children}</td>
);

export default VolunteerCoordination;