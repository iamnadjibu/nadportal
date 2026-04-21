import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Trash2, CheckCircle, Clock } from 'lucide-react';

export default function AdminBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'nad_bookings'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            setBookings(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Permanently delete this booking request?")) {
            await deleteDoc(doc(db, 'nad_bookings', id));
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'PENDING' ? 'COMPLETED' : 'PENDING';
        await updateDoc(doc(db, 'nad_bookings', id), { status: newStatus });
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter">THE BOOKINGS</h1>
                    <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">Incoming Client Requests</p>
                </div>
                <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800 text-center">
                    <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Total Requests</p>
                    <p className="text-white font-bold text-xl tabular-nums">{bookings.length}</p>
                </div>
            </div>

            <div className="space-y-6">
                {bookings.length === 0 ? (
                    <p className="text-zinc-600 font-bold uppercase text-xs tracking-widest text-center py-20">No booking requests detected.</p>
                ) : (
                    bookings.map(booking => (
                        <div key={booking.id} className="glass-panel p-8 rounded-[2.5rem] border border-zinc-800/50 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between group hover:border-amber-500/30 transition-all">
                            
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-4">
                                    <button 
                                        onClick={() => toggleStatus(booking.id, booking.status)}
                                        className={`flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            booking.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                                        }`}
                                    >
                                        {booking.status === 'PENDING' ? <Clock size={12} /> : <CheckCircle size={12} />}
                                        <span>{booking.status}</span>
                                    </button>
                                    <span className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase">
                                        {new Date(booking.timestamp).toLocaleString()}
                                    </span>
                                </div>
                                
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">{booking.name}</h3>
                                    <p className="text-amber-500 text-xs font-bold uppercase tracking-widest">{booking.service}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row sm:space-x-8 text-sm font-bold text-zinc-400">
                                    <a href={`mailto:${booking.email}`} className="hover:text-amber-500 transition-colors">{booking.email}</a>
                                    <a href={`tel:${booking.phone}`} className="hover:text-amber-500 transition-colors">{booking.phone}</a>
                                </div>

                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                    <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap">{booking.message}</p>
                                </div>
                            </div>

                            <button onClick={() => handleDelete(booking.id)} className="text-zinc-800 hover:text-red-500 transition-colors self-end md:self-center p-4">
                                <Trash2 size={24} />
                            </button>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
