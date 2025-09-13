import React, { useEffect, useMemo, useState } from 'react';
import userService from '../services/userService';

// Small utility for classNames
const cx = (...cls) => cls.filter(Boolean).join(' ');

const roles = [
    { value: 'student', label: 'Student' },
    { value: 'judge', label: 'Judge' },
    { value: 'volunteer', label: 'Volunteer' },
    { value: 'admin', label: 'Admin' },
];

const PAGE_SIZE = 10;

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [query, setQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [page, setPage] = useState(1);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return users.filter(u => {
            const matchesQuery = !q || [u.username, u.email, u.first_name, u.last_name].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
            const matchesRole = !roleFilter || u.role === roleFilter;
            return matchesQuery && matchesRole;
        });
    }, [users, query, roleFilter]);

    const paged = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError('');
            try {
                const data = await userService.list();
                setUsers(Array.isArray(data) ? data : data.results || []);
            } catch (e) {
                setError('Failed to load users.');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const updateUser = async (id, patch) => {
        try {
            const updated = await userService.update(id, patch);
            setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updated } : u)));
        } catch (e) {
            setError('Failed to update user.');
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await userService.remove(id);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (e) {
            setError('Failed to delete user.');
        }
    };

    const onRoleChange = (id, role) => updateUser(id, { role });
    const onPhoneChange = (id, phone) => updateUser(id, { phone });

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">User Management</h2>

            {error && (
                <div className="mb-4 p-3 border border-red-200 bg-red-50 text-red-700 rounded">{error}</div>
            )}

            {/* Controls */}
            <div className="bg-white border rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                    className="border rounded-lg px-3 py-2"
                    placeholder="Search by name, username, email"
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setPage(1); }}
                />
                <select
                    className="border rounded-lg px-3 py-2"
                    value={roleFilter}
                    onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                >
                    <option value="">All roles</option>
                    {roles.map(r => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                </select>
                <div className="text-sm text-gray-600 self-center">{filtered.length} users</div>
                <div className="flex items-center gap-2 justify-end">
                    <button
                        className="px-3 py-2 border rounded-lg disabled:opacity-50"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page <= 1}
                    >Prev</button>
                    <span className="text-sm">{page} / {totalPages}</span>
                    <button
                        className="px-3 py-2 border rounded-lg disabled:opacity-50"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page >= totalPages}
                    >Next</button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto bg-white border rounded-xl">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <Th>Username</Th>
                            <Th>Name</Th>
                            <Th>Email</Th>
                            <Th>Role</Th>
                            <Th>Phone</Th>
                            <Th className="text-right">Actions</Th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-500">Loading...</td></tr>
                        ) : paged.length === 0 ? (
                            <tr><td colSpan={6} className="p-6 text-center text-gray-500">No users</td></tr>
                        ) : (
                            paged.map(u => (
                                <tr key={u.id} className="border-t">
                                    <Td>{u.username}</Td>
                                    <Td>{[u.first_name, u.last_name].filter(Boolean).join(' ') || '-'}</Td>
                                    <Td>{u.email}</Td>
                                    <Td>
                                        <select
                                            className="border rounded px-2 py-1"
                                            value={u.role || ''}
                                            onChange={(e) => onRoleChange(u.id, e.target.value)}
                                        >
                                            {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                                        </select>
                                    </Td>
                                    <Td>
                                        <InlineEdit
                                            value={u.phone || ''}
                                            placeholder="Add phone"
                                            onSave={(val) => onPhoneChange(u.id, val)}
                                        />
                                    </Td>
                                    <Td alignRight>
                                        <button
                                            className="text-red-600 hover:text-red-800"
                                            onClick={() => deleteUser(u.id)}
                                        >Delete</button>
                                    </Td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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

// Simple inline edit text input
const InlineEdit = ({ value, onSave, placeholder }) => {
    const [val, setVal] = useState(value);
    const [editing, setEditing] = useState(false);

    useEffect(() => setVal(value), [value]);

    const commit = () => {
        setEditing(false);
        if (val !== value) onSave(val);
    };

    return (
        <div className="flex items-center gap-2">
            {editing ? (
                <input
                    autoFocus
                    className="border rounded px-2 py-1"
                    value={val}
                    placeholder={placeholder}
                    onChange={(e) => setVal(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => e.key === 'Enter' && commit()}
                />
            ) : (
                <button className="text-blue-700 hover:underline" onClick={() => setEditing(true)}>
                    {value ? value : '—'}
                </button>
            )}
        </div>
    );
};

export default UserManagement;