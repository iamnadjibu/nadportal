import { UI } from '../shared/ui-library.js';
import { db, collection } from '../shared/firebase-config.js';
import { onSnapshot, query, where, addDoc, deleteDoc, doc, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * Shared renderer for Admin Content Pages (Films, Graphics, Websites)
 */
export function initAdminContentPage(typeFilter, pageTitle, subtitle) {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    const content = document.createElement('main');
    content.className = "flex-1 ml-80 p-16";
    
    const header = document.createElement('div');
    header.className = "flex justify-between items-end mb-16";
    
    const titleBlock = UI.renderTitle(pageTitle, subtitle);
    header.appendChild(titleBlock);
    
    const addBtn = document.createElement('button');
    addBtn.className = "bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-500 transition-all";
    addBtn.textContent = `New ${pageTitle}`;
    header.appendChild(addBtn);
    
    content.appendChild(header);

    const list = document.createElement('div');
    list.id = "admin-list";
    list.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8";
    content.appendChild(list);
    root.appendChild(content);

    // Add logic
    addBtn.onclick = () => {
        const title = prompt(`${pageTitle} Title:`);
        if (title) {
            addDoc(collection(db, 'nad_projects'), { 
                title, 
                type: Array.isArray(typeFilter) ? typeFilter[0] : typeFilter, 
                timestamp: Date.now(), 
                views: 0, 
                clicks: 0, 
                thumbnail: 'https://via.placeholder.com/800x450' 
            });
        }
    };

    // Data Loading
    let q;
    if (Array.isArray(typeFilter)) {
        q = query(collection(db, 'nad_projects'), where('type', 'in', typeFilter));
    } else {
        q = query(collection(db, 'nad_projects'), where('type', '==', typeFilter));
    }

    onSnapshot(q, (snap) => {
        list.innerHTML = '';
        snap.docs.forEach(snapDoc => {
            const p = snapDoc.data();
            const item = document.createElement('div');
            item.className = "glass-panel p-8 rounded-[2.5rem] flex items-center justify-between group";
            item.innerHTML = `
                <div class="flex items-center space-x-6">
                    <div class="w-24 h-16 rounded-xl overflow-hidden bg-black">
                        <img src="${p.thumbnail}" class="w-full h-full object-cover opacity-50">
                    </div>
                    <div>
                        <h3 class="text-white font-black text-sm uppercase">${p.title}</h3>
                        <p class="text-zinc-700 text-[10px] font-bold uppercase">${p.type}</p>
                    </div>
                </div>
                <button class="delete-btn text-zinc-800 hover:text-red-500 transition-colors">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;
            
            item.querySelector('.delete-btn').onclick = async () => {
                if (confirm(`Erase ${pageTitle} node?`)) await deleteDoc(doc(db, 'nad_projects', snapDoc.id));
            };
            
            list.appendChild(item);
        });
        if (window.lucide) window.lucide.createIcons();
    });
}

/**
 * Specialized renderer for Admin Reviews
 */
export function initAdminReviewsPage() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    const content = document.createElement('main');
    content.className = "flex-1 ml-80 p-16";
    content.appendChild(UI.renderTitle('COMMUNITY REVIEWS', 'Monitoring Discourse'));

    const list = document.createElement('div');
    list.className = "space-y-6";
    content.appendChild(list);
    root.appendChild(content);

    onSnapshot(query(collection(db, 'nad_comments'), orderBy('timestamp', 'desc')), (snap) => {
        list.innerHTML = '';
        if (snap.empty) {
            list.innerHTML = `<p class="py-20 text-center font-bold text-zinc-900 border-2 border-dashed border-zinc-900 rounded-[3rem] uppercase tracking-widest">No transmissions recorded</p>`;
            return;
        }

        snap.docs.forEach(snapDoc => {
            const c = snapDoc.data();
            const item = document.createElement('div');
            item.className = "glass-panel p-10 rounded-[3rem] flex justify-between items-center group transition-all hover:border-amber-500/30";
            item.innerHTML = `
                <div class="space-y-3">
                    <div class="flex items-center space-x-3">
                        <span class="bg-amber-500 text-black px-3 py-1 rounded-full text-[8px] font-black uppercase">Identity</span>
                        <p class="text-white text-xs font-black uppercase tracking-widest">${c.userName}</p>
                        ${c.userEmail ? `<span class="text-zinc-700 text-[10px] lowercase">${c.userEmail}</span>` : ''}
                    </div>
                    <p class="text-zinc-400 text-sm leading-relaxed max-w-3xl">"${c.text}"</p>
                    <p class="text-[8px] font-bold text-zinc-800 uppercase tracking-widest">${new Date(c.timestamp).toLocaleString()}</p>
                </div>
                <button class="delete-btn p-4 bg-zinc-900 text-zinc-700 hover:bg-red-600 hover:text-white rounded-2xl transition-all">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            `;
            
            item.querySelector('.delete-btn').onclick = async () => {
                if (confirm("Purge this review transmission?")) await deleteDoc(doc(db, 'nad_comments', snapDoc.id));
            };
            
            list.appendChild(item);
        });
        if (window.lucide) window.lucide.createIcons();
    });
}
