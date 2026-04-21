import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Film, PenTool, Globe, MessageSquare, LogOut, User } from 'lucide-react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'FILMS', path: '/admin/films', icon: Film },
    { name: 'GRAPHICS', path: '/admin/graphics', icon: PenTool },
    { name: 'WEBSITES', path: '/admin/websites', icon: Globe },
    { name: 'REVIEWS', path: '/admin/comments', icon: MessageSquare }
];

export default function AdminSidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <aside className="w-80 h-screen fixed bg-black border-r border-zinc-900 p-8 flex flex-col z-[100]">
            <div className="mb-12">
                <h2 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter">NAD <span className="text-amber-500">STUDIO</span></h2>
                <p className="text-[9px] font-black tracking-widest text-zinc-700 uppercase mt-1">Intelligence Control</p>
            </div>
            <nav className="flex-1 space-y-2">
                {adminNavItems.map(item => {
                    const isActive = location.pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link 
                            key={item.name} 
                            to={item.path} 
                            className={`flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${isActive ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'}`}
                        >
                            <Icon size={16} />
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="mt-auto border-t border-zinc-900 pt-8">
                <button onClick={handleLogout} className="flex items-center space-x-4 px-6 py-4 text-zinc-700 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest w-full text-left">
                    <LogOut size={16} />
                    <span>Terminate Session</span>
                </button>
                <div className="mt-6 flex items-center space-x-3 px-6">
                    <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                        <User size={16} className="text-amber-500" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[9px] font-black text-white uppercase truncate">Administrator</p>
                        <p className="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">Authorized Agency</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
