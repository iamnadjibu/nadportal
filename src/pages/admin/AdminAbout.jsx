import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Loader2, Save, Plus, Trash2 } from 'lucide-react';

const defaultAboutData = {
    name: "Nadjibullah Uwabato",
    description: "A visionary director and creative engineer dedicated to the intersection of cinematic storytelling and digital innovation. \nWith a focus on AI-driven narrative and high-performance web architecture, NAD PORTAL serves as the central node for \nexperimental and professional visual productions.",
    imageUrl: "https://via.placeholder.com/800x800",
    domains: [
        { label: "Primary Domain", value: "Film & Production" },
        { label: "Secondary Node", value: "Creative Engineering" }
    ]
};

export default function AdminAbout() {
    const [aboutData, setAboutData] = useState(defaultAboutData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const docSnap = await getDoc(doc(db, 'nad_settings', 'about'));
            if (docSnap.exists()) {
                setAboutData(docSnap.data());
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'nad_settings', 'about'), aboutData);
            alert('About page settings saved successfully.');
        } catch (err) {
            console.error('Error saving about settings:', err);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const addDomain = () => {
        setAboutData({
            ...aboutData,
            domains: [...aboutData.domains, { label: "New Label", value: "New Value" }]
        });
    };

    const removeDomain = (indexToRemove) => {
        setAboutData({
            ...aboutData,
            domains: aboutData.domains.filter((_, idx) => idx !== indexToRemove)
        });
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-amber-500 mx-auto" /></div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter">ABOUT SETTINGS</h1>
                    <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">Manage About Page Content</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all flex items-center space-x-2"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Content</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Personal Info & Image */}
                <div className="space-y-10">
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <h3 className="text-white font-black uppercase text-sm mb-6 border-b border-zinc-800 pb-2">Profile Information</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                                <input
                                    type="text"
                                    value={aboutData.name}
                                    onChange={(e) => setAboutData({...aboutData, name: e.target.value})}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors mt-2"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Image URL</label>
                                <input
                                    type="text"
                                    value={aboutData.imageUrl}
                                    onChange={(e) => setAboutData({...aboutData, imageUrl: e.target.value})}
                                    placeholder="https://..."
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors mt-2"
                                />
                                {aboutData.imageUrl && (
                                    <div className="mt-4 rounded-2xl overflow-hidden border border-zinc-800 w-32 h-32">
                                        <img src={aboutData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Description</label>
                                <textarea
                                    value={aboutData.description}
                                    onChange={(e) => setAboutData({...aboutData, description: e.target.value})}
                                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors resize-none mt-2"
                                    rows={6}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Domains / Expertise */}
                <div className="space-y-10">
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-2">
                            <h3 className="text-white font-black uppercase text-sm">Domains & Expertise</h3>
                            <button 
                                onClick={addDomain}
                                className="text-amber-500 hover:text-white flex items-center space-x-1 text-[10px] uppercase font-bold tracking-widest transition-colors"
                            >
                                <Plus size={14} />
                                <span>Add Domain</span>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {aboutData.domains.map((domain, idx) => (
                                <div key={idx} className="flex space-x-4 items-center bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50">
                                    <div className="flex-1 space-y-4">
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Label</label>
                                            <input
                                                type="text"
                                                value={domain.label}
                                                placeholder="e.g. Primary Domain"
                                                onChange={(e) => {
                                                    const newDomains = [...aboutData.domains];
                                                    newDomains[idx].label = e.target.value;
                                                    setAboutData({...aboutData, domains: newDomains});
                                                }}
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2 text-zinc-400 focus:outline-none focus:border-amber-500 focus:text-white text-xs transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1 block">Value</label>
                                            <input
                                                type="text"
                                                value={domain.value}
                                                placeholder="e.g. Film & Production"
                                                onChange={(e) => {
                                                    const newDomains = [...aboutData.domains];
                                                    newDomains[idx].value = e.target.value;
                                                    setAboutData({...aboutData, domains: newDomains});
                                                }}
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm font-bold tracking-tight transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => removeDomain(idx)}
                                        className="w-10 h-10 flex-shrink-0 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                                        title="Remove Domain"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                            {aboutData.domains.length === 0 && (
                                <p className="text-zinc-600 text-xs text-center italic py-4">No domains added. Click "Add Domain" to create one.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
