/**
 * NAD PORTAL Navigation Injector
 * Handles dynamic generation of navigation for both Public and Admin sites.
 */

const publicNavItems = [
    { name: 'Home', path: '/' },
    { name: 'FILMS', path: '/films' },
    { name: 'GRAPHICS', path: '/graphics' },
    { name: 'WEBSITES', path: '/websites' },
    { name: 'ABOUT NAD', path: '/about' },
    { name: 'CONTACT US', path: '/contact' }
];

const adminNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'layout-dashboard' },
    { name: 'FILMS', path: '/admin/films', icon: 'film' },
    { name: 'GRAPHICS', path: '/admin/graphics', icon: 'pen-tool' },
    { name: 'WEBSITES', path: '/admin/websites', icon: 'globe' },
    { name: 'REVIEWS', path: '/admin/reviews', icon: 'message-square' }
];

function initNav() {
    const path = window.location.pathname;
    
    // Inject Public Navbar
    const navbarTarget = document.getElementById('navbar-target');
    if (navbarTarget) {
        navbarTarget.innerHTML = `
            <nav id="navbar" class="fixed w-full z-[100] py-8 transition-all duration-500 bg-black/80 backdrop-blur-md border-b border-zinc-900">
                <div class="max-w-7xl mx-auto px-8 flex justify-between items-center">
                    <a href="/" class="text-3xl font-black text-white font-outfit uppercase tracking-tighter">IAM <span class="text-amber-500">NAD</span></a>
                    <div class="hidden lg:flex items-center space-x-8 text-[11px] uppercase tracking-[0.3em] font-bold">
                        ${publicNavItems.map(item => `
                            <a href="${item.path}" class="${isActive(path, item.path) ? 'text-white border-b-2 border-amber-500' : 'text-zinc-500 hover:text-white transition-colors'} pb-1">
                                ${item.name}
                            </a>
                        `).join('')}
                    </div>
                    <button class="lg:hidden text-white" id="mobile-nav-toggle"><i data-lucide="menu"></i></button>
                </div>
            </nav>
        `;
    }

    // Inject Admin Sidebar
    const sidebarTarget = document.getElementById('sidebar-target');
    if (sidebarTarget) {
        sidebarTarget.innerHTML = `
            <aside class="w-80 h-screen fixed bg-black border-r border-zinc-900 p-8 flex flex-col z-[100]">
                <div class="mb-12">
                    <h2 class="text-2xl font-black text-white font-outfit uppercase tracking-tighter">NAD <span class="text-amber-500">STUDIO</span></h2>
                    <p class="text-[9px] font-black tracking-widest text-zinc-700 uppercase mt-1">Intelligence Control</p>
                </div>
                <nav class="flex-1 space-y-2">
                    ${adminNavItems.map(item => `
                        <a href="${item.path}" class="flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest ${isActive(path, item.path) ? 'bg-amber-500/10 text-amber-500' : 'text-zinc-600 hover:bg-zinc-900 hover:text-zinc-300'}">
                            <i data-lucide="${item.icon}" class="w-4 h-4"></i> 
                            <span>${item.name}</span>
                        </a>
                    `).join('')}
                </nav>
                <div class="mt-auto border-t border-zinc-900 pt-8">
                    <button id="nav-logout" class="flex items-center space-x-4 px-6 py-4 text-zinc-700 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest">
                        <i data-lucide="log-out" class="w-4 h-4"></i> 
                        <span>Terminate Session</span>
                    </button>
                    <div class="mt-6 flex items-center space-x-3 px-6">
                        <div class="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <i data-lucide="user" class="w-4 h-4 text-amber-500"></i>
                        </div>
                        <div class="overflow-hidden">
                            <p id="user-status-text" class="text-[9px] font-black text-white uppercase truncate">Administrator</p>
                            <p class="text-[8px] font-bold text-zinc-700 uppercase tracking-tighter">Authorized Agency</p>
                        </div>
                    </div>
                </div>
            </aside>
        `;
        
        // Handle logout
        const logoutBtn = document.getElementById('nav-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                const { auth } = await import('./firebase-config.js');
                const { signOut } = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
                try {
                    await signOut(auth);
                    window.location.href = '/admin';
                } catch (err) {
                    console.error('Logout failed:', err);
                }
            });
        }
    }

    if (window.lucide) window.lucide.createIcons();
}

function isActive(current, target) {
    if (target === '/' && current === '/') return true;
    if (target === '/admin' && (current === '/admin' || current === '/admin/index.html')) return true;
    if (target !== '/' && current.startsWith(target)) return true;
    return false;
}

// Ensure the navbar style is standard
const style = document.createElement('style');
style.textContent = `
    .nav-active { border-bottom: 2px solid #f59e0b; color: white !important; }
    #mobile-nav-toggle svg { width: 24px; height: 24px; }
`;
document.head.appendChild(style);

// Run initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
} else {
    initNav();
}
