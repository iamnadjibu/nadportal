import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

export default function Home() {
    const [highlights, setHighlights] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'nad_projects'), limit(3));
        const unsubscribe = onSnapshot(q, (snap) => {
            setHighlights(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    return (
        <div>
            {/* Hero Section */}
            <section className="h-screen flex items-center justify-center text-center px-4 relative">
                <div className="relative z-10 max-w-6xl">
                    <h2 className="text-amber-500 uppercase tracking-[0.5em] text-xs font-black mb-8 animate-[fadeInUp_1s_ease-out]">
                        Nadjibullah Uwabato
                    </h2>
                    <h1 className="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-8 font-outfit animate-[fadeInUp_1.5s_ease-out]">
                        Visionary <br /> Directing
                    </h1>
                    <Link to="/films" className="inline-block bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all animate-[fadeInUp_2s_ease-out]">
                        See Creations
                    </Link>
                </div>
                <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080')] opacity-20 bg-cover bg-center"></div>
            </section>

            {/* Highlights Section */}
            <section className="py-32 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="mb-16">
                        <h2 className="text-7xl md:text-8xl font-black text-white uppercase tracking-tighter font-outfit mb-2">The Highlight Cut</h2>
                        <p className="text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase">Core Node Productions</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {highlights.map(p => (
                            <Link to="/films" key={p.id} className="group cursor-pointer bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-zinc-900 transition-all hover:border-amber-500/30 block">
                                <div className="aspect-video relative overflow-hidden">
                                    <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                </div>
                                <div className="p-8">
                                    <p className="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest">{p.type}</p>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{p.title}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
