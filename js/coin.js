// This file handles the 3D coin mechanics, images, and layers

import { chanceTiers, valueTiers, timeTiers } from './upgrades.js';

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
        
        let size = 100;
        if(val == 0.10) size = 85;
        if(val == 0.25) size = 110;
        if(val == 0.50) size = 120;
        if(val >= 1.00) size = 130;

        const wrapper = document.createElement('div');
        wrapper.className = `coin-wrapper ${index === selectedCoinIndex ? 'selected' : ''}`;
        wrapper.onclick = () => selectCoinCallback(index);
        
        wrapper.innerHTML = `
            <div class="coin-shadow" id="shadow-${index}" style="width: ${size}px; height: ${size/5}px;"></div>
            <div class="coin" id="coin-${index}" style="width:${size}px; height:${size}px; transform: rotateX(${coinData.rotation}deg)">
                
                <!-- Inner 3D Edge Slices -->
                <div class="coin-edge" style="background-image: url('${images.f}'); transform: translateZ(1px);"></div>
                <div class="coin-edge" style="background-image: url('${images.f}'); transform: translateZ(2px);"></div>
                <div class="coin-edge" style="background-image: url('${images.f}'); transform: translateZ(3px);"></div>
                <div class="coin-edge" style="background-image: url('${images.f}'); transform: translateZ(4px);"></div>

                <!-- Front Face (Pushed Outwards) -->
                <div class="coin-face" style="background-image: url('${images.f}'); transform: translateZ(5px);">
                    <div class="shine" id="shine-f-${index}"></div>
                </div>
                
                <!-- Back Face (Pushed Inwards) -->
                <div class="coin-face coin-back" style="background-image: url('${images.b}'); transform: rotateX(180deg) translateZ(0px);">
                    <div class="shine" id="shine-b-${index}"></div>
                </div>
            </div>
        `;
        table.appendChild(wrapper);
    });

    const addBtn = document.getElementById('addCoinBtn');
    if (addBtn) {
        addBtn.style.display = coins.length >= 5 ? 'none' : 'flex';
    }
}
