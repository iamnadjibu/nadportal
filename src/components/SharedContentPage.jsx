import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import PreviewModal from './PreviewModal';

export default function SharedContentPage({ typeFilter, pageTitle, subtitle, isWebsite }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [previewProject, setPreviewProject] = useState(null);

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
                <div className="py-20 text-center animate-pulse">
                    <p className="font-bold text-amber-500 uppercase tracking-[0.5em] text-xs">Accessing Nodes...</p>
                </div>
            ) : projects.length === 0 ? (
                <p className="py-20 text-center font-bold text-zinc-700 uppercase tracking-[0.5em] text-xs">No nodes detected in this sector</p>
            ) : (
                <div className={`grid gap-10 ${isWebsite ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
                    {projects.map((p, index) => isWebsite ? (
                        <div 
                            key={p.id} 
                            className="glass-panel p-10 rounded-[3.5rem] text-center flex flex-col items-center group transition-all duration-500 hover:bg-zinc-900/50 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] border border-zinc-800/50 hover:border-amber-500/30"
                            style={{ animation: `fadeInUp 0.8s ease-out forwards`, animationDelay: `${index * 0.15}s`, opacity: 0 }}
                        >
                            <div className="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl group-hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                                <img src={p.logo || p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-8 group-hover:text-amber-50 transition-colors">{p.title}</h3>
                            <a href={p.link} target="_blank" rel="noreferrer" className="w-full relative group/btn">
                                <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl block border border-transparent hover:border-amber-400">
                                    Open Node
                                </div>
                            </a>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setPreviewProject(p)}
                            key={p.id} 
                            className="group cursor-pointer bg-zinc-900/30 rounded-[3rem] overflow-hidden border border-zinc-800/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] text-left relative w-full"
                            style={{ animation: `fadeInUp 0.8s ease-out forwards`, animationDelay: `${index * 0.15}s`, opacity: 0 }}
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                                <div className="absolute inset-0 flex justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <div className="w-16 h-16 bg-amber-500/90 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-500">
                                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-black border-b-[8px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 relative">
                                <p className="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest group-hover:animate-pulse-glow">{p.type}</p>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-amber-50 transition-colors">{p.title}</h3>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            <PreviewModal 
                isOpen={!!previewProject} 
                onClose={() => setPreviewProject(null)} 
                project={previewProject} 
            />
        </div>
    );
}
