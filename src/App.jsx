import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import PublicNavbar from './components/PublicNavbar';
import PublicFooter from './components/PublicFooter';
import ProtectedLayout from './components/ProtectedLayout';

// Public Pages
import Home from './pages/public/Home';
import Films from './pages/public/Films';
import Graphics from './pages/public/Graphics';
import Websites from './pages/public/Websites';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import BookUs from './pages/public/BookUs';

// Admin Pages
import Login from './pages/admin/Login';
import Signup from './pages/admin/Signup';
import Dashboard from './pages/admin/Dashboard';
import AdminFilms from './pages/admin/AdminFilms';
import AdminGraphics from './pages/admin/AdminGraphics';
import AdminWebsites from './pages/admin/AdminWebsites';
import AdminBookings from './pages/admin/AdminBookings';
import AdminFooterSettings from './pages/admin/AdminFooterSettings';
import Comments from './pages/admin/Comments';

function PublicLayout() {
    return (
        <div className="bg-black min-h-screen text-zinc-300 antialiased overflow-x-hidden flex flex-col">
            <PublicNavbar />
            <div className="flex-grow">
                <Outlet />
            </div>
            <PublicFooter />
        </div>
    );
}

export default function App() {
    return (
        <Router>
            <Routes>
                {/* Public Site Routes */}
                <Route path="/" element={<PublicLayout />}>
                    <Route index element={<Home />} />
                    <Route path="films" element={<Films />} />
                    <Route path="graphics" element={<Graphics />} />
                    <Route path="websites" element={<Websites />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="book" element={<BookUs />} />
                </Route>

                {/* Admin Auth Routes */}
                <Route path="/admin" element={<Login />} />
                <Route path="/admin/login" element={<Login />} />
                <Route path="/admin/signup" element={<Signup />} />

                {/* Secure Admin Dashboard Routes */}
                <Route path="/admin" element={<ProtectedLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="films" element={<AdminFilms />} />
                    <Route path="graphics" element={<AdminGraphics />} />
                    <Route path="websites" element={<AdminWebsites />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="comments" element={<Comments />} />
                    <Route path="settings" element={<AdminFooterSettings />} />
                </Route>
            </Routes>
        </Router>
    );
}
