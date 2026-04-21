import { useEffect, useState } from 'react';
import { collection, query, where, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trash2, Edit, Eye, EyeOff, Plus, X } from 'lucide-react';

export default function AdminSharedList({ typeFilter, pageTitle, subtitle, isWebsite }) {
    const [projects, setProjects] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNode, setEditingNode] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        thumbnail: '',
        logo: '',
        hidden: false
    });

    useEffect(() => {
        let q;
        if (Array.isArray(typeFilter)) {
            q = query(collection(db, 'nad_projects'), where('type', 'in', typeFilter));
        } else {
            q = query(collection(db, 'nad_projects'), where('type', '==', typeFilter));
        }

        const unsubscribe = onSnapshot(q, (snap) => {
            // Sort client-side by timestamp descending to keep recent at top
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.timestamp - a.timestamp);
            setProjects(data);
        });

        return () => unsubscribe();
    }, [typeFilter]);

    const openModal = (node = null) => {
        if (node) {
            setEditingNode(node.id);
            setFormData({
                title: node.title || '',
                link: node.link || '',
                thumbnail: node.thumbnail || '',
                logo: node.logo || '',
                hidden: node.hidden || false
            });
        } else {
            setEditingNode(null);
            setFormData({
                title: '',
                link: '',
                thumbnail: '',
                logo: '',
                hidden: false
            });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            title: formData.title,
            thumbnail: formData.thumbnail || 'https://via.placeholder.com/800x450',
            hidden: formData.hidden
        };

        if (isWebsite) {
            payload.link = formData.link;
            payload.logo = formData.logo || 'https://via.placeholder.com/200';
        } else {
            payload.link = formData.link; // Films/Graphics also use link for preview
        }

        if (editingNode) {
            await updateDoc(doc(db, 'nad_projects', editingNode), payload);
        } else {
            payload.type = Array.isArray(typeFilter) ? typeFilter[0] : typeFilter;
            payload.timestamp = Date.now();
            payload.views = 0;
            payload.clicks = 0;
            await addDoc(collection(db, 'nad_projects'), payload);
        }
        setIsModalOpen(false);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Permanently erase this ${pageTitle} node?`)) {
            await deleteDoc(doc(db, 'nad_projects', id));
        }
    };

    const toggleVisibility = async (id, currentHidden) => {
        await updateDoc(doc(db, 'nad_projects', id), { hidden: !currentHidden });
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter">{pageTitle} NODE</h1>
                    <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">{subtitle}</p>
                </div>
                <button onClick={() => openModal()} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all flex items-center space-x-2">
                    <Plus size={16} />
                    <span>{isWebsite ? "Deploy Site Node" : "Launch Production"}</span>
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(p => (
                    <div key={p.id} className={`glass-panel p-6 rounded-[2.5rem] relative group ${p.hidden ? 'opacity-50' : ''}`}>
                        
                        {/* Admin Action Bar */}
                        <div className="absolute top-4 right-4 z-20 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => toggleVisibility(p.id, p.hidden)} className="p-2 bg-zinc-800 text-white hover:text-amber-500 rounded-lg shadow-xl transition-colors">
                                {p.hidden ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button onClick={() => openModal(p)} className="p-2 bg-zinc-800 text-white hover:text-blue-500 rounded-lg shadow-xl transition-colors">
                                <Edit size={14} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-xl transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>

                        {isWebsite ? (
                            <div className="flex flex-col items-center text-center mt-6">
                                <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden mb-4">
                                    <img src={p.logo || p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="text-white font-black text-lg uppercase">{p.title}</h3>
                                <p className="text-zinc-500 text-[9px] font-bold uppercase truncate max-w-full mt-2">{p.link}</p>
                            </div>
                        ) : (
                            <>
                                <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-6 relative">
                                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                                    {p.hidden && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><p className="text-xs font-bold text-red-500 uppercase tracking-widest bg-black/80 px-4 py-2 rounded-full">HIDDEN</p></div>}
                                </div>
                                <h3 className="text-white font-black text-sm uppercase px-2">{p.title}</h3>
                            </>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal Form */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative bg-zinc-950 border border-zinc-800 p-10 rounded-[3rem] w-full max-w-xl shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-zinc-500 hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-8">{editingNode ? 'Modify' : 'Deploy'} Node</h2>
                        
                        <form onSubmit={handleSave} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Title</label>
                                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500" />
                            </div>
                            
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Source Link / Video ID</label>
                                <input required type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500" />
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Thumbnail Image URL</label>
                                <input type="url" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500" />
                            </div>

                            {isWebsite && (
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Website Logo URL (Optional)</label>
                                    <input type="url" value={formData.logo} onChange={e => setFormData({...formData, logo: e.target.value})} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-amber-500" />
                                </div>
                            )}

                            <div className="flex items-center space-x-4 ml-4">
                                <input type="checkbox" id="hidden" checked={formData.hidden} onChange={e => setFormData({...formData, hidden: e.target.checked})} className="w-4 h-4 accent-amber-500" />
                                <label htmlFor="hidden" className="text-xs font-bold text-zinc-400 uppercase tracking-widest cursor-pointer">Hide from Public View</label>
                            </div>

                            <button type="submit" className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-amber-400 transition-colors mt-8">
                                {editingNode ? 'Save Changes' : 'Launch Node'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
