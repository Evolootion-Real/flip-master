// This file handles the themes, saving, loading, and resetting progress
import { saveCloudGame, loadCloudGame, loginWithGoogle, logoutGoogle } from './auth.js';

export function setTheme(color) {
    document.documentElement.style.setProperty('--theme', color);
    document.documentElement.style.setProperty('--theme-text', (color === '#ffffff' || color === '#e9c46a') ? '#000' : '#fff');
}

export function toggleSettings() {
    document.getElementById('settingsModal').classList.toggle('open');
    document.getElementById('saveMsg').style.display = 'none';
}

export async function saveGame(gameState) {
    // Save locally
    localStorage.setItem('coinFlipMasterSave', JSON.stringify(gameState));
    
    // Save to cloud if logged in
    await saveCloudGame(gameState);

    const msg = document.getElementById('saveMsg');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

export async function loadGame() {
    // Try loading from cloud if user is authenticated
    const cloudData = await loadCloudGame();
    if (cloudData) {
        return cloudData;
    }

    // Fallback to local storage
    const saved = localStorage.getItem('coinFlipMasterSave');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}
