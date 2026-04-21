import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, updateDoc, doc, increment, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// --- FIREBASE SETUP ---
const firebaseConfig = {
  apiKey: "AIzaSyCJI93K3sZI-d5SC8Rotl9Ex_6mnVGyggE",
  authDomain: "nadportfolio.firebaseapp.com",
  projectId: "nadportfolio",
  storageBucket: "nadportfolio.firebasestorage.app",
  messagingSenderId: "1055308326353",
  appId: "1:1055308326353:web:1f37d0f8f7be1124ebacf0",
  measurementId: "G-HJ3WWDPSSD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const projectsRef = collection(db, 'nad_projects');
const commentsRef = collection(db, 'nad_comments');

// --- STATE MANAGEMENT ---
let state = {
    projects: [],
    currentView: 'home',
    loading: true
};

// --- ROUTER ---
const routes = {
    'home': renderHome,
    'films': renderFilms,
    'graphics': renderGraphics,
    'websites': renderWebsites,
    'about': renderAbout,
    'contact': renderContact
};

// --- INITIALIZATION ---
const init = () => {
    fetchData();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('scroll', handleNavbarScroll);
    handleRouteChange(); // Initial load
};

const fetchData = () => {
    const q = query(projectsRef, orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        state.projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        state.loading = false;
        renderCurrentView();
    });
};

const handleRouteChange = () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    state.currentView = hash;
    
    // Update Nav UI
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === `#${hash}`) {
            link.classList.add('text-white', 'active');
            link.classList.remove('text-zinc-500');
        } else {
            link.classList.remove('text-white', 'active');
            link.classList.add('text-zinc-500');
        }
    });

    renderCurrentView();
    window.scrollTo(0, 0);
};

const renderCurrentView = () => {
    const root = document.getElementById('app-root');
    const renderer = routes[state.currentView] || renderHome;
    
    // Add transition effect
    root.innerHTML = `<div class="view-enter">${renderer(state.projects)}</div>`;
    setTimeout(() => {
        root.querySelector('.view-enter')?.classList.add('view-enter-active');
    }, 10);

    lucide.createIcons();
    attachProjectListeners();
};

// --- VIEW RENDERERS ---

function renderHome(projects) {
    const latestFilms = projects.filter(p => ['FILM', 'AI FILM', 'SHORT FILM'].includes(p.type)).slice(0, 2);
    const latestWebsites = projects.filter(p => p.type === 'WEBSITE').slice(0, 3);
    const latestGraphics = projects.filter(p => p.type === 'GRAPHIC').slice(0, 2);

    return `
        <!-- Hero Section -->
        <section class="relative h-screen flex flex-col justify-center items-center text-center px-4 overflow-hidden">
            <div class="relative z-10 max-w-6xl mx-auto">
                <h2 id="hero-subtitle" class="text-amber-500 uppercase tracking-[0.6em] text-xs font-black mb-8 hero-title">Nadjibullah Uwabato</h2>
                <h1 id="hero-main-title" class="text-7xl md:text-9xl lg:text-[11rem] font-black text-white uppercase tracking-tighter mb-10 leading-[0.85] font-outfit hero-title">
                    Cinematic <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-600">Visionary</span>
                </h1>
                <p id="hero-desc" class="text-xl md:text-2xl max-w-2xl mx-auto text-zinc-500 mb-14 font-light hero-p">
                    Crafting legacies through the intersection of filmmaking, engineering, and digital art.
                </p>
                <div id="hero-cta" class="flex flex-wrap justify-center gap-6 hero-btn">
                    <a href="#films" class="bg-amber-500 text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-amber-400 transition-all shadow-2xl shadow-amber-500/20">Watch Tales</a>
                    <a href="#about" class="bg-zinc-900 border border-zinc-800 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:border-amber-500 transition-all">My Story</a>
                </div>
            </div>
            
            <!-- Animated Background Grid -->
            <div class="absolute inset-0 z-0 opacity-10">
                <div class="grid grid-cols-12 h-full w-full">
                    ${Array(48).fill(0).map(() => `<div class="border-[0.5px] border-zinc-800"></div>`).join('')}
                </div>
            </div>
        </section>

        <!-- Highlights Section -->
        <section class="py-32 bg-black">
            <div class="max-w-7xl mx-auto px-8">
                <div class="flex justify-between items-end mb-20">
                    <div>
                        <h3 class="text-amber-500 uppercase tracking-widest text-xs font-bold mb-4">Latest Highlights</h3>
                        <h2 class="text-5xl font-black text-white tracking-tighter font-outfit">The Recent Cut</h2>
                    </div>
                    <a href="#films" class="text-zinc-500 hover:text-white uppercase tracking-widest text-[10px] font-black pb-1 border-b border-zinc-800">See All Productions</a>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    ${latestFilms.map(p => renderProjectCard(p)).join('')}
                    ${latestWebsites.map(p => renderWebsiteCard(p)).join('')}
                    ${latestGraphics.map(p => renderProjectCard(p)).join('')}
                </div>
            </div>
        </section>
    `;
}

function renderFilms(projects) {
    const films = projects.filter(p => ['FILM', 'AI FILM', 'SHORT FILM'].includes(p.type.toUpperCase()));
    return `
        <div class="pt-40 pb-20 px-8 max-w-7xl mx-auto">
            <h1 class="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-4 font-outfit">FILMS</h1>
            <p class="text-zinc-500 uppercase tracking-[0.4em] text-xs font-black mb-20">Narrative Excellence & Virtual Cinematography</p>
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                ${films.map(p => renderProjectCard(p, true)).join('')}
            </div>
        </div>
    `;
}

function renderGraphics(projects) {
    const graphics = projects.filter(p => p.type.toUpperCase() === 'GRAPHIC');
    return `
        <div class="pt-40 pb-20 px-8 max-w-7xl mx-auto">
            <h1 class="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-4 font-outfit">GRAPHICS</h1>
            <p class="text-zinc-500 uppercase tracking-[0.4em] text-xs font-black mb-20">Visual Identity & Artistic Design</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                ${graphics.map(p => renderProjectCard(p, true)).join('')}
            </div>
        </div>
    `;
}

function renderWebsites(projects) {
    const websites = projects.filter(p => p.type.toUpperCase() === 'WEBSITE');
    return `
        <div class="pt-40 pb-20 px-8 max-w-7xl mx-auto">
            <h1 class="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-4 font-outfit">WEBSITES</h1>
            <p class="text-zinc-500 uppercase tracking-[0.4em] text-xs font-black mb-20">Digital Architecture & User Journeys</p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                ${websites.map(p => renderWebsiteCard(p)).join('')}
            </div>
        </div>
    `;
}

function renderAbout() {
    return `
        <div class="pt-40 pb-20 px-8 max-w-5xl mx-auto text-center">
            <h1 class="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-12 font-outfit">ABOUT NAD</h1>
            <div class="glass-panel p-12 rounded-[3rem] text-left">
                <p class="text-2xl text-zinc-300 leading-relaxed font-light mb-8 italic">
                    "I don't just capture light; I capture the frequency of emotion."
                </p>
                <div class="space-y-6 text-zinc-400 text-lg leading-relaxed">
                    <p>I am <strong>Nadjibullah Uwabato</strong>, known as <strong>IAM NAD</strong>. As a filmmaker trained at KSP Rwanda and a mechanical engineer in training, my work lives at the edge of precision and poetry.</p>
                    <p>Founder of <strong>NAD PRODUCTION</strong>, I've spent years honing the art of visual storytelling, from $7 minimalist shorts to complex AI-assisted films. My mission is to bridge the gap between technical engineering and pure creative vision.</p>
                </div>
            </div>
        </div>
    `;
}

function renderContact() {
    return `
        <div class="pt-40 pb-20 px-8 max-w-7xl mx-auto text-center">
             <h1 class="text-7xl md:text-9xl font-black text-white uppercase tracking-tighter mb-4 font-outfit">CONTACT</h1>
             <p class="text-zinc-500 uppercase tracking-[0.4em] text-xs font-black mb-20">Let's create the next legacy</p>
             <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <a href="mailto:nadjibullahu@gmail.com" class="glass-panel p-10 rounded-[2.5rem] group hover:border-amber-500/50 transition-all">
                    <i data-lucide="mail" class="w-12 h-12 text-amber-500 mb-6 mx-auto group-hover:scale-110 transition-transform"></i>
                    <h3 class="text-white font-black uppercase text-xl">Email Me</h3>
                    <p class="text-zinc-500 text-sm mt-2">nadjibullahu@gmail.com</p>
                </a>
                <a href="https://wa.me/250786487234" class="glass-panel p-10 rounded-[2.5rem] group hover:border-amber-500/50 transition-all">
                    <i data-lucide="message-circle" class="w-12 h-12 text-emerald-500 mb-6 mx-auto group-hover:scale-110 transition-transform"></i>
                    <h3 class="text-white font-black uppercase text-xl">WhatsApp</h3>
                    <p class="text-zinc-500 text-sm mt-2">+250 786 487 234</p>
                </a>
             </div>
        </div>
    `;
}

// --- CARD RENDERERS ---

function renderProjectCard(p, detailed = false) {
    return `
        <div class="group relative flex flex-col bg-zinc-900/40 rounded-[2.5rem] overflow-hidden border border-zinc-900 hover:border-amber-500/30 transition-all duration-500 cursor-pointer project-card-trigger" data-id="${p.id}">
            <div class="relative aspect-video overflow-hidden">
                <img src="${p.thumbnail}" class="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000">
                <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div class="bg-amber-500 w-16 h-16 rounded-full flex items-center justify-center text-black shadow-2xl">
                        <i data-lucide="play" class="w-6 h-6 fill-current ml-1"></i>
                    </div>
                </div>
            </div>
            <div class="p-8">
                <p class="text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase mb-1">${p.type}</p>
                <h3 class="text-2xl font-black text-white uppercase tracking-tighter">${p.title}</h3>
                ${detailed ? `<p class="mt-4 text-zinc-500 text-sm font-light leading-relaxed line-clamp-2">${p.description}</p>` : ''}
                <div class="mt-6 flex items-center justify-between text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
                    <span>${p.views || 0} Views</span>
                    <span>${p.clicks || 0} Clicks</span>
                </div>
            </div>
        </div>
    `;
}

function renderWebsiteCard(p) {
    return `
        <div class="website-card glass-panel p-8 rounded-[3rem] text-center flex flex-col items-center group">
            <div class="website-logo-container mb-6 group-hover:scale-110 transition-all duration-500">
                <img src="${p.logo || p.thumbnail}" class="website-logo shadow-2xl">
            </div>
            <h3 class="text-xl font-black text-white uppercase tracking-tighter mb-2">${p.title}</h3>
            <p class="text-zinc-600 text-[10px] font-black tracking-widest uppercase mb-6">Website Evolution</p>
            <a href="${p.link}" target="_blank" class="w-full bg-zinc-900 border border-zinc-800 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-500 hover:text-black hover:border-amber-500 transition-all visit-trigger" data-id="${p.id}">Visit Website</a>
        </div>
    `;
}

// --- PROJECT INTERACTION (MODAL & STATS) ---

const attachProjectListeners = () => {
    document.querySelectorAll('.project-card-trigger').forEach(card => {
        card.onclick = () => openProjectModal(card.dataset.id);
    });

    document.querySelectorAll('.visit-trigger').forEach(btn => {
        btn.onclick = (e) => {
            incrementStat(btn.dataset.id, 'clicks');
        };
    });

    // Run GSAP for Hero if on home
    if (state.currentView === 'home') {
        gsap.to(".hero-title", { opacity: 1, y: 0, duration: 1.2, stagger: 0.2, ease: "power4.out" });
        gsap.to(".hero-p", { opacity: 1, y: 0, duration: 1, delay: 0.6, ease: "power3.out" });
        gsap.to(".hero-btn", { opacity: 1, scale: 1, duration: 0.8, delay: 0.8, ease: "back.out(1.7)" });
    }
};

const openProjectModal = async (id) => {
    const p = state.projects.find(p => p.id === id);
    if (!p) return;

    incrementStat(id, 'views');

    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = `
        <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/95 backdrop-blur-2xl" id="modal-backdrop"></div>
            <div class="relative w-full max-w-6xl max-h-[90vh] bg-zinc-950 border border-zinc-900 rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl glass-panel">
                <button class="absolute top-6 right-6 z-50 text-zinc-500 hover:text-amber-500 transition-colors" id="modal-close">
                    <i data-lucide="x" class="w-8 h-8"></i>
                </button>
                
                <!-- Media Area -->
                <div class="w-full md:w-2/3 aspect-video bg-black relative">
                    <iframe src="${formatLinkForEmbed(p.link)}" class="w-full h-full" frameborder="0" allowfullscreen></iframe>
                </div>
                
                <!-- Interaction Area -->
                <div class="w-full md:w-1/3 p-10 overflow-y-auto flex flex-col bg-zinc-950/50">
                    <div class="mb-10">
                        <p class="text-amber-500 text-[10px] font-black tracking-widest uppercase mb-1">${p.type}</p>
                        <h2 class="text-3xl font-black text-white uppercase tracking-tighter">${p.title}</h2>
                        <p class="mt-4 text-zinc-500 text-sm font-light leading-relaxed">${p.description}</p>
                    </div>

                    <div class="flex-1 flex flex-col">
                        <h4 class="text-white text-xs font-black uppercase tracking-widest mb-6 flex items-center space-x-2">
                             <i data-lucide="message-square" class="w-4 h-4"></i>
                             <span>Community Reviews</span>
                        </h4>
                        
                        <!-- Comments List -->
                        <div id="comments-list" class="space-y-6 mb-8 flex-1">
                             <p class="text-zinc-700 text-xs italic">Loading conversations...</p>
                        </div>

                        <!-- Comment Form -->
                        <form id="comment-form" class="space-y-4">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" id="comment-name" placeholder="Your Profile Name" required class="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-amber-500">
                                <input type="email" id="comment-email" placeholder="Email (Optional)" class="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-amber-500">
                            </div>
                            <textarea id="comment-text" placeholder="Share your vision of this work..." required class="w-full bg-black border border-zinc-900 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-amber-500 resize-none h-24"></textarea>
                            <button type="submit" class="w-full bg-white text-black font-black uppercase tracking-widest text-[10px] py-4 rounded-xl hover:bg-amber-500 transition-all">Submit Review</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    lucide.createIcons();
    
    // Close logic
    document.getElementById('modal-backdrop').onclick = closeModal;
    document.getElementById('modal-close').onclick = closeModal;

    // Fetch Comments
    fetchComments(id);

    // Comment Submission
    document.getElementById('comment-form').onsubmit = (e) => submitComment(e, id);
};

const closeModal = () => {
    document.getElementById('modal-container').innerHTML = '';
};

const incrementStat = async (id, field) => {
    try {
        await updateDoc(doc(projectsRef, id), { [field]: increment(1) });
    } catch (err) { console.error(err); }
};

// --- COMMENTS LOGIC ---

const fetchComments = (projectId) => {
    const q = query(commentsRef, where('projectId', '==', projectId), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        const list = document.getElementById('comments-list');
        const comments = snapshot.docs.map(doc => doc.data());
        
        if (comments.length === 0) {
            list.innerHTML = `<p class="text-zinc-700 text-[10px] uppercase font-bold text-center py-4">No reviews yet. Be the first.</p>`;
            return;
        }

        list.innerHTML = comments.map(c => `
            <div class="border-l-2 border-zinc-900 pl-4 py-1">
                <div class="flex items-center space-x-2 mb-1">
                    <span class="text-white font-black text-[10px] uppercase">${c.userName}</span>
                    <span class="text-zinc-700 text-[8px] font-bold">${new Date(c.timestamp).toLocaleDateString()}</span>
                </div>
                <p class="text-zinc-500 text-[11px] leading-relaxed">${c.text}</p>
            </div>
        `).join('');
    });
};

const submitComment = async (e, projectId) => {
    e.preventDefault();
    const btn = e.target.querySelector('button');
    btn.disabled = true;
    btn.textContent = "TRANSMITTING...";

    const comment = {
        projectId,
        userName: document.getElementById('comment-name').value,
        userEmail: document.getElementById('comment-email').value || null,
        text: document.getElementById('comment-text').value,
        timestamp: Date.now()
    };

    try {
        await addDoc(commentsRef, comment);
        e.target.reset();
        showToast("Review Recorded");
    } catch (err) {
        showToast("Transmission Error", "error");
    } finally {
        btn.disabled = false;
        btn.textContent = "Submit Review";
    }
};

// --- UTILS ---

function formatLinkForEmbed(url) {
    if (url.includes('drive.google.com') && url.includes('/view')) {
        return url.replace(/\/view.*$/, '/preview');
    }
    if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/');
    }
    return url;
}

function handleNavbarScroll() {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 100) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translate(-50%, 0)';
    toast.className = `fixed bottom-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest z-[200] transition-all duration-500 bg-amber-500 text-black shadow-2xl`;
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translate(-50%, 20px)';
    }, 3000);
}

// Start
init();
