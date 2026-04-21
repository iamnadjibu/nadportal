/**
 * NAD PORTAL UI LIBRARY
 * Core utility for generating dynamic, high-end visual components.
 */

export const UI = {
    /** Renders a standard page layout container */
    renderLayout: (id) => {
        const container = document.createElement('div');
        container.id = id;
        container.className = "pt-48 pb-20 px-8 max-w-7xl mx-auto";
        return container;
    },

    /** Renders a Cinematic Title Node */
    renderTitle: (text, subtitle = null) => {
        const wrapper = document.createElement('div');
        wrapper.className = "mb-16";
        wrapper.innerHTML = `
            <h1 class="text-7xl md:text-8xl font-black text-white uppercase tracking-tighter font-outfit mb-2">${text}</h1>
            ${subtitle ? `<p class="text-[10px] font-black tracking-[0.3em] text-zinc-700 uppercase">${subtitle}</p>` : ''}
        `;
        return wrapper;
    },

    /** Renders a responsive Grid Node */
    renderGrid: (cols = 3, id = "content-grid") => {
        const grid = document.createElement('div');
        grid.id = id;
        const colClass = {
            1: 'grid-cols-1',
            2: 'grid-cols-1 md:grid-cols-2',
            3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
            4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
        };
        grid.className = `grid ${colClass[cols] || colClass[3]} gap-10`;
        return grid;
    },

    /** Renders a Project Card (Film/Graphic Style) */
    renderProjectCard: (p, onClick) => {
        const card = document.createElement('div');
        card.className = "group cursor-pointer bg-zinc-900/50 rounded-[3rem] overflow-hidden border border-zinc-900 transition-all hover:border-amber-500/30";
        card.innerHTML = `
            <div class="aspect-video relative overflow-hidden">
                <img src="${p.thumbnail}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
            <div class="p-8">
                <p class="text-amber-500 text-[10px] font-black uppercase mb-1 tracking-widest">${p.type}</p>
                <h3 class="text-2xl font-black text-white uppercase tracking-tighter">${p.title}</h3>
            </div>
        `;
        if (onClick) card.addEventListener('click', onClick);
        return card;
    },

    /** Renders a Website Card (Circular Logo Style) */
    renderWebsiteCard: (p) => {
        const card = document.createElement('div');
        card.className = "glass-panel p-10 rounded-[3.5rem] text-center flex flex-col items-center group transition-all hover:bg-zinc-900/30";
        card.innerHTML = `
            <div class="w-24 h-24 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden mb-8 group-hover:scale-110 transition-all duration-500 shadow-2xl">
                <img src="${p.logo || p.thumbnail}" class="w-full h-full object-cover">
            </div>
            <h3 class="text-xl font-black text-white uppercase tracking-tighter mb-8">${p.title}</h3>
            <a href="${p.link}" target="_blank" class="w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 transition-all shadow-xl">
                Open Node
            </a>
        `;
        return card;
    },

    /** Renders a Modal Node */
    renderModalShell: () => {
        const modal = document.createElement('div');
        modal.id = "ui-modal";
        modal.className = "fixed inset-0 z-[300] flex items-center justify-center p-4 lg:p-12";
        modal.innerHTML = `
            <div class="absolute inset-0 bg-black/95 backdrop-blur-3xl" id="modal-backdrop"></div>
            <div class="relative w-full max-w-7xl glass-panel rounded-[4rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row h-full max-h-[90vh]">
                <div id="modal-content-left" class="flex-1 bg-black relative"></div>
                <div id="modal-content-right" class="w-full lg:w-[450px] border-l border-zinc-900 p-10 overflow-y-auto bg-black/20"></div>
                <button id="modal-close" class="absolute top-8 right-8 text-white/20 hover:text-white transition-colors z-50">
                    <i data-lucide="x" class="w-10 h-10"></i>
                </button>
            </div>
        `;
        return modal;
    }
};
