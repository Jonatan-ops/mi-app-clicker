// Local Storage Wrapper
window.GameStorage = window.GameStorage || {};
const KEY = 'MICHI_GYM_SAVE_V1';

export function saveGame(state) {
    try {
        const data = JSON.stringify({
            ...state,
            timestamp: Date.now() // Save current time
        });
        localStorage.setItem(KEY, data);
    } catch (e) {
        console.error("Save failed", e);
    }
}

export function loadGame() {
    try {
        const data = localStorage.getItem(KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Load failed", e);
    }
    return null;
}

window.GameStorage.saveGame = saveGame;
window.GameStorage.loadGame = loadGame;
