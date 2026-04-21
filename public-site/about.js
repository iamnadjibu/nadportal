import { UI } from '../shared/ui-library.js';

function renderAbout() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    const layout = UI.renderLayout('about-layout');
    const title = UI.renderTitle('ABOUT NAD', 'Visionary Director & Engineer');
    layout.appendChild(title);

    const content = document.createElement('div');
    content.className = "grid grid-cols-1 lg:grid-cols-2 gap-20 items-center";
    content.innerHTML = `
        <div class="aspect-square bg-zinc-900 rounded-[4rem] overflow-hidden border border-zinc-800">
            <img src="https://via.placeholder.com/800x800" class="w-full h-full object-cover grayscale opacity-80">
        </div>
        <div class="space-y-8">
            <h2 class="text-3xl font-black text-amber-500 uppercase tracking-widest">Nadjibullah Uwabato</h2>
            <p class="text-xl text-zinc-400 leading-relaxed font-light">
                A visionary director and creative engineer dedicated to the intersection of cinematic storytelling and digital innovation. 
                With a focus on AI-driven narrative and high-performance web architecture, NAD PORTAL serves as the central node for 
                experimental and professional visual productions.
            </p>
            <div class="grid grid-cols-2 gap-8 pt-8">
                <div>
                    <p class="text-[10px] font-black uppercase text-zinc-700 tracking-widest mb-2">Primary Domain</p>
                    <p class="text-white font-bold uppercase tracking-tighter">Film & Production</p>
                </div>
                <div>
                    <p class="text-[10px] font-black uppercase text-zinc-700 tracking-widest mb-2">Secondary Node</p>
                    <p class="text-white font-bold uppercase tracking-tighter">Creative Engineering</p>
                </div>
            </div>
        </div>
    `;
    layout.appendChild(content);
    root.appendChild(layout);
}

renderAbout();
