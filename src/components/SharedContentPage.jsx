import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export default function SharedContentPage({ typeFilter, pageTitle, subtitle, isWebsite }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let q;
        if (Array.isArray(typeFilter)) {
            q = query(collection(db, 'nad_projects'), where('type', 'in', typeFilter));
        } else {
            q = query(collection(db, 'nad_projects'), where('type', '==', typeFilter));
        }

        const unsubscribe = onSnapshot(q, (snap) => {
            const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => !p.hidden);
            setProjects(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [typeFilter]);

    return (
        <div className="pt-48 pb-20 px-8 max-w-7xl mx-auto">
            <div className="mb-16">
                <h1 className="text-7xl md:text-8xl font-black text-white uppercase tracking-tighter font-outfit mb-2">{pageTitle}</h1>
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase">{subtitle}</p>
            </div>

            {loading ? (
                <p className="py-20 text-center font-bold text-zinc-900 uppercase tracking-widest">Accessing Nodes...</p>
            ) : projects.length === 0 ? (
                <p className="py-20 text-center font-bold text-zinc-900 uppercase tracking-widest">No nodes detected in this sector</p>
            ) : (
                <div className={`grid gap-10 ${isWebsite ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {projects.map(p => isWebsite ? (
                        <div key={p.id} className="glass-panel p-10 rounded-[3.5rem] text-center flex flex-col items-center group transition-all hover:bg-zinc-900/30">
                            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                                <img src={p.logo || p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8">{p.title}</h3>
                            <a href={p.link} target="_blank" rel="noreferrer" className="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl">
                                Open Node
                            </a>
                        </div>
                    ) : (
                        <div key={p.id} className="group cursor-pointer bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-zinc-900 transition-all hover:border-amber-500/30">
                            <div className="aspect-video relative overflow-hidden">
                                <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                            </div>
                            <div className="p-8">
                                <p className="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest">{p.type}</p>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{p.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
