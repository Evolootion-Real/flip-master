// This file handles the themes, saving, loading, and resetting progress

export function setTheme(color) {
    document.documentElement.style.setProperty('--theme', color);
    document.documentElement.style.setProperty('--theme-text', (color === '#ffffff' || color === '#e9c46a') ? '#000' : '#fff');
}

export function toggleSettings() {
    document.getElementById('settingsModal').classList.toggle('open');
    document.getElementById('saveMsg').style.display = 'none';
}

export function saveGame(gameState) {
    localStorage.setItem('coinFlipMasterSave', JSON.stringify(gameState));
    const msg = document.getElementById('saveMsg');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

export function loadGame() {
    const saved = localStorage.getItem('coinFlipMasterSave');
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}
