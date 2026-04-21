import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Globe, Mail, MapPin } from 'lucide-react';

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

export default function PublicFooter() {
    const [footerData, setFooterData] = useState(defaultFooterData);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'nad_settings', 'footer'), (docSnap) => {
            if (docSnap.exists()) {
                setFooterData(docSnap.data());
            }
        });
        return () => unsubscribe();
    }, []);

    return (
        <footer className="bg-black border-t border-zinc-900 pt-20 pb-10 px-8 relative z-50">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                
                {/* Column 1: Brief */}
                <div className="space-y-6">
                    <Link to="/" className="text-4xl font-black text-white font-outfit uppercase tracking-tighter inline-block mb-4">
                        IAM <span className="text-amber-500">NAD</span>
                    </Link>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        {footerData.brief}
                    </p>
                    <div className="flex items-center space-x-2 text-zinc-600 text-xs font-bold uppercase tracking-widest mt-4">
                        <MapPin size={14} className="text-amber-500" />
                        <span>Kigali, Rwanda</span>
                    </div>
                </div>

                {/* Column 2: Quick Links 1 */}
                <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 pb-2 border-b border-zinc-800 inline-block">{footerData.col1Title}</h4>
                    <ul className="space-y-4">
                        {footerData.col1Links?.map((link, idx) => (
                            <li key={idx}>
                                <Link to={link.url} className="text-zinc-500 hover:text-amber-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center group">
                                    <span className="w-0 h-[2px] bg-amber-500 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 3: Quick Links 2 */}
                <div>
                    <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 pb-2 border-b border-zinc-800 inline-block">{footerData.col2Title}</h4>
                    <ul className="space-y-4">
                        {footerData.col2Links?.map((link, idx) => (
                            <li key={idx}>
                                <Link to={link.url} className="text-zinc-500 hover:text-amber-500 text-xs font-bold uppercase tracking-widest transition-colors flex items-center group">
                                    <span className="w-0 h-[2px] bg-amber-500 mr-0 group-hover:w-4 group-hover:mr-2 transition-all duration-300"></span>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Column 4: Socials & Book Us */}
                <div className="space-y-8">
                    <div>
                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6 pb-2 border-b border-zinc-800 inline-block">Connect</h4>
                        <div className="flex space-x-4">
                            <a href={footerData.socials?.instagram} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all hover:scale-110">
                                <Globe size={18} />
                            </a>
                            <a href={footerData.socials?.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all hover:scale-110">
                                <Globe size={18} />
                            </a>
                            <a href={footerData.socials?.youtube} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all hover:scale-110">
                                <Globe size={18} />
                            </a>
                            <a href={`mailto:${footerData.socials?.email}`} className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-amber-500 hover:border-amber-500 transition-all hover:scale-110">
                                <Mail size={18} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <Link to="/book" className="block w-full text-center bg-amber-500 hover:bg-amber-400 text-black py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                            BOOK US
                        </Link>
                    </div>
                </div>

            </div>
            
            <div className="max-w-7xl mx-auto border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest mb-4 md:mb-0">
                    &copy; {new Date().getFullYear()} IAM NAD. All Rights Reserved.
                </p>
                <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
                    System Engineered by Antigravity
                </p>
            </div>
        </footer>
    );
}
