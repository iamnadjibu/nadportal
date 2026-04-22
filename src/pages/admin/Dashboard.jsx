import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { Play, ThumbsUp, ThumbsDown, MousePointerClick, TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'nad_projects'), (snap) => {
            setProjects(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(p => !p.hidden));
        });
        return () => unsubscribe();
    }, []);

    const films = projects.filter(p => ['FILM', 'AI FILM', 'SHORT FILM'].includes(p.type));
    const graphics = projects.filter(p => p.type === 'GRAPHIC');
    const websites = projects.filter(p => p.type === 'WEBSITE');

    const totalViews = films.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalLikes = graphics.reduce((acc, curr) => acc + (curr.likes || 0), 0);
    const totalDislikes = graphics.reduce((acc, curr) => acc + (curr.dislikes || 0), 0);
    const totalClicks = websites.reduce((acc, curr) => acc + (curr.clicks || 0), 0);

    const viewsData = {
        labels: films.map(p => p.title.substring(0, 15) + (p.title.length > 15 ? '...' : '')),
        datasets: [{
            label: 'Views',
            data: films.map(p => p.views || 0),
            backgroundColor: '#f59e0b',
            borderRadius: 6
        }]
    };

    const graphicsData = {
        labels: graphics.map(p => p.title.substring(0, 15) + (p.title.length > 15 ? '...' : '')),
        datasets: [
            {
                label: 'Likes',
                data: graphics.map(p => p.likes || 0),
                backgroundColor: '#10b981',
                borderRadius: 4
            },
            {
                label: 'Dislikes',
                data: graphics.map(p => p.dislikes || 0),
                backgroundColor: '#ef4444',
                borderRadius: 4
            }
        ]
    };

    const clicksData = {
        labels: websites.map(p => p.title.substring(0, 15) + (p.title.length > 15 ? '...' : '')),
        datasets: [{
            label: 'Clicks',
            data: websites.map(p => p.clicks || 0),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            tension: 0.4,
            fill: true
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { 
            y: { grid: { color: '#27272a' }, ticks: { color: '#71717a' } }, 
            x: { grid: { display: false }, ticks: { color: '#71717a', maxRotation: 45, minRotation: 45 } } 
        }
    };

    return (
        <div className="space-y-24">
            
            {/* OVERVIEW SECTION */}
            <section>
                <div className="flex flex-col md:flex-row justify-between md:items-end mb-10 gap-4">
                    <div>
                        <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter mb-2">INTELLIGENCE</h1>
                        <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">Real-time Ecosystem Analytics</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800 flex items-center space-x-4">
                            <TrendingUp className="text-amber-500" size={24} />
                            <div>
                                <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Global Engagements</p>
                                <p className="text-white font-bold text-xl tabular-nums">{totalViews + totalLikes + totalClicks}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl">
                        <p className="text-amber-500 text-[10px] font-black uppercase mb-6 flex items-center"><Play size={14} className="mr-2"/> Film Views</p>
                        {films.length > 0 ? <Bar data={viewsData} options={chartOptions} /> : <p className="text-zinc-600 text-xs">No data.</p>}
                    </div>
                    <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl">
                        <p className="text-emerald-500 text-[10px] font-black uppercase mb-6 flex items-center"><ThumbsUp size={14} className="mr-2"/> Graphic Reactions</p>
                        {graphics.length > 0 ? <Bar data={graphicsData} options={chartOptions} /> : <p className="text-zinc-600 text-xs">No data.</p>}
                    </div>
                    <div className="glass-panel p-8 rounded-[2.5rem] shadow-2xl">
                        <p className="text-blue-500 text-[10px] font-black uppercase mb-6 flex items-center"><MousePointerClick size={14} className="mr-2"/> Website Clicks</p>
                        {websites.length > 0 ? <Line data={clicksData} options={chartOptions} /> : <p className="text-zinc-600 text-xs">No data.</p>}
                    </div>
                </div>
            </section>

            {/* FILMS SECTION */}
            <section className="glass-panel p-10 rounded-[3rem]">
                <div className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Film Section</h2>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total Network Views</p>
                        <p className="text-amber-500 font-black text-2xl tabular-nums">{totalViews}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    {films.map(film => (
                        <div key={film.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                            <p className="text-white font-bold uppercase tracking-tight text-sm">{film.title}</p>
                            <div className="flex items-center space-x-2 bg-amber-500/10 px-4 py-2 rounded-xl text-amber-500">
                                <Play size={14} />
                                <span className="font-black text-sm tabular-nums">{film.views || 0}</span>
                            </div>
                        </div>
                    ))}
                    {films.length === 0 && <p className="text-zinc-600 text-xs">No films uploaded.</p>}
                </div>
            </section>

            {/* GRAPHICS SECTION */}
            <section className="glass-panel p-10 rounded-[3rem]">
                <div className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Graphics Section</h2>
                    <div className="text-right flex space-x-6">
                        <div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total Likes</p>
                            <p className="text-emerald-500 font-black text-2xl tabular-nums">{totalLikes}</p>
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total Dislikes</p>
                            <p className="text-red-500 font-black text-2xl tabular-nums">{totalDislikes}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {graphics.map(graphic => (
                        <div key={graphic.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                            <p className="text-white font-bold uppercase tracking-tight text-sm truncate pr-4">{graphic.title}</p>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-emerald-500">
                                    <ThumbsUp size={12} />
                                    <span className="font-black text-xs tabular-nums">{graphic.likes || 0}</span>
                                </div>
                                <div className="flex items-center space-x-2 bg-red-500/10 px-3 py-1.5 rounded-lg text-red-500">
                                    <ThumbsDown size={12} />
                                    <span className="font-black text-xs tabular-nums">{graphic.dislikes || 0}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {graphics.length === 0 && <p className="text-zinc-600 text-xs">No graphics uploaded.</p>}
                </div>
            </section>

            {/* WEBSITES SECTION */}
            <section className="glass-panel p-10 rounded-[3rem]">
                <div className="flex justify-between items-end mb-10 border-b border-zinc-800 pb-4">
                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Websites Section</h2>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total Clicks</p>
                        <p className="text-blue-500 font-black text-2xl tabular-nums">{totalClicks}</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {websites.map(website => (
                        <div key={website.id} className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800/50">
                            <p className="text-white font-bold uppercase tracking-tight text-sm truncate pr-4">{website.title}</p>
                            <div className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-xl text-blue-500">
                                <MousePointerClick size={14} />
                                <span className="font-black text-sm tabular-nums">{website.clicks || 0}</span>
                            </div>
                        </div>
                    ))}
                    {websites.length === 0 && <p className="text-zinc-600 text-xs">No websites uploaded.</p>}
                </div>
            </section>

        </div>
    );
}
