import { UI } from '../shared/ui-library.js';
import { db, collection } from '../shared/firebase-config.js';
import { onSnapshot, query, where, orderBy } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

/**
 * Shared renderer for Public Content Pages (Films, Graphics, Websites)
 * @param {string} typeFilter - The type of production nodes to display
 * @param {string} pageTitle - The large cinematic header text
 */
export function initContentPage(typeFilter, pageTitle, subtitle) {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    const layout = UI.renderLayout('content-layout');
    const titleNode = UI.renderTitle(pageTitle, subtitle);
    layout.appendChild(titleNode);

    const isWebsite = typeFilter === 'WEBSITE';
    const grid = UI.renderGrid(isWebsite ? 4 : 2, 'content-grid');
    layout.appendChild(grid);
    root.appendChild(layout);

    // Queries
    let q;
    if (Array.isArray(typeFilter)) {
        q = query(collection(db, 'nad_projects'), where('type', 'in', typeFilter));
    } else {
        q = query(collection(db, 'nad_projects'), where('type', '==', typeFilter));
    }

    onSnapshot(q, (snap) => {
        grid.innerHTML = '';
        if (snap.empty) {
            grid.innerHTML = `<p class="col-span-full py-20 text-center font-bold text-zinc-900 uppercase tracking-widest">No nodes detected in this sector</p>`;
            return;
        }

        snap.docs.forEach(doc => {
            const p = doc.data();
            if (p.hidden) return;

            let card;
            if (isWebsite) {
                card = UI.renderWebsiteCard(p);
            } else {
                card = UI.renderProjectCard(p, () => {
                    // Open Modal logic here in future
                    console.log("Opening node:", p.title);
                });
            }
            grid.appendChild(card);
        });
    });
}
