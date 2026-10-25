// This is the main application file that ties all modules together

import { chanceTiers, chanceCosts, valueTiers, valueCosts, timeTiers, timeCosts } from './upgrades.js';
import { setTheme, toggleSettings, saveGame, loadGame } from './settings.js';
import { renderCoins } from './coin.js';

let balance = 0;
let totalRolls = 0;
let history = [];
let coins = [{ chanceIdx: 0, valueIdx: 0, timeIdx: 0, rotation: 0 }];
let selectedCoinIndex = 0;
let isFlipping = false;

function init() {
    const saved = loadGame();
    if (saved) {
        balance = saved.balance || 0;
        totalRolls = saved.totalRolls || 0;
        history = saved.history || [];
        coins = saved.coins || [{ chanceIdx: 0, valueIdx: 0, timeIdx: 0, rotation: 0 }];
        if (saved.theme) setTheme(saved.theme);
    }
    renderCoins(coins, selectedCoinIndex, selectCoin);
    updateSidebar();
}

function selectCoin(index) {
    if (isFlipping) return;
    selectedCoinIndex = index;
    renderCoins(coins, selectedCoinIndex, selectCoin);
    updateSidebar();
}

function addNewCoin() {
    if (coins.length < 5) {
        if (balance >= 10000) {
            balance -= 10000;
            coins.push({ chanceIdx: 0, valueIdx: 0, timeIdx: 0, rotation: 0 });
            selectedCoinIndex = coins.length - 1;
            renderCoins(coins, selectedCoinIndex, selectCoin);
            updateSidebar();
        } else {
            const btn = document.getElementById('addCoinBtn');
            btn.style.backgroundColor = '#ff4444';
            setTimeout(() => btn.style.backgroundColor = '', 300);
        }
    }
}

function updateSidebar() {
    document.getElementById('balance').innerText = balance.toFixed(2);
    document.getElementById('totalRolls').innerText = totalRolls;
    document.getElementById('selectedCoinHeader').innerText = `Selected: Coin #${selectedCoinIndex + 1}`;
    
    const activeCoin = coins[selectedCoinIndex];
    document.getElementById('chanceDisplay').innerText = chanceTiers[activeCoin.chanceIdx].toFixed(1);
    document.getElementById('valueDisplay').innerText = valueTiers[activeCoin.valueIdx].toFixed(2);
    document.getElementById('timeDisplay').innerText = timeTiers[activeCoin.timeIdx].toFixed(1);

    const historyContainer = document.getElementById('historyList');
    historyContainer.innerHTML = '';
    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerText = item;
        historyContainer.appendChild(div);
    });

    const chanceBtn = document.getElementById('chanceBtn');
    if (activeCoin.chanceIdx < chanceTiers.length - 1) {
        const cost = chanceCosts[activeCoin.chanceIdx];
        chanceBtn.innerHTML = `Chance Lvl ${activeCoin.chanceIdx} <span style="color: white;">(</span><span style="color: #4ade80;">$${cost}</span><span style="color: white;">)</span>`;
    } else {
        chanceBtn.innerHTML = `Chance (MAX)`;
    }

    const valueBtn = document.getElementById('valueBtn');
    if (activeCoin.valueIdx < valueTiers.length - 1) {
        const cost = valueCosts[activeCoin.valueIdx];
        valueBtn.innerHTML = `Value Lvl ${activeCoin.valueIdx} <span style="color: white;">(</span><span style="color: #4ade80;">$${cost}</span><span style="color: white;">)</span>`;
    } else {
        valueBtn.innerHTML = `Value (MAX)`;
    }

    const timeBtn = document.getElementById('timeBtn');
    if (activeCoin.timeIdx < timeTiers.length - 1) {
        const cost = timeCosts[activeCoin.timeIdx];
        timeBtn.innerHTML = `Time Lvl ${activeCoin.timeIdx} <span style="color: white;">(</span><span style="color: #4ade80;">$${cost}</span><span style="color: white;">)</span>`;
    } else {
        timeBtn.innerHTML = `Time (MAX)`;
    }
}

function addHistory(text) {
    history.unshift(text);
    if (history.length > 10) history.pop();
    updateSidebar();
}

function flipAllCoins() {
    if (isFlipping) return;
    isFlipping = true;
    
    const btn = document.getElementById('flipBtn');
    btn.style.opacity = '0.5';
    btn.innerText = '...';

    let maxTime = 0;
    let totalEarned = 0;
    let headsCount = 0;
    totalRolls++;

    coins.forEach((coinData, index) => {
        const domCoin = document.getElementById(`coin-${index}`);
        const shadow = document.getElementById(`shadow-${index}`);
        const shineF = document.getElementById(`shine-f-${index}`);
        const shineB = document.getElementById(`shine-b-${index}`);
        
        const flipTimeMs = timeTiers[coinData.timeIdx] * 1000;
        if (flipTimeMs > maxTime) maxTime = flipTimeMs;

        const chance = chanceTiers[coinData.chanceIdx] / 100;
        const isHeads = Math.random() < chance;
        
        let nextRotation = coinData.rotation + 1800; // 5 full spins
        if (isHeads && nextRotation % 360 !== 0) nextRotation += 180;
        if (!isHeads && nextRotation % 360 === 0) nextRotation += 180;

        // Realistic jump and gravity physics
        domCoin.animate([
            { transform: `translateY(0) rotateX(${coinData.rotation}deg)`, offset: 0, easing: 'ease-out' },
            { transform: `translateY(-450px) rotateX(${coinData.rotation + (nextRotation - coinData.rotation)/2}deg)`, offset: 0.5, easing: 'ease-in' },
            { transform: `translateY(0) rotateX(${nextRotation}deg)`, offset: 1 }
        ], { duration: flipTimeMs, fill: 'forwards' });

        // Shadow shrinks as it goes higher
        shadow.animate([
            { transform: `translateX(-50%) scale(1)`, opacity: 0.9, offset: 0, easing: 'ease-out' },
            { transform: `translateX(-50%) scale(0.2)`, opacity: 0.1, offset: 0.5, easing: 'ease-in' },
            { transform: `translateX(-50%) scale(1)`, opacity: 0.9, offset: 1 }
        ], { duration: flipTimeMs });

        // Dynamic light streaking across the metal
        const spins = (nextRotation - coinData.rotation) / 180;
        shineF.animate([
            { backgroundPosition: '200% 200%' },
            { backgroundPosition: '-100% -100%' }
        ], { duration: flipTimeMs, iterations: spins });

        shineB.animate([
            { backgroundPosition: '200% 200%' },
            { backgroundPosition: '-100% -100%' }
        ], { duration: flipTimeMs, iterations: spins });

        setTimeout(() => {
            coinData.rotation = nextRotation;
            if (isHeads) {
                headsCount++;
                totalEarned += valueTiers[coinData.valueIdx];
            }
        }, flipTimeMs);
    });

    setTimeout(() => {
        balance += totalEarned;
        if (coins.length === 1) {
            if (headsCount === 1) {
                addHistory(`Roll ${totalRolls}: Heads (+$${totalEarned.toFixed(2)})`);
            } else {
                addHistory(`Roll ${totalRolls}: Tails ($0.00)`);
            }
        } else {
            const tailsCount = coins.length - headsCount;
            addHistory(`Roll ${totalRolls}: ${headsCount} Heads, ${tailsCount} Tails (+$${totalEarned.toFixed(2)})`);
        }
        btn.style.opacity = '1';
        btn.innerText = 'FLIP';
        isFlipping = false;
        renderCoins(coins, selectedCoinIndex, selectCoin);
    }, maxTime);
}

function upgradeChance() {
    const activeCoin = coins[selectedCoinIndex];
    if (activeCoin.chanceIdx < chanceTiers.length - 1) {
        const cost = chanceCosts[activeCoin.chanceIdx];
        if (balance >= cost) {
            balance -= cost; 
            activeCoin.chanceIdx++; 
            renderCoins(coins, selectedCoinIndex, selectCoin);
            updateSidebar();
        } else {
            const btn = document.getElementById('chanceBtn');
            btn.style.backgroundColor = '#ff4444';
            setTimeout(() => btn.style.backgroundColor = '', 300);
        }
    }
}

function upgradeValue() {
    const activeCoin = coins[selectedCoinIndex];
    if (activeCoin.valueIdx < valueTiers.length - 1) {
        const cost = valueCosts[activeCoin.valueIdx];
        if (balance >= cost) {
            balance -= cost; 
            activeCoin.valueIdx++; 
            renderCoins(coins, selectedCoinIndex, selectCoin);
            updateSidebar();
        } else {
            const btn = document.getElementById('valueBtn');
            btn.style.backgroundColor = '#ff4444';
            setTimeout(() => btn.style.backgroundColor = '', 300);
        }
    }
}

function upgradeTime() {
    const activeCoin = coins[selectedCoinIndex];
    if (activeCoin.timeIdx < timeTiers.length - 1) {
        const cost = timeCosts[activeCoin.timeIdx];
        if (balance >= cost) {
            balance -= cost; 
            activeCoin.timeIdx++; 
            renderCoins(coins, selectedCoinIndex, selectCoin);
            updateSidebar();
        } else {
            const btn = document.getElementById('timeBtn');
            btn.style.backgroundColor = '#ff4444';
            setTimeout(() => btn.style.backgroundColor = '', 300);
        }
    }
}

function performSave() {
    const theme = getComputedStyle(document.documentElement).getPropertyValue('--theme').trim();
    saveGame({ balance, totalRolls, history, coins, theme });
}

function resetProgress() {
    if(confirm("Are you sure you want to reset ALL progress? This cannot be undone.")) {
        localStorage.removeItem('coinFlipMasterSave');
        balance = 0;
        totalRolls = 0;
        history = [];
        coins = [{ chanceIdx: 0, valueIdx: 0, timeIdx: 0, rotation: 0 }];
        selectedCoinIndex = 0;
        renderCoins(coins, selectedCoinIndex, selectCoin);
        updateSidebar();
        toggleSettings();
    }
}

window.toggleSettings = toggleSettings;
window.setTheme = setTheme;
window.addNewCoin = addNewCoin;
window.flipAllCoins = flipAllCoins;
window.upgradeChance = upgradeChance;
window.upgradeValue = upgradeValue;
window.upgradeTime = upgradeTime;
window.saveGame = performSave;
window.resetProgress = resetProgress;

init();
