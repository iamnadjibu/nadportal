import { UI } from '../shared/ui-library.js';
import { db, collection } from '../shared/firebase-config.js';
import { onSnapshot } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

function renderDashboard() {
    const root = document.getElementById('app-root');
    root.innerHTML = '';

    const content = document.createElement('main');
    content.className = "flex-1 ml-80 p-16";
    
    const title = UI.renderTitle('INTELLIGENCE', 'Real-time Ecosystem Analytics');
    content.appendChild(title);

    const statsGrid = UI.renderGrid(2, 'stats-grid');
    
    // Views Chart Container
    const viewsBox = document.createElement('div');
    viewsBox.className = "glass-panel p-10 rounded-[3rem] shadow-2xl";
    viewsBox.innerHTML = `
        <p class="text-white text-[10px] font-black uppercase mb-8">Video Views Analytics</p>
        <canvas id="viewsChart"></canvas>
    `;
    statsGrid.appendChild(viewsBox);

    // Clicks Chart Container
    const clicksBox = document.createElement('div');
    clicksBox.className = "glass-panel p-10 rounded-[3rem] shadow-2xl";
    clicksBox.innerHTML = `
        <p class="text-white text-[10px] font-black uppercase mb-8">System Clicks (Web vs Graphics)</p>
        <canvas id="clicksChart"></canvas>
    `;
    statsGrid.appendChild(clicksBox);

    content.appendChild(statsGrid);
    root.appendChild(content);

    // Load Charts
    onSnapshot(collection(db, 'nad_projects'), (snap) => {
        const projects = snap.docs.map(d => d.data());
        initCharts(projects);
    });
}

function initCharts(data) {
    const viewsCtx = document.getElementById('viewsChart')?.getContext('2d');
    const clicksCtx = document.getElementById('clicksChart')?.getContext('2d');
    if (!viewsCtx || !clicksCtx || !window.Chart) return;

    // Destroy existing charts if any to avoid re-render issues
    if (window.vChart) window.vChart.destroy();
    if (window.cChart) window.cChart.destroy();

    window.vChart = new Chart(viewsCtx, {
        type: 'bar',
        data: {
            labels: data.filter(p => ['FILM', 'AI FILM'].includes(p.type)).map(p => p.title),
            datasets: [{ label: 'Views', data: data.filter(p => ['FILM', 'AI FILM'].includes(p.type)).map(p => p.views || 0), backgroundColor: '#f59e0b' }]
        },
        options: { responsive: true, plugins: { legend: { display: false } } }
    });

    window.cChart = new Chart(clicksCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar'], 
            datasets: [
                { label: 'Websites', data: [12, 19, 3], borderColor: '#fff' },
                { label: 'Graphics', data: [5, 2, 9], borderColor: '#f59e0b' }
            ]
        },
        options: { responsive: true }
    });
}

renderDashboard();
