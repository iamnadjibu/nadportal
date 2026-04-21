import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebase';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Registration Failed: ' + error.message);
        }
    };

    return (
        <div className="h-screen flex items-center justify-center relative bg-black px-4">
            <div className="absolute top-8 left-8 z-50">
                <Link to="/" className="text-3xl font-black text-white font-outfit tracking-tighter uppercase">IAM <span className="text-amber-500">NAD</span></Link>
            </div>
            
            <div className="relative z-10 w-full max-w-md bg-zinc-950/90 backdrop-blur-3xl border border-amber-500/20 rounded-[3rem] p-12 shadow-2xl">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-black text-amber-500 uppercase tracking-tighter font-outfit mb-2">AGENCY REGISTRATION</h1>
                    <p className="text-[9px] font-black tracking-widest text-zinc-500 uppercase">Secure clearance required</p>
                </div>
                
                <form onSubmit={handleSignup} className="space-y-6">
                    <input 
                        type="email" 
                        placeholder="NEW AGENCY EMAIL" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500" 
                    />
                    <input 
                        type="password" 
                        placeholder="DEFINE ACCESS CODE" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-4 text-white text-[10px] font-black uppercase outline-none focus:border-amber-500" 
                    />
                    <button type="submit" className="w-full bg-amber-500 text-black font-black uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-white transition-all">
                        Establish Connection
                    </button>
                    <Link to="/admin" className="block text-center mt-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest hover:text-amber-500">
                        Return to Login
                    </Link>
                </form>
            </div>
        </div>
    );
}
