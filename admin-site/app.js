import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, deleteDoc, doc, updateDoc, where } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

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
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const projectsRef = collection(db, 'nad_projects');
const commentsRef = collection(db, 'nad_comments');

// --- STATE ---
let state = {
    user: null,
    projects: [],
    comments: [],
    activeTab: 'dashboard',
    authMode: 'LOGIN' // or 'SIGNUP'
};

// --- AUTH LOGIC ---
const init = () => {
    onAuthStateChanged(auth, (user) => {
        state.user = user;
        if (user) {
            document.getElementById('login-overlay').classList.add('hidden');
            document.getElementById('admin-panel').classList.remove('hidden');
            fetchSystemData();
        } else {
            document.getElementById('login-overlay').classList.remove('hidden');
            document.getElementById('admin-panel').classList.add('hidden');
        }
    });

    window.switchTab = switchTab;
    setupAuthListeners();
};

const setupAuthListeners = () => {
    const authForm = document.getElementById('auth-form');
    const googleBtn = document.getElementById('google-auth-btn');
    const toggleBtn = document.getElementById('toggle-auth-mode');
    const logoutBtn = document.getElementById('logout-btn');

    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const password = document.getElementById('auth-password').value;
        const btn = document.getElementById('auth-submit-btn');
        btn.disabled = true;
        btn.textContent = state.authMode === 'LOGIN' ? 'AUTHORIZING...' : 'CREATING NODE...';

        try {
            if (state.authMode === 'LOGIN') {
                await signInWithEmailAndPassword(auth, email, password);
                showToast("Access Granted", "success");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                showToast("Network Node Created", "success");
            }
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            btn.disabled = false;
            btn.textContent = state.authMode === 'LOGIN' ? 'Authorize Access' : 'Register Account';
        }
    };

    googleBtn.onclick = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            showToast("Google Authorization Successful", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    toggleBtn.onclick = () => {
        state.authMode = state.authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN';
        document.getElementById('auth-mode-text').textContent = state.authMode === 'LOGIN' ? 'Command Center Access' : 'New Administrator Registration';
        document.getElementById('auth-submit-btn').textContent = state.authMode === 'LOGIN' ? 'Authorize Access' : 'Register Account';
        toggleBtn.textContent = state.authMode === 'LOGIN' ? 'Need an account? Request Signup' : 'Already registered? Return to Login';
    };

    logoutBtn.onclick = async () => {
        await signOut(auth);
        showToast("Session Terminated");
    };
};

// --- DATA FETCHING & RENDERING (Rest of logic remains same but uses state.user) ---
const fetchSystemData = () => {
    onSnapshot(query(projectsRef, orderBy('timestamp', 'desc')), (snapshot) => {
        state.projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderActiveTab();
    });
    onSnapshot(query(commentsRef, orderBy('timestamp', 'desc')), (snapshot) => {
        state.comments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (state.activeTab === 'comments') renderCommentsTab();
    });
};

const switchTab = (tabId) => {
    state.activeTab = tabId;
    document.querySelectorAll('.sidebar-link').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    
    const titles = {
        'dashboard': { t: 'INTELLIGENCE', s: 'Real-time engagement telemetry' },
        'films': { t: 'FILM NODE', s: 'Narrative content management' },
        'graphics': { t: 'GRAPHIC NODE', s: 'Aesthetic asset management' },
        'websites': { t: 'WEBSITE NODE', s: 'Digital infrastructure control' },
        'comments': { t: 'REVIEWS', s: 'Community discourse monitoring' }
    };
    
    document.getElementById('page-title').textContent = titles[tabId].t;
    document.getElementById('page-subtitle').textContent = titles[tabId].s;
    
    renderActiveTab();
};

const renderActiveTab = () => {
    const root = document.getElementById('admin-root');
    const utility = document.getElementById('utility-bar');
    utility.innerHTML = '';

    if (state.activeTab === 'dashboard') renderDashboardTab();
    else if (['films', 'graphics', 'websites'].includes(state.activeTab)) {
        renderContentTab();
        utility.innerHTML = `<button onclick="window.openAddModal()" class="bg-amber-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-amber-400">Add Production</button>`;
    }
    else if (state.activeTab === 'comments') renderCommentsTab();
    
    lucide.createIcons();
};

// --- DASHBOARD (CHARTS) ---
function renderDashboardTab() {
    const root = document.getElementById('admin-root');
    root.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div class="glass p-10 rounded-[2.5rem]">
                <h4 class="text-white text-xs font-black uppercase tracking-widest mb-8">Video Consumption Trend</h4>
                <canvas id="viewsChart"></canvas>
            </div>
            <div class="glass p-10 rounded-[2.5rem]">
                <h4 class="text-white text-xs font-black uppercase tracking-widest mb-8">Ecosystem Engagement (Web vs Graphics)</h4>
                <canvas id="ecosystemChart"></canvas>
            </div>
            <div class="glass p-10 rounded-[2.5rem] lg:col-span-2">
                <h4 class="text-white text-xs font-black uppercase tracking-widest mb-8">Production Hierarchy (AI vs Short vs Feature)</h4>
                <canvas id="hierarchyChart"></canvas>
            </div>
        </div>
    `;

    setTimeout(initCharts, 50);
}

function initCharts() {
    const viewsCtx = document.getElementById('viewsChart')?.getContext('2d');
    const ecosystemCtx = document.getElementById('ecosystemChart')?.getContext('2d');
    const hierarchyCtx = document.getElementById('hierarchyChart')?.getContext('2d');
    if (!viewsCtx) return;

    const videoProjects = state.projects.filter(p => ['FILM', 'AI FILM', 'SHORT FILM'].includes(p.type.toUpperCase()));
    const chartOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: '#71717a', font: { family: 'Inter', size: 10, weight: 'bold' } } } },
        scales: {
            y: { grid: { color: '#18181b' }, ticks: { color: '#71717a' } },
            x: { grid: { display: false }, ticks: { color: '#71717a' } }
        }
    };

    // Views Chart
    new Chart(viewsCtx, {
        type: 'bar',
        data: {
            labels: videoProjects.map(p => p.title),
            datasets: [{
                label: 'Views',
                data: videoProjects.map(p => p.views || 0),
                backgroundColor: '#f59e0b',
                borderRadius: 10
            }]
        },
        options: chartOptions
    });

    // Ecosystem Chart
    const websites = state.projects.filter(p => p.type === 'WEBSITE');
    const graphics = state.projects.filter(p => p.type === 'GRAPHIC');
    new Chart(ecosystemCtx, {
        type: 'line',
        data: {
            labels: state.projects.slice(0, 5).map((_v, i) => `Node ${i+1}`),
            datasets: [
                { label: 'Websites', data: websites.map(p => p.clicks || 0), borderColor: '#ffffff', fill: false, tension: 0.4 },
                { label: 'Graphics', data: graphics.map(p => p.clicks || 0), borderColor: '#f59e0b', fill: false, tension: 0.4 }
            ]
        },
        options: chartOptions
    });

    // Hierarchy Chart
    const aiFilms = state.projects.filter(p => p.type === 'AI FILM');
    const shortFilms = state.projects.filter(p => p.type === 'SHORT FILM');
    const featureFilms = state.projects.filter(p => p.type === 'FILM');
    new Chart(hierarchyCtx, {
        type: 'line',
        data: {
            labels: state.projects.slice(0, 3).map((_v, i) => `Cycle ${i+1}`),
            datasets: [
                { label: 'AI FILM', data: aiFilms.map(p => p.views || 0), borderColor: '#3b82f6', fill: false, tension: 0.4 },
                { label: 'SHORT FILM', data: shortFilms.map(p => p.views || 0), borderColor: '#f59e0b', fill: false, tension: 0.4 },
                { label: 'FILM', data: featureFilms.map(p => p.views || 0), borderColor: '#ffffff', fill: false, tension: 0.4 }
            ]
        },
        options: chartOptions
    });
}

// --- CONTENT MANAGEMENT ---
function renderContentTab() {
    const root = document.getElementById('admin-root');
    const typeMap = { 'films': ['FILM', 'AI FILM', 'SHORT FILM'], 'graphics': ['GRAPHIC'], 'websites': ['WEBSITE'] };
    const filtered = state.projects.filter(p => typeMap[state.activeTab].includes(p.type.toUpperCase()));

    root.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            ${filtered.length ? filtered.map(p => `
                <div class="glass p-6 rounded-3xl group ${p.hidden ? 'opacity-30' : ''}">
                    <div class="aspect-video rounded-2xl overflow-hidden mb-6 relative">
                        <img src="${p.thumbnail}" class="w-full h-full object-cover">
                        <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <div class="flex space-x-3">
                                <button onclick="window.openEditModal('${p.id}')" class="p-3 bg-white text-black rounded-xl"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                                <button onclick="window.toggleHide('${p.id}', ${!p.hidden})" class="p-3 bg-zinc-800 text-white rounded-xl"><i data-lucide="${p.hidden ? 'eye' : 'eye-off'}" class="w-4 h-4"></i></button>
                                <button onclick="window.deleteProject('${p.id}')" class="p-3 bg-red-600 text-white rounded-xl"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                             </div>
                        </div>
                    </div>
                    <h4 class="text-white font-black text-sm uppercase tracking-tighter">${p.title}</h4>
                    <p class="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">${p.type}</p>
                </div>
            `).join('') : '<p class="col-span-full py-20 text-center font-bold">NODE EMPTY</p>'}
        </div>
    `;
    
    // Attach globals
    window.openEditModal = openEditModal;
    window.deleteProject = deleteProject;
    window.toggleHide = toggleHide;
}

function renderCommentsTab() {
    const root = document.getElementById('admin-root');
    root.innerHTML = `
        <div class="space-y-4">
            ${state.comments.map(c => `
                <div class="glass p-8 rounded-[2rem] flex justify-between items-center">
                    <div class="space-y-2">
                        <p class="text-white text-xs font-black uppercase tracking-widest">${c.userName} <span class="text-zinc-600 text-[10px] ml-2">(${c.userEmail || 'No Email'})</span></p>
                        <p class="text-zinc-400 text-sm leading-relaxed max-w-2xl">"${c.text}"</p>
                    </div>
                    <button onclick="window.deleteComment('${c.id}')" class="text-zinc-700 hover:text-red-500 transition-colors">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    window.deleteComment = deleteComment;
}

// --- OPERATIONS (Same as before but verifying auth) ---
window.openAddModal = () => renderModal('ADD');
const openEditModal = (id) => renderModal('EDIT', state.projects.find(p => p.id === id));

function renderModal(mode, data = null) {
    const container = document.getElementById('admin-modal-container');
    container.innerHTML = `
        <div class="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <div class="absolute inset-0 bg-black/95 backdrop-blur-2xl" id="modal-backdrop"></div>
            <div class="relative w-full max-w-3xl glass p-12 rounded-[3.5rem] shadow-2xl">
                <h2 class="text-3xl font-black text-white uppercase tracking-tighter font-outfit mb-10">${mode} PRODUCTION</h2>
                <form id="project-form" class="grid grid-cols-2 gap-6">
                    <div class="col-span-2">
                        <label class="block text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Title</label>
                        <input type="text" id="p-title" value="${data?.title || ''}" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Type</label>
                        <select id="p-type" class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500">
                            <option value="FILM" ${data?.type === 'FILM' ? 'selected' : ''}>FEATURE FILM</option>
                            <option value="AI FILM" ${data?.type === 'AI FILM' ? 'selected' : ''}>AI FILM</option>
                            <option value="SHORT FILM" ${data?.type === 'SHORT FILM' ? 'selected' : ''}>SHORT FILM</option>
                            <option value="WEBSITE" ${data?.type === 'WEBSITE' ? 'selected' : ''}>WEBSITE</option>
                            <option value="GRAPHIC" ${data?.type === 'GRAPHIC' ? 'selected' : ''}>GRAPHIC</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Media URL</label>
                        <input type="url" id="p-link" value="${data?.link || ''}" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Thumbnail URL</label>
                        <input type="url" id="p-thumb" value="${data?.thumbnail || ''}" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500">
                    </div>
                    <div>
                        <label class="block text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Logo URL (Website Node)</label>
                        <input type="url" id="p-logo" value="${data?.logo || ''}" class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white outline-none focus:border-amber-500" placeholder="Optional for Websites">
                    </div>
                    <div class="col-span-2">
                        <label class="block text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-3">Brief Description</label>
                        <textarea id="p-desc" required class="w-full bg-black border border-zinc-900 rounded-2xl px-6 py-4 text-white h-32 outline-none focus:border-amber-500 resize-none">${data?.description || ''}</textarea>
                    </div>
                    <div class="col-span-2 pt-6">
                        <button type="submit" class="w-full bg-white text-black font-black uppercase tracking-widest py-5 rounded-2xl hover:bg-amber-500 transition-all">${mode === 'ADD' ? 'Deploy Production' : 'Sync Changes'}</button>
                    </div>
                </form>
                <button onclick="document.getElementById('admin-modal-container').innerHTML = ''" class="absolute top-10 right-10 text-zinc-700 hover:text-white transition-colors">
                    <i data-lucide="x" class="w-10 h-10"></i>
                </button>
            </div>
        </div>
    `;
    lucide.createIcons();
    
    document.getElementById('project-form').onsubmit = async (e) => {
        e.preventDefault();
        const payload = {
            title: document.getElementById('p-title').value,
            type: document.getElementById('p-type').value,
            link: document.getElementById('p-link').value,
            thumbnail: document.getElementById('p-thumb').value,
            logo: document.getElementById('p-logo').value,
            description: document.getElementById('p-desc').value,
            timestamp: data?.timestamp || Date.now()
        };

        try {
            if (mode === 'ADD') await addDoc(projectsRef, { ...payload, views: 0, clicks: 0, hidden: false });
            else await updateDoc(doc(db, 'nad_projects', data.id), payload);
            showToast("Cloud Sync Successful", "success");
            container.innerHTML = '';
        } catch (err) { showToast(err.message, "error"); }
    };
}

// --- UTILS ---
async function deleteProject(id) {
    if (confirm("Permanently erase this production node?")) {
        await deleteDoc(doc(db, 'nad_projects', id)); showToast("Node Erased", "success");
    }
}
async function toggleHide(id, status) {
    await updateDoc(doc(db, 'nad_projects', id), { hidden: status }); showToast(status ? "Production Offline" : "Production Online", "success");
}
async function deleteComment(id) {
    if (confirm("Purge this review?")) {
        await deleteDoc(doc(db, 'nad_comments', id)); showToast("Review Purged", "success");
    }
}

function showToast(msg, type = "info") {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.style.opacity = '1';
    t.style.transform = 'translate(-50%, 0)';
    t.className = `fixed top-8 left-1/2 -translate-x-1/2 px-8 py-4 rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] z-[300] transition-all duration-500 ${type === 'error' ? 'bg-red-600 text-white' : 'bg-white text-black'} shadow-2xl`;
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translate(-50%, -20px)'; }, 3000);
}

// Start Admin Context
init();
