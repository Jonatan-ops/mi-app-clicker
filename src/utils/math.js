// The math utilities for the game

// Make it global for the browser to find if modules fail, but also export for modules.
window.GameUtils = window.GameUtils || {};

export function calculateUpgradeCost(baseCost, level) {
    // Formula: Cost = Base * (1.15)^Level
    return Math.floor(baseCost * Math.pow(1.15, level));
}

export function calculateIncome(baseIncome, level, multiplier = 1) {
    // Formula: Income = (Base * Level) * Multiplier
    if (level === 0) return 0;
    return baseIncome * level * multiplier;
}

export function formatCurrency(amount) {
    if (amount >= 1000000) {
        return (amount / 1000000).toFixed(2) + 'M';
    }
    if (amount >= 1000) {
        return (amount / 1000).toFixed(1) + 'k';
    }
    return Math.floor(amount).toString();
}

// Attach to global for fallback
window.GameUtils.calculateUpgradeCost = calculateUpgradeCost;
window.GameUtils.calculateIncome = calculateIncome;
window.GameUtils.formatCurrency = formatCurrency;
