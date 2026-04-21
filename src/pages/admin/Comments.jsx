import { useEffect, useState } from 'react';
import { collection, query, orderBy, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Trash2 } from 'lucide-react';

export default function Comments() {
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        const q = query(collection(db, 'nad_comments'), orderBy('timestamp', 'desc'));
        const unsubscribe = onSnapshot(q, (snap) => {
            setReviews(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Purge this review transmission?")) {
            await deleteDoc(doc(db, 'nad_comments', id));
        }
    };

    return (
        <div>
            <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter mb-16">COMMUNITY REVIEWS</h1>
            
            <div className="space-y-6">
                {reviews.length === 0 ? (
                    <p className="py-20 text-center font-bold text-zinc-900 border-2 border-dashed border-zinc-900 rounded-[3rem] uppercase tracking-widest">
                        No transmissions recorded
                    </p>
                ) : (
                    reviews.map(c => (
                        <div key={c.id} className="glass-panel p-10 rounded-[3rem] flex justify-between items-center group transition-all hover:border-amber-500/30">
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <span className="bg-amber-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase">Identity</span>
                                    <p className="text-white text-xs font-black uppercase tracking-widest">{c.userName}</p>
                                    {c.userEmail && <span className="text-zinc-700 text-[10px] lowercase">{c.userEmail}</span>}
                                </div>
                                <p className="text-zinc-400 text-sm leading-relaxed max-w-3xl">&quot;{c.text}&quot;</p>
                                <p className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest">
                                    Project ID: {c.projectId?.slice(0, 8)}... | {new Date(c.timestamp).toLocaleString()}
                                </p>
                            </div>
                            <button onClick={() => handleDelete(c.id)} className="p-4 bg-zinc-900 text-zinc-700 hover:bg-red-600 hover:text-white rounded-2xl transition-all">
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
