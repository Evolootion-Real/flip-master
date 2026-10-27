export function setTheme(color) {
    document.documentElement.style.setProperty('--theme', color);
    document.documentElement.style.setProperty('--theme-text', (color === '#ffffff' || color === '#e9c46a') ? '#000' : '#fff');
}

export function toggleSettings() {
    document.getElementById('settingsModal').classList.toggle('open');
    document.getElementById('saveMsg').style.display = 'none';
}

export function saveGame(gameState) {
    const activeUser = localStorage.getItem('coinFlipActiveUser') || 'DefaultPlayer';
    const saveKey = `coinFlipMasterSave_${activeUser}`;
    localStorage.setItem(saveKey, JSON.stringify(gameState));

    const msg = document.getElementById('saveMsg');
    msg.style.display = 'block';
    setTimeout(() => msg.style.display = 'none', 3000);
}

export function loadGame() {
    const activeUser = localStorage.getItem('coinFlipActiveUser') || 'DefaultPlayer';
    const saveKey = `coinFlipMasterSave_${activeUser}`;
    const saved = localStorage.getItem(saveKey);
    if (saved) {
        return JSON.parse(saved);
    }
    return null;
}

export function switchUserProfile(username) {
    if (!username || username.trim() === '') return;
    localStorage.setItem('coinFlipActiveUser', username.trim());
    location.reload();
}
