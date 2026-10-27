// js/supabaseAuth.js

const SUPABASE_URL = 'https://ipnmqyzdflycojqjspui.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlwbm1xeXpkZmx5Y29xamlzcHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxMzQzNTYsImV4cCI6MjEwODcxMDM1Nn0.0OiiBTYzPgMfo99YHCkCFhS6OfCprIdSCnfuyMf72-M'; 

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function loginWithGoogle() {
    console.log("Attempting Google OAuth login...");
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.href
        }
    });
    if (error) console.error("Login Error:", error);
}

export async function logoutUser() {
    await supabase.auth.signOut();
    location.reload();
}

export async function saveCloudGame(gameState) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        localStorage.setItem('coinFlipGuestSave', JSON.stringify(gameState));
        return;
    }

    const { error } = await supabase
        .from('player_saves')
        .upsert({ id: user.id, game_data: gameState, updated_at: new Date() });

    if (error) console.error("Cloud Save Error:", error);
}

export async function loadCloudGame() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        const saved = localStorage.getItem('coinFlipGuestSave');
        return saved ? JSON.parse(saved) : null;
    }

    const { data, error } = await supabase
        .from('player_saves')
        .select('game_data')
        .eq('id', user.id)
        .single();

    if (error && error.code !== 'PGRST116') {
        console.error("Cloud Load Error:", error);
        return null;
    }
    return data ? data.game_data : null;
}

export async function checkUserSession() {
    const { data: { session } } = await supabase.auth.getSession();
    const statusEl = document.getElementById('authStatus');
    const btnEl = document.getElementById('googleAuthBtn');

    if (session && session.user) {
        if (statusEl) statusEl.innerText = `Logged in as: ${session.user.email}`;
        if (btnEl) {
            btnEl.innerText = 'Sign Out';
            btnEl.style.backgroundColor = '#e63946';
        }
        return true;
    } else {
        if (statusEl) statusEl.innerText = 'Not logged in (saving locally)';
        if (btnEl) {
            btnEl.innerText = 'Sign In with Google';
            btnEl.style.backgroundColor = '';
        }
        return false;
    }
}

// Global window mappings
window.loginWithGoogle = loginWithGoogle;
window.logoutUser = logoutUser;
