 import React, { useEffect, useState } from 'react';

// Placeholder system settings with local storage persistence.
// Can be wired to backend later if endpoints are added.
const STORAGE_KEY = 'system_settings';

const defaultSettings = {
    maintenance_mode: false,
    site_title: 'E-Kalolsavam Portal',
    default_language: 'en',
};

const SystemSettings = () => {
    const [settings, setSettings] = useState(defaultSettings);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            try { setSettings({ ...defaultSettings, ...JSON.parse(raw) }); } catch (_) { }
        }
    }, []);

    const save = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">System Settings</h2>

            <div className="bg-white border rounded-xl p-4 max-w-2xl">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Portal Title</label>
                    <input
                        className="border rounded-lg px-3 py-2 w-full"
                        value={settings.site_title}
                        onChange={e => setSettings(s => ({ ...s, site_title: e.target.value }))}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
                    <select
                        className="border rounded-lg px-3 py-2 w-full"
                        value={settings.default_language}
                        onChange={e => setSettings(s => ({ ...s, default_language: e.target.value }))}
                    >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="ml">Malayalam</option>
                    </select>
                </div>

                <div className="mb-6 flex items-center gap-3">
                    <input
                        id="maintenance"
                        type="checkbox"
                        checked={settings.maintenance_mode}
                        onChange={e => setSettings(s => ({ ...s, maintenance_mode: e.target.checked }))}
                    />
                    <label htmlFor="maintenance" className="text-sm text-gray-800">Enable Maintenance Mode</label>
                </div>

                <div className="flex items-center gap-3">
                    <button onClick={save} className="px-4 py-2 border rounded-lg bg-amber-600 text-white hover:bg-amber-700">Save Settings</button>
                    {saved && <span className="text-green-700">Saved</span>}
                </div>
            </div>

            <p className="text-xs text-gray-500 mt-4">These settings are stored locally for now. Wire them to backend once available.</p>
        </div>
    );
};

export default SystemSettings;