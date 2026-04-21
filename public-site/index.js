import { UI } from '../shared/ui-library.js';
import { db, collection } from '../shared/firebase-config.js';
import { onSnapshot, query, limit } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

function renderHome() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    // 1. Hero Section
    const hero = document.createElement('section');
    hero.className = "h-screen flex items-center justify-center text-center px-4 relative";
    hero.innerHTML = `
        <div class="relative z-10 max-w-6xl">
            <h2 class="text-amber-500 uppercase tracking-[0.5em] text-xs font-black mb-8 hero-anim">Nadjibullah Uwabato</h2>
            <h1 class="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-8 font-outfit hero-anim">Visionary <br> Directing</h1>
            <a href="/films" class="inline-block bg-white text-black px-12 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-500 transition-all hero-anim">See Creations</a>
        </div>
        <div class="absolute inset-0 bg-stardust opacity-20"></div>
    `;
    root.appendChild(hero);

    // 2. Highlights Section
    const highlightSection = document.createElement('section');
    highlightSection.className = "py-32 bg-zinc-950";
    const layout = UI.renderLayout('highlights-container');
    layout.className = "max-w-7xl mx-auto px-8"; // Override for home padding
    
    const title = UI.renderTitle("The Highlight Cut", "Core Node Productions");
    layout.appendChild(title);

    const grid = UI.renderGrid(3, 'highlights-grid');
    layout.appendChild(grid);
    highlightSection.appendChild(layout);
    root.appendChild(highlightSection);

    // 3. Animations
    if (window.gsap) {
        gsap.from(".hero-anim", { opacity: 0, y: 30, duration: 1, stagger: 0.2, ease: "power4.out" });
    }

    // 4. Data Loading
    const q = query(collection(db, 'nad_projects'), limit(3));
    onSnapshot(q, (snap) => {
        grid.innerHTML = '';
        snap.docs.forEach(doc => {
            const p = doc.data();
            const card = UI.renderProjectCard(p, () => window.location.href = `/films`); // Temp redirect
            grid.appendChild(card);
        });
    });
}

renderHome();
