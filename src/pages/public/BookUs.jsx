import { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function BookUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        service: 'FILM',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await addDoc(collection(db, 'nad_bookings'), {
                ...formData,
                status: 'PENDING',
                timestamp: Date.now()
            });
            setSuccess(true);
            setFormData({ name: '', email: '', phone: '', service: 'FILM', message: '' });
        } catch (err) {
            console.error("Booking failed:", err);
            setError("Failed to submit your booking. Please try again or contact us directly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-48 pb-32 px-8 max-w-4xl mx-auto min-h-screen">
            <div className="mb-16 text-center">
                <h1 className="text-7xl md:text-8xl font-black text-white uppercase tracking-tighter font-outfit mb-4">Book <span className="text-amber-500">Us</span></h1>
                <p className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">Initiate Production Protocol</p>
            </div>

            {success ? (
                <div className="glass-panel p-16 rounded-[3rem] text-center max-w-xl mx-auto border border-amber-500/30 bg-amber-500/5 animate-[fadeInUp_0.5s_ease-out]">
                    <div className="flex justify-center mb-8 text-amber-500">
                        <CheckCircle2 size={64} />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Booking Received</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed mb-8">
                        Your production request has been logged into our systems. Our team will review the parameters and contact you shortly.
                    </p>
                    <button 
                        onClick={() => setSuccess(false)}
                        className="bg-zinc-900 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                    >
                        Submit Another Request
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="glass-panel p-8 md:p-16 rounded-[3rem] space-y-8 animate-[fadeInUp_0.5s_ease-out]">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-500 p-4 rounded-2xl text-sm font-bold text-center">
                            {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Full Name</label>
                            <input 
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder="CLIENT NAME"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Email Address</label>
                            <input 
                                required
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder="CONTACT EMAIL"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Phone Number</label>
                            <input 
                                required
                                type="tel"
                                value={formData.phone}
                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors"
                                placeholder="CONTACT NUMBER"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Service Required</label>
                            <select
                                value={formData.service}
                                onChange={e => setFormData({...formData, service: e.target.value})}
                                className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none"
                            >
                                <option value="FILM">Cinematic Film Production</option>
                                <option value="GRAPHIC">Visual Graphics & Branding</option>
                                <option value="WEBSITE">Web Platform Engineering</option>
                                <option value="OTHER">Other Custom Request</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-4">Project Details</label>
                        <textarea 
                            required
                            rows="5"
                            value={formData.message}
                            onChange={e => setFormData({...formData, message: e.target.value})}
                            className="w-full bg-zinc-900/50 border border-zinc-800 rounded-3xl px-6 py-4 text-white focus:outline-none focus:border-amber-500 transition-colors resize-none"
                            placeholder="Describe your vision, budget, and timeline..."
                        ></textarea>
                    </div>

                    <div className="pt-8">
                        <button 
                            disabled={loading}
                            type="submit"
                            className="w-full bg-amber-500 text-black py-5 rounded-full font-black uppercase tracking-widest hover:bg-amber-400 transition-all shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {loading ? <Loader2 size={24} className="animate-spin" /> : "Transmit Request"}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
