// This file handles the 3D coin mechanics, images, and animations

import { chanceTiers, valueTiers, timeTiers } from './upgrades.js';

// Realistic Wikimedia Commons Image Mapping
export function getCoinImages(value) {
    if (value >= 1.00) return { f: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Krugerrand_1oz_2017_obverse.jpg/240px-Krugerrand_1oz_2017_obverse.jpg', b: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Krugerrand_1oz_2017_reverse.jpg/240px-Krugerrand_1oz_2017_reverse.jpg' };
    if (value >= 0.50) return { f: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Kennedy_Half_Dollar_Obv_1989.png/240px-Kennedy_Half_Dollar_Obv_1989.png', b: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Kennedy_Half_Dollar_Rev_1989.png/240px-Kennedy_Half_Dollar_Rev_1989.png' };
    if (value >= 0.25) return { f: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Washington_Quarter_Obv.png/240px-Washington_Quarter_Obv.png', b: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Washington_Quarter_Rev.png/240px-Washington_Quarter_Rev.png' };
    if (value >= 0.10) return { f: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/US_Dime_Obv.png/240px-US_Dime_Obv.png', b: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/US_Dime_Rev.png/240px-US_Dime_Rev.png' };
    if (value >= 0.05) return { f: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/US_Nickel_2013_Obv.png/240px-US_Nickel_2013_Obv.png', b: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/US_Nickel_2013_Rev.png/240px-US_Nickel_2013_Rev.png' };
    return { f: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/US_One_Cent_Obv.png/240px-US_One_Cent_Obv.png', b: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/US_One_Cent_Rev.png/240px-US_One_Cent_Rev.png' };
}

export function renderCoins(coins, selectedCoinIndex, selectCoinCallback) {
    const table = document.getElementById('table');
    table.innerHTML = '';
    
    coins.forEach((coinData, index) => {
        const val = valueTiers[coinData.valueIdx];
        const images = getCoinImages(val);
        
        // Adjust size based on value
        let size = 100;
        if(val == 0.10) size = 85;
        if(val == 0.25) size = 110;
        if(val == 0.50) size = 120;
        if(val >= 1.00) size = 130;

        const wrapper = document.createElement('div');
        wrapper.className = `coin-wrapper ${index === selectedCoinIndex ? 'selected' : ''}`;
        wrapper.onclick = () => selectCoinCallback(index);
        
        wrapper.innerHTML = `
            <div class="coin" id="coin-${index}" style="width:${size}px; height:${size}px; transform: rotateX(${coinData.rotation}deg)">
                <div class="coin-face" style="background-image: url('${images.f}')"></div>
                <div class="coin-face coin-back" style="background-image: url('${images.b}')"></div>
            </div>
        `;
        table.appendChild(wrapper);
    });

    const addBtn = document.getElementById('addCoinBtn');
    if (addBtn) {
        addBtn.style.display = coins.length >= 5 ? 'none' : 'block';
    }
}
