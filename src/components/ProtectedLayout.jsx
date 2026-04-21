import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import AdminSidebar from './AdminSidebar';

export default function ProtectedLayout() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate('/admin');
            } else {
                setUser(currentUser);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [navigate]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#020202] text-amber-500 font-black tracking-widest text-xs uppercase">
                Verifying Credentials...
            </div>
        );
    }

    return (
        <div className="flex bg-[#020202] min-h-screen text-zinc-500 overflow-x-hidden">
            <AdminSidebar />
            <main className="flex-1 ml-80 p-16">
                <Outlet />
            </main>
        </div>
    );
}
