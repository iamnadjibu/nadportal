import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Loader2 } from 'lucide-react';

const defaultAboutData = {
    name: "Nadjibullah Uwabato",
    description: "A visionary director and creative engineer dedicated to the intersection of cinematic storytelling and digital innovation. \nWith a focus on AI-driven narrative and high-performance web architecture, NAD PORTAL serves as the central node for \nexperimental and professional visual productions.",
    imageUrl: "https://via.placeholder.com/800x800",
    domains: [
        { label: "Primary Domain", value: "Film & Production" },
        { label: "Secondary Node", value: "Creative Engineering" }
    ],
    certificates: []
};

export default function About() {
    const [aboutData, setAboutData] = useState(defaultAboutData);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'nad_settings', 'about'), (docSnap) => {
            if (docSnap.exists()) {
                setAboutData(docSnap.data());
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return <div className="pt-48 pb-20 px-8 text-center"><Loader2 className="animate-spin text-amber-500 mx-auto" size={48} /></div>;

    return (
        <div className="pt-48 pb-20 px-8 max-w-7xl mx-auto min-h-[80vh]">
            <h1 className="text-8xl md:text-9xl font-black text-white uppercase tracking-tighter mb-16 font-outfit">ABOUT NAD</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="aspect-square bg-zinc-900 rounded-[4rem] overflow-hidden border border-zinc-800">
                    <img src={aboutData.imageUrl} alt={aboutData.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 opacity-80 hover:opacity-100" />
                </div>
                <div className="space-y-8">
                    <h2 className="text-4xl font-black text-amber-500 uppercase tracking-widest">{aboutData.name}</h2>
                    <p className="text-xl text-zinc-400 leading-relaxed font-light whitespace-pre-wrap">
                        {aboutData.description}
                    </p>
                    <div className="grid grid-cols-2 gap-8 pt-8">
                        {aboutData.domains?.map((domain, idx) => (
                            <div key={idx}>
                                <p className="text-[10px] font-black uppercase text-zinc-700 tracking-widest mb-2">{domain.label}</p>
                                <p className="text-white font-bold uppercase tracking-tighter text-lg">{domain.value}</p>
                            </div>
                        ))}
                    </div>

                    {aboutData.certificates?.length > 0 && (
                        <div className="pt-8 border-t border-zinc-800/50">
                            <h3 className="text-[10px] font-black uppercase text-amber-500 tracking-widest mb-6">Certificates & Diplomas</h3>
                            <div className="space-y-6">
                                {aboutData.certificates.map((cert, idx) => (
                                    <div key={idx} className="flex justify-between items-center group">
                                        <div>
                                            <p className="text-white font-bold uppercase tracking-tighter text-lg group-hover:text-amber-500 transition-colors">{cert.title}</p>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">{cert.issuer}</p>
                                        </div>
                                        <div className="text-zinc-700 font-black text-xl tabular-nums">
                                            {cert.year}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
