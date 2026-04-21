import { Mail, Globe } from 'lucide-react';

export default function Contact() {
    return (
        <div className="pt-48 pb-20 px-8 max-w-7xl mx-auto">
            <h1 className="text-8xl font-black text-white uppercase tracking-tighter mb-16 font-outfit">CONTACT US</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                <div className="space-y-12">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest mb-6">Inquiry Channel</h2>
                        <p className="text-zinc-500 text-sm leading-relaxed max-w-md">
                            Whether it is for a high-production film project, creative web infrastructure, or strategic aesthetic consultation, we are ready to transmit.
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                <Mail size={16} className="text-amber-500" />
                            </div>
                            <span className="text-xs font-black uppercase text-zinc-400">nadjibullahu@gmail.com</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                <Globe size={16} className="text-amber-500" />
                            </div>
                            <span className="text-xs font-black uppercase text-zinc-400">nadportfolio.web.app</span>
                        </div>
                    </div>
                </div>

                <form className="space-y-6 glass-panel p-10 rounded-[3rem]">
                    <div className="grid grid-cols-2 gap-6">
                        <input type="text" placeholder="IDENTITY" required className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500" />
                        <input type="email" placeholder="EMAIL" required className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500" />
                    </div>
                    <input type="text" placeholder="SUBJECT" required className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500" />
                    <textarea placeholder="MESSAGE TRANSMISSION" required className="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500 h-40 resize-none"></textarea>
                    <button type="submit" className="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-amber-500 transition-all">Submit Transmission</button>
                </form>
            </div>
        </div>
    );
}
