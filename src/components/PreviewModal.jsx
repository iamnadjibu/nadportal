import { X, ExternalLink, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

function formatLinkForEmbed(url) {
    if (!url) return '';
    if (url.includes('drive.google.com') && url.includes('/view')) {
        return url.replace(/\/view.*$/, '/preview');
    }
    return url;
}

export default function PreviewModal({ isOpen, onClose, project }) {
    const [isLoading, setIsLoading] = useState(true);
    const viewTimerRef = useRef(null);

    useEffect(() => {
        if (isOpen && project) {
            document.body.style.overflow = 'hidden';
            setIsLoading(true);

            // Start 10-second view tracking if it's a FILM
            if (['FILM', 'AI FILM', 'SHORT FILM'].includes(project.type)) {
                viewTimerRef.current = setTimeout(async () => {
                    try {
                        const projectRef = doc(db, 'nad_projects', project.id);
                        await updateDoc(projectRef, {
                            views: increment(1)
                        });
                    } catch (error) {
                        console.error("Error recording view:", error);
                    }
                }, 10000); // 10 seconds
            }
        } else {
            document.body.style.overflow = 'auto';
            setTimeout(() => setIsLoading(true), 300); // reset after transition
            
            if (viewTimerRef.current) {
                clearTimeout(viewTimerRef.current);
            }
        }
        return () => {
            document.body.style.overflow = 'auto';
            if (viewTimerRef.current) {
                clearTimeout(viewTimerRef.current);
            }
        };
    }, [isOpen, project]);

    if (!project && !isOpen) return null;

    return (
        <div className={`fixed inset-0 z-[150] flex items-center justify-center transition-all duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {/* Backdrop */}
            <div 
                className={`absolute inset-0 bg-black/95 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
                onClick={onClose}
            ></div>
            
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-white hover:text-amber-500 z-[160] transition-colors p-2"
            >
                <X size={32} />
            </button>
            
            {/* Modal Content */}
            <div className={`relative z-10 w-full h-full p-4 md:p-12 flex flex-col items-center justify-center transition-all duration-300 delay-100 ${isOpen ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-10 opacity-0'}`}>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-8 uppercase tracking-widest text-center w-full drop-shadow-lg font-outfit">
                    {project?.title}
                </h3>
                
                <div className="w-full max-w-6xl aspect-video bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative">
                    {/* Loader */}
                    {isLoading && (
                        <div className="absolute inset-0 flex justify-center items-center z-0 bg-zinc-950">
                            <Loader2 size={40} className="text-amber-500 animate-spin" />
                        </div>
                    )}
                    
                    {/* Iframe */}
                    {isOpen && project?.link && (
                        <iframe 
                            src={formatLinkForEmbed(project.link)} 
                            className={`w-full h-full relative z-10 transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            frameBorder="0" 
                            allowFullScreen 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            onLoad={() => setIsLoading(false)}
                        ></iframe>
                    )}
                </div>
                
                <a 
                    href={project?.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-8 flex items-center space-x-3 text-zinc-400 hover:text-amber-500 transition-colors group"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">Open in New Tab</span>
                    <ExternalLink size={16} className="group-hover:drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </a>
            </div>
        </div>
    );
}
