// Initial Game State Configuration
window.GameData = window.GameData || {};

export const INITIAL_PLAYER_STATE = {
    cash: 0,
    gems: 0,
    lastLogin: Date.now(),
    multiplier: 1, // Global multiplier
};

export const INITIAL_MACHINES_STATE = [
    {
        id: 'machine_01',
        name: 'Rascador de Cartón',
        level: 1,
        baseCost: 10,
        baseIncome: 1, // 1 per sec
        unlockPrice: 0,
        isUnlocked: true,
        hasManager: false,
        managerCost: 500,
        icon: '📦',
        color: '#dcdcdc',
        duration: 1000 // ms to complete cycle
    },
    {
        id: 'machine_02',
        name: 'Cinta de Correr',
        level: 0,
        baseCost: 100,
        baseIncome: 10,
        unlockPrice: 500,
        isUnlocked: false,
        hasManager: false,
        managerCost: 5000,
        icon: '🏃',
        color: '#ffcccb',
        duration: 2000
    },
    {
        id: 'machine_03',
        name: 'Press de Banca',
        level: 0,
        baseCost: 1000,
        baseIncome: 50,
        unlockPrice: 2000,
        isUnlocked: false,
        hasManager: false,
        managerCost: 25000,
        icon: '🏋️',
        color: '#add8e6',
        duration: 4000
    },
    {
        id: 'machine_04',
        name: 'Zona Zen',
        level: 0,
        baseCost: 10000,
        baseIncome: 250,
        unlockPrice: 15000,
        isUnlocked: false,
        hasManager: false,
        managerCost: 100000,
        icon: '🧘',
        color: '#90ee90',
        duration: 8000
    }
];

window.GameData.INITIAL_PLAYER_STATE = INITIAL_PLAYER_STATE;
window.GameData.INITIAL_MACHINES_STATE = INITIAL_MACHINES_STATE;
