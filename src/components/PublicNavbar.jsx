import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'FILMS', path: '/films' },
    { name: 'GRAPHICS', path: '/graphics' },
    { name: 'WEBSITES', path: '/websites' },
    { name: 'ABOUT NAD', path: '/about' },
    { name: 'CONTACT US', path: '/contact' },
    { name: 'BOOK US', path: '/book' }
];

export default function PublicNavbar() {
    const location = useLocation();

    return (
        <nav className="fixed w-full z-[100] py-8 transition-all duration-500 bg-black/80 backdrop-blur-md border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <Link to="/" className="text-3xl font-black text-white font-outfit uppercase tracking-tighter group transition-all duration-500 hover:drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    IAM <span className="text-amber-500 group-hover:text-white transition-colors duration-500">NAD</span>
                </Link>
                <div className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-[0.3em] font-bold">
                    {publicNavItems.map(item => {
                        const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                className="group relative py-2"
                            >
                                <span className={`${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-white'} transition-colors duration-300 relative z-10`}>
                                    {item.name}
                                </span>
                                <span className={`absolute bottom-0 left-0 h-[2px] bg-amber-500 transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                            </Link>
                        );
                    })}
                </div>
                <button className="lg:hidden text-white">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
}
