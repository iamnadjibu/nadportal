import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';

const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'FILMS', path: '/films' },
    { name: 'GRAPHICS', path: '/graphics' },
    { name: 'WEBSITES', path: '/websites' },
    { name: 'ABOUT NAD', path: '/about' },
    { name: 'CONTACT US', path: '/contact' }
];

export default function PublicNavbar() {
    const location = useLocation();

    return (
        <nav className="fixed w-full z-[100] py-8 transition-all duration-500 bg-black/80 backdrop-blur-md border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
                <Link to="/" className="text-3xl font-black text-white font-outfit uppercase tracking-tighter">
                    IAM <span className="text-amber-500">NAD</span>
                </Link>
                <div className="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-[0.3em] font-bold">
                    {publicNavItems.map(item => {
                        const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path} 
                                className={`${isActive ? 'text-white border-b-2 border-amber-500' : 'text-zinc-500 hover:text-white transition-colors'} pb-1`}
                            >
                                {item.name}
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
