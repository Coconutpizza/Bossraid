// stats.js
export const CONFIG = {
    // Base Settings (Scaled by Difficulty)
    BOSS_MAX_HP: 60000, 
    PLAYER_MAX_HP: 100,
    PLAYER_SPEED: 12.0, 
    BOSS_SPEED: 12.0,
    
    // Damage & Cooldowns
    RIFLE_DMG: 85, 
    RIFLE_RATE: 90, 
    DIRECT_HIT_DMG: 3000, 
    DIRECT_HIT_CD: 1000,
    
    // Entity HP
    TWIN_HP: 200, 
    VOID_TWIN_HP: 700, 
    ELITE_HP: 600, 
    TITAN_HP: 2500, 
    GENERAL_HP: 8000, // New Miniboss
    FOOTMAN_HP: 350, 
    ALLY_HP: 450, 
    GUARDIAN_HP: 1500,
    
    // Ability Stats
    THROW_CD: 250, 
    BASTION_DURATION: 8000, // Replaces Mech
    BASTION_CD: 45000,
    LAMENT_DMG: 50, 
    VOID_CANNON_DMG: 90
};

export const DIFFICULTY = {
    EASY: { mult: 0.7, aggression: 1500, label: "Tourist" },
    NORMAL: { mult: 1.0, aggression: 1000, label: "Soldier" },
    HARD: { mult: 1.5, aggression: 600, label: "Sultan's Nightmare" }
};

export const STATE = {
    difficulty: DIFFICULTY.NORMAL,
    gameActive: false,
    cinematicMode: false,
    score: 0,
    time: 0
};

export let playerStats = { 
    hp: 100, maxHp: 100, shield: 150, 
    rifleActive: false, rifleAmmo: 0,
    throwTimer: 0, attackTimer: 0, directHitTimer: 0,
    bastionActive: false, bastionTimer: 0, // New ability state
