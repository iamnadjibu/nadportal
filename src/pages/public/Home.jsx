import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PreviewModal from '../../components/PreviewModal';
import { collection, query, limit, where, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';
import GLSLHills from '../../components/ui/glsl-hills';

export default function Home() {
    const [films, setFilms] = useState([]);
    const [graphics, setGraphics] = useState([]);
    const [websites, setWebsites] = useState([]);
    const [previewProject, setPreviewProject] = useState(null);

    useEffect(() => {
        // Fetch Recent Films
        const qFilms = query(collection(db, 'nad_projects'), where('type', 'in', ['FILM', 'AI FILM', 'SHORT FILM']));
        const unsubFilms = onSnapshot(qFilms, snap => {
            let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => !p.hidden);
            data.sort((a, b) => b.timestamp - a.timestamp);
            setFilms(data.slice(0, 3));
        });

        // Fetch Recent Graphics
        const qGraphics = query(collection(db, 'nad_projects'), where('type', '==', 'GRAPHIC'));
        const unsubGraphics = onSnapshot(qGraphics, snap => {
            let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => !p.hidden);
            data.sort((a, b) => b.timestamp - a.timestamp);
            setGraphics(data.slice(0, 3));
        });

        // Fetch Recent Websites
        const qWebsites = query(collection(db, 'nad_projects'), where('type', '==', 'WEBSITE'));
        const unsubWebsites = onSnapshot(qWebsites, snap => {
            let data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => !p.hidden);
            data.sort((a, b) => b.timestamp - a.timestamp);
            setWebsites(data.slice(0, 3));
        });

        return () => {
            unsubFilms();
            unsubGraphics();
            unsubWebsites();
        };
    }, []);

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

    const renderGrid = (items, isWebsiteRoute) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {items.map((p, index) => {
                const isWebsite = p.type === 'WEBSITE';
                
                return isWebsite ? (
                    <a 
                        href={p.link}
                        onClick={(e) => handleWebsiteClick(e, p.id, p.link)}
                        key={p.id} 
                        className="group cursor-pointer bg-zinc-900/30 rounded-[3rem] overflow-hidden border border-zinc-800/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] block relative"
                        style={{ animation: `fadeInUp 0.8s ease-out forwards`, animationDelay: `${index * 0.2}s`, opacity: 0 }}
                    >
                        <div className="aspect-video relative overflow-hidden">
                            <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
                        </div>
                        <div className="p-8 relative">
                            <p className="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest group-hover:animate-pulse-glow">{p.type}</p>
                            <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-amber-50 transition-colors">{p.title}</h3>
                        </div>
                    </a>
                ) : (
                    <button 
                        onClick={() => setPreviewProject(p)}
                        key={p.id} 
                        className="group cursor-pointer bg-zinc-900/30 rounded-[3rem] overflow-hidden border border-zinc-800/50 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.2)] block text-left relative w-full"
                        style={{ animation: `fadeInUp 0.8s ease-out forwards`, animationDelay: `${index * 0.2}s`, opacity: 0 }}
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
                );
            })}
        </div>
    );

    return (
        <div>
            {/* GLSL Hills Hero Section */}
            <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
                <GLSLHills />
                <div className="space-y-8 pointer-events-none z-10 text-center absolute px-4 max-w-5xl mt-24">
                    <h1 className="font-black text-white uppercase tracking-tighter text-6xl md:text-8xl drop-shadow-2xl font-outfit leading-tight">
                        <span className="italic text-5xl md:text-7xl font-thin text-amber-500 block mb-4">Designs That Speak</span>
                        Louder Than Words
                    </h1>
                    <p className="text-sm md:text-base text-zinc-300 tracking-widest uppercase font-bold max-w-2xl mx-auto drop-shadow-lg leading-relaxed">
                        We craft stunning visuals and user-friendly experiences that help your brand stand out and connect with your audience.
                    </p>
                    <div className="pt-8 pointer-events-auto">
                        <Link to="/book" className="inline-block relative group animate-[fadeInUp_2s_ease-out]">
                            <div className="absolute inset-0 bg-amber-500 rounded-full blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
                            <div className="relative bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 hover:text-white transition-all duration-300 border border-transparent hover:border-amber-400">
                                BOOK US NOW
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-32 bg-black relative">
                <div className="max-w-7xl mx-auto px-8 relative z-10 space-y-32">
                    
                    {/* Recent Films */}
                    {films.length > 0 && (
                        <div>
                            <div className="mb-12 flex justify-between items-end border-b border-zinc-900 pb-6">
                                <div>
                                    <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter font-outfit mb-2">Recent Films</h2>
                                    <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Latest Video Productions</p>
                                </div>
                                <Link to="/films" className="text-amber-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-2">View All</Link>
                            </div>
                            {renderGrid(films)}
                        </div>
                    )}

                    {/* Recent Graphics */}
                    {graphics.length > 0 && (
                        <div>
                            <div className="mb-12 flex justify-between items-end border-b border-zinc-900 pb-6">
                                <div>
                                    <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter font-outfit mb-2">Recent Graphics</h2>
                                    <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Visual Art & Branding</p>
                                </div>
                                <Link to="/graphics" className="text-amber-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-2">View All</Link>
                            </div>
                            {renderGrid(graphics)}
                        </div>
                    )}

                    {/* Recent Websites */}
                    {websites.length > 0 && (
                        <div>
                            <div className="mb-12 flex justify-between items-end border-b border-zinc-900 pb-6">
                                <div>
                                    <h2 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter font-outfit mb-2">Recent Websites</h2>
                                    <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Digital Platforms</p>
                                </div>
                                <Link to="/websites" className="text-amber-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-2">View All</Link>
                            </div>
                            {renderGrid(websites)}
                        </div>
                    )}

                </div>
            </section>

            <PreviewModal 
                isOpen={!!previewProject} 
                onClose={() => setPreviewProject(null)} 
                project={previewProject} 
            />
        </div>
    );
}
