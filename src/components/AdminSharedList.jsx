import { useEffect, useState } from 'react';
import { collection, query, where, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Trash2 } from 'lucide-react';

export default function AdminSharedList({ typeFilter, pageTitle, subtitle, isWebsite }) {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        let q;
        if (Array.isArray(typeFilter)) {
            q = query(collection(db, 'nad_projects'), where('type', 'in', typeFilter));
        } else {
            q = query(collection(db, 'nad_projects'), where('type', '==', typeFilter));
        }

        const unsubscribe = onSnapshot(q, (snap) => {
            setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [typeFilter]);

    const handleAdd = async () => {
        const title = prompt(`${pageTitle} Title:`);
        if (!title) return;
        
        const payload = {
            title,
            type: Array.isArray(typeFilter) ? typeFilter[0] : typeFilter,
            timestamp: Date.now(),
            views: 0,
            clicks: 0,
            thumbnail: 'https://via.placeholder.com/800x450'
        };

        if (isWebsite) {
            payload.link = prompt("Site URL:");
            payload.logo = prompt("Logo URL (optional):") || 'https://via.placeholder.com/200';
            if (!payload.link) return;
        }

        await addDoc(collection(db, 'nad_projects'), payload);
    };

    const handleDelete = async (id) => {
        if (window.confirm(`Erase ${pageTitle} node?`)) {
            await deleteDoc(doc(db, 'nad_projects', id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter">{pageTitle} NODE</h1>
                    <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">{subtitle}</p>
                </div>
                <button onClick={handleAdd} className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all">
                    {isWebsite ? "Deploy Site Node" : "Launch Production"}
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map(p => (
                    <div key={p.id} className={`glass-panel p-6 rounded-[2.5rem] ${isWebsite ? 'flex items-center justify-between' : 'group'}`}>
                        {isWebsite ? (
                            <>
                                <div className="flex items-center space-x-6">
                                    <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden">
                                        <img src={p.logo || p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-sm uppercase">{p.title}</h3>
                                        <p className="text-zinc-700 text-[9px] font-bold uppercase truncate max-w-[150px]">{p.link}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(p.id)} className="text-zinc-800 hover:text-red-500 transition-colors">
                                    <Trash2 size={20} />
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="aspect-video rounded-2xl overflow-hidden bg-black mb-6 relative">
                                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700" />
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-600 text-white rounded-xl shadow-xl">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-white font-black text-sm uppercase px-2">{p.title}</h3>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
