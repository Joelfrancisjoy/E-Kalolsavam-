import React, { useEffect, useMemo, useState } from 'react';
import eventService from '../services/eventService';
import userService from '../services/userService';

const CATEGORY_OPTIONS = [
    { value: 'dance', label: 'Dance' },
    { value: 'music', label: 'Music' },
    { value: 'theatre', label: 'Theatre' },
    { value: 'literary', label: 'Literary' },
    { value: 'visual_arts', label: 'Visual Arts' },
];

const initialEventState = {
    name: '',
    description: '',
    category: 'dance',
    date: '', // YYYY-MM-DD
    start_time: '', // HH:MM
    end_time: '', // HH:MM
    venue: '', // id
    max_participants: 1,
    judges: [], // [ids]
};

const EventManagement = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [events, setEvents] = useState([]);
    const [venues, setVenues] = useState([]);
    const [judges, setJudges] = useState([]);

    const [filters, setFilters] = useState({ category: '', date: '' });

    const [activeTab, setActiveTab] = useState('list'); // list | form
    const [formData, setFormData] = useState(initialEventState);
    const [editingId, setEditingId] = useState(null);
    const isEditing = useMemo(() => editingId !== null, [editingId]);

    useEffect(() => {
        loadAll();
    }, []);

    const loadAll = async () => {
        try {
            setLoading(true);
            const [evData, venueData] = await Promise.all([
                eventService.listEvents(),
                eventService.listVenues(),
            ]);
            setEvents(evData);
            setVenues(venueData);
            // Try to fetch judges list (expects backend to support role filter)
            try {
                const judgeUsers = await userService.list({ role: 'judge' });
                setJudges(judgeUsers);
            } catch (_) {
                // fallback: load all users and let admin pick from them
                try {
                    const allUsers = await userService.list();
                    setJudges(allUsers);
                } catch (e2) {
                    // ignore
                }
            }
            setError('');
        } catch (err) {
            console.error('Failed to load events/venues', err);
            setError('Failed to load data');
        } finally {
            setLoading(false);
        }
    };

    const reloadEvents = async () => {
        try {
            const data = await eventService.listEvents(filters);
            setEvents(data);
        } catch (err) {
            console.error('Failed to reload events', err);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = async () => {
        await reloadEvents();
    };

    const resetForm = () => {
        setFormData(initialEventState);
        setEditingId(null);
    };

    const openCreate = () => {
        resetForm();
        setActiveTab('form');
    };

    const openEdit = (event) => {
        setEditingId(event.id);
        setFormData({
            name: event.name || '',
            description: event.description || '',
            category: event.category || 'dance',
            date: event.date || '',
            start_time: event.start_time?.slice(0, 5) || '',
            end_time: event.end_time?.slice(0, 5) || '',
            venue: event.venue || '',
            max_participants: event.max_participants || 1,
            judges: (event.judges || []),
        });
        setActiveTab('form');
    };

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value,
        }));
    };

    const handleJudgesChange = (e) => {
        const selected = Array.from(e.target.selectedOptions).map((o) => Number(o.value));
        setFormData((prev) => ({ ...prev, judges: selected }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            // Build payload compliant with backend
            const payload = {
                ...formData,
                venue: formData.venue ? Number(formData.venue) : null,
                judges: formData.judges || [],
            };

            if (isEditing) {
                await eventService.updateEvent(editingId, payload);
                setSuccess('Event updated successfully');
            } else {
                await eventService.createEvent(payload);
                setSuccess('Event created successfully');
            }

            await reloadEvents();
            setActiveTab('list');
            resetForm();

            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            console.error('Failed to save event', err);
            const apiMsg = err.response?.data;
            setError(typeof apiMsg === 'string' ? apiMsg : 'Failed to save event');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this event?')) return;
        try {
            await eventService.deleteEvent(id);
            setSuccess('Event deleted');
            await reloadEvents();
            setTimeout(() => setSuccess(''), 2000);
        } catch (err) {
            console.error('Failed to delete event', err);
            setError('Failed to delete event');
            setTimeout(() => setError(''), 3000);
        }
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
                            <h2 className="text-2xl font-bold text-gray-900">Event Management</h2>
                            <p className="mt-1 text-gray-600">Create, schedule and manage events</p>
                        </div>
                        <button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">+ New Event</button>
                    </div>

                    <div className="flex space-x-8 mt-4">
                        <button onClick={() => setActiveTab('list')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'list' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Events</button>
                        <button onClick={() => setActiveTab('form')} className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'form' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>{isEditing ? 'Edit Event' : 'Create Event'}</button>
                    </div>
                </div>

                {error && (
                    <div className="mx-6 mt-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">{error}</div>
                )}
                {success && (
                    <div className="mx-6 mt-4 p-4 bg-green-50 border border-green-200 rounded-md text-green-800 text-sm">{success}</div>
                )}

                <div className="p-6">
                    {activeTab === 'list' && (
                        <>
                            <Filters
                                filters={filters}
                                onChange={handleFilterChange}
                                onApply={applyFilters}
                            />
                            <EventList events={events} venues={venues} judges={judges} onEdit={openEdit} onDelete={handleDelete} />
                        </>
                    )}

                    {activeTab === 'form' && (
                        <EventForm
                            venues={venues}
                            judges={judges}
                            data={formData}
                            onChange={handleChange}
                            onJudgesChange={handleJudgesChange}
                            onCancel={() => { setActiveTab('list'); resetForm(); }}
                            onSubmit={handleSubmit}
                            saving={saving}
                            isEditing={isEditing}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

const Filters = ({ filters, onChange, onApply }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={filters.category} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    <option value="">All</option>
                    {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={filters.date} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
            </div>
            <div className="flex items-end">
                <button onClick={onApply} className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-900 w-full">Apply</button>
            </div>
        </div>
    );
};

const EventList = ({ events, venues, judges, onEdit, onDelete }) => {
    const venueLabel = (id) => venues.find((v) => v.id === id)?.name || '-';
    const judgeName = (id) => judges.find((u) => u.id === id)?.username || `User#${id}`;

    if (!events.length) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No events found</div>
                <p className="text-gray-400 mt-2">Create your first event</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judges</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {events.map((ev) => (
                        <tr key={ev.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{ev.name}</div>
                                <div className="text-xs text-gray-500 max-w-xs truncate">{ev.description}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ev.category}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ev.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{ev.start_time} - {ev.end_time}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{venueLabel(ev.venue)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                <div className="flex flex-wrap gap-1">
                                    {(ev.judges || []).map((jid) => (
                                        <span key={jid} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                                            {judgeName(jid)}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                <button onClick={() => onEdit(ev)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                <button onClick={() => onDelete(ev.id)} className="text-red-600 hover:text-red-900">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const EventForm = ({ venues, judges, data, onChange, onJudgesChange, onCancel, onSubmit, saving, isEditing }) => {
    return (
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input name="name" value={data.name} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea name="description" value={data.description} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" rows={3} />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select name="category" value={data.category} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm">
                    {CATEGORY_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" name="date" value={data.date} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input type="time" name="start_time" value={data.start_time} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input type="time" name="end_time" value={data.end_time} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Venue</label>
                <select name="venue" value={data.venue} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required>
                    <option value="">Select a venue</option>
                    {venues.map((v) => (
                        <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                <input type="number" min={1} name="max_participants" value={data.max_participants} onChange={onChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Judges</label>
                <select multiple value={data.judges} onChange={onJudgesChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm h-40">
                    {judges.map((u) => (
                        <option key={u.id} value={u.id}>{u.username || u.email || `User#${u.id}`}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple judges</p>
            </div>

            <div className="md:col-span-2 flex items-center justify-end space-x-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 rounded-md border">Cancel</button>
                <button type="submit" disabled={saving} className={`px-4 py-2 rounded-md text-white ${saving ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {saving ? 'Saving...' : isEditing ? 'Update Event' : 'Create Event'}
                </button>
            </div>
        </form>
    );
};

export default EventManagement;