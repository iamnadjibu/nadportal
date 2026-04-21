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
            setProjects(snap.docs.map(doc => doc.data()));
        });
        return () => unsubscribe();
    }, []);

    const films = projects.filter(p => ['FILM', 'AI FILM'].includes(p.type));
    
    const viewsData = {
        labels: films.map(p => p.title),
        datasets: [
            {
                label: 'Views',
                data: films.map(p => p.views || 0),
                backgroundColor: '#f59e0b',
                borderRadius: 10
            }
        ]
    };

    const clicksData = {
        labels: ['Jan', 'Feb', 'Mar'], // Represents time periods
        datasets: [
            {
                label: 'Website Clicks',
                data: [400, 800, 1200],
                borderColor: '#f59e0b',
                tension: 0.4
            }
        ]
    };

    return (
        <div>
            <div className="flex justify-between items-end mb-16">
                <div>
                    <h1 className="text-6xl font-black text-white font-outfit uppercase tracking-tighter mb-2">INTELLIGENCE</h1>
                    <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase">Real-time Ecosystem Analytics</p>
                </div>
                <div className="flex space-x-4">
                    <div className="bg-zinc-900 px-6 py-3 rounded-2xl border border-zinc-800">
                        <p className="text-[8px] font-black text-zinc-600 uppercase mb-1">Global Reach</p>
                        <p className="text-white font-bold text-xl tabular-nums">4.2K</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
                    <p className="text-white text-[10px] font-black uppercase mb-8">Video Views Analytics</p>
                    {films.length > 0 ? (
                        <Bar 
                            data={viewsData} 
                            options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { display: false }, x: { grid: { display: false } } } }} 
                        />
                    ) : (
                        <p className="text-zinc-600 font-bold uppercase text-xs">Awaiting data...</p>
                    )}
                </div>
                <div className="glass-panel p-10 rounded-[3rem] shadow-2xl">
                    <p className="text-white text-[10px] font-black uppercase mb-8">System Clicks</p>
                    <Line 
                        data={clicksData} 
                        options={{ responsive: true }}
                    />
                </div>
            </div>
        </div>
    );
}
