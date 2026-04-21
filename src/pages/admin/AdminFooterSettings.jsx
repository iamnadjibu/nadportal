import { useEffect, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Loader2, Save } from 'lucide-react';

const defaultFooterData = {
    brief: "We craft stunning visuals and user-friendly experiences that help your brand stand out and connect with your audience. Visionary directing at its finest.",
    col1Title: "Quick Links",
    col1Links: [
        { label: "Home", url: "/" },
        { label: "About NAD", url: "/about" },
        { label: "Contact Us", url: "/contact" }
    ],
    col2Title: "Portfolios",
    col2Links: [
        { label: "Films & AI Films", url: "/films" },
        { label: "Graphics", url: "/graphics" },
        { label: "Websites", url: "/websites" }
    ],
    socials: {
        instagram: "https://instagram.com",
        youtube: "https://youtube.com",
        twitter: "https://twitter.com",
        email: "inkhub250@gmail.com"
    }
};

export default function AdminFooterSettings() {
    const [footerData, setFooterData] = useState(defaultFooterData);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            const docSnap = await getDoc(doc(db, 'nad_settings', 'footer'));
            if (docSnap.exists()) {
                setFooterData(docSnap.data());
            }
            setLoading(false);
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'nad_settings', 'footer'), footerData);
            alert('Settings saved successfully.');
        } catch (err) {
            console.error('Error saving settings:', err);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-amber-500 mx-auto" /></div>;

    return (
        <div>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter">SETTINGS</h1>
                    <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">System Configuration & Footer Layout</p>
                </div>
                <button 
                    onClick={handleSave} 
                    disabled={saving}
                    className="bg-amber-500 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-all flex items-center space-x-2"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Layout</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Brief & Socials */}
                <div className="space-y-10">
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <h3 className="text-white font-black uppercase text-sm mb-6 border-b border-zinc-800 pb-2">Brief About NAD</h3>
                        <textarea
                            value={footerData.brief}
                            onChange={(e) => setFooterData({...footerData, brief: e.target.value})}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-zinc-300 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                            rows={4}
                        />
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <h3 className="text-white font-black uppercase text-sm mb-6 border-b border-zinc-800 pb-2">Social Hub & Contact</h3>
                        <div className="space-y-4">
                            {Object.keys(footerData.socials).map((platform) => (
                                <div key={platform}>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">{platform}</label>
                                    <input
                                        type="text"
                                        value={footerData.socials[platform]}
                                        onChange={(e) => setFooterData({
                                            ...footerData, 
                                            socials: { ...footerData.socials, [platform]: e.target.value }
                                        })}
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quick Links Columns */}
                <div className="space-y-10">
                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <h3 className="text-white font-black uppercase text-sm mb-6 border-b border-zinc-800 pb-2">Column 1 Links</h3>
                        <div className="mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Column Title</label>
                            <input
                                type="text"
                                value={footerData.col1Title}
                                onChange={(e) => setFooterData({...footerData, col1Title: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-4">
                            {footerData.col1Links.map((link, idx) => (
                                <div key={idx} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={link.label}
                                        placeholder="Label"
                                        onChange={(e) => {
                                            const newLinks = [...footerData.col1Links];
                                            newLinks[idx].label = e.target.value;
                                            setFooterData({...footerData, col1Links: newLinks});
                                        }}
                                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        placeholder="URL"
                                        onChange={(e) => {
                                            const newLinks = [...footerData.col1Links];
                                            newLinks[idx].url = e.target.value;
                                            setFooterData({...footerData, col1Links: newLinks});
                                        }}
                                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-8 rounded-[2.5rem]">
                        <h3 className="text-white font-black uppercase text-sm mb-6 border-b border-zinc-800 pb-2">Column 2 Links</h3>
                        <div className="mb-4">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Column Title</label>
                            <input
                                type="text"
                                value={footerData.col2Title}
                                onChange={(e) => setFooterData({...footerData, col2Title: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                            />
                        </div>
                        <div className="space-y-4">
                            {footerData.col2Links.map((link, idx) => (
                                <div key={idx} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={link.label}
                                        placeholder="Label"
                                        onChange={(e) => {
                                            const newLinks = [...footerData.col2Links];
                                            newLinks[idx].label = e.target.value;
                                            setFooterData({...footerData, col2Links: newLinks});
                                        }}
                                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                                    />
                                    <input
                                        type="text"
                                        value={link.url}
                                        placeholder="URL"
                                        onChange={(e) => {
                                            const newLinks = [...footerData.col2Links];
                                            newLinks[idx].url = e.target.value;
                                            setFooterData({...footerData, col2Links: newLinks});
                                        }}
                                        className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-4 py-2 text-white focus:outline-none focus:border-amber-500 text-sm"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
