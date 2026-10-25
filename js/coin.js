// This file handles the 3D coin mechanics, images, and layers

import { chanceTiers, valueTiers, timeTiers } from './upgrades.js';

// Ultra-Realistic Official US Mint Images
export function getCoinImages(value) {
    if (value >= 1.00) return { f: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-native-american-one-dollar-uncirculated-obverse-768x768.jpg', b: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-native-american-one-dollar-uncirculated-reverse-768x768.jpg' };
    if (value >= 0.50) return { f: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-kennedy-half-dollar-uncirculated-obverse-768x768.jpg', b: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-kennedy-half-dollar-uncirculated-reverse-768x768.jpg' };
    if (value >= 0.25) return { f: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/10/2023-american-women-quarters-coin-bessie-coleman-uncirculated-obverse-768x768.jpg', b: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/10/2023-american-women-quarters-coin-bessie-coleman-uncirculated-reverse-768x768.jpg' };
    if (value >= 0.10) return { f: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-roosevelt-dime-uncirculated-obverse-768x768.jpg', b: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-roosevelt-dime-uncirculated-reverse-768x768.jpg' };
    if (value >= 0.05) return { f: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-jefferson-nickel-uncirculated-obverse-768x768.jpg', b: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-jefferson-nickel-uncirculated-reverse-768x768.jpg' };
    return { f: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-lincoln-penny-uncirculated-obverse-768x768.jpg', b: 'https://www.usmint.gov/wordpress/wp-content/uploads/2022/12/2023-lincoln-penny-uncirculated-reverse-768x768.jpg' };
}

export function renderCoins(coins, selectedCoinIndex, selectCoinCallback) {
    const table = document.getElementById('table');
    table.innerHTML = '';
    
    coins.forEach((coinData, index) => {
        const val = valueTiers[coinData.valueIdx];
        const images = getCoinImages(val);
        
        // Solid Metallic Fallbacks (prevents the black blob if images are blocked)
        let fallbackBg = '#b87333'; // Copper
        if (val >= 1.00) fallbackBg = '#daa520'; // Gold
        else if (val >= 0.05) fallbackBg = '#c0c0c0'; // Silver
        
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
            <div class="coin-shadow" id="shadow-${index}" style="width: ${size}px; height: ${size/5}px;"></div>
            <div class="coin" id="coin-${index}" style="width:${size}px; height:${size}px; transform: rotateX(${coinData.rotation}deg)">
                
                <!-- Inner 3D Edge Slices (Solid Metal) -->
                <div class="coin-edge" style="background-color: ${fallbackBg}; transform: translateZ(1px);"></div>
                <div class="coin-edge" style="background-color: ${fallbackBg}; transform: translateZ(2px);"></div>
                <div class="coin-edge" style="background-color: ${fallbackBg}; transform: translateZ(3px);"></div>
                <div class="coin-edge" style="background-color: ${fallbackBg}; transform: translateZ(4px);"></div>

                <!-- Front Face (Pushed Outwards) -->
                <div class="coin-face" style="background-color: ${fallbackBg}; background-image: url('${images.f}'); transform: translateZ(5px);">
                    <div class="shine" id="shine-f-${index}"></div>
                </div>
                
                <!-- Back Face (Pushed Inwards) -->
                <div class="coin-face coin-back" style="background-color: ${fallbackBg}; background-image: url('${images.b}'); transform: rotateX(180deg) translateZ(0px);">
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
