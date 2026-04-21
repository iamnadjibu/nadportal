import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect if not the login page
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/admin/') {
             window.location.href = 'index.html';
        }
    } else {
        // If logged in and on login page, redirect to dashboard
        if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/admin/') {
             window.location.href = 'dashboard.html';
        }
    }
});
