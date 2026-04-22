import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import PreviewModal from './PreviewModal';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

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
            let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => !p.hidden);
            data.sort((a, b) => b.timestamp - a.timestamp);
            setProjects(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [typeFilter]);

    const handleWebsiteClick = async (e, id, link) => {
        e.preventDefault();
        try {
            await updateDoc(doc(db, 'nad_projects', id), {
                clicks: increment(1)
            });
        } catch (error) {
            console.error("Error tracking click", error);
        }
        window.open(link, '_blank');
    };

    const handleVote = async (e, id, type) => {
        e.stopPropagation();
        const votedKey = `voted_${id}`;
        if (localStorage.getItem(votedKey)) return;
        
        try {
            await updateDoc(doc(db, 'nad_projects', id), {
                [type]: increment(1)
            });
            localStorage.setItem(votedKey, 'true');
        } catch (error) {
            console.error("Error recording vote", error);
        }
    };

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
                            <a href={p.link} onClick={(e) => handleWebsiteClick(e, p.id, p.link)} className="w-full relative group/btn">
                                <div className="absolute inset-0 bg-amber-500 rounded-2xl blur-md opacity-0 group-hover/btn:opacity-50 transition-opacity duration-300"></div>
                                <div className="relative bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all shadow-xl block border border-transparent hover:border-amber-400">
                                    Open Node
                                </div>
                            </a>
                        </div>
                    ) : p.type === 'GRAPHIC' ? (
                        <div 
                            key={p.id} 
                            className="group bg-zinc-900/30 rounded-[3rem] overflow-hidden border border-zinc-800/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] flex flex-col relative w-full"
                            style={{ animation: `fadeInUp 0.8s ease-out forwards`, animationDelay: `${index * 0.15}s`, opacity: 0 }}
                        >
                            <div className="w-full aspect-video flex justify-center items-center bg-black/50 overflow-hidden relative">
                                <div className="w-full h-full flex items-center justify-center [&>iframe]:w-full [&>iframe]:h-full" dangerouslySetInnerHTML={{ __html: p.link }} />
                            </div>
                            
                            <div className="p-8 relative mt-auto">
                                <p className="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest group-hover:animate-pulse-glow">{p.type}</p>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-amber-50 transition-colors">{p.title}</h3>
                                
                                <div className="flex space-x-6 mt-6 relative z-20">
                                    <button onClick={(e) => handleVote(e, p.id, 'likes')} className="flex items-center space-x-2 text-zinc-500 hover:text-emerald-500 transition-colors group/vote">
                                        <ThumbsUp size={18} className="group-hover/vote:-translate-y-1 transition-transform" /> <span className="text-sm font-bold">{p.likes || 0}</span>
                                    </button>
                                    <button onClick={(e) => handleVote(e, p.id, 'dislikes')} className="flex items-center space-x-2 text-zinc-500 hover:text-red-500 transition-colors group/vote">
                                        <ThumbsDown size={18} className="group-hover/vote:translate-y-1 transition-transform" /> <span className="text-sm font-bold">{p.dislikes || 0}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
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
