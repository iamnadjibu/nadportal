import { UI } from '../shared/ui-library.js';

function renderContact() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    const layout = UI.renderLayout('contact-layout');
    const title = UI.renderTitle('CONTACT US', 'Communication Link Established');
    layout.appendChild(title);

    const content = document.createElement('div');
    content.className = "grid grid-cols-1 lg:grid-cols-2 gap-20";
    content.innerHTML = `
        <div class="space-y-12">
            <div>
                <h2 class="text-xl font-black text-white uppercase tracking-widest mb-6">Inquiry Channel</h2>
                <p class="text-zinc-500 text-sm leading-relaxed max-w-md">
                    Whether it is for a high-production film project, creative web infrastructure, or strategic aesthetic consultation, we are ready to transmit.
                </p>
            </div>
            
            <div class="space-y-6">
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                         <i data-lucide="mail" class="w-4 h-4 text-amber-500"></i>
                    </div>
                    <span class="text-xs font-black uppercase text-zinc-400">nadjibullahu@gmail.com</span>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center border border-zinc-800">
                         <i data-lucide="globe" class="w-4 h-4 text-amber-500"></i>
                    </div>
                    <span class="text-xs font-black uppercase text-zinc-400">nadportfolio.web.app</span>
                </div>
            </div>
        </div>

        <form id="contact-form" class="space-y-6 glass-panel p-10 rounded-[3rem]">
            <div class="grid grid-cols-2 gap-6">
                <input type="text" placeholder="IDENTITY" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500">
                <input type="email" placeholder="EMAIL" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500">
            </div>
            <input type="text" placeholder="SUBJECT" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500">
            <textarea placeholder="MESSAGE TRANSMISSION" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500 h-40 resize-none"></textarea>
            <button type="submit" class="w-full bg-white text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-amber-500 transition-all">Submit Transmission</button>
        </form>
    `;
    layout.appendChild(content);
    root.appendChild(layout);
    
    if (window.lucide) window.lucide.createIcons();
}

renderContact();
